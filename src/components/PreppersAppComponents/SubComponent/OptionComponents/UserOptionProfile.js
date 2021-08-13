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
  const [ changePasswordInput, setChangePasswordInput ] = useState(false);
  const isMounted = useRef(true);

  const { register, handleSubmit, formState: { errors }, unregister, setError } = useForm({
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
    if(data.newPassword && data.confirmPassword){
      if(data.newPassword !== data.confirmPassword){
        setError('confirmPassword', {
          type:"manual",
          message: "Mauvais mot de passe!"
        });
        return;
      }
    }
    delete data.confirmPassword;
    console.log(data)
    const patchUserDataEndPoint = `${apiDomain}/api/${apiVersion}/users/${userData._id}`;
    await axiosInstance.patch(patchUserDataEndPoint, data)
      .then((response) => {
        if(isMounted.current){
          setUserData(response.data);
          setSuccessFormUser(true);
        }
      });
  };

  const showChangePassword = () => {
    setChangePasswordInput(!changePasswordInput);
    unregister(['newPassword', 'actualPassword', 'confirmPassword'])
  };

  return (
    <form className="option-component" onSubmit={handleSubmit(updateUserData)}>
      {userData && 
        <>
          <div className="input-form-container-with-error">
            <label htmlFor="firstname">Prénom *</label>
            <input name="firstname" className="input-form" type="text" id="firstname" placeholder="Prénom..." defaultValue={userData.firstname} {...register("firstname", { required: true })} />
            {errors.firstname && <span className="error-message-form">Ce champ est requis</span>}
          </div>

          <div className="input-form-container-with-error">
            <label htmlFor="lastname">Nom *</label>
            <input name="lastname" className="input-form" type="text" id="lastname" placeholder="Nom..." defaultValue={userData.lastname} {...register("lastname", { required: true })} />
            {errors.lastname && <span className="error-message-form">Ce champ est requis</span>}
          </div>

          <div className="input-form-container-with-error">
            <label htmlFor="email">E-mail *</label>
            <input name="email" className="input-form" type="mail" id="email" placeholder="Prénom..." defaultValue={userData.email} {...register("email", { required: true })} />
            {errors.email && <span className="error-message-form">Ce champ est requis</span>}
          </div>

          <div className="change-password">
            <p>Changer de mot de passe</p>
            <button className="" type="button" onClick={showChangePassword}><FontAwesomeIcon icon="check" /></button>
          </div>

          {changePasswordInput &&
            <>
              <div className="input-form-container-with-error">
                <label htmlFor="actualPassword">Mot de passe actuel *</label>
                <input name="actualPassword" className="input-form" type="password" id="actualPassword" placeholder="Mot de passe actuel" {...register("actualPassword", { required: true })} />
                {errors.actualPassword && <span className="error-message-form">Ce champ est requis</span>}
              </div>

              <div className="input-form-container-with-error">
                <label htmlFor="newPassword">Nouveau mot de passe *</label>
                <input 
                name="newPassword" 
                className="input-form" 
                type="password" 
                id="newPassword" 
                placeholder="Nouveau mot de passe" 
                {...register("newPassword", 
                  {
                    required: "Ce champ est requis",
                    minLength: {
                      value: 6,
                      message: "Votre mot de passe doit contenir au minimum 6 caractères!"
                    }
                  }
                )} />
                {errors.newPassword && 
                  <span className={errors.newPassword.type === "minLength" ? "error-message-form-double" : "error-message-form"}>
                  {errors.newPassword.message}
                  </span>
                }
              </div>

              <div className="input-form-container-with-error">
                <label htmlFor="confirmPassword">Confirmer nouveau mot de passe *</label>
                <input 
                name="confirmPassword" 
                className="input-form" 
                type="password" 
                id="confirmPassword" 
                placeholder="Confirmer nouveau mot de passe" 
                {...register("confirmPassword", 
                  { 
                    required: "Ce champ est requis", 
                    minLength: {
                      value: 6,
                      message: "Votre mot de passe doit contenir au minimum 6 caractères!"
                    }
                  }
                )} />
                {errors.confirmPassword && 
                  <span className={errors.confirmPassword.type === "minLength" ? "error-message-form-double" : "error-message-form"}>
                  {errors.confirmPassword.message}
                  </span>
                }
              </div>
            </>
          }

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
