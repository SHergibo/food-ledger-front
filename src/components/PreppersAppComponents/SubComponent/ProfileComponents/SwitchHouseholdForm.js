import React, { useState, useEffect, useRef } from 'react';
import { useUserData } from '../../DataContext';
import { useForm } from 'react-hook-form';
import axiosInstance from '../../../../utils/axiosInstance';
import { apiDomain, apiVersion } from '../../../../apiConfig/ApiConfig';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import InformationIcon from '../../UtilitiesComponent/InformationIcons';
import PropTypes from 'prop-types';

function SwitchFamillyForm({requestDelegateAdmin}) {
  const { userData } = useUserData();
  const [ errorMessage, setErrorMessage ] = useState(false);
  const [ messageError, setMessageError ] = useState("");
  const [ successForm, setSuccessForm ] = useState(false);
  const isMounted = useRef(true);

  const { register : registerFormSwitchFamilly, handleSubmit : handleSubmitFormSwitchFamilly, formState: { errors : errorsFormSwitchFamilly }} = useForm({
    mode: "onChange"
  });

  useEffect(() => {
    let timerSuccessForm;
    if(successForm){
      timerSuccessForm = setTimeout(() => {
        setSuccessForm(false);
      }, 5000);
    }
    return () => {
      clearTimeout(timerSuccessForm);
    }
  }, [successForm]);

  const switchFamilly = async (data) => {
    let switchFamillyData = {
      usercode : `${userData.usercode}`, 
      type : "userToHousehold",
      householdCode : `${data.switchFamillyCode}`
    }
    const switchFamillyEndPoint = `${apiDomain}/api/${apiVersion}/requests/add-user-request`;

    await axiosInstance.post(switchFamillyEndPoint, switchFamillyData)
      .then((response) => {
        if(response.status === 204 && isMounted.current){
          setSuccessForm(true);
          setErrorMessage(false);
          setMessageError("");
        }
      })
      .catch((error) => {
        if(isMounted.current){
          setErrorMessage(true);
          setMessageError(error.response.data.output.payload.message);
        }
      });
  };

  const clearErrorMessage = () =>{
    if(errorMessage){
      setErrorMessage(false);
    }
  }

  return (
    <form className="form-inline option-component" onSubmit={handleSubmitFormSwitchFamilly(switchFamilly)}>
      <div className="input-form-container-with-error">
        <label htmlFor="switchFamillyCode">{userData.householdId ? "Changer de famille *" : "Rejoindre une famille *"}</label>
        <input name="switchFamillyCode" className="input-form" type="text" id="switchFamillyCode" placeholder="Code famille..." onChange={clearErrorMessage} {...registerFormSwitchFamilly("switchFamillyCode", { required: true })} />
        {errorsFormSwitchFamilly.switchFamillyCode && <span className="error-message-form">Ce champ est requis</span>}
      </div>
      <div className="default-action-form-container">
        <button 
        className={requestDelegateAdmin ? "default-btn-disabled-form" : "default-btn-action-form"}
        disabled={requestDelegateAdmin}
        type="submit">
          <FontAwesomeIcon icon="exchange-alt" /> {userData.householdId ? "Changer": "Demander"}
        </button> 
        {successForm && !errorMessage &&
          <InformationIcon 
            className="success-icon"
            icon={<FontAwesomeIcon icon="check" />}
          />
        }
        {errorMessage &&
          <InformationIcon 
            className="error-icon"
            icon={<FontAwesomeIcon icon="times" />}
            message={messageError}
          />
        }
      </div>
    </form>
  )
}

SwitchFamillyForm.propTypes = {
  requestDelegateAdmin: PropTypes.bool.isRequired
}

export default SwitchFamillyForm;
