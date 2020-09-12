import React, { useEffect, useRef } from 'react';
import { useUserData, useUserOptionData } from './../DataContext';
import { useForm, Controller } from 'react-hook-form';
import axiosInstance from '../../../utils/axiosInstance';
import { apiDomain, apiVersion } from '../../../apiConfig/ApiConfig';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen } from '@fortawesome/free-solid-svg-icons';

function Profile() {
  const { userData, setUserData } = useUserData();
  const { userOptionData, setUserOptionData } = useUserOptionData();
  const isMounted = useRef(true);

  console.log(userOptionData);

  const { register, handleSubmit, errors, control, setValue } = useForm({
    mode: "onChange"
  });

  useEffect(() => {
    return () => {
      isMounted.current = false;
    }
  }, []);

  let userForm = <>
    {userData && 
      <>
        <div className="input-form-container-with-error">
          <label htmlFor="firstname">Prénom *</label>
          <input name="firstname" className="input-form" type="text" id="firstname" placeholder="Prénom..." defaultValue={userData.firstname} ref={register({ required: true })} />
          {errors.firstname && <span className="error-message-form">Ce champ est requis</span>}
        </div>

        <div className="input-form-container-with-error">
          <label htmlFor="lastname">Nom *</label>
          <input name="lastname" className="input-form" type="text" id="lastname" placeholder="Nom..." defaultValue={userData.lastname} ref={register({ required: true })} />
          {errors.firstname && <span className="error-message-form">Ce champ est requis</span>}
        </div>

        <div className="input-form-container-with-error">
          <label htmlFor="email">E-mail *</label>
          <input name="email" className="input-form" type="mail" id="email" placeholder="Prénom..." defaultValue={userData.email} ref={register({ required: true })} />
          {errors.firstname && <span className="error-message-form">Ce champ est requis</span>}
        </div>

        <button className="default-btn-action-form" type="submit"><FontAwesomeIcon icon={faPen} /> Éditer</button>
      </>
    }
  </>;

  const updateUserData = async (data) => {
    const patchUserDataEndPoint = `${apiDomain}/api/${apiVersion}/users/${userData._id}`;
    await axiosInstance.patch(patchUserDataEndPoint, data)
      .then((response) => {
        if(isMounted.current){
          setUserData(response.data);
        }
      });
  };

  let userOptionForm = <>
    {userOptionData && 
      <>
        <button className="default-btn-action-form" type="submit"><FontAwesomeIcon icon={faPen} /> Éditer</button>
      </>
    }
  </>;

  const updateUserOptionData = async (data) => {
    const patchUserOptionDataEndPoint = `${apiDomain}/api/${apiVersion}/options/${userData._id}`;
    await axiosInstance.patch(patchUserOptionDataEndPoint, data)
      .then((response) => {
        if(isMounted.current){
          setUserOptionData(response.data);
        }
      });
  };

  return (
    
    <div className="default-wrapper">
      {userData && 
        <>
          <div className="default-title-container">
            <h1 className="default-h">Profil de {userData.firstname} {userData.lastname}</h1>
          </div>

          <form onSubmit={handleSubmit(updateUserData)}>
            {userForm}
          </form>

          <div className="default-title-container delimiter-title">
            <h1 className="default-h">Options</h1>
          </div>
          
          <form onSubmit={handleSubmit(updateUserOptionData)}>
            {userOptionForm}
          </form>
        </>
      }
    </div>
  )
}

export default Profile
