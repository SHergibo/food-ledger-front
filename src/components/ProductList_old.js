import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useTable, usePagination, useGlobalFilter, useAsyncDebounce } from 'react-table';
import axiosInstance from '../utils/axiosInstance';
import { apiDomain, apiVersion } from '../apiConfig/ApiConfig';
import PropTypes from 'prop-types';

const EditableCell = ({
  value: initialValue,
  row: { index },
  column: { id },
  updateMyData,
}) => {
  const [value, setValue] = useState(initialValue)

  const onChange = e => {
    if (e.target.value >= 0) {
      setValue(e.target.value)
    }
  }

  const newData = () => {
    updateMyData(index, id, value);
  }

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])
  if (id === "number") {
    return <input type="number" min="0" value={value} onChange={onChange} onClick={newData} onKeyUp={newData} />
  } else {
    return value;
  }

}

const defaultColumn = {
  Cell: EditableCell,
}

function GlobalFilter({preGlobalFilteredRows, globalFilter, setGlobalFilter,}) {
  const count = preGlobalFilteredRows.length
  const [value, setValue] = useState(globalFilter)
  const onChange = useAsyncDebounce(value => {
    setGlobalFilter(value || undefined)
  }, 200)

  return (
    <span>
      Search:{' '}
      <input
        value={value || ""}
        onChange={e => {
          setValue(e.target.value);
          onChange(e.target.value);
        }}
        placeholder={`${count} records...`}
        style={{
          fontSize: '1.1rem',
          border: '0',
        }}
      />
    </span>
  )
}


function Table({columns, data, fetchData, updateMyData, skipPageReset, loading, pageCount: controlledPageCount}) {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    preGlobalFilteredRows,
    setGlobalFilter,
    // Get the state from the instance
    state: { pageIndex, pageSize, globalFilter },
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0 },
      manualPagination: true,
      pageCount: controlledPageCount,
      defaultColumn,
      autoResetPage: !skipPageReset,
      updateMyData
    },
    useGlobalFilter,
    usePagination
  )

  useEffect(() => {
    fetchData({ pageIndex, pageSize,globalFilter })
  }, [fetchData, pageIndex, pageSize, globalFilter])

  return (
    <>
      <pre>
        <code>
          {JSON.stringify(
            {
              pageIndex,
              pageSize,
              pageCount,
              canNextPage,
              canPreviousPage,
            },
            null,
            2
          )}
        </code>
        <code>{JSON.stringify(globalFilter, null, 2)}</code>
      </pre>
      <GlobalFilter
        preGlobalFilteredRows={preGlobalFilteredRows}
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
      />
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th {...column.getHeaderProps()}>
                  {column.render('Header')}
                  <span>
                    {column.isSorted
                      ? column.isSortedDesc
                        ? ' 🔽'
                        : ' 🔼'
                      : ''}
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row, i) => {
            prepareRow(row)
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map(cell => {
                  return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                })}
              </tr>
            )
          })}
          <tr>
            {loading ? (
              <td colSpan="10000">Loading...</td>
            ) : (
                <td colSpan="10000">
                  Showing {page.length} of ~{controlledPageCount * pageSize}{' '}
                results
                </td>
              )}
          </tr>
        </tbody>
      </table>
      <div className="pagination">
        <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
          {'<<'}
        </button>{' '}
        <button onClick={() => previousPage()} disabled={!canPreviousPage}>
          {'<'}
        </button>{' '}
        <button onClick={() => nextPage()} disabled={!canNextPage}>
          {'>'}
        </button>{' '}
        <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
          {'>>'}
        </button>{' '}
        <span>
          Page{' '}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>{' '}
        </span>
        <span>
          | Go to page:{' '}
          <input
            type="number"
            defaultValue={pageIndex + 1}
            onChange={e => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0
              gotoPage(page)
            }}
            style={{ width: '100px' }}
          />
        </span>{' '}
        <select
          value={pageSize}
          onChange={e => {
            setPageSize(Number(e.target.value))
          }}
        >
          {[10, 20, 30, 40, 50].map(pageSize => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>
    </>
  )
}



