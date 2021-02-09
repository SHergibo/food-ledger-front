import React, { useEffect, useState, useRef } from 'react';
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

  const { register : registerFormProduct, handleSubmit : handleSubmitFormProduct, errors : errorsFormProduct, setValue: setValueFormProduct, control: controlFormProduct } = useForm({
    mode: "onChange"
  });

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
    if(userOptionData){
      if (userOptionData.warningExpirationDate) {
        setValueFormProduct("warningExpirationDate", { value: userOptionData.warningExpirationDate.value, label: userOptionData.warningExpirationDate.label });
      }
    }
  }, [userOptionData, setValueFormProduct]);

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
    <form onSubmit={handleSubmitFormProduct(updateUserOptionProductData)}>
      {userOptionData && 
        <>
          <div className="input-form-container">
            <ReactSelect
              format="select"
              label="Prévenir date de péremption proche"
              Controller={Controller}
              name="warningExpirationDate"
              inputId="warning-expiration-date"
              classNamePrefix="warning-expiration-date"
              isClearable={false}
              placeholder="Interval d'envoi..."
              arrayOptions={warningExpirationDate}
              control={controlFormProduct}
              defaultValue={""}
            />
          </div>

          <div className="input-form-container">
            <label htmlFor="minimalProductStockGlobal">Stock minimum global *</label>
            <input className="input-form" name="minimalProductStockGlobal" type="number" id="minimalProductStockGlobal" placeholder="Stock minimum..." defaultValue={userOptionData.minimalProductStockGlobal} ref={registerFormProduct({required: true})} />
            {errorsFormProduct.minimalProductStockGlobal && <span className="error-message-form">Ce champ est requis</span>}
          </div>

          <label className="container-checkbox-input" htmlFor="updateAllMinimalProductStock">Utiliser le stock global pour les stocks entrées manuellement : 
            <input type="checkbox" name="updateAllMinimalProductStock" id="updateAllMinimalProductStock" defaultChecked={userOptionData.updateAllMinimalProductStock} ref={registerFormProduct()}/>
            <span className="checkmark-checkbox"></span>
          </label>
          <div className="default-action-form-container">
            <button className="default-btn-action-form" type="submit"><FontAwesomeIcon icon="pen" /> Éditer</button>
            {successFormProduct && 
              <InformationIcon 
                className="success-icon"
                icon={<FontAwesomeIcon icon="check" />}
              />
            }
          </div>
        </>
      }
    </form>
  )
}

export default ProductOptionProfile
