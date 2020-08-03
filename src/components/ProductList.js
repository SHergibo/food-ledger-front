import React, { useState, useEffect, useCallback, Fragment } from 'react';
import { Link, useLocation, withRouter } from 'react-router-dom';
import QueryString from 'query-string';
import axiosInstance from '../utils/axiosInstance';
import { apiDomain, apiVersion } from '../apiConfig/ApiConfig';
import { useForm } from 'react-hook-form';
import PropTypes from 'prop-types';

function ProductList({ userData, history }) {
  const location = useLocation();
  const [data, setData] = useState([]);
  const queryPage = QueryString.parse(location.search);
  const [pageIndex, setPageIndex] = useState(queryPage.page || 1);
  const [pageCount, setPageCount] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [searchObject, setSearchObject] = useState({});
  const [sortObject, setSortObject] = useState({});
  const { register, handleSubmit } = useForm({
    mode: "onChange"
  });

  const getProductList = useCallback(async () => {

    let getProductEndPoint = `${apiDomain}/api/${apiVersion}/products/pagination/${userData.householdcode}?page=${pageIndex - 1}`;

    if (Object.keys(sortObject).length > 0) {
      let urlQuery = "";
      for (const key in sortObject) {
        if (sortObject[key] !== "") {
          urlQuery += `&${key}=${sortObject[key]}`
        }
      }
      getProductEndPoint += urlQuery;
    }

    if (Object.keys(searchObject).length > 0) {
      let urlQuery = "";
      for (const key in searchObject) {
        if (searchObject[key] !== "") {
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
  }, [userData, pageSize, pageIndex, searchObject, sortObject]);


  useEffect(() => {
    console.log('ici');
    const queryParsed = QueryString.parse(location.search);


    if (Object.keys(queryParsed).length > 0) {
      for (const key in queryParsed) {
        if(key.split('-')[1] === "sort"){
          sortObject[key] = queryParsed[key];
          setSortObject(sortObject);
        }else if(key !== "page"){
          searchObject[key] = queryParsed[key];;
          setSearchObject(searchObject);
        }
      }
    }
    
  }, [location, sortObject, searchObject]);

  useEffect(() => {
    if (userData) {
      getProductList();
    }
  }, [userData, getProductList]);


  const columns = [
    {
      Header: 'Nom',
      id: 'name'
    },
    {
      Header: 'Marque',
      id: 'brand'
    },
    {
      Header: 'Type',
      id: 'type'
    },
    {
      Header: 'Poids',
      id: 'weight'
    },
    {
      Header: 'Kcal',
      id: 'kcal'
    },
    {
      Header: "Date d'expiration",
      id: 'expirationDate'
    },
    {
      Header: 'Emplacement',
      id: 'location'
    },
    {
      Header: 'Nombre',
      id: 'number'
    },
    {
      Header: "Actions",
      id: 'action'
    }
  ];

  const gotoPage = (page) => {
    setPageIndex(page);
  };

  const previousPage = () => {
    if (pageIndex > 1) {
      setPageIndex(pageIndex - 1);
    }
  };

  const nextPage = async () => {
    if (pageIndex < (pageCount)) {
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

  const populateSearchObject = (data) => {
    for (const key in data) {
      if (data[key] !== "") {
        setSearchObject(data);
        gotoPage(1);
        return;
      }
    }
  }

  const resetSearchObject = () => {
    if (Object.keys(searchObject).length > 0) {
      setSearchObject({});
      gotoPage(1);
    }
  }

const populateSortObject = (btnId, dataToSort) =>{
  const btnSort = document.getElementById(btnId);

  if(btnSort.dataset.sort === 'none'){
    btnSort.innerHTML = 'desc';
    btnSort.dataset.sort = 'desc';
  }else if(btnSort.dataset.sort === 'desc'){
    btnSort.innerHTML = 'asc';
    btnSort.dataset.sort = 'asc';
  }else if(btnSort.dataset.sort === 'asc'){
    btnSort.innerHTML = 'none';
    btnSort.dataset.sort = 'none';
  }

  let newSortObject = sortObject

  if(btnSort.dataset.sort !== 'none'){
    newSortObject[`${dataToSort}-sort`] = btnSort.dataset.sort;
  }else{
    delete newSortObject[`${dataToSort}-sort`];
  }

  setSortObject(newSortObject);

  // let urlQuery = location.search;
  // const queryParsed = QueryString.parse(location.search);
  // console.log(queryParsed);
  // if (Object.keys(sortObject).length > 0) {
    
  //   for (const key in sortObject) {
  //     if (sortObject[key] !== "") {
  //       if(urlQuery === ""){
  //         urlQuery += `${key}=${sortObject[key]}`
  //       }else{
  //         urlQuery += `&${key}=${sortObject[key]}`
  //       }
  //     }
  //   }
  // }

  // console.log(location);

  // history.push({
  //   pathname: '/app/liste-produit',
  //   search: `${urlQuery}`
  // })
  getProductList();
};


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
            {columns.map((column, index) => {
              if (column.id !== 'action') {
                return (
                  <th key={`${column.id}-${index}`}>
                    {column.Header}
                    <button id={`btn-${column.id}`} onClick={()=>populateSortObject(`btn-${column.id}`, column.id)} data-sort="none">none</button>
                  </th>
                )
              } else {
                return (
                  <th key={`${column.id}-${index}`}>
                    {column.Header}
                  </th>
                )
              }
            })}
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
        {data.length > 0 && <span>Page {pageIndex} of {pageCount}</span>}
      </div>
    </Fragment>
  )
}

ProductList.propTypes = {
  userData: PropTypes.object,
}

export default withRouter(ProductList);;

//TODO utiliser query url dans un sens comme dans l'autre
//TODO champ ajout et update data si besoin
//TODO historique (faire component pour réutiliser le tableau + recherche pour historique)
//TODO design