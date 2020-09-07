import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useLocation, withRouter } from 'react-router-dom';
import QueryString from 'query-string';
import ReactSelect from './../UtilitiesComponent/ReactSelect';
import axiosInstance from '../../../utils/axiosInstance';
import { apiDomain, apiVersion } from '../../../apiConfig/ApiConfig';
import Loading from '../UtilitiesComponent/Loading';
import { useForm, Controller } from 'react-hook-form';
import { productType } from "../../../utils/localData";
import { transformDate } from '../../../helpers/transformDate.helper';
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter, faEdit, faTrash, faAngleDoubleLeft, faAngleLeft, faAngleRight, faAngleDoubleRight, faUndo } from '@fortawesome/free-solid-svg-icons';
import PropTypes from 'prop-types';
registerLocale("fr", fr);

function ComponentProductList({ userData, requestTo, urlTo, columns, title, history }) {
  const location = useLocation();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [queryParsed, setQueryParsed] = useState(QueryString.parse(location.search) || {});
  const [showFilter, setShowFilter] = useState(false);
  const [arrayOptions, setArrayOptions] = useState([]);
  let btnSortRef = useRef([]);
  const [pageIndex, setPageIndex] = useState(queryParsed.page || 1);
  const [pageCount, setPageCount] = useState(0);
  const pageSize = 14;
  const [searchObject, setSearchObject] = useState({});
  const [sortObject, setSortObject] = useState({});

  useEffect(() => {
    if (Object.keys(queryParsed).length > 0) {
      for (const key in queryParsed) {

        if (key.split('-')[1] === "sort") {
          sortObject[key] = queryParsed[key];
          setSortObject(sortObject);

          if (btnSortRef.current.length >= 1) {
            btnSortRef.current.forEach(element => {
              if (element && element.id === `btn-${key}`) {
                element.innerHTML = "";
                if(queryParsed[key] === "desc"){
                  element.insertAdjacentHTML('afterbegin', '<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="sort-amount-down" class="svg-inline--fa fa-sort-amount-down fa-w-16 " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M304 416h-64a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h64a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16zm-128-64h-48V48a16 16 0 0 0-16-16H80a16 16 0 0 0-16 16v304H16c-14.19 0-21.37 17.24-11.29 27.31l80 96a16 16 0 0 0 22.62 0l80-96C197.35 369.26 190.22 352 176 352zm256-192H240a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h192a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16zm-64 128H240a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h128a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16zM496 32H240a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h256a16 16 0 0 0 16-16V48a16 16 0 0 0-16-16z"></path></svg>');
                }else if(queryParsed[key] === "asc"){
                  element.insertAdjacentHTML('afterbegin', '<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="sort-amount-up" class="svg-inline--fa fa-sort-amount-up fa-w-16 " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M304 416h-64a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h64a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16zM16 160h48v304a16 16 0 0 0 16 16h32a16 16 0 0 0 16-16V160h48c14.21 0 21.38-17.24 11.31-27.31l-80-96a16 16 0 0 0-22.62 0l-80 96C-5.35 142.74 1.77 160 16 160zm416 0H240a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h192a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16zm-64 128H240a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h128a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16zM496 32H240a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h256a16 16 0 0 0 16-16V48a16 16 0 0 0-16-16z"></path></svg>');
                }
                
                element.dataset.sort = `${queryParsed[key]}`;
              }
            });
          }

        } else if (key !== "page") {
          searchObject[key] = queryParsed[key];
          setSearchObject(searchObject);
        }
      }
    }
  }, [location, sortObject, searchObject, queryParsed, columns]);

  const defaultValues = {
    expirationDate: null,
    brand: null,
    type:  null
  };

  useEffect(() => {
    if (queryParsed.expirationDate) {
      defaultValues.expirationDate = parseISO(queryParsed.expirationDate);
    }
    if (queryParsed.brand) {
      defaultValues.brand = { value: searchObject.brand, label: searchObject.brand };
    }
    if (queryParsed.type) {
      defaultValues.type = { value: searchObject.type, label: searchObject.type };
    }
  }, [defaultValues, queryParsed, searchObject]);

  const { register, handleSubmit, reset, control } = useForm({
    defaultValues,
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
    if(pageIndex >= 1){
      let getDataEndPoint = `${apiDomain}/api/${apiVersion}/${requestTo}/pagination/${userData.householdCode}?page=${pageIndex - 1}`;
      const endPoint = finalEndPoint(getDataEndPoint);
      await axiosInstance.get(endPoint)
        .then((response) => {
          setData(response.data.arrayProduct);
          setPageCount(Math.ceil(response.data.totalProduct / pageSize));
          setLoading(false);
        });
    }
  }, [userData, requestTo, pageIndex, finalEndPoint]);

  useEffect(() => {
    if (userData) {
      getDataList();
    }
  }, [userData, getDataList, searchObject]);

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

  const populateSearchObject = (dataInput) => {

    if (dataInput.brand) {
      dataInput.brand = dataInput.brand.value
    }

    if (dataInput.type) {
      dataInput.type = dataInput.type.value
    }

    if (dataInput.expirationDate) {
      dataInput.expirationDate = dataInput.expirationDate.toISOString();
    }

    for (const key in dataInput) {
      if (dataInput[key] !== "" && dataInput[key] !== undefined && dataInput[key] !== null) {
        searchObject[key] = dataInput[key];
        queryParsed[key] = dataInput[key];
      }
      if(dataInput[key] === null){
        delete queryParsed[key];
        delete searchObject[key];
      }
    }

    history.push({
      pathname: `/app/liste-${urlTo}`,
      search: `${QueryString.stringify(queryParsed, { sort: false })}`
    })

    setSearchObject(searchObject);
    setQueryParsed(queryParsed);

    if (pageIndex === 1) {
      getDataList();
    } else {
      gotoPage(1);
    }
  }

  const debounced = (delay, fn) => {
    let timerId;
    return function (...args) {
      if (timerId) {
        clearTimeout(timerId);
      }
      timerId = setTimeout(() => {
        fn(...args);
        timerId = null;
      }, delay);
    }
  }

  const populateSearchObjectQuickSearch = (dataInput) => {

    if(dataInput.name !== ""){
      searchObject.name = dataInput.name;
      queryParsed.name = dataInput.name;
    }else{
      delete queryParsed.name;
      delete searchObject.name;
    }

    history.push({
      pathname: `/app/liste-${urlTo}`,
      search: `${QueryString.stringify(queryParsed, { sort: false })}`
    })

    setSearchObject(searchObject);
    setQueryParsed(queryParsed);

    if (pageIndex === 1) {
      getDataList();
    } else {
      gotoPage(1);
    }
  }

  const debounceQuickSearch = useCallback(debounced(200, populateSearchObjectQuickSearch), []);


  const resetAllSearch = () => {
    if (Object.keys(queryParsed).length > 0) {
      for (const key in queryParsed) {
        if (key.split('-')[1] === "sort") {
          btnSortRef.current.forEach(element => {
            if (element.id === `btn-${key}`) {
              element.innerHTML = '';
              element.insertAdjacentHTML('beforeend', '<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="sort" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path fill="currentColor" d="M41 288h238c21.4 0 32.1 25.9 17 41L177 448c-9.4 9.4-24.6 9.4-33.9 0L24 329c-15.1-15.1-4.4-41 17-41zm255-105L177 64c-9.4-9.4-24.6-9.4-33.9 0L24 183c-15.1 15.1-4.4 41 17 41h238c21.4 0 32.1-25.9 17-41z"></path></svg>');
              element.dataset.sort = "none";
            }
          });
        }
      }
    }

    if (Object.keys(sortObject).length > 0) {
      setSortObject({});
    }

    if (Object.keys(searchObject).length > 0) {
      setSearchObject({});
    }
    reset();
    reset({type: null, brand: null, expirationDate: null});
    setQueryParsed({});
    setPageIndex(1);

    history.push({
      pathname: `/app/liste-${urlTo}`
    })
  }

  const populateSortObject = (dataToSort, index) => {
    const btnSort = btnSortRef.current[index];

    if (btnSort.dataset.sort === 'none') {
      btnSort.dataset.sort = 'desc';
    } else if (btnSort.dataset.sort === 'desc') {
      btnSort.dataset.sort = 'asc';
    } else if (btnSort.dataset.sort === 'asc') {
      btnSort.innerHTML = '';
      btnSort.insertAdjacentHTML('beforeend', '<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="sort" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path fill="currentColor" d="M41 288h238c21.4 0 32.1 25.9 17 41L177 448c-9.4 9.4-24.6 9.4-33.9 0L24 329c-15.1-15.1-4.4-41 17-41zm255-105L177 64c-9.4-9.4-24.6-9.4-33.9 0L24 183c-15.1 15.1-4.4 41 17 41h238c21.4 0 32.1-25.9 17-41z"></path></svg>');
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

    setQueryParsed(queryParsed);
    setSortObject(newSortObject);

    getDataList();
  };

  const setUrlPageQueryParam = (page) => {
    if (page > 1 && page !== null) {
      queryParsed["page"] = page;
    } else {
      delete queryParsed["page"];
    }
    history.push({
      pathname: `/app/liste-${urlTo}`,
      search: `${QueryString.stringify(queryParsed, { sort: false })}`
    });
    setQueryParsed(queryParsed);
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
    <section className="wrapper-list-table">

      <div className="header-list-table">
        <div className="default-title-container">
          <h1 className="default-h">{title}</h1>
        </div>

        <div>
          <Link className="default-btn-blue" to={`/app/ajout-${urlTo}`}>+ Ajouter un produit</Link>

          <button className="default-btn-white" onClick={() => {
            showFilter ? setShowFilter(false) : setShowFilter(true);
          }}>
            {!showFilter &&
              <>
                Filtre avancée
              </>
            }

            {showFilter &&
              <>
                Fermer
              </>
            }
            <FontAwesomeIcon icon={faFilter} />
          </button>

          {!showFilter &&
            <form onChange={handleSubmit(debounceQuickSearch)}>
              <input className="quick-search" name="name" type="text" id="product-name" placeholder="Recherche rapide" defaultValue={searchObject.name || ""} ref={register()} />
            </form>
          }
        </div>
      </div>

      {showFilter &&
        <>
          <form className="form-filter-table" onSubmit={handleSubmit(populateSearchObject)}>
            <div className="input-form-container">
              <label htmlFor="product-name">Nom du produit</label>
              <input className="input-form" name="name" type="text" id="product-name" placeholder="Nom..." defaultValue={searchObject.name || ""} ref={register()} />
            </div>
            
            <div className="input-form-container">
              <ReactSelect
                format="select"
                label="Marque du produit"
                Controller={Controller}
                name="brand"
                inputId="product-brand"
                classNamePrefix="select-brand"
                placeholder="Marque..."
                arrayOptions={arrayOptions}
                control={control}
              />
            </div>

            <div className="input-form-container">
              <ReactSelect
                format="select"
                label="Type de produit"
                Controller={Controller}
                name="type"
                inputId="product-type"
                classNamePrefix="select-type"
                placeholder="Type..."
                arrayOptions={productType}
                control={control}
              />
            </div>

            <div className="input-form-container">
              <label htmlFor="product-weight">Poids du produit</label>
              <input className="input-form" name="weight" type="number" id="product-weight" placeholder="Poids..." defaultValue={searchObject.weight} ref={register()} />
            </div>

            <div className="input-form-container">
              <label htmlFor="product-kcal">Valeur energétique du produit</label>
              <input className="input-form" name="kcal" type="text" id="product-kcal" placeholder="Kcal..." defaultValue={searchObject.kcal} ref={register()} />
            </div>

            <div className="input-form-container">
              <label htmlFor="product-expirationDate">Date d'expiration du produit</label>
              <Controller
                control={control}
                name="expirationDate"
                render={(props) => (
                  <DatePicker
                    className="input-form input-form-date-picker"
                    id="product-expirationDate"
                    dateFormat="dd/MM/yyyy"
                    locale="fr"
                    isClearable
                    placeholderText="Date d'expiration..."
                    onChange={(e) => props.onChange(e)}
                    selected={props.value}
                  />
                )}
              />
            {/* TODO chercher un input de type date permettant de faire une recherce AA ou MM/AA ou JJ/MM/AA */}
            </div>
            
            <div className="input-form-container">
              <label htmlFor="product-location">Emplacement du produit</label>
              <input className="input-form" name="location" type="text" id="product-location" placeholder="Emplacement..." defaultValue={searchObject.location} ref={register()} />
            </div>

            <div className="input-form-container">
              <label htmlFor="product-number">Nombre de produit</label>
              <input className="input-form" name="number" type="number" id="product-number" placeholder="Nombre..." defaultValue={searchObject.number} ref={register()} />
            </div>

            <div className="default-action-form-container">
              <button className="default-btn-action-form" type="submit"><FontAwesomeIcon icon={faFilter} />Filtrer</button>
              <button className="default-btn-action-form" onClick={resetAllSearch}><FontAwesomeIcon icon={faUndo} />Réinitialiser filtre</button>
            </div>
            
          </form>
        </>
      }
      <div className="container-list-table-loading">
        <Loading
          loading={loading}
        />
        <div className="container-list-table">
          <table className="list-table">
            <thead>
              <tr>
                {columns.map((column, index) => {
                  if (column.id !== 'action' && column.id !== 'more') {
                    return (
                      <th key={`${column.id}-${index}`}>
                        <span>
                          {column.Header}
                          <button 
                          className="btn-list-sort"
                          id={`btn-${column.id}-sort`} 
                          ref={(el) => (btnSortRef.current[index] = el)} 
                          onClick={(e) => populateSortObject(column.id, index)} 
                          data-sort="none">
                            <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="sort" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path fill="currentColor" d="M41 288h238c21.4 0 32.1 25.9 17 41L177 448c-9.4 9.4-24.6 9.4-33.9 0L24 329c-15.1-15.1-4.4-41 17-41zm255-105L177 64c-9.4-9.4-24.6-9.4-33.9 0L24 183c-15.1 15.1-4.4 41 17 41h238c21.4 0 32.1-25.9 17-41z"></path></svg>
                          </button>
                        </span>
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
                            <div className="div-list-table-action">
                              <Link className="list-table-action" to={`/app/edition-${urlTo}/${row._id}`}><FontAwesomeIcon icon={faEdit} /></Link>
                              <button className="list-table-action" onClick={() => deleteData(row._id)}><FontAwesomeIcon icon={faTrash} /></button>
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
                            {transformDate(row[column.id][0].expDate)} (x{row[column.id][0].productLinkedToExpDate})
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
            <div className="action-pagination">
              <button onClick={() => gotoPage(1)}>
                <FontAwesomeIcon icon={faAngleDoubleLeft} />
              </button>
              <button onClick={() => previousPage()}>
                <FontAwesomeIcon icon={faAngleLeft} />
              </button>

                <span>Page
                  <input 
                  type="number" 
                  value={pageIndex}
                  min={1}
                  max={pageCount}
                  onChange={(e) => {
                    if(e.target.value > pageCount){
                      setPageIndex(pageCount);
                      setUrlPageQueryParam(pageCount);
                    } else if (e.target.value <= 0 || e.target.value === ""){
                      setPageIndex("");
                      setUrlPageQueryParam(null);
                    } else {
                      setPageIndex(e.target.value);
                      setUrlPageQueryParam(e.target.value);
                    }
                  }}
                  />
                  sur {pageCount}
                </span>

              <button onClick={() => nextPage()}>
                <FontAwesomeIcon icon={faAngleRight} />
              </button>
              <button onClick={() => gotoPage(pageCount)}>
                <FontAwesomeIcon icon={faAngleDoubleRight} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

ComponentProductList.propTypes = {
  userData: PropTypes.object,
  requestTo: PropTypes.string.isRequired,
  urlTo: PropTypes.string.isRequired,
  columns: PropTypes.array,
  title: PropTypes.string.isRequired,
  history: PropTypes.object.isRequired,
}

export default withRouter(ComponentProductList);