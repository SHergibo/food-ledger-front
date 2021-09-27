import React, { useEffect, useCallback, useState, useRef, useMemo } from 'react';
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
  const valueRef = useRef({});

  const { register, handleSubmit, setError, formState: { errors }, reset } = useForm({
    defaultValues: useMemo(() => {
      return brand
    }, [brand])
  });

  const { onChange, ...rest } = register("brandName");

  useEffect(() => {
    valueRef.current = {
      brandName: brand?.brandName?.label,
    }
    reset(valueRef.current)
  }, [reset, brand]);

  useEffect(() => {
    if(userHouseholdData?.isWaiting){
      history.push("/app/options");
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
        history.push("/app/options");
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
        if(response.status === 204){
          history.push({
            pathname: '/app/options',
            state: {
              brandOptions: true 
            }
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
        className="small-btn-red"
        onClick={()=>{deleteBrand()}}>
          Oui
        </button>
        <button 
        className="small-btn-purple" 
        onClick={() => {setOpenTitleMessage(!openTitleMessage)}}>
          Non
        </button>
      </div>
    </div>
  }
</>;

  return (
   <>
      <div className="sub-header">
        <div className="sub-option sub-option-return">
          <div className="title-return">
            <button className="btn-action-title"
              onClick={() => {
                history.push({
                  pathname: '/app/options',
                  state: {
                    brandOptions: true 
                  }
                })
              }}>
              <FontAwesomeIcon className="btn-icon" icon="arrow-left" />
            </button>
            <h1>Édition de marque</h1>
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
      </div>
      
      <div className="container-loading">
          <Loading
            loading={loading}
            errorFetch={errorFetch}
            retryFetch={getBrand}
          />
        <div className="container-data container-option">
          <form className="option-component form-edit-brand" onSubmit={handleSubmit(editBrand)}>
            <div className="input-group">
              <input
                name="brandName"
                type="text"
                id="brandName"
                className={`form-input ${errors.brandName  ? "error-input" : ""}`}
                onChange={(e) => {
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
                    onChange(e);
                  }
                }
                {...rest}
              />
              <label htmlFor="brandName" className="form-label">Marque *</label>
              <div className="error-message-input">
                {errors.brandName && <span>{errors.brandName.message}</span>}
              </div>
            </div>

            <div className="btn-action-container">
              <button className="btn-purple" type="submit"><FontAwesomeIcon className="btn-icon" icon="pen" /> Éditer</button>
              {success && 
                <InformationIcon 
                  className="success-icon"
                  icon={<FontAwesomeIcon icon="check" />}
                />
              }
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

EditBrand.propTypes = {
  history: PropTypes.object.isRequired
}

export default withRouter(EditBrand);
