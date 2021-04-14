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
  const [ errorMessageSwitchFamilly, setErrorMessageSwitchFamilly ] = useState(false);
  const [ messageErrorSwitchFamilly, setMessageErrorSwitchFamilly ] = useState("");
  const [ successFormSwitchFamilly, setSuccessFormSwitchFamilly ] = useState(false);
  const isMounted = useRef(true);

  const { register : registerFormSwitchFamilly, handleSubmit : handleSubmitFormSwitchFamilly, errors : errorsFormSwitchFamilly} = useForm({
    mode: "onChange"
  });

  useEffect(() => {
    let timerSuccessFormSwitchFamilly;
    if(successFormSwitchFamilly){
      timerSuccessFormSwitchFamilly = setTimeout(() => {
        setSuccessFormSwitchFamilly(false);
      }, 5000);
    }
    return () => {
      clearTimeout(timerSuccessFormSwitchFamilly);
    }
  }, [successFormSwitchFamilly]);

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
          setSuccessFormSwitchFamilly(true);
          setErrorMessageSwitchFamilly(false);
          setMessageErrorSwitchFamilly("");
        }
      })
      .catch((error) => {
        if(isMounted.current){
          setErrorMessageSwitchFamilly(true);
          setMessageErrorSwitchFamilly(error.response.data.output.payload.message);
        }
      });
  };

  const clearErrorMessage = () =>{
    if(messageErrorSwitchFamilly){
      setErrorMessageSwitchFamilly(false);
    }
  }

  return (
    <form className="form-inline" onSubmit={handleSubmitFormSwitchFamilly(switchFamilly)}>
      <div className="input-form-container-with-error">
        <label htmlFor="switchFamillyCode">Changer de famille *</label>
        <input name="switchFamillyCode" className="input-form" type="mail" id="switchFamillyCode" placeholder="Code famille..." onChange={clearErrorMessage} ref={registerFormSwitchFamilly({ required : true })} />
        {errorsFormSwitchFamilly.switchFamillyCode && <span className="error-message-form">Ce champ est requis</span>}
      </div>
      <div className="default-action-form-container">
        <button 
        className={requestDelegateAdmin ? "default-btn-disabled-form" : "default-btn-action-form"}
        disabled={requestDelegateAdmin}
        type="submit">
          <FontAwesomeIcon icon="exchange-alt" /> Changer
        </button> 
        {successFormSwitchFamilly && !errorMessageSwitchFamilly &&
          <InformationIcon 
            className="success-icon"
            icon={<FontAwesomeIcon icon="check" />}
          />
        }
        {errorMessageSwitchFamilly &&
          <InformationIcon 
            className="error-icon"
            icon={<FontAwesomeIcon icon="times" />}
            message={messageErrorSwitchFamilly}
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
