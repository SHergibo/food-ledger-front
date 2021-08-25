import React, { useEffect, useState, useRef, useMemo } from 'react';
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
  const valueRef = useRef({});

  const { register, handleSubmit, formState: { errors }, unregister, setError, reset } = useForm({
    defaultValues: useMemo(() => {
      return userData
    }, [userData])
  });

  useEffect(() => {
    valueRef.current = {
      firstname: userData?.firstname,
      lastname: userData?.lastname,
      email: userData?.email,
    }
    reset(valueRef.current)
  }, [reset, userData]);

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
    const patchUserDataEndPoint = `${apiDomain}/api/${apiVersion}/users/${userData._id}`;
    await axiosInstance.patch(patchUserDataEndPoint, data)
      .then((response) => {
        setUserData(response.data);
        setSuccessFormUser(true);
      });
  };

  const showChangePassword = () => {
    setChangePasswordInput(!changePasswordInput);
    unregister(['newPassword', 'actualPassword', 'confirmPassword'])
  };

  return (
    <div className="container-data container-option">
      <div className="form-profile option-component">
        <form>
          {userData && 
            <>
              <div className="input-group">
                <input
                  name="firstname"
                  type="text"
                  id="firstname"
                  className={`form-input ${errors.firstname  ? "error-input" : ""}`}
                  {...register("firstname", { required: true })}
                />
                <label htmlFor="firstname" className="form-label">Prénom *</label>
                <div className="error-message-input">
                  {errors.firstname && <span>Ce champ est requis</span>}
                </div>
              </div>

              <div className="input-group">
                <input
                  name="lastname"
                  type="text"
                  id="lastname"
                  className={`form-input ${errors.lastname  ? "error-input" : ""}`}
                  {...register("lastname", { required: true })}
                />
                <label htmlFor="lastname" className="form-label">Nom *</label>
                <div className="error-message-input">
                  {errors.lastname && <span>Ce champ est requis</span>}
                </div>
              </div>

              <div className="input-group">
                <input
                  name="email"
                  type="mail"
                  id="email"
                  className={`form-input ${errors.email  ? "error-input" : ""}`}
                  {...register("email", { required: true })}
                />
                <label htmlFor="email" className="form-label">E-mail *</label>
                <div className="error-message-input">
                  {errors.email && <span>Ce champ est requis</span>}
                </div>
              </div>

              <label className="container-checkbox" htmlFor="changedPwd">
                Changer de mot de passe : 
                <input type="checkbox" name="changedPwd" id="changedPwd" onClick={showChangePassword}/>
                <span className="checkmark-checkbox"></span>
              </label>

              {changePasswordInput &&
                <div>
                  <div className="input-group">
                    <input
                      name="actualPassword"
                      type="password"
                      id="actualPassword"
                      className={`form-input ${errors.actualPassword  ? "error-input" : ""}`}
                      {...register("actualPassword", { required: true })}
                    />
                    <label htmlFor="actualPassword" className="form-label">Mot de passe actuel *</label>
                    <div className="error-message-input">
                      {errors.actualPassword && <span >Ce champ est requis</span>}
                    </div>
                  </div>

                  <div className="input-group">
                    <input
                      name="newPassword"
                      type="password"
                      id="newPassword"
                      className={`form-input ${errors.newPassword  ? "error-input" : ""}`}
                      {...register("newPassword", 
                        { 
                          required: "Ce champ est requis" ,
                          minLength: {
                            value: 6,
                            message: "Votre mot de passe doit contenir au minimum 6 caractères!"
                          }
                        }
                      )}
                    />
                    <label htmlFor="newPassword" className="form-label">Nouveau mot de passe *</label>
                    <div className="error-message-input">
                      {errors.newPassword && <span>{errors.newPassword.message}</span>}
                    </div>
                  </div>

                  <div className="input-group">
                    <input
                      name="confirmPassword"
                      type="password"
                      id="confirmPassword"
                      className={`form-input ${errors.confirmPassword  ? "error-input" : ""}`}
                      {...register("confirmPassword", 
                        { 
                          required: "Ce champ est requis" ,
                          minLength: {
                            value: 6,
                            message: "Votre mot de passe doit contenir au minimum 6 caractères!"
                          }
                        }
                      )}
                    />
                    <label htmlFor="confirmPassword" className="form-label">Confirmer nouveau mot de passe *</label>
                    <div className="error-message-input">
                      {errors.confirmPassword && <span>{errors.confirmPassword.message}</span>}
                    </div>
                  </div>
                </div>
              }
            </>
          }
        </form>
        <div className="btn-action-container" >
          <button className="btn-purple" onClick={() => {
            handleSubmit(updateUserData)();
          }}>
          <FontAwesomeIcon className="btn-icon" icon="pen" /> Éditer
          </button>
          {successFormUser && 
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

export default UserOptionProfile
