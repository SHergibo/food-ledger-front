import React, { useState, useEffect, useCallback, Fragment } from 'react';
import { Link, useLocation, withRouter } from 'react-router-dom';
import QueryString from 'query-string';
import Select from 'react-select';
import axiosInstance from '../../../utils/axiosInstance';
import { apiDomain, apiVersion } from '../../../apiConfig/ApiConfig';
import { useForm, Controller } from 'react-hook-form';
import { transformDate } from '../../../helpers/transformDate.helper';
import DatePicker, { registerLocale } from "react-datepicker";
import { parseISO } from 'date-fns';
import { fr } from 'date-fns/locale'
import PropTypes from 'prop-types';
registerLocale("fr", fr);

function ComponentProductList({ userData, requestTo, urlTo, columns, history }) {
  const location = useLocation();
  const [data, setData] = useState([]);
  let queryParsed = QueryString.parse(location.search); //TODO utilisation d'un useState??
  const [showFilter, setShowFilter] = useState(false);
  const [arrayOptions, setArrayOptions] = useState([]);
  const [pageIndex, setPageIndex] = useState(queryParsed.page || 1);
  const [pageCount, setPageCount] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [searchObject, setSearchObject] = useState({});
  const [sortObject, setSortObject] = useState({});
  const [dateDatePicker, setDateDatePicker] = useState(null);
  const { register, handleSubmit, reset, control, setValue } = useForm({
    mode: "onChange"
  });

  const finalEndPoint = useCallback((endPoint) => {
    if (Object.keys(sortObject).length > 0) {
      let urlQuery = "";
      for (const key in sortObject) {
        if (sortObject[key] !== "") {
          urlQuery += `&${key}=${sortObject[key]}`
        }
      }
      endPoint += urlQuery;
    }

    if (Object.keys(searchObject).length > 0) {
      let urlQuery = "";
      for (const key in searchObject) {
        if (searchObject[key] !== "") {
          urlQuery += `&${key}=${searchObject[key]}`
        }
      }
      endPoint += urlQuery;
    }
    return endPoint;
  }, [sortObject, searchObject]);


  const getDataList = useCallback(async () => {
    let getDataEndPoint = `${apiDomain}/api/${apiVersion}/${requestTo}/pagination/${userData.householdCode}?page=${pageIndex - 1}`;
    const endPoint = finalEndPoint(getDataEndPoint);
    await axiosInstance.get(endPoint)
      .then((response) => {
        setData(response.data.arrayProduct);
        setPageCount(Math.ceil(response.data.totalProduct / pageSize));
      });
  }, [userData, requestTo, pageSize, pageIndex, finalEndPoint]);


  useEffect(() => {
    if (queryParsed.expirationDate) {
      setDateDatePicker(parseISO(queryParsed.expirationDate));
      setValue("expirationDate", parseISO(queryParsed.expirationDate));
    }
  }, [queryParsed.expirationDate, setValue])


  useEffect(() => {
    if (Object.keys(queryParsed).length > 0) {
      for (const key in queryParsed) {

        if (key.split('-')[1] === "sort") {
          sortObject[key] = queryParsed[key];
          setSortObject(sortObject);

          let btnSort = document.getElementById(`btn-${key}`);
          btnSort.innerHTML = `${queryParsed[key]}`;
          btnSort.dataset.sort = `${queryParsed[key]}`;

        } else if (key !== "page") {
          searchObject[key] = queryParsed[key];
          setSearchObject(searchObject);
        }
      }
    }
  }, [location, sortObject, searchObject, queryParsed]);

  useEffect(() => {
    register({ name: "expirationDate" });
    if (userData) {
      getDataList();
    }
  }, [register, userData, getDataList, searchObject]);

  useEffect(() => {
    const loadOptions = async () => {
      let newArray = arrayOptions;
      const getBrandListEndPoint = `${apiDomain}/api/${apiVersion}/brands/${userData.householdCode}`;
      await axiosInstance.get(getBrandListEndPoint)
        .then((response) => {
          response.data.forEach(element => {
            newArray.push({ value: element.brandName, label: element.brandName })
          });
        });
      setArrayOptions(newArray);
    }
    if (userData) {
      loadOptions();
    }
  }, [arrayOptions, userData]);

  const populateSearchObject = (data) => {

    if (data.brand) {
      data.brand = data.brand.value
    }

    if (data.expirationDate) {
      data.expirationDate = data.expirationDate.toISOString();
    }

    for (const key in data) {
      if (data[key] !== "" && data[key] !== undefined) {
        searchObject[key] = data[key];
        queryParsed[key] = data[key];
      }
    }

    history.push({
      pathname: `/app/liste-${urlTo}`,
      search: `${QueryString.stringify(queryParsed, { sort: false })}`
    })

    setSearchObject(searchObject);

    if (pageIndex === 1) {
      getDataList();
    } else {
      gotoPage(1);
    }
  }

  const resetAllSearch = () => {
    if (Object.keys(queryParsed).length > 0) {
      for (const key in queryParsed) {
        if (key.split('-')[1] === "sort") {
          let btnSort = document.getElementById(`btn-${key}`);
          btnSort.innerHTML = "none";
          btnSort.dataset.sort = "none";
        }
      }
    }

    if (Object.keys(sortObject).length > 0) {
      setSortObject({});
    }

    if (Object.keys(searchObject).length > 0) {
      setSearchObject({});
      reset();
    }

    if (pageIndex === 1) {
      getDataList();
    } else {
      gotoPage(1);
    }

    history.push({
      pathname: `/app/liste-${urlTo}`
    })
  }

  const populateSortObject = (e, dataToSort) => {
    e.persist();
    const btnSort = document.getElementById(e.target.id);

    if (btnSort.dataset.sort === 'none') {
      btnSort.innerHTML = 'desc';
      btnSort.dataset.sort = 'desc';
    } else if (btnSort.dataset.sort === 'desc') {
      btnSort.innerHTML = 'asc';
      btnSort.dataset.sort = 'asc';
    } else if (btnSort.dataset.sort === 'asc') {
      btnSort.innerHTML = 'none';
      btnSort.dataset.sort = 'none';
    }

    let newSortObject = sortObject;

    if (btnSort.dataset.sort !== 'none') {
      newSortObject[`${dataToSort}-sort`] = btnSort.dataset.sort;
      queryParsed[`${dataToSort}-sort`] = btnSort.dataset.sort;
    } else {
      delete newSortObject[`${dataToSort}-sort`];
      delete queryParsed[`${dataToSort}-sort`];
    }

    history.push({
      pathname: `/app/liste-${urlTo}`,
      search: `${QueryString.stringify(queryParsed, { sort: false })}`
    })

    setSortObject(newSortObject);

    getDataList();
  };

  const setUrlPageQueryParam = (page) => {
    if (page !== 1) {
      queryParsed["page"] = page;
    } else {
      delete queryParsed["page"];
    }
    history.push({
      pathname: `/app/liste-${urlTo}`,
      search: `${QueryString.stringify(queryParsed, { sort: false })}`
    });
  };

  const gotoPage = (page) => {
    setPageIndex(page);
    setUrlPageQueryParam(page);
  };

  const previousPage = () => {
    if (pageIndex > 1) {
      setPageIndex(pageIndex - 1);
      setUrlPageQueryParam(pageIndex - 1);
    }
  };

  const nextPage = async () => {
    if (pageIndex < (pageCount)) {
      setPageIndex(pageIndex + 1);
      setUrlPageQueryParam(pageIndex + 1);
    }
  };

  const deleteData = async (rowId) => {
    let deleteDataEndPoint = `${apiDomain}/api/${apiVersion}/${requestTo}/delete-pagination/${rowId}?page=${pageIndex - 1}`;

    const endPoint = finalEndPoint(deleteDataEndPoint);

    await axiosInstance.delete(endPoint)
      .then((response) => {
        setData(response.data.arrayProduct)
        setPageCount(Math.ceil(response.data.totalProduct / pageSize))
      });
  };

  return (
    <Fragment>
      {showFilter &&
        <>
          <form onSubmit={handleSubmit(populateSearchObject)}>
            <input name="name" type="text" id="product-name" placeholder="Nom" defaultValue={searchObject.name || ""} ref={register()} />
            {searchObject && searchObject.brand &&
              <Controller
                name="brand"
                id="product-brand"
                as={Select}
                defaultValue={{ value: searchObject.brand, label: searchObject.brand }}
                options={arrayOptions}
                control={control}
              />
            }

            {!searchObject.brand &&
              <Controller
                name="brand"
                id="product-brand"
                as={Select}
                options={arrayOptions}
                control={control}
              />
            }
            <input name="type" type="text" id="product-type" placeholder="Type" defaultValue={searchObject.type} ref={register()} />
            <input name="weight" type="number" id="product-weight" placeholder="Poids" defaultValue={searchObject.weight} ref={register()} />
            <input name="kcal" type="text" id="product-kcal" placeholder="Kcal" defaultValue={searchObject.kcal} ref={register()} />

            <DatePicker
              id="product-expiration-date"
              name="expirationDate"
              isClearable
              placeholderText="Date d'expiration"
              dateFormat="dd/MM/yyyy"
              locale="fr"
              selected={dateDatePicker}
              onChange={val => {
                setDateDatePicker(val);
                setValue("expirationDate", val);
              }}
            />

            {/* TODO chercher un input de type date permettant de faire une recherce AA ou MM/AA ou JJ/MM/AA */}
            <input name="location" type="text" id="product-location" placeholder="Emplacement" defaultValue={searchObject.location} ref={register()} />
            <input name="number" type="number" id="product-number" placeholder="Nombre" defaultValue={searchObject.number} ref={register()} />
            <button type="submit">Search</button>
          </form>

          <button onClick={resetAllSearch}>Reset search</button>
        </>
      }

      <button onClick={() => {
        showFilter ? setShowFilter(false) : setShowFilter(true);
      }}>
        Show filter
      </button>

      <Link to={`/app/ajout-${urlTo}`}>Ajouter un produit</Link>

      <table>
        <thead>
          <tr>
            {columns.map((column, index) => {
              if (column.id !== 'action' && column.id !== 'more') {
                return (
                  <th key={`${column.id}-${index}`}>
                    {column.Header}
                    <button id={`btn-${column.id}-sort`} onClick={(e) => populateSortObject(e, column.id)} data-sort="none">none</button>
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
                {columns.map((column, index) => {
                  if (column.id === 'action') {
                    return (
                      <td key={`${column.id}-${index}`}>
                        <div>
                          <Link to={`/app/edition-${urlTo}/${row._id}`}>Edit</Link>
                          <button onClick={() => deleteData(row._id)}>Delete</button>
                        </div>
                      </td>
                    )
                  }
                  if (column.id !== "expirationDate") {
                    return (
                      <td key={`${column.id}-${index}`}>
                        {row[column.id]}
                      </td>
                    )
                  }
                  if (column.id === "expirationDate") {
                    return (
                      <td key={`${column.id}-${index}`}>
                        {transformDate(row[column.id][0].expDate)}
                      </td>
                    )
                  }
                  return null;
                })}
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

ComponentProductList.propTypes = {
  userData: PropTypes.object,
  requestTo: PropTypes.string.isRequired,
  urlTo: PropTypes.string.isRequired,
  Colums: PropTypes.array,
  history: PropTypes.object.isRequired,
}

export default withRouter(ComponentProductList);