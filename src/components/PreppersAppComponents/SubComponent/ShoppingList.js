import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useUserData, useUserHouseHoldData } from './../DataContext';
import Loading from '../UtilitiesComponent/Loading';
import axiosInstance from '../../../utils/axiosInstance';
import { apiDomain, apiVersion } from '../../../apiConfig/ApiConfig';
import exportFromJSON from 'export-from-json';
import { transformDate } from '../../../helpers/transformDate.helper';
import TitleButtonInteraction from './../UtilitiesComponent/TitleButtonInteraction';
import {columnsShoppingListMobile, columnsShoppingListTablet, columnsShoppingListFullScreen} from "./../../../utils/localData";
import Table from './../UtilitiesComponent/Table';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function ShoppingList() {
  const [loading, setLoading] = useState(true);
  const [errorFetch, setErrorFetch] = useState(false);
  const isMounted = useRef(true);
  const [ openTitleMessage, setOpenTitleMessage ] = useState(false);
  const [ deleteAllMessage, setDeleteAllMessage ] = useState(false);
  const { userData } = useUserData();
  const { userHouseholdData } = useUserHouseHoldData();
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
      const getShoppingListEndPoint = `${apiDomain}/api/${apiVersion}/shopping-lists/pagination/${userData.householdId}?page=${pageIndex - 1}`;
      await axiosInstance.get(getShoppingListEndPoint)
        .then((response) => {
          if(isMounted.current){
            if(response.data.totalShoppingList >= 1){
              setShoppingList(response.data.arrayData);
              setPageCount(Math.ceil(response.data.totalShoppingList / pageSize));
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

  const downloadShoppingList = async () => {
    let downloadShoppingListEndPoint = `${apiDomain}/api/${apiVersion}/shopping-lists/download/${userData.householdId}`;

    await axiosInstance.get(downloadShoppingListEndPoint)
    .then((response) => {
      const data = response.data;
      const date = transformDate(new Date());
      const fileName = `Liste-de-course-${date}`;
      const exportType = 'xls';

      exportFromJSON({ data, fileName, exportType });
    })
  };

  const sendShoppingListEmail = async () => {
    let sendShoppingListEmailEndPoint = `${apiDomain}/api/${apiVersion}/shopping-lists/send-mail/${userData.householdId}`;

    await axiosInstance.get(sendShoppingListEmailEndPoint)
    .then(() => {
      //TODO animation loading puis checkmark puis remettre l'icône normal;
    });
  };

  const deleteAllShoppingList = async () => {
    let deleteDataEndPoint = `${apiDomain}/api/${apiVersion}/shopping-lists/${userData.householdId}`;

    await axiosInstance.delete(deleteDataEndPoint)
      .then((response) => {
        if(response.status === 204){
          setShoppingList([]);
          setPageCount(0);
          setHasProduct(false);
        }
      });
  };

  const closeAllTitleMessage = () => {
    setOpenTitleMessage(!openTitleMessage);
    setDeleteAllMessage(false);
  };

  let contentTitleInteractionSmartPhone = <>
    {openTitleMessage && 
    <>
     {!deleteAllMessage &&
        <div className="multiple-action-container">
          <button 
          className="btn-delete-action-no" 
          onClick={() => {}}>
            <FontAwesomeIcon icon="download" /> Télécharger la liste de course
          </button>
          <button 
          className="btn-delete-action-no" 
          onClick={sendShoppingListEmail}>
            <FontAwesomeIcon icon="envelope" /> Envoyer la liste de course par mail
          </button>
          <button 
          className="btn-delete-action-yes"
          onClick={()=> {setDeleteAllMessage(!deleteAllMessage)}}>
            <FontAwesomeIcon icon="trash" /> Supprimer tout le registe !
          </button>
        </div>
     }
     {deleteAllMessage &&
      <div className="title-message-container-delete-action">
        <p>Êtes-vous sur et certain de vouloir supprimer toute la liste de course? Toutes les courses seront perdues !</p>
        <div className="btn-delete-action-container">
          <button 
          className="btn-delete-action-yes"
          onClick={()=>{deleteAllShoppingList()}}>
            Oui
          </button>
          <button 
          className="btn-delete-action-no" 
          onClick={() => {setDeleteAllMessage(!deleteAllMessage)}}>
            Non
          </button>
        </div>
      </div>
     }
    </>
    }
  </>;

  let contentTitleInteractionFullScreen = <>
    {openTitleMessage && 
      <div className="title-message-container-delete-action">
        {userHouseholdData.isWaiting ?
          <p>Vous ne pouvez effectuer cette action tant qu'il n'y a pas d'administrateur dans votre famille!</p> :
          <p>Êtes-vous sur et certain de vouloir supprimer toute la liste de course? Toutes les courses seront perdues !</p>
        }
        <div className="btn-delete-action-container">
          <button 
          className={userHouseholdData.isWaiting ? "btn-delete-action-disabled" : "btn-delete-action-yes"}
          onClick={()=>{deleteAllShoppingList()}}
          disabled={userHouseholdData.isWaiting}>
            Oui
          </button>
          <button 
          className="btn-delete-action-no" 
          onClick={() => {setOpenTitleMessage(!openTitleMessage)}}>
            Non
          </button>
        </div>
      </div>
    }
  </>;

  const deleteShopping = async (rowId) => {
    if(shoppingList.length === 1 && pageIndex > 1){
      setPageIndex(currPageIndex => currPageIndex - 1);
    }

    let deleteDataEndPoint = `${apiDomain}/api/${apiVersion}/shopping-lists/delete-pagination/${rowId}?page=${pageIndex - 1}`;

    await axiosInstance.delete(deleteDataEndPoint)
      .then((response) => {
        setShoppingList(response.data.arrayData);
        setPageCount(Math.ceil(response.data.totalProduct / pageSize));
        if(response.data.totalProduct >= 1){
          setHasProduct(true);
        }else{
          setHasProduct(false);
        }
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
                  <button 
                  className={userHouseholdData.isWaiting ? "list-table-one-action-disabled " : "list-table-one-action"} 
                  onClick={() => deleteShopping(row._id)} 
                  disabled={userHouseholdData.isWaiting}>
                    <FontAwesomeIcon icon="trash"/>
                  </button>
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
        <>
          {windowWidth >= 992 &&
            <div className="multiple-button-interaction">
              <button 
                className="btn-action-title"
                title="Télécharger la liste"
                onClick={downloadShoppingList}>
                <FontAwesomeIcon icon="download" />
              </button>
              <button 
                className="btn-action-title" 
                title="Envoyer la liste par mail"
                onClick={sendShoppingListEmail}>
                <FontAwesomeIcon icon="envelope" />
              </button>
              <TitleButtonInteraction
                title={"Supprimer toute la liste !"}
                openTitleMessage={openTitleMessage}
                setOpenTitleMessage={setOpenTitleMessage}
                icon={<FontAwesomeIcon icon="trash" />}
                contentDiv={contentTitleInteractionFullScreen}
              />
            </div>
          }
          {windowWidth < 992 &&
            <TitleButtonInteraction
              title={"Actions liste de course"}
              openTitleMessage={openTitleMessage}
              setOpenTitleMessage={closeAllTitleMessage}
              icon={<FontAwesomeIcon icon="cog" />}
              contentDiv={contentTitleInteractionSmartPhone}
            />
          }
        </>

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