function ProductList({ userData }) {
  const [data, setData] = useState([]);
  const [pageS, setPageS] = useState();
  const [pageI, setPageI] = useState();
  const [loading, setLoading] = useState(false);
  const [pageCount, setPageCount] = useState(0);
  const fetchIdRef = useRef(0);
  const [skipPageReset, setSkipPageReset] = useState(false);

  const updateMyData = async (rowIndex, columnId, value) => {
    setSkipPageReset(true);
    if (data[rowIndex].number !== value && value >= 0 && value) {
      const patchProductDataEndPoint = `${apiDomain}/api/${apiVersion}/products/${data[rowIndex]._id}?page=${pageI}`;
      await axiosInstance.patch(patchProductDataEndPoint, { number: value })
        .then((response) => {
          console.log(response);
          //TODO si response.data.arrayProduct, remplacer data du tableau
        });
    }
    setData(old =>
      old.map((row, index) => {
        if (index === rowIndex) {
          return {
            ...old[rowIndex],
            [columnId]: value,
          }
        }
        return row
      })
    )
  }
  useEffect(() => {
    setSkipPageReset(false)
  }, [data])

  const columns = useMemo(
    () => [
      {
        Header: 'Liste des produits dans votre stock',
        columns: [
          {
            Header: 'Nom',
            accessor: 'name',
          },
          {
            Header: 'Marque',
            accessor: 'brand',
          },
          {
            Header: 'Type',
            accessor: 'type',
          },
          {
            Header: 'Poids',
            accessor: 'weight',
          },
          {
            Header: 'Kcal',
            accessor: 'kcal',
          },
          {
            Header: "Date d'expiration",
            accessor: 'expirationDate',
          },
          {
            Header: 'Emplacement',
            accessor: 'location',
          },
          {
            Header: 'Nombre',
            accessor: 'number'
          },
          {
            Header: 'Action',
            Cell: ({ row }) => (
              <div>
                <Link to={`/app/edition-produit/${row.original._id}`}>Edit</Link>
                <button onClick={async () => {
                  setLoading(true)
                  const getProductDataEndPoint = `${apiDomain}/api/${apiVersion}/products/delete-pagination/${row.original._id}?page=${pageI}`;
                  await axiosInstance.delete(getProductDataEndPoint)
                    .then((response) => {
                      setData(response.data.arrayProduct)

                      setPageCount(Math.ceil(response.data.totalProduct / pageS))

                      setLoading(false)
                    });
                }}>Delete</button>
                <button onClick={() => { console.log(pageS) }}>test</button>
              </div>
            )
          },
        ],
      }
    ],
    [pageS, pageI]
  )

  const fetchData = useCallback(({ pageSize, pageIndex, globalFilter }) => {
    console.log(globalFilter);
    setPageS(pageSize);
    setPageI(pageIndex);

    const fetchId = ++fetchIdRef.current
    setLoading(true)

    if (fetchId === fetchIdRef.current) {
      const getProductList = async () => {
        const getProductEndPoint = `${apiDomain}/api/${apiVersion}/products/pagination/${userData.householdcode}?page=${pageIndex}`;
        await axiosInstance.get(getProductEndPoint)
          .then((response) => {
            setData(response.data.arrayProduct)

            setPageCount(Math.ceil(response.data.totalProduct / pageSize))

            setLoading(false)
          });
      };
      if (userData) {
        getProductList();
      }
    }
  }, [userData])

  return (
    <Table
      columns={columns}
      data={data}
      fetchData={fetchData}
      loading={loading}
      pageCount={pageCount}
      updateMyData={updateMyData}
      skipPageReset={skipPageReset}
    />
  )
}

ProductList.propTypes = {
  userData: PropTypes.object,
}

export default ProductList