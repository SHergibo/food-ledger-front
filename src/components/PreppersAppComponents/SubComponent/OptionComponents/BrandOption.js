import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../../../../utils/axiosInstance';
import { apiDomain, apiVersion } from '../../../../apiConfig/ApiConfig';
import { useUserHouseHoldData, useSocket, useUserData } from '../../DataContext';
import Table from './../../UtilitiesComponent/Table';
import { columnsBrandOption } from "./../../../../utils/localData";
import { pageSize } from "./../../../../utils/globalVariable";
import Loading from './../../UtilitiesComponent/Loading';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function BrandOption() {
  const [loading, setLoading] = useState(true);
  const [errorFetch, setErrorFetch] = useState(false);
  const [brands, setBrands] = useState([]);
  const [hasBrand, setHasBrand] = useState(false);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const isMounted = useRef(true);
  const { userHouseholdData } = useUserHouseHoldData();
  const { userData } = useUserData();
  const { socketRef } = useSocket();

  useEffect(() => {
    let socket = null;

    if(socketRef.current && userHouseholdData){
      socket = socketRef.current;
      socket.emit('enterSocketRoom', {socketRoomName: `${userHouseholdData._id}/brand/${pageIndex - 1}`});

      socket.on("connect", () => {
        socket.emit('enterSocketRoom', {socketRoomName: `${userHouseholdData._id}/brand/${pageIndex - 1}`});
      });
    }

    return () => {
      if(socket && userHouseholdData) {
        socket.emit('leaveSocketRoom', {socketRoomName: `${userHouseholdData._id}/brand/${pageIndex - 1}`});
        socket.off('connect');
      }
    };
  }, [userHouseholdData, socketRef, pageIndex]);

  const findIndexData = (data, brandId) => {
    let arrayData = [...data];
    let dataIndex = arrayData.findIndex(data => data._id === brandId);
    return {arrayData, dataIndex};
  };

  const brandIsEdited = useCallback((brandId, isEdited) => {
    let {arrayData, dataIndex} = findIndexData(brands, brandId);
    if(dataIndex !== -1){
      arrayData[dataIndex].isBeingEdited = isEdited;
      setBrands(arrayData);
    }
  }, [brands]);

  const addedData = useCallback((brandData) => {
    let newBrandArray = [brandData, ...brands];
    if(newBrandArray.length > pageSize) newBrandArray.pop();
    if(newBrandArray.length === 1){
      setHasBrand(true);
      setPageCount(1);
    } 
    setBrands(newBrandArray);
  }, [brands]);

  const updatedData = useCallback((brandData) => {
    let {arrayData, dataIndex} = findIndexData(brands, brandData._id);
    arrayData[dataIndex] = brandData;
    setBrands(arrayData);
  }, [brands]);

  const updateDataArray = useCallback((data) => {
    setBrands(data.arrayData);
    if(data.totalData >= 1){
      setPageCount(Math.ceil(data.totalData/ pageSize));
      setHasBrand(true);
      if(data.arrayData.length === 0){
        setPageIndex(currPageIndex => currPageIndex - 1);
      }
    }else{
      setHasBrand(false);
    }
  },[]);

  const updatePageCount = useCallback((data) => {
      setPageCount(Math.ceil(data.totalData / pageSize));
  },[]);

  useEffect(() => {
    let socket = null;

    if(socketRef.current){
      socket = socketRef.current;
      socket.on("brandIsEdited", ({brandId, isEdited}) => {
        brandIsEdited(brandId, isEdited);
      });
      
      socket.on("addedData", (brandData) => {
        addedData(brandData);
      });

      socket.on("updatedData", (brandData) => {
        updatedData(brandData);
      });

      socket.on("updateDataArray", (data) => {
        updateDataArray(data);
      });

      socket.on("updatePageCount", (data) => {
        updatePageCount(data);
      });
    }

    return () => {
      if(socket) {
        socket.off('brandIsEdited');
        socket.off('addedData');
        socket.off('updatedData');
        socket.off('updateDataArray');
        socket.off('updatePageCount');
      }
    }
  }, [socketRef, brandIsEdited, addedData, updatedData, updateDataArray, updatePageCount]);

  const getBrand = useCallback(async () => {
    setErrorFetch(false);
    setLoading(true);
    const getBrandEndPoint = `${apiDomain}/api/${apiVersion}/brands/pagination/${userHouseholdData._id}?page=${pageIndex - 1}`;
    await axiosInstance.get(getBrandEndPoint)
      .then(async (response) => {
        if(isMounted.current){
          if(response.data.totalData >=1){
            setBrands(response.data.arrayData);
            setPageCount(Math.ceil(response.data.totalData / pageSize));
            setHasBrand(true);
          }else{
            setHasBrand(false);
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
  }, [userHouseholdData, pageIndex]);

  useEffect(() => {
    if(userHouseholdData){
      getBrand();
    }
  }, [userHouseholdData, getBrand]);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    }
  }, []);

  const deleteBrand = async (brandId) => {
    if(brands.length === 1 && pageIndex > 1){
      setPageIndex(currPageIndex => currPageIndex - 1);
    }

    const removeBrandEndpoint = `${apiDomain}/api/${apiVersion}/brands/${brandId}`;
    await axiosInstance.delete(removeBrandEndpoint);
  };

  let trTable = brands.map((row, indexRow) => {
    return (
      <tr key={`${row}-${indexRow}`}>
        {columnsBrandOption.map((column, index) => {
          if (column.id === 'action') {
            return (
              <td key={`${column.id}-${index}`}>
                <div className="div-list-table-action">
                  {userHouseholdData?.isWaiting ?
                    <>
                      <button title="Vous ne pouvez pas editer une marque si votre famille n'a pas d'administrateur.trice!" type="button" className="list-table-action-disabled" disabled><FontAwesomeIcon icon="edit"/></button>
                      <button title="Vous ne pouvez pas supprimer une marque si votre famille n'a pas d'administrateur.trice!" type="button" className="list-table-action-disabled" disabled><FontAwesomeIcon icon="trash"/></button>
                    </> :
                    <> 
                    {row.numberOfProduct >= 1 || row.numberOfHistoric >= 1 ? 
                      <>
                      {row.isBeingEdited ?
                        <>
                          {userData.role === "admin" ?
                            <Link title="Attention, une autre personne édite cette marque, si vous cliquez sur ce bouton, la personne sera éjectée du formulaire d'édition et perdra toutes ses données!" className="list-table-action-warning" to={`/app/edition-marque/${row._id}`} ><FontAwesomeIcon icon="edit" /></Link>
                          :
                            <button title="Une autre personne édite ce produit!" className="list-table-action-disabled" disabled><FontAwesomeIcon icon="edit" /></button>
                          }
                        </>
                      :
                        <Link title="Éditer la marque" className="list-table-action" to={`/app/edition-marque/${row._id}`}><FontAwesomeIcon icon="edit" /></Link>
                      }
                        <button title="Vous ne pouvez pas supprimer une marque si elle est utilisée dans un produit ou historique!" type="button" className="list-table-action-disabled" disabled><FontAwesomeIcon icon="trash"/></button>
                      </>
                      :
                      <>
                      {row.isBeingEdited ?
                        <>
                        {userData.role === "admin" ?
                          <>
                            <Link title="Attention, une autre personne édite cette marque, si vous cliquez sur ce bouton, la personne sera éjectée du formulaire d'édition et perdra toutes ses données!" className="list-table-action-warning" to={`/app/edition-marque/${row._id}`} ><FontAwesomeIcon icon="edit" /></Link>
                            <button title="Vous ne pouvez pas supprimer cette marque pendant qu'une personne l'édite!" className="list-table-action-disabled" disabled><FontAwesomeIcon icon="trash" /></button>
                          </>
                        :
                        <>
                          <button title="Une autre personne édite ce produit!" className="list-table-action-disabled" disabled><FontAwesomeIcon icon="edit" /></button>
                          <button title="Vous ne pouvez pas supprimer cette marque pendant qu'une personne l'édite!" className="list-table-action-disabled" disabled><FontAwesomeIcon icon="trash" /></button>
                        </>
                        }
                          
                        </>
                      :
                        <>
                          <Link title="Éditer la marque" className="list-table-action" to={`/app/edition-marque/${row._id}`}><FontAwesomeIcon icon="edit" /></Link>
                          <button title="Supprimer la marque" type="button" className="list-table-action" onClick={()=>{deleteBrand(row._id)}}><FontAwesomeIcon icon="trash"/></button>
                        </>
                      }
                        
                      </>
                    }
                    </>
                  }
                </div>
              </td>
            )
          }
          if (column.id === "brandName") {
            return (
              <td key={`${column.id}-${index}`} className="td-align-center">
                {row[column.id].label}
              </td>
            )
          }else{
            return (
            <td key={`${column.id}-${index}`} className="td-align-center">
              {row[column.id]}
            </td>
            )
          }
        })}
      </tr>
    )
  });

  return (
    <div className="container-loading">
      <Loading
        loading={loading}
        errorFetch={errorFetch}
        retryFetch={getBrand}
      />

      <div className="container-option-data">
        <div className="option-component">
          {!hasBrand &&
            <div className="no-data-option">
              <p>Pas de marque disponible !</p>
            </div>
          }
          
          {hasBrand &&
            <Table 
              columns={columnsBrandOption}
              customTableClass={{customThead: "centered-thead"}}
              trTable={trTable}
              pagination={true}
              paginationInfo={{pageIndex, setPageIndex, pageCount}}
            />
          }
        </div>
      </div>
    </div>
  )
}

export default BrandOption
