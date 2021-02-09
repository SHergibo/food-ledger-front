import React, { useEffect, useState, useRef } from 'react';
import { useUserData } from '../../DataContext';
import { useForm } from 'react-hook-form';
import axiosInstance from '../../../../utils/axiosInstance';
import { apiDomain, apiVersion } from '../../../../apiConfig/ApiConfig';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import InformationIcon from '../../UtilitiesComponent/InformationIcons';

function UserOptionProfile() {
  const { userData, setUserData } = useUserData();
  const [ successFormUser, setSuccessFormUser ] = useState(false);
  const isMounted = useRef(true);

  const { register : registerFormUser, handleSubmit : handleSubmitFormUser, errors : errorsFormUser } = useForm({
    mode: "onChange"
  });

  useEffect(() => {
    let timerSuccessFormUser;
    if(successFormUser){
      timerSuccessFormUser = setTimeout(() => {
        setSuccessFormUser(false);
      }, 5000);
    }
    return () => {
      clearTimeout(timerSuccessFormUser);
    }
  }, [successFormUser]);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    }
  }, []);

  const updateUserData = async (data) => {
    const patchUserDataEndPoint = `${apiDomain}/api/${apiVersion}/users/${userData._id}`;
    await axiosInstance.patch(patchUserDataEndPoint, data)
      .then((response) => {
        if(isMounted.current){
          setUserData(response.data);
          setSuccessFormUser(true);
        }
      });
  };

  return (
    <form onSubmit={handleSubmitFormUser(updateUserData)}>
      {userData && 
        <>
          <div className="input-form-container-with-error">
            <label htmlFor="firstname">Prénom *</label>
            <input name="firstname" className="input-form" type="text" id="firstname" placeholder="Prénom..." defaultValue={userData.firstname} ref={registerFormUser({ required: true })} />
            {errorsFormUser.firstname && <span className="error-message-form">Ce champ est requis</span>}
          </div>

          <div className="input-form-container-with-error">
            <label htmlFor="lastname">Nom *</label>
            <input name="lastname" className="input-form" type="text" id="lastname" placeholder="Nom..." defaultValue={userData.lastname} ref={registerFormUser({ required: true })} />
            {errorsFormUser.lastname && <span className="error-message-form">Ce champ est requis</span>}
          </div>

          <div className="input-form-container-with-error">
            <label htmlFor="email">E-mail *</label>
            <input name="email" className="input-form" type="mail" id="email" placeholder="Prénom..." defaultValue={userData.email} ref={registerFormUser({ required: true })} />
            {errorsFormUser.email && <span className="error-message-form">Ce champ est requis</span>}
          </div>

          <div className="default-action-form-container">
            <button className="default-btn-action-form" type="submit"><FontAwesomeIcon icon="pen" /> Éditer</button>
            {successFormUser && 
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

export default UserOptionProfile
