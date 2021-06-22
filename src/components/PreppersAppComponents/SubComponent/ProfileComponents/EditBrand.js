import React, { useEffect, useCallback, useState, useRef } from 'react';
import { useLocation, withRouter } from "react-router-dom";
import { useUserHouseHoldData, useSocket } from '../../DataContext';
import axiosInstance from '../../../../utils/axiosInstance';
import { apiDomain, apiVersion } from '../../../../apiConfig/ApiConfig';
import { useForm } from 'react-hook-form';
import TitleButtonInteraction from '../../UtilitiesComponent/TitleButtonInteraction';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Loading from '../../UtilitiesComponent/Loading';
import InformationIcon from '../../UtilitiesComponent/InformationIcons';
import slugUrl from '../../../../utils/slugify';
import PropTypes from 'prop-types';


function EditBrand({ history }) {
  const isMounted = useRef(true);
  const location = useLocation();
  const { userHouseholdData } = useUserHouseHoldData();
  const { socketRef } = useSocket();
  const [brand, setBrand] = useState({});
  const [brands, setBrands] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [errorFetch, setErrorFetch] = useState(false);
  const [success, setSuccess] = useState(false);
  const [openTitleMessage, setOpenTitleMessage] = useState(false);
  let brandId = location.pathname.split('/')[3];

  const { register, handleSubmit, setError, formState: { errors } } = useForm({
    mode: "onChange"
  });

  const brandName = register("brandName");

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
  }, [getBrand]);

  const getBrands = useCallback(async () => {
    const getBrandsEndPoint = `${apiDomain}/api/${apiVersion}/brands/find-all/${userHouseholdData._id}`;
    await axiosInstance.get(getBrandsEndPoint)
      .then((response) => {
        if(isMounted.current){
          setBrands(response.data);
        }
      })
  }, [userHouseholdData]);

  useEffect(() => {
    if(userHouseholdData){
      getBrands();
    }
  }, [userHouseholdData, getBrands]);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    }
  }, []);

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

  const editBrand = async (data) => {
    if(!data.brandName){
      setError("brandName", {
        type: "manual",
        message: errorMessage
      });
      return;
    }
    let findOtherBrand = brands.find(brand => brand.brandName.value === slugUrl(data.brandName));
    if(data.brandName.toLowerCase() !== brand.brandName.value && findOtherBrand){
      setError('brandName', {
        type:"manual",
        message: errorMessage
      });
      return;
    }
    data.brandName = {label: data.brandName, value: slugUrl(data.brandName)};
    
    const patchBrandEndPoint = `${apiDomain}/api/${apiVersion}/brands/${brandId}`;
    await axiosInstance.patch(patchBrandEndPoint, data)
      .then((response) => {
        if (response.status === 200) {
          setSuccess(true);
        }
      });
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
            <form className="option-component" onSubmit={handleSubmit(editBrand)}>
                <>
                  <div className="input-form-container-with-error">
                    <label htmlFor="firstname">Marque *</label>
                    <input 
                      name="brandName" 
                      className="input-form" 
                      type="text" 
                      placeholder="Marque" 
                      defaultValue={brand?.brandName?.label}
                      onChange={(e) => {
                        brandName.onChange(e);
                        let findOtherBrand = brands.find(brand => brand.brandName.value === slugUrl(e.target.value));
                        if(e.target.value.toLowerCase() !== brand.brandName.value && findOtherBrand){
                          setError('brandName', {
                            type:"manual",
                            message: "Cette marque existe déjà!"
                          });
                          setErrorMessage("Cette marque existe déjà!");
                        }
                        if(!e.target.value){
                          setError('brandName', {
                            type:"manual",
                            message: "Ce champs est requis"
                          });
                          setErrorMessage("Ce champs est requis");
                        }
                      }
                    }
                    />
                    {errors.brandName && <span className="error-message-form">{errors.brandName.message}</span>}
                  </div>

                  <div className="default-action-form-container">
                    <button className="default-btn-action-form" type="submit"><FontAwesomeIcon icon="pen" /> Éditer</button>
                    {success && 
                      <InformationIcon 
                        className="success-icon"
                        icon={<FontAwesomeIcon icon="check" />}
                      />
                    }
                  </div>
                </>
            </form>
          </div> 
        </div>
      </div>
      
    </div>
  )
}

EditBrand.propTypes = {
  history: PropTypes.object.isRequired
}

export default withRouter(EditBrand);
