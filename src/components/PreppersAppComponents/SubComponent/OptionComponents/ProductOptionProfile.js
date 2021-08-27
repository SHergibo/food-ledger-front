import React, { useEffect, useState, useRef, useMemo } from 'react';
import { useUserData, useUserOptionData } from '../../DataContext';
import { useForm, Controller } from 'react-hook-form';
import ReactSelect from '../../UtilitiesComponent/ReactSelect';
import { warningExpirationDate } from "../../../../utils/localData";
import axiosInstance from '../../../../utils/axiosInstance';
import { apiDomain, apiVersion } from '../../../../apiConfig/ApiConfig';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import InformationIcon from '../../UtilitiesComponent/InformationIcons';

function ProductOptionProfile() {
  const { userData } = useUserData();
  const { userOptionData, setUserOptionData } = useUserOptionData();
  const [ successFormProduct, setSuccessFormProduct ] = useState(false);
  const isMounted = useRef(true);
  const valueRef = useRef({});

  const { register, handleSubmit, formState: { errors }, control, reset } = useForm({
    defaultValues: useMemo(() => {
      return userOptionData
    }, [userOptionData])
  });

  useEffect(() => {
    valueRef.current = {
      warningExpirationDate: userOptionData?.warningExpirationDate,
      minimalProductStockGlobal: userOptionData?.minimalProductStockGlobal,
      updateAllMinimalProductStock: userOptionData?.updateAllMinimalProductStock,
    }
    reset(valueRef.current)
  }, [reset, userOptionData]);

  useEffect(() => {
    let timerSuccessFormProduct;
    if(successFormProduct){
      timerSuccessFormProduct = setTimeout(() => {
        setSuccessFormProduct(false);
      }, 5000);
    }
    return () => {
      clearTimeout(timerSuccessFormProduct);
    }
  }, [successFormProduct]);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    }
  }, []);

  const patchOptionData = async (data) => {
    const patchUserOptionDataEndPoint = `${apiDomain}/api/${apiVersion}/options/${userData._id}`;
    await axiosInstance.patch(patchUserOptionDataEndPoint, data)
      .then((response) => {
        if(isMounted.current){
          setUserOptionData(response.data);
          return true;
        }
      });
  }

  const updateUserOptionProductData = async (data) => {
    let success = patchOptionData(data);
    if(success){
      setSuccessFormProduct(true);
    }
  };

  return (
    <div className="container-data container-option">
      <div className="form-product option-component">
        <form>
          {userOptionData && 
            <>
              <div className="input-group">
                <ReactSelect
                  format="select"
                  label="Prévenir date de péremption proche"
                  labelBackWhite={true}
                  respSelect={true}
                  Controller={Controller}
                  name="warningExpirationDate"
                  inputId="warning-expiration-date"
                  isClearable={false}
                  arrayOptions={warningExpirationDate}
                  control={control}
                  defaultValue={""}
                />
              </div>

              <div className="input-group">
                <input
                  name="minimalProductStockGlobal"
                  type="number"
                  id="minimalProductStockGlobal"
                  className={`form-input ${errors.minimalProductStockGlobal  ? "error-input" : ""}`}
                  {...register("minimalProductStockGlobal", { required: true })}
                />
                <label htmlFor="minimalProductStockGlobal" className="form-label">Stock minimum global *</label>
                <div className="error-message-input">
                  {errors.minimalProductStockGlobal && <span >Ce champ est requis</span>}
                </div>
              </div>

              <label className="container-checkbox" htmlFor="updateAllMinimalProductStock">
                Utiliser le stock global pour les stocks entrées manuellement : 
                <input type="checkbox" name="updateAllMinimalProductStock" id="updateAllMinimalProductStock" {...register("updateAllMinimalProductStock")} />
                <span className="checkmark-checkbox"></span>
              </label>

            </>
          }
        </form>
        <div className="btn-action-container">
          <button className="btn-purple" type="submit" onClick={() => {
            handleSubmit(updateUserOptionProductData)();
          }}>
            <FontAwesomeIcon className="btn-icon" icon="pen" /> Éditer
          </button>
          {successFormProduct && 
            <InformationIcon 
              className="success-icon"
              icon={<FontAwesomeIcon icon="check" />}
            />
          }
        </div>
      </div>
    </div>
  )
}

export default ProductOptionProfile;