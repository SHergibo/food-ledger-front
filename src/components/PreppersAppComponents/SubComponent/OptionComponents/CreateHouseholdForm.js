import React, { useState, useRef } from 'react';
import { useUserData, useUserHouseHoldData } from '../../DataContext';
import { useForm } from 'react-hook-form';
import axiosInstance from '../../../../utils/axiosInstance';
import { apiDomain, apiVersion } from '../../../../apiConfig/ApiConfig';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import SwitchFamillyForm from './../OptionComponents/SwitchHouseholdForm';
import InformationIcon from '../../UtilitiesComponent/InformationIcons';
import PropTypes from 'prop-types';

function CreateHouseholdForm({ requestDelegateAdmin }) {
  const { setUserHouseholdData } = useUserHouseHoldData();
  const { setUserData } = useUserData();
  const [ errorMessage, setErrorMessage ] = useState(false);
  const [ messageError, setMessageError ] = useState("");
  const isMounted = useRef(true);

  const { register, handleSubmit, formState: { errors } } = useForm({
    mode: "onChange"
  });

  const createdHousehold = async (data) => {
    
    const createHouseholdEndpoint = `${apiDomain}/api/${apiVersion}/households`;

    await axiosInstance.post(createHouseholdEndpoint, data)
      .then((response) => {
        if(response.status === 200 && isMounted.current){
          setUserHouseholdData(response.data.householdData);
          setUserData(response.data.userData);
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
    <div className="container-data container-option form-familly">
      <form className="form-inline option-component" onSubmit={handleSubmit(createdHousehold)}>
        <div className="input-group">
          <input
            name="householdName"
            type="text"
            id="householdName"
            className={`form-input ${errors.householdName  ? "error-input" : ""}`}
            onChange={clearErrorMessage}
            {...register("householdName", { required: true })}
          />
          <label htmlFor="householdName" className="form-label">Créer une famille *</label>
          <div className="error-message-input">
            {errors.householdName && <span >Ce champ est requis</span>}
          </div>
        </div>

        <div className="btn-action-container">
          <button 
          className="btn-purple"
          type="submit">
            <FontAwesomeIcon className="btn-icon" icon="plus" /> Créer
          </button> 
          {errorMessage &&
            <InformationIcon 
              className="error-icon"
              icon={<FontAwesomeIcon icon="times" />}
              message={messageError}
            />
          }
        </div>
      </form>
      <SwitchFamillyForm 
        requestDelegateAdmin={requestDelegateAdmin}
      />
    </div>
  )
}

CreateHouseholdForm.propTypes = {
  requestDelegateAdmin: PropTypes.bool.isRequired
}

export default CreateHouseholdForm;
