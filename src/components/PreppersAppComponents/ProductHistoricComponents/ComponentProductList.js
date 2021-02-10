import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useUserData, useUserOptionData } from './../DataContext';
import { Link, useLocation, withRouter } from 'react-router-dom';
import QueryString from 'query-string';
import ReactSelect from './../UtilitiesComponent/ReactSelect';
import axiosInstance from '../../../utils/axiosInstance';
import { apiDomain, apiVersion } from '../../../apiConfig/ApiConfig';
import Loading from '../UtilitiesComponent/Loading';
import exportFromJSON from 'export-from-json';
import TitleButtonInteraction from './../UtilitiesComponent/TitleButtonInteraction';
import { useForm, Controller } from 'react-hook-form';
import { productType } from "../../../utils/localData";
import Table from './../UtilitiesComponent/Table';
import { transformDate, addMonths } from '../../../helpers/transformDate.helper';
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import slugUrl from './../../../utils/slugify';
import PropTypes from 'prop-types';
registerLocale("fr", fr);

function ComponentProductList({ requestTo, urlTo, columns, title, history }) {
  const { userData } = useUserData();
  const { userOptionData, setUserOptionData } = useUserOptionData();
  const location = useLocation();
  const [openTitleMessage, setOpenTitleMessage] = useState(false);
  const [data, setData] = useState([]);
  const isMounted = useRef(true);
  const [hasProduct, setHasProduct] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errorFetch, setErrorFetch] = useState(false);
  const [queryParsed, setQueryParsed] = useState(QueryString.parse(location.search) || {});
  const [showFilter, setShowFilter] = useState(false);
  const [arrayOptions, setArrayOptions] = useState([]);
  let btnSortRef = useRef([]);
  const [pageIndex, setPageIndex] = useState(parseInt(queryParsed.page) || 1);
  const [pageCount, setPageCount] = useState(0);
  const pageSize = 14;
  const [searchObject, setSearchObject] = useState({});
  const [sortObject, setSortObject] = useState({});

  const [hideColorCodeDate, setHideColorCodeDate] = useState("");
  const [hideColorCodeStock, setHideColorCodeStock] = useState("");

  useEffect(() => {
    if(userOptionData){
      if(!userOptionData.colorCodeDate){
        setHideColorCodeDate("hide-color-code")
      }
      if(userOptionData.colorCodeDate){
        setHideColorCodeDate("")
      }

      if(!userOptionData.colorCodeStock){
        setHideColorCodeStock("hide-color-code")
      }
      if(userOptionData.colorCodeStock){
        setHideColorCodeStock("")
      }
    }
  }, [userOptionData]);



  useEffect(() => {
    const loadOptions = async () => {
      let newArray = [];
      const getBrandListEndPoint = `${apiDomain}/api/${apiVersion}/brands/${userData.householdCode}`;
      await axiosInstance.get(getBrandListEndPoint)
        .then((response) => {
          if(isMounted.current){
            response.data.forEach(element => {
              newArray.push({ value: element.brandName.value, label: element.brandName.label })
            });
          }
        });
      setArrayOptions(newArray);
    }
    if (userData) {
      loadOptions();
    }
  }, [userData]);

  useEffect(() => {
    let searchObj = {};
    let sortObj = {};
    let queryParsedDelete = [];
    if (Object.keys(queryParsed).length > 0) {
      for (const key in queryParsed) {

        if (key.split('-')[1] === "sort") {
          sortObj[key] = queryParsed[key];

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
          if(key === "name"){
            if(sessionStorage.getItem('nameFilter') && JSON.parse(sessionStorage.getItem('nameFilter')).value ===  queryParsed[key]){
              searchObj.name = JSON.parse(sessionStorage.getItem('nameFilter')).label;
            }else{
              searchObj[key] = queryParsed[key];
            }
          }else if(key === "location"){
            if(sessionStorage.getItem('locationFilter') && JSON.parse(sessionStorage.getItem('locationFilter')).value ===  queryParsed[key]){
              searchObj.location = JSON.parse(sessionStorage.getItem('locationFilter')).label;
            }else{
              searchObj[key] = queryParsed[key];
            }
          }else if(key === "expirationDate"){
            if(/\d{4}-\d{2}-\d{2}T\d{2}-\d{2}-\d{2}_\d{3}Z/.test(queryParsed[key].toUpperCase())){
              searchObj[key] = queryParsed[key];
            }else{
              queryParsedDelete.push(key);
            }
          }else if (key === "number" || key === "weight" || key === "kcal"){
            if(! isNaN(queryParsed[key])){
              searchObj[key] = parseFloat(queryParsed[key]);
            }else{
              queryParsedDelete.push(key);
            }
          }else if (key === "brand"){
            if(arrayOptions.length >= 1){
              let arrayBrand = arrayOptions.filter(item => item.value === queryParsed[key]);
              if(arrayBrand.length >= 1){
                searchObj[key] = queryParsed[key];
              }else{
                queryParsedDelete.push(key);
              }
            }
          }else if (key === "type"){
            let arrayType = productType.filter(item => item.value === queryParsed[key]);
            if(arrayType.length === 1){
              searchObj[key] = queryParsed[key];
            }else{
              queryParsedDelete.push(key);
            }
          }
        }
      }
      if(queryParsedDelete.length >= 1){
        queryParsedDelete.forEach(element => {
          delete queryParsed[element];
        });
        history.push({
          pathname: `/app/liste-${urlTo}`,
          search: `${QueryString.stringify(queryParsed, { sort: false })}`
        });
      }
    }
    if(Object.keys(sortObj).length > 0){
      setSortObject(sortObj);
    }
    if(Object.keys(searchObj).length > 0){
      setSearchObject(searchObj);
    }
  }, [location, history, urlTo, queryParsed, arrayOptions]);

  const defaultValues = {
    expirationDate: null,
    brand: null,
    type:  null
  };

  const { register, handleSubmit, reset, control, setValue } = useForm({
    defaultValues,
    mode: "onChange"
  });

  useEffect(() => {
    if(showFilter){
      if (queryParsed.expirationDate) {
        let dateUpperCase = queryParsed.expirationDate.toUpperCase()
        let unSlugExpDate = dateUpperCase.split('T')[1].replace(/-/g, ":").replace("_", ".");
        let expDate = `${dateUpperCase.split('T')[0]}T${unSlugExpDate}`;
        setValue("expirationDate", parseISO(expDate));
      }
      if (queryParsed.brand) {
        let arrayBrand = arrayOptions.filter(item => item.value === queryParsed.brand);
        setValue("brand", { value: arrayBrand[0].value, label: arrayBrand[0].label });
      }
      if (queryParsed.type) {
        let arrayType = productType.filter(item => item.value === queryParsed.type);
        setValue("type", { value: arrayType[0].value, label: arrayType[0].label });
      }
    }
  }, [showFilter, setValue, queryParsed, arrayOptions]);


  const { register : registerFormOption, handleSubmit : handleSubmitFormOption } = useForm({
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
        if (searchObject[key] !== "" && key !== "name"  && key !== "location") {
          urlQuery += `&${key}=${searchObject[key]}`;
        }else if(key === "name" || key === "location"){
          urlQuery += `&${key}=${slugUrl(searchObject[key])}`;
        }
      }
      endPoint += urlQuery;
    }
    return endPoint;
  }, [sortObject, searchObject]);

  const getDataList = useCallback(async () => {
    setErrorFetch(false);

    if(pageIndex >= 1 && userData){
      setLoading(true);
      let getDataEndPoint = `${apiDomain}/api/${apiVersion}/${requestTo}/pagination/${userData.householdCode}?page=${pageIndex - 1}`;
      const endPoint = finalEndPoint(getDataEndPoint);
      await axiosInstance.get(endPoint)
        .then((response) => {
          if(isMounted.current){
            setData(response.data.arrayData);
            setPageCount(Math.ceil(response.data.totalProduct / pageSize));
            if(response.data.totalProduct >= 1){
              setHasProduct(true);
            }else{
              setHasProduct(false);
            }
            setLoading(false);
          }
        })
        .catch((error)=> {
          let jsonError = JSON.parse(JSON.stringify(error));
          if(isMounted.current){
            if(error.code === "ECONNABORTED" || jsonError.name === "Error"){
              setErrorFetch(true);
            }
          }
        });
    }
  }, [userData, requestTo, pageIndex, finalEndPoint, isMounted]);

  useEffect(() => {
    if (userData) {
      getDataList();
    }
  }, [userData, getDataList]);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    }
  }, [isMounted]);

  const populateSearchObject = (dataInput) => {

    if(dataInput.name){
      sessionStorage.setItem('nameFilter', JSON.stringify({label: dataInput.name, value: slugUrl(dataInput.name)}));
      dataInput.name = slugUrl(dataInput.name);
    }

    if(dataInput.location){
      sessionStorage.setItem('locationFilter', JSON.stringify({label: dataInput.location, value: slugUrl(dataInput.location)}));
      dataInput.location = slugUrl(dataInput.location);
    }

    if (dataInput.brand) {
      dataInput.brand = dataInput.brand.value
    }

    if (dataInput.type) {
      dataInput.type = dataInput.type.value
    }

    if (dataInput.expirationDate) {
      let date = dataInput.expirationDate.toISOString();
      dataInput.expirationDate = slugUrl(date);
    }

    let searchObj = searchObject;
    let queryObj = queryParsed;

    for (const key in dataInput) {
      if (dataInput[key] !== "" && dataInput[key] !== undefined && dataInput[key] !== null) {
        searchObj[key] = dataInput[key];
        queryObj[key] = dataInput[key];
      }
      if(searchObj[key] !== dataInput[key]){
        if(dataInput[key] === "" || dataInput[key] === null)
        delete searchObj[key];
        delete queryObj[key];
      }
    }

    if(Object.keys(searchObj).length === 0){
      setSearchObject({});
      setQueryParsed({});
    }else{
      setSearchObject(searchObj);
      setQueryParsed(queryObj);
    }

    if(requestTo === "products"){
      sessionStorage.setItem('productQueryParamsFilter', QueryString.stringify(queryObj));
    }else if (requestTo === "historics"){
      sessionStorage.setItem('historicQueryParamsFilter', QueryString.stringify(queryObj));
    }

    history.push({
      pathname: `/app/liste-${urlTo}`,
      search: `${QueryString.stringify(queryObj, { sort: false })}`
    })

    if (pageIndex > 1) {
      gotoPage(1);
    }
  }

  const populateSearchObjectQuickSearch = (e) => {
    e.persist();
    e.preventDefault();
    handleSubmit((dataInput)=> {
      let searchObj = searchObject;
      let queryObj = queryParsed;
  
      if(slugUrl(dataInput.name) !== ""){
        sessionStorage.setItem('nameFilter', JSON.stringify({label: dataInput.name, value: slugUrl(dataInput.name)}));
        searchObj.name = slugUrl(dataInput.name);
        queryObj.name = slugUrl(dataInput.name);

        setSearchObject(searchObj);
        setQueryParsed(queryObj);

        if(requestTo === "products"){
          sessionStorage.setItem('productQueryParamsFilter', QueryString.stringify(queryObj));
        }else if (requestTo === "historics"){
          sessionStorage.setItem('historicQueryParamsFilter', QueryString.stringify(queryObj));
        }
    
        history.push({
          pathname: `/app/liste-${urlTo}`,
          search: `${QueryString.stringify(queryParsed, { sort: false })}`
        });
      }
  
      if (pageIndex > 1) {
        gotoPage(1);
      }
    })(e);
  }

  const resetQuickSearch = (e) => {
    let searchObj = searchObject;
    let queryObj = queryParsed;
    sessionStorage.removeItem('nameFilter');

    if(e.target.value === "" && searchObj.name && queryObj.name){
      if(Object.keys(searchObj).length >= 2 && Object.keys(queryObj).length >= 2){
        delete searchObj.name;
        delete queryObj.name;
        setSearchObject(searchObj);
        setQueryParsed(queryObj);
      }else{
        queryObj = {};
        setSearchObject({});
        setQueryParsed({});
      }

      if(requestTo === "products"){
        sessionStorage.setItem('productQueryParamsFilter', QueryString.stringify(queryObj));
      }else if (requestTo === "historics"){
        sessionStorage.setItem('historicQueryParamsFilter', QueryString.stringify(queryObj));
      }

      history.push({
        pathname: `/app/liste-${urlTo}`,
        search: `${QueryString.stringify(queryObj, { sort: false })}`
      })
    }
  }

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
    sessionStorage.removeItem('nameFilter');
    sessionStorage.removeItem('locationFilter');

    if(requestTo === "products"){
      sessionStorage.removeItem('productQueryParamsFilter');
    }else if (requestTo === "historics"){
      sessionStorage.removeItem('historicQueryParamsFilter');
    }
    
    reset();
    reset({brand: null, type: null, weight: null, kcal: null, expirationDate: null, location: null, number: null});
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
      if (Object.keys(sortObject).length < 1 && Object.keys(searchObject).length === 0) {
        getDataList();
      } 
    }

    setQueryParsed(queryParsed);
    setSortObject(newSortObject);

    if(requestTo === "products"){
      sessionStorage.setItem('productQueryParamsFilter', QueryString.stringify(queryParsed));
    }else if (requestTo === "historics"){
      sessionStorage.setItem('historicQueryParamsFilter', QueryString.stringify(queryParsed));
    }

    history.push({
      pathname: `/app/liste-${urlTo}`,
      search: `${QueryString.stringify(queryParsed, { sort: false })}`
    })

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
      setPageIndex(currPageIndex => currPageIndex - 1);
      setUrlPageQueryParam(pageIndex - 1);
    }
  };

  const nextPage = async () => {
    if (pageIndex < pageCount) {
      setPageIndex(currPageIndex => parseInt(currPageIndex) + 1);
      setUrlPageQueryParam(parseInt(pageIndex) + 1);
    }
  };

  const deleteData = async (rowId) => {

    if(data.length === 1 && pageIndex > 1){
      setPageIndex(currPageIndex => currPageIndex - 1);
      setUrlPageQueryParam(pageIndex - 1);
    }
    let deleteDataEndPoint = `${apiDomain}/api/${apiVersion}/${requestTo}/delete-pagination/${rowId}?page=${pageIndex - 1}`;

    const endPoint = finalEndPoint(deleteDataEndPoint);

    await axiosInstance.delete(endPoint)
      .then((response) => {
        setData(response.data.arrayData);
        setPageCount(Math.ceil(response.data.totalProduct / pageSize));
        if(response.data.totalProduct >= 1){
          setHasProduct(true);
        }else{
          setHasProduct(false);
          setShowFilter(false);
        }
      });
  };

  const udpateUserOptionDate = async (data) => {
    const patchUserOptionDataEndPoint = `${apiDomain}/api/${apiVersion}/options/${userData._id}`;
    await axiosInstance.patch(patchUserOptionDataEndPoint, data)
      .then((response) => {
        if(isMounted.current){
          setUserOptionData(response.data);
          return true;
        }
      });
  }

  const downloadList = async () => {
    let downloadListEndPoint = `${apiDomain}/api/${apiVersion}/${requestTo}/download/${userData.householdCode}`;

    await axiosInstance.get(downloadListEndPoint)
    .then((response) => {
      const data = response.data;
      let fileName= "Document-gestion-de-stock";
      const date = transformDate(new Date());
      if(requestTo === "products"){
        fileName = `Liste-des-produit-${date}`;
      }else if(requestTo === "historics"){
        fileName = `Liste-historique-des-produits-${date}`;
      }
      const exportType = 'xls';

      exportFromJSON({ data, fileName, exportType });
    })
  };

  let contentTitleInteraction = <form className="form-standard" onSubmit={handleSubmitFormOption(udpateUserOptionDate)}>
    {userOptionData &&
    <>
      <h4>Afficher code couleur : </h4>
      <label className="container-checkbox-input-interaction" htmlFor="colorCodeDate">
        Pour les dates de péremption : 
        <input type="checkbox" name="colorCodeDate" id="colorCodeDate" defaultChecked={userOptionData.colorCodeDate} ref={registerFormOption()}/>
        <span className="checkmark-checkbox"></span>
      </label>
      <label className="container-checkbox-input-interaction" htmlFor="colorCodeStock">
        Pour les stock minimum de produits : 
        <input type="checkbox" name="colorCodeStock" id="colorCodeStock" defaultChecked={userOptionData.colorCodeStock} ref={registerFormOption()}/>
        <span className="checkmark-checkbox"></span>
      </label>
      <button className="btn-action-form-interaction" type="submit">Mettre à jour</button>
    </>
    }
  </form>;

  let trTable = data.map((row, indexRow) => {
    return (
      <tr key={`${row}-${indexRow}`}>
        {columns.map((column, index) => {
          if (column.id === 'action') {
            return (
              <td key={`${column.id}-${index}`}>
                <div className="div-list-table-action">
                  <Link className="list-table-action" to={`/app/edition-${urlTo}/${row._id}`}><FontAwesomeIcon icon="edit" /></Link>
                  <button className="list-table-action" onClick={() => deleteData(row._id)}><FontAwesomeIcon icon="trash"/></button>
                </div>
              </td>
            )
          }
          if (column.id === "weight" || column.id === "kcal" || column.id === "location") {
            return (
              <td key={`${column.id}-${index}`}>
                {row[column.id]}
              </td>
            )
          }
          if (column.id === "brand") {
            return (
              <td key={`${column.id}-${index}`}>
                {row[column.id].brandName.label}
              </td>
            )
          }
          if (column.id === "type") {
            return (
              <td key={`${column.id}-${index}`}>
                {row[column.id].label}
              </td>
            )
          }
          if (column.id === "name") {
            let title = {}
            if(row[column.id].length >= 24){
              title = {title : `${row[column.id]}`}
            }
            return (
              <td key={`${column.id}-${index}`} {...title} className="ellipsis-info">
                {row[column.id]}
              </td>
            )
          }
          if (column.id === "expirationDate") {
            if(userOptionData){
              if(row[column.id][0].expDate <= addMonths(userOptionData.warningExpirationDate.value)){
                return (
                  <td key={`${column.id}-${index}`}>
                    <span className={`color-code-red ${hideColorCodeDate}`}>{transformDate(row[column.id][0].expDate)} (x{row[column.id][0].productLinkedToExpDate})</span>
                  </td>
                )
              }else if(row[column.id][0].expDate > addMonths(userOptionData.warningExpirationDate.value) && row[column.id][0].expDate <= addMonths(userOptionData.warningExpirationDate.value + 1)){
                return (
                  <td key={`${column.id}-${index}`}>
                    <span className={`color-code-orange ${hideColorCodeDate}`}>{transformDate(row[column.id][0].expDate)} (x{row[column.id][0].productLinkedToExpDate})</span>
                  </td>
                )
              }else{
                return (
                  <td key={`${column.id}-${index}`}>
                    <span className={`no-color-code ${hideColorCodeDate}`}>{transformDate(row[column.id][0].expDate)} (x{row[column.id][0].productLinkedToExpDate})</span>
                  </td>
                )
              }
            }
          }
          if (column.id === "number") {
            if(row[column.id] < row["minimumInStock"].minInStock){
              return (
                <td key={`${column.id}-${index}`}>
                  <span className={`color-code-red ${hideColorCodeStock}`}>{row[column.id]}</span>
                </td>
              )
            }else if(row["minimumInStock"].minInStock !== 0 && row[column.id] >= row["minimumInStock"].minInStock && row[column.id] < row["minimumInStock"].minInStock + 5){
              return (
                <td key={`${column.id}-${index}`}>
                  <span className={`color-code-orange ${hideColorCodeStock}`}>{row[column.id]}</span>
                </td>
              )
            }else{
              return (
                <td key={`${column.id}-${index}`}>
                <span className={`no-color-code ${hideColorCodeStock}`}>{row[column.id]}</span>
                </td>
              )
            }
          }
          if (column.id === "minimumInStock") {
            return (
              <td key={`${column.id}-${index}`}>
                {row[column.id].minInStock}
              </td>
            )
          }
          return null;
        })}
      </tr>
    )
  });

  let inputPagination = (e) => {
    if(e.target.value > pageCount){
      setPageIndex(pageCount);
      setUrlPageQueryParam(pageCount);
    } else if (e.target.value <= 0 || e.target.value === ""){
      setPageIndex(null);
      setUrlPageQueryParam(null);
    } else {
      setPageIndex(e.target.value);
      setUrlPageQueryParam(e.target.value);
    }
  }

  return (
    <div className="default-wrapper">

      <div className="header-list-table">
        <div className="default-title-container">
          <h1 className="default-h1">{title}</h1>
          <div className="multiple-button-interaction">
            {hasProduct &&
              <button 
                className="btn-action-title"
                title="Télécharger la liste"
                onClick={downloadList}>
                <FontAwesomeIcon icon="download" />
              </button>
            }
            {requestTo === "products" &&
              <TitleButtonInteraction
                title={"Options du tableau"}
                openTitleMessage={openTitleMessage}
                setOpenTitleMessage={setOpenTitleMessage}
                icon={<FontAwesomeIcon icon="cog" />}
                contentDiv={contentTitleInteraction}
              />
            }
          </div>
        </div>

        <div>
          {(hasProduct || Object.keys(searchObject).length > 0) && 
            <>
              <Link className="default-btn-blue" to={`/app/ajout-${urlTo}`}>Ajouter un produit  <FontAwesomeIcon icon="plus" /></Link>
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
                <FontAwesomeIcon icon="filter" />
              </button>

              {!showFilter &&
                <form onSubmit={(e)=>populateSearchObjectQuickSearch(e)} onChange={(e)=>{resetQuickSearch(e)}}>
                  <input className="quick-search" name="name" type="text" id="product-name" placeholder="Recherche rapide" defaultValue={searchObject.name || ""} ref={register()} />
                </form>
              }
              <button title="Réinitialiser les filtres" className="reset-filter-table" onClick={resetAllSearch}>
                <span className="reset-filter-text">Réinitialiser les filtres</span>
                <FontAwesomeIcon icon="undo" />
              </button>
            </>
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
                isClearable={true}
                placeholder="Marque..."
                arrayOptions={arrayOptions}
                control={control}
                defaultValue={""}
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
                isClearable={true}
                placeholder="Type..."
                arrayOptions={productType}
                control={control}
                defaultValue={""}
              />
            </div>

            <div className="input-form-container">
              <label htmlFor="product-weight">Poids du produit (gr)</label>
              <input className="input-form" name="weight" type="number" id="product-weight" placeholder="Poids..." defaultValue={searchObject.weight} ref={register()} />
            </div>

            <div className="input-form-container">
              <label htmlFor="product-kcal">Valeur énergétique du produit (kcal)</label>
              <input className="input-form" name="kcal" type="number" id="product-kcal" placeholder="Kcal..." defaultValue={searchObject.kcal} ref={register()} />
            </div>

            {requestTo === "products" &&
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
                      autoComplete="off"
                      placeholderText="Date d'expiration..."
                      onChange={(e) => props.onChange(e)}
                      selected={props.value}
                    />
                  )}
                />
                {/* TODO chercher un input de type date permettant de faire une recherce AA ou MM/AA ou JJ/MM/AA */}
              </div>
            }


            
            <div className="input-form-container">
              <label htmlFor="product-location">Emplacement du produit</label>
              <input className="input-form" name="location" type="text" id="product-location" placeholder="Emplacement..." defaultValue={searchObject.location} ref={register()} />
            </div>

            {requestTo === "products" &&
              <div className="input-form-container">
                <label htmlFor="product-number">Nombre de produit</label>
                <input className="input-form" name="number" type="number" id="product-number" placeholder="Nombre..." defaultValue={searchObject.number} ref={register()} />
              </div>
            }

            <div className="default-action-form-container">
              <button className="default-btn-action-form" type="submit"><FontAwesomeIcon icon="filter" />Filtrer</button>
              
            </div>
            
          </form>
        </>
      }
      <div className="container-loading">
        <Loading
          loading={loading}
          errorFetch={errorFetch}
          retryFetch={getDataList}
        />
        {!hasProduct &&
          <div className="no-data">
            <p>Pas de produit !</p>
            {Object.keys(searchObject).length === 0 &&
              <Link className="default-btn-blue" to={`/app/ajout-${urlTo}`}>Ajouter un produit <FontAwesomeIcon icon="plus" /></Link>
            }
          </div>
        }

        {hasProduct &&
          <Table 
            columns={columns}
            sorting={true}
            btnSortRef={btnSortRef}
            sortObject={sortObject}
            populateSortObject={populateSortObject}
            trTable={trTable}
            pagination={true}
            paginationInfo={{pageIndex, pageCount}}
            paginationFunction={{gotoPage, previousPage, nextPage, inputPagination}}
          />
        }

      </div>
    </div>
  )
}

ComponentProductList.propTypes = {
  requestTo: PropTypes.string.isRequired,
  urlTo: PropTypes.string.isRequired,
  columns: PropTypes.array,
  title: PropTypes.string.isRequired,
  history: PropTypes.object.isRequired,
}

export default withRouter(ComponentProductList);