import React, {useEffect, useState, useRef, useCallback} from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../../../../utils/axiosInstance';
import { apiDomain, apiVersion } from '../../../../apiConfig/ApiConfig';
import { useUserHouseHoldData, useSocket, useUserData } from '../../DataContext';
import Table from './../../UtilitiesComponent/Table';
import { columnsBrandOption } from "./../../../../utils/localData";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function BrandOption() {
  const [brands, setBrands] = useState([]);
  const [hasBrand, setHasBrand] = useState(false);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const isMounted = useRef(true);
  const { userHouseholdData } = useUserHouseHoldData();
  const { userData } = useUserData();
  const { socketRef } = useSocket();
  const pageSize = 12;

  useEffect(() => {
    let socket = null;

    if(socketRef.current && userHouseholdData){
      socket = socketRef.current;
      socket.emit('enterEditedRoom', {householdId: userHouseholdData._id, type: "brand"});

      socket.on("connect", () => {
        socket.emit('enterEditedRoom', {householdId: userHouseholdData._id, type: "brand"});
      });
    }

    return () => {
      if(socket && userHouseholdData) {
        socket.emit('leaveEditedRoom', {householdId: userHouseholdData._id, type: "brand"});
        socket.off('connect');
      }
    };
  }, [userHouseholdData, socketRef]);

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

  const updatedBrand = useCallback((brandData) => {
    let {arrayData, dataIndex} = findIndexData(brands, brandData._id);
    arrayData[dataIndex] = brandData;
    setBrands(arrayData);
  }, [brands]);

  const deletedBrand = useCallback((brandId) => {
    let arrayData = brands.filter(brand => brand._id !== brandId);
    setBrands(arrayData);
  }, [brands]);

  const addedBrand = useCallback((brandData) => {;
    setBrands([...brands, brandData]);
  }, [brands]);

  useEffect(() => {
    let socket = null;

    if(socketRef.current){
      socket = socketRef.current;
      socket.on("brandIsEdited", ({brandId, isEdited}) => {
        brandIsEdited(brandId, isEdited);
      });

      socket.on("updatedBrand", (brandData) => {
        updatedBrand(brandData);
      });

      socket.on("deletedBrand", (brandId) => {
        deletedBrand(brandId);
      });

      socket.on("addedBrand", (brandData) => {
        addedBrand(brandData);
      });
    }

    return () => {
      if(socket) {
        socket.off('brandIsEdited');
        socket.off('updatedBrand');
        socket.off('deletedBrand');
        socket.off('addedBrand');
      }
    }
  }, [socketRef, brandIsEdited, updatedBrand, deletedBrand, addedBrand]);

  useEffect(() => {
    const getBrand = async () => {
      const getBrandEndPoint = `${apiDomain}/api/${apiVersion}/brands/pagination/${userHouseholdData._id}?page=${pageIndex - 1}`;
      await axiosInstance.get(getBrandEndPoint)
        .then(async (response) => {
          if(isMounted.current){
            setBrands(response.data.arrayData);
            setPageCount(Math.ceil(response.data.totalBrand / pageSize));
            setHasBrand(true);
          }else{
            setHasBrand(false);
          }
        });
    };
    if(userHouseholdData){
      getBrand();
    }
  }, [userHouseholdData, pageIndex]);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    }
  }, []);

  const deleteBrand = async (brandId) => {
    if(brands.length === 1 && pageIndex > 1){
      setPageIndex(currPageIndex => currPageIndex - 1);
    }

    const removeBrandEndpoint = `${apiDomain}/api/${apiVersion}/brands/delete-pagination/${brandId}?page=${pageIndex - 1}`;
    await axiosInstance.delete(removeBrandEndpoint)
      .then((response)=> {
        setBrands(response.data.arrayData);
        setPageCount(Math.ceil(response.data.totalBrand / pageSize));
        if(response.data.totalBrand >= 1){
          setHasBrand(true);
        }else{
          setHasBrand(false);
        }
      });
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
    <div className="container-brand">
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
  )
}

export default BrandOption
