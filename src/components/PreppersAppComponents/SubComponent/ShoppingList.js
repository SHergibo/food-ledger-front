import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useUserData } from './../DataContext';
import Loading from '../UtilitiesComponent/Loading';
import axiosInstance from '../../../utils/axiosInstance';
import { apiDomain, apiVersion } from '../../../apiConfig/ApiConfig';
import TitleButtonInteraction from './../UtilitiesComponent/TitleButtonInteraction';
import {columnsShoppingListMobile, columnsShoppingListTablet, columnsShoppingListFullScreen} from "./../../../utils/localData";
import Table from './../UtilitiesComponent/Table';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function ShoppingList() {
  const [loading, setLoading] = useState(true);
  const [errorFetch, setErrorFetch] = useState(false);
  const isMounted = useRef(true);
  const [ openTitleMessage, setOpenTitleMessage ] = useState(false);
  const { userData } = useUserData();
  const [shoppingList, setShoppingList] = useState([]);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const pageSize = 14;
  let btnSortRef = useRef([]);
  const [hasProduct, setHasProduct] = useState(false);

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
    setColumns(columnsShoppingListMobile);

    if(windowWidth >= 992){
      setColumns(columnsShoppingListTablet)
    }

    if(windowWidth >= 1312){
      setColumns(columnsShoppingListFullScreen)
    }
  }, [setColumns, windowWidth]);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    }
  }, [isMounted]);

  const loadShoppingList = useCallback(async () => {
    if(userData){
      setErrorFetch(false);
      setLoading(true);
      const getShoppingListEndPoint = `${apiDomain}/api/${apiVersion}/shopping-lists/pagination/${userData.householdCode}?page=${pageIndex - 1}`;
      await axiosInstance.get(getShoppingListEndPoint)
        .then((response) => {
          if(isMounted.current){
            if(response.data.totalProduct >= 1){
              setShoppingList(response.data.arrayData);
              setPageCount(Math.ceil(response.data.totalProduct / pageSize));
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
      loadShoppingList();
    }
  }, [userData, loadShoppingList]);

  const deleteAllShoppingList = async () => {
    let deleteDataEndPoint = `${apiDomain}/api/${apiVersion}/shopping-lists/${userData.householdCode}`;

    await axiosInstance.delete(deleteDataEndPoint)
      .then(() => {
        setShoppingList([]);
        setPageCount(0);
        setHasProduct(false);
      });
  };

  let contentTitleInteraction = <>
  {openTitleMessage && 
    <div className="title-message">
      <div>
        <p>Êtes-vous sur et certain de vouloir supprimer toute la liste de course? Toutes les courses seront perdues !</p>
        <div className="btn-delete-action-container">
          <button 
          className="btn-delete-action-yes"
          onClick={()=>{deleteAllShoppingList()}}>
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

  const deleteShopping = async (rowId) => {
    if(shoppingList.length === 1){
      setPageIndex(currPageIndex => currPageIndex - 1);
    }

    let deleteDataEndPoint = `${apiDomain}/api/${apiVersion}/shopping-lists/delete-pagination/${rowId}?page=${pageIndex - 1}`;

    await axiosInstance.delete(deleteDataEndPoint)
      .then((response) => {
        setShoppingList(response.data.arrayData);
          setPageCount(Math.ceil(response.data.totalProduct / pageSize));
      });
  };

  let trTable = shoppingList.map((row, indexRow) => {
    let objectPropertyName;
    if(row.product){
      objectPropertyName = "product";
    }else{
      objectPropertyName = "historic";
    }
    return (
      <tr key={`${row}-${indexRow}`}>
        {columns.map((column, index) => {
          if (column.id === 'action') {
            return (
              <td key={`${column.id}-${index}`}>
                <div className="div-list-table-action">
                  <button className="list-table-one-action" onClick={() => deleteShopping(row._id)}><FontAwesomeIcon icon="trash"/></button>
                </div>
              </td>
            )
          }
          if (column.id === "name") {
            return (
              <td key={`${column.id}-${index}`}>
                {row[objectPropertyName].name}
              </td>
            )
          }
          if (column.id === "brand") {
            return (
              <td key={`${column.id}-${index}`}>
                {row[objectPropertyName].brand.brandName.label}
              </td>
            )
          }
          if (column.id === "weight") {
            return (
              <td key={`${column.id}-${index}`}>
                {row[objectPropertyName].weight}
              </td>
            )
          }
          if (column.id === "numberProduct") {
            return (
              <td key={`${column.id}-${index}`}>
                {row[column.id]}
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
        {shoppingList.length > 1 &&
          <h1 className="default-h1">Liste de courses</h1>
        }
        {shoppingList.length <= 1 &&
          <h1 className="default-h1">Liste de course</h1>
        }
        
        {shoppingList.length >= 1 &&
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
          retryFetch={loadShoppingList}
        />
        {!hasProduct &&
          <div className="no-data">
            <p>Pas de produit dans la liste de course !</p>
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

export default ShoppingList;

