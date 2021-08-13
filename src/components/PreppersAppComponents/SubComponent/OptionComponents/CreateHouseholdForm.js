import React, { useState, useRef } from 'react';
import { useUserData, useUserHouseHoldData } from '../../DataContext';
import { useForm } from 'react-hook-form';
import axiosInstance from '../../../../utils/axiosInstance';
import { apiDomain, apiVersion } from '../../../../apiConfig/ApiConfig';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import InformationIcon from '../../UtilitiesComponent/InformationIcons';

function CreateHouseholdForm() {
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
    <form className="form-inline option-component" onSubmit={handleSubmit(createdHousehold)}>
      <div className="input-form-container-with-error">
        <label htmlFor="householdName">Créer une famille *</label>
        <input name="householdName" className="input-form" type="text" id="householdName" placeholder="Nom de la famille..." onChange={clearErrorMessage} {...register("householdName", { required: true })} />
        {errors.householdName && <span className="error-message-form">Ce champ est requis</span>}
      </div>
      <div className="default-action-form-container">
        <button 
        className={"default-btn-action-form"}
        type="submit">
          <FontAwesomeIcon icon="plus" /> Créer
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
  )
}

export default CreateHouseholdForm;
