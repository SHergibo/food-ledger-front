import React, { useState, useEffect, useCallback, Fragment } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import { apiDomain, apiVersion } from '../apiConfig/ApiConfig';
import { useForm } from 'react-hook-form';
import PropTypes from 'prop-types';

function ProductList({ userData }) {
  const [data, setData] = useState([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [searchObject, setSearchObject] = useState({});
  const { register, handleSubmit } = useForm({
    mode: "onChange"
  });

  const getProductList = useCallback(async () => {
    let getProductEndPoint = `${apiDomain}/api/${apiVersion}/products/pagination/${userData.householdcode}?page=${pageIndex}`;

    if (Object.keys(searchObject).length > 0) {
      let urlQuery = "";
      for (const key in searchObject) {
        if(searchObject[key] !== ""){
          urlQuery += `&${key}=${searchObject[key]}`
        }
      }
      getProductEndPoint += urlQuery;
    }

    await axiosInstance.get(getProductEndPoint)
      .then((response) => {
        setData(response.data.arrayProduct);

        setPageCount(Math.ceil(response.data.totalProduct / pageSize));

      });
  }, [userData, pageIndex, pageSize, searchObject]);

  useEffect(() => {

    if (userData) {
      getProductList();
    }
  }, [userData, getProductList]);


  const columns = [
    {
      Header: 'Nom',
    },
    {
      Header: 'Marque',
    },
    {
      Header: 'Type',
    },
    {
      Header: 'Poids',
    },
    {
      Header: 'Kcal',
    },
    {
      Header: "Date d'expiration",
    },
    {
      Header: 'Emplacement',
    },
    {
      Header: 'Nombre',
    },
    {
      Header: "Actions"
    }
  ];

  const gotoPage = (page) => {
    setPageIndex(page - 1);
  };

  const previousPage = () => {
    if (pageIndex > 0) {
      setPageIndex(pageIndex - 1);
    }
  };

  const nextPage = async () => {
    if (pageIndex < (pageCount - 1)) {
      setPageIndex(pageIndex + 1);
    }
  };

  const EditableCell = ({ initialValue, row, indexRow }) => {
    const [value, setValue] = useState(initialValue);

    const onChange = e => {
      if (e.target.value >= 0) {
        setValue(e.target.value)
      }
    }

    const newData = async () => {
      if (row.number !== value && value >= 0 && value) {
        const patchProductDataEndPoint = `${apiDomain}/api/${apiVersion}/products/${row._id}?page=${pageIndex}`;
        await axiosInstance.patch(patchProductDataEndPoint, { number: value })
          .then((response) => {
            let newData = data;
            newData[indexRow] = response.data;
            setData(newData);
            //TODO si response.data.arrayProduct, remplacer data du tableau
          });
      }
    }
    return <input type="number" min="0" value={value} onChange={onChange} onClick={newData} onKeyUp={newData} />
  }

  const populateSearchObject = (data) =>{
    for (const key in data) {
      if(data[key] !== ""){
        setSearchObject(data);
        gotoPage(1);
        return;
      }
    }
  }

  const resetSearchObject = () =>{
    if(Object.keys(searchObject).length > 0){
      setSearchObject({});
      gotoPage(1);
    }
  }
  return (
    <Fragment>
      <form onSubmit={handleSubmit(populateSearchObject)}>
        <input name="name" type="text" id="product-name" placeholder="Nom" ref={register()} />
        <input name="brand" type="text" id="product-brand" placeholder="Marque" ref={register()} />
        <input name="type" type="text" id="product-type" placeholder="Type" ref={register()} />
        <input name="weight" type="number" id="product-weight" placeholder="Poids" ref={register()} />
        <input name="kcal" type="text" id="product-kcal" placeholder="Kcal" ref={register()} />
        <input name="expirationDate" type="text" id="product-expiration-date" placeholder="Date d'expiration" ref={register()} />
        <input name="location" type="text" id="product-location" placeholder="Emplacement" ref={register()} />
        <input name="number" type="number" id="product-number" placeholder="Nombre" ref={register()} />
        <button type="submit">Search</button>
        
      </form>
      <button onClick={resetSearchObject}>Reset search</button>
      <table>
        <thead>
          <tr>
            {columns.map((column, index) => (
              <th key={`${column.header}-${index}`}>
                {column.Header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, indexRow) => {
            return (
              <tr key={`${row}-${indexRow}`}>
                {Object.entries(row).map(([key, value], index) => {
                  if (key !== "_id" && key !== "number") {
                    return (
                      <td key={`${key}-${index}`}>
                        {value}
                      </td>
                    )
                  }
                  if (key === "number") {
                    return (
                      <td key={`${key}-${index}`}>
                        <EditableCell
                          initialValue={value}
                          row={row}
                          indexRow={indexRow}
                        />
                      </td>
                    )
                  }
                  return null;
                })}
                <td>
                  <div>
                    <Link to={`/app/edition-produit/${row._id}`}>Edit</Link>
                    <button onClick={async () => {
                      const getProductDataEndPoint = `${apiDomain}/api/${apiVersion}/products/delete-pagination/${row._id}?page=${pageIndex}`;
                      await axiosInstance.delete(getProductDataEndPoint)
                        .then((response) => {
                          setData(response.data.arrayProduct)

                          setPageCount(Math.ceil(response.data.totalProduct / pageSize))

                        });
                    }}>Delete</button>
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
      <div className="pagination">
        <button onClick={() => gotoPage(1)}>
          {'<<'}
        </button>
        <button onClick={() => previousPage()}>
          {'<'}
        </button>
        <button onClick={() => nextPage()}>
          {'>'}
        </button>
        <button onClick={() => gotoPage(pageCount)}>
          {'>>'}
        </button>
      </div>
      <div>
      {data.length === 0 && <span>Pas de produit</span>}
      {data.length > 0 && <span>Page {pageIndex + 1} of {pageCount}</span>}
      </div>
    </Fragment>
  )
}

ProductList.propTypes = {
  userData: PropTypes.object,
}

export default ProductList