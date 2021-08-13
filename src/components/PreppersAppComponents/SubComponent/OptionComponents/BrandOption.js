import React, {useEffect, useState, useRef, useCallback} from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../../../../utils/axiosInstance';
import { apiDomain, apiVersion } from '../../../../apiConfig/ApiConfig';
import { useUserHouseHoldData, useSocket, useUserData } from '../../DataContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function BrandOption() {
  const [brands, setBrands] = useState([]);
  const isMounted = useRef(true);
  const { userHouseholdData } = useUserHouseHoldData();
  const { userData } = useUserData();
  const { socketRef } = useSocket();

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
      const getBrandEndPoint = `${apiDomain}/api/${apiVersion}/brands/find-all/${userHouseholdData._id}`;
      await axiosInstance.get(getBrandEndPoint)
        .then(async (response) => {
          if(isMounted.current){
            setBrands(response.data);
          }
        });
    };
    if(userHouseholdData){
      getBrand();
    }
  }, [userHouseholdData]);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    }
  }, []);

  const deleteBrand = async (brandId) => {
    const removeBrandEndpoint = `${apiDomain}/api/${apiVersion}/brands/${brandId}`;
    await axiosInstance.delete(removeBrandEndpoint)
      .then((response)=> {
        setBrands(brands => brands.filter((brand) => brand._id !== response.data._id));
      });
  };

  let tableBrand = <div className="option-component">
    <h2 className="default-h2">Tableau des marques</h2>
    <div className="container-list-table list-table-profile">
      <table className="list-table">
        <thead className="thead-no-cursor">
          <tr>
            <th>Nom</th>
            <th>N° de produit lié</th>
            <th>N° d'historique lié</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {brands.map((brand, index) => {
            return (
              <tr key={`brand-${index}`}>
                <td className="td-align-center">
                  {brand.brandName.label}
                </td>
                <td className="td-align-center">
                  {brand.numberOfProduct}
                </td>
                <td className="td-align-center">
                  {brand.numberOfHistoric}
                </td>
                <td>
                  <div className="div-list-table-action">
                    {userHouseholdData?.isWaiting ?
                      <>
                        <button title="Vous ne pouvez pas editer une marque si votre famille n'a pas d'administrateur.trice!" type="button" className="list-table-action-disabled" disabled><FontAwesomeIcon icon="edit"/></button>
                        <button title="Vous ne pouvez pas supprimer une marque si votre famille n'a pas d'administrateur.trice!" type="button" className="list-table-action-disabled" disabled><FontAwesomeIcon icon="trash"/></button>
                      </> :
                      <> 
                      {brand.numberOfProduct >= 1 || brand.numberOfHistoric >= 1 ? 
                        <>
                        {brand.isBeingEdited ?
                          <>
                            {userData.role === "admin" ?
                              <Link title="Attention, une autre personne édite cette marque, si vous cliquez sur ce bouton, la personne sera éjectée du formulaire d'édition et perdra toutes ses données!" className="list-table-action-warning" to={`/app/edition-marque/${brand._id}`} ><FontAwesomeIcon icon="edit" /></Link>
                            :
                              <button title="Une autre personne édite ce produit!" className="list-table-action-disabled" disabled><FontAwesomeIcon icon="edit" /></button>
                            }
                          </>
                        :
                          <Link title="Éditer la marque" className="list-table-action" to={`/app/edition-marque/${brand._id}`}><FontAwesomeIcon icon="edit" /></Link>
                        }
                          <button title="Vous ne pouvez pas supprimer une marque si elle est utilisée dans un produit ou historique!" type="button" className="list-table-action-disabled" disabled><FontAwesomeIcon icon="trash"/></button>
                        </>
                        :
                        <>
                        {brands.isBeingEdited ?
                          <>
                          {userData.role === "admin" ?
                            <>
                              <Link title="Attention, une autre personne édite cette marque, si vous cliquez sur ce bouton, la personne sera éjectée du formulaire d'édition et perdra toutes ses données!" className="list-table-action-warning" to={`/app/edition-marque/${brand._id}`} ><FontAwesomeIcon icon="edit" /></Link>
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
                            <Link title="Éditer la marque" className="list-table-action" to={`/app/edition-marque/${brand._id}`}><FontAwesomeIcon icon="edit" /></Link>
                            <button title="Supprimer la marque" type="button" className="list-table-action" onClick={()=>{deleteBrand(brand._id)}}><FontAwesomeIcon icon="trash"/></button>
                          </>
                        }
                          
                        </>
                      }
                      </>
                    }
                  </div>
                </td>
              </tr>  
            )
          })}
        </tbody>
      </table>
    </div>     
  </div>;

  return (
    <>
      {brands && <>{tableBrand}</>}
    </>
  )
}

export default BrandOption
