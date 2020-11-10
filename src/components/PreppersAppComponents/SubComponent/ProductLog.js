import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useUserData } from './../DataContext';
import Loading from '../UtilitiesComponent/Loading';
import axiosInstance from '../../../utils/axiosInstance';
import { apiDomain, apiVersion } from '../../../apiConfig/ApiConfig';
import TitleButtonInteraction from './../UtilitiesComponent/TitleButtonInteraction';
import { transformDate } from '../../../helpers/transformDate.helper';
import {columnsLogMobile, columnsLogTablet, columnsLogFullScreen} from "./../../../utils/localData";
import Table from './../UtilitiesComponent/Table';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';

function ProductLog({ history }) {
  const [loading, setLoading] = useState(true);
  const [errorFetch, setErrorFetch] = useState(false);
  const isMounted = useRef(true);
  const [ openTitleMessage, setOpenTitleMessage ] = useState(false);
  const { userData } = useUserData();
  const [productLog, setProductLog] = useState([]);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const pageSize = 14;
  let btnSortRef = useRef([]);
  const [hasProduct, setHasProduct] = useState(false);

  useEffect(() => {
    if(userData && userData.role !== "admin"){
      history.push({
        pathname: '/app',
      });
    }
  }, [userData, history]);

  const [columns, setColumns] = useState([]);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const responsiveColumns = useCallback(() =>{
    setWindowWidth(window.innerWidth);
  }, []);

  useEffect(() => {
    window.addEventListener('resize', responsiveColumns);
    return () =>{
      window.removeEventListener('resize', responsiveColumns);
    }
  }, [responsiveColumns]);

  useEffect(() => {
    setColumns(columnsLogMobile);

    if(windowWidth >= 992){
      setColumns(columnsLogTablet)
    }

    if(windowWidth >= 1312){
      setColumns(columnsLogFullScreen)
    }
  }, [setColumns, windowWidth]);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    }
  }, [isMounted]);

  const loadProductLog = useCallback(async () => {
    if(userData){
      setErrorFetch(false);
      setLoading(true);
      const getProductLogEndPoint = `${apiDomain}/api/${apiVersion}/product-logs/pagination/${userData.householdCode}?page=${pageIndex - 1}`;
      await axiosInstance.get(getProductLogEndPoint)
        .then((response) => {
          if(isMounted.current){
            if(response.data.totalProductLog >= 1){
              setProductLog(response.data.arrayProductLog);
              setPageCount(Math.ceil(response.data.totalProductLog / pageSize));
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
  }, [userData, pageIndex]);

  useEffect(() => {
    if (userData) {
      loadProductLog();
    }
  }, [userData, loadProductLog]);

  const deleteAllProductLog = async () => {
    let deleteDataEndPoint = `${apiDomain}/api/${apiVersion}/product-logs/${userData.householdCode}`;

    await axiosInstance.delete(deleteDataEndPoint)
      .then(() => {
        setProductLog([]);
        setPageCount(0);
        setHasProduct(false);
      });
  };

  let contentTitleInteraction = <>
  {openTitleMessage && 
    <div className="title-message">
      <div>
        <p>Êtes-vous sur et certain de vouloir supprimer tout le registre? Tous les registres seront perdus !</p>
        <div className="btn-delete-action-container">
          <button 
          className="btn-delete-action-yes"
          onClick={()=>{deleteAllProductLog()}}>
            Oui
          </button>
          <button 
          className="btn-delete-action-no" 
          onClick={() => {setOpenTitleMessage(!openTitleMessage)}}>
            Non
          </button>
        </div>
      </div>
    </div>
  }
</>

  const deleteProductLog = async (rowId) => {
    let deleteDataEndPoint = `${apiDomain}/api/${apiVersion}/product-logs/delete-pagination/${rowId}?page=${pageIndex - 1}`;

    await axiosInstance.delete(deleteDataEndPoint)
      .then((response) => {
        setProductLog(response.data.arrayProductLog);
          setPageCount(Math.ceil(response.data.totalProductLog / pageSize));
      });
  };

  let trTable = productLog.map((row, indexRow) => {
    return (
      <tr key={`${row}-${indexRow}`}>
        {columns.map((column, index) => {
          if (column.id === 'action') {
            return (
              <td key={`${column.id}-${index}`}>
                <div className="div-list-table-action">
                  <button className="list-table-one-action" onClick={() => deleteProductLog(row._id)}><FontAwesomeIcon icon="trash"/></button>
                </div>
              </td>
            )
          }
          if (column.id !== "user" && column.id !== "createdAt" && column.id !== "infoProduct") {
            return (
              <td key={`${column.id}-${index}`}>
                {row[column.id]}
              </td>
            )
          }
          if (column.id === "user") {
            return (
              <td key={`${column.id}-${index}`}>
                {row[column.id].firstname}
              </td>
            )
          }
          if (column.id === "infoProduct") {
            if(row[column.id] === "Mise à jour" || row[column.id] === "Ajout"){
              return (
                <td key={`${column.id}-${index}`}>
                  <span className="color-code-green">{row[column.id]}</span>
                </td>
              )
            }else if (row[column.id] === "Suppression"){
              return(
                <td key={`${column.id}-${index}`}>
                  <span className="color-code-red">{row[column.id]}</span>
                </td>
              )
            }
          }
          if (column.id === "createdAt") {
            return (
              <td key={`${column.id}-${index}`}>
                {transformDate(row[column.id])}
              </td>
            )
          }
          return null;
        })}
      </tr>
    )
  });

  const gotoPage = (page) => {
    setPageIndex(page);
  };

  const previousPage = () => {
    if (pageIndex > 1) {
      setPageIndex(currPageIndex => currPageIndex - 1);
    }
  };

  const nextPage = async () => {
    if (pageIndex < pageCount) {
      setPageIndex(currPageIndex => parseInt(currPageIndex) + 1);
    }
  };

  let inputPagination = (e) => {
    if(e.target.value > pageCount){
      setPageIndex(pageCount);
    } else if (e.target.value <= 0 || e.target.value === ""){
      setPageIndex("");
    } else {
      setPageIndex(e.target.value);
    }
  }

  
  return (
    <div className="default-wrapper">
      <div className="default-title-container">
        <h1 className="default-h1">Registre des produits</h1>
        {productLog.length >= 1 &&
          <TitleButtonInteraction 
            openTitleMessage={openTitleMessage}
            setOpenTitleMessage={setOpenTitleMessage}
            icon={<FontAwesomeIcon icon="trash" />}
            contentDiv={contentTitleInteraction}
          />
        }
      </div>

      <div className="container-loading">
        <Loading
          loading={loading}
          errorFetch={errorFetch}
          retryFetch={loadProductLog}
        />
        {!hasProduct &&
          <div className="no-data">
            <p>Pas de produit dans le registre !</p>
          </div>
        }

        {hasProduct &&
          <Table 
            columns={columns}
            btnSortRef={btnSortRef}
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

ProductLog.propTypes = {
  history: PropTypes.object.isRequired,
}

export default ProductLog;

