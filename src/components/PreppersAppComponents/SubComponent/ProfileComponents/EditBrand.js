import React, { useEffect, useCallback, useState, useRef } from 'react';
import { useLocation, withRouter } from "react-router-dom";
import { useUserHouseHoldData, useSocket } from '../../DataContext';
import axiosInstance from '../../../../utils/axiosInstance';
import { apiDomain, apiVersion } from '../../../../apiConfig/ApiConfig';
import TitleButtonInteraction from '../../UtilitiesComponent/TitleButtonInteraction';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Loading from '../../UtilitiesComponent/Loading';
import slugUrl from '../../../../utils/slugify';
import PropTypes from 'prop-types';


function EditBrand({ history }) {
  const isMounted = useRef(true);
  const location = useLocation();
  const { userHouseholdData } = useUserHouseHoldData();
  const { socketRef } = useSocket();
  const [brand, setBrand] = useState({});
  const [loading, setLoading] = useState(true);
  const [errorFetch, setErrorFetch] = useState(false);
  const [success, setSuccess] = useState(false);
  const [openTitleMessage, setOpenTitleMessage] = useState(false);
  let brandId = location.pathname.split('/')[3];

  useEffect(() => {
    if(userHouseholdData?.isWaiting){
      history.push("/app/profil");
    }
  }, [userHouseholdData, history]);

  useEffect(() => {
    let socket = null;
    if(socketRef.current && userHouseholdData?._id && brand?._id){
      socket = socketRef.current;
      socket.emit('brandIsEdited', {householdId: userHouseholdData._id, brandId: brand._id, isEdited: true});
    }

    return () => {
      if(socket && userHouseholdData?._id && brand?._id){
        socket.emit('brandIsEdited', {householdId: userHouseholdData._id, brandId: brand._id, isEdited: false});
      }
    };
  }, [location, brand, userHouseholdData, socketRef]);

  useEffect(() => {
    let socket = null;

    if(socketRef.current){
      socket = socketRef.current;
      socket.on("kickBrandIsEdited", () => {
        history.push("/app/profil");
      });
    }

    return () => {
      if(socket) {
        socket.off('kickBrandIsEdited');
      }
    }
  }, [socketRef, history]);

  const getBrand = useCallback(async () => {
    setErrorFetch(false);
    const getBrandEndPoint = `${apiDomain}/api/${apiVersion}/brands/${brandId}`;
    await axiosInstance.get(getBrandEndPoint)
      .then((response) => {
        if(isMounted.current){
          setBrand(response.data);
          setLoading(false);
        }
      })
      .catch(error => {
        if(isMounted.current){
          if (error.response.status === 404 || error.response.status === 500) {
            history.goBack();
          }
          let jsonError = JSON.parse(JSON.stringify(error));
          if(error.code === "ECONNABORTED" || jsonError.name === "Error"){
            setErrorFetch(true);
          }
        }
      });
  }, [history, brandId]);

  useEffect(() => {
    getBrand();
    return () => {
      isMounted.current = false;
    }
  }, [getBrand]);

  useEffect(() => {
    let timerSuccess;
    if(success){
      timerSuccess = setTimeout(() => {
        setSuccess(false);
      }, 3500);
    }

    return () => {
      clearTimeout(timerSuccess);
    }
  }, [success]);



  const EditBrand = async (data) => {
    // data.brand.value = slugUrl(data.brand.value);
    // let newData = {
    //   kcal: data.kcal,
    //   location: data.location,
    //   name: data.name,
    //   expirationDate: arrayExpDate,
    //   weight: data.weight,
    //   brand: data.brand,
    //   type: data.type,
    //   householdId: userHouseholdData._id
    // }

    // let totalNumber = 0;
    // let emptyProductLinkedToExpDate = false;
    // arrayExpDate.forEach(item => {
    //   if(item.productLinkedToExpDate === ""){
    //     emptyProductLinkedToExpDate = true;
    //     return;
    //   }
    //   totalNumber = totalNumber + parseInt(item.productLinkedToExpDate);
    // });

    // if(emptyProductLinkedToExpDate) return;

    // newData.number = totalNumber;

    // if(data.minimumInStock === ""){
    //   newData.minimumInStock = { minInStock : 0 };
    // }else{
    //   newData.minimumInStock = { minInStock : parseInt(data.minimumInStock), updatedBy: "user" };
    // }

    // const patchDataEndPoint = `${apiDomain}/api/${apiVersion}/${requestUrl}/${productId}`;
    // await axiosInstance.patch(patchDataEndPoint, newData)
    //   .then((response) => {
    //     if (response.status === 200) {
    //       if (productId === response.data._id) {
    //         setSuccess(true);
    //       }
    //       if (parseInt(newData.number) === 0 && newData.expirationDate.length === 0 && requestUrl === "products") {
    //         history.push({
    //           pathname: `/app/edition-historique/${response.data._id}`,
    //         })
    //       }
    //       if (newData.number >= 1 && newData.expirationDate.length >= 1 && requestUrl === "historics") {
    //         history.push({
    //           pathname: `/app/edition-produit/${response.data._id}`,
    //         })
    //       }
    //     }
    //   });
  }

  const deleteBrand = async () => {
    let deleteBrandEndPoint = `${apiDomain}/api/${apiVersion}/brands/${brandId}`;

    await axiosInstance.delete(deleteBrandEndPoint)
      .then((response) => {
        if(response.status === 200){
          history.push({
            pathname: '/app/profile',
          })
        }
      });
  }

  let contentTitleInteractionDeleteBrand = <>
  {openTitleMessage && 
    <div className="title-message-container-delete-action">
      <p>Êtes-vous sur et certain de vouloir supprimer la marque {brand?.brandName?.label}?</p>
      <div className="btn-delete-action-container">
        <button 
        className="btn-delete-action-yes"
        onClick={()=>{deleteBrand()}}>
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

  return (
   <div className="default-wrapper">
      <div className="default-title-container">
        <div className="title-and-return">
          <button className="return-to"
            onClick={() => {
              history.push({
                pathname: '/app/profil',
                state: {
                  brandOptions: true 
                }
              })
            }}>
            <FontAwesomeIcon icon="arrow-left" />
          </button>
          <h1 className="default-h1">Édition de la marque {brand?.brandName?.label}</h1>
        </div>
        {(brand.numberOfHistoric + brand.numberOfProduct) < 1 && 
          <TitleButtonInteraction
            title={`Supprimer la marque ${brand?.brandName?.label}!`}
            openTitleMessage={openTitleMessage}
            setOpenTitleMessage={setOpenTitleMessage}
            icon={<FontAwesomeIcon icon="trash" />}
            contentDiv={contentTitleInteractionDeleteBrand}
          />
        }
      </div>
      
      <div className="container-loading">
          <Loading
            loading={loading}
            errorFetch={errorFetch}
            retryFetch={getBrand}
          />
        <div>
          <div className="form-add-edit-product-container">
            <form>
              {/* {form} */}
            </form>
          </div>

          {/* <div className="default-action-form-container">
            <button className="default-btn-action-form" onClick={() => {
              handleSubmit(handleFunction)();
              expErrorMessageLogic();
              }}>
              {formType === "add" &&
                <FontAwesomeIcon icon="plus" /> 
              }
              {formType === "edit" &&
                <FontAwesomeIcon icon="pen" /> 
              }
              {button}
            </button>
            {success && number !== 0 &&
              <InformationIcon 
                className="success-icon"
                icon={<FontAwesomeIcon icon="check" />}
              />
            }
            {formType === "edit" && number === 0 && requestUrl === "products" &&
              <InformationIcon 
                className="warning-icon"
                icon={<FontAwesomeIcon icon="exclamation" />}
                message="Attention, après édition de ce produit, ce produit se trouvera dans la liste des historiques car le nombre total de produits est égal à 0 !"
              />
            }
            {formType === "edit" && number >= 1 && requestUrl === "historics" &&
              <InformationIcon 
                className="warning-icon"
                icon={<FontAwesomeIcon icon="exclamation" />}
                message="Attention, après édition de ce produit, ce produit se trouvera dans la liste des produits car le nombre total de produits est supérieur à 0 !"
              />
            }
          </div> */}
          
        </div>
      </div>
      
    </div>
  )
}

EditBrand.propTypes = {
  history: PropTypes.object.isRequired
}

export default withRouter(EditBrand);
