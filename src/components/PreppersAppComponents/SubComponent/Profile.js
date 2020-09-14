import React, { useEffect, useRef } from 'react';
import { useUserData, useUserOptionData } from './../DataContext';
import { useForm, Controller } from 'react-hook-form';
import ReactSelect from './../UtilitiesComponent/ReactSelect';
import { dateSendMailGlobal, dateSendMailShoppingList, warningExpirationDate } from "../../../utils/localData";
import axiosInstance from '../../../utils/axiosInstance';
import { apiDomain, apiVersion } from '../../../apiConfig/ApiConfig';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen } from '@fortawesome/free-solid-svg-icons';

function Profile() {
  const { userData, setUserData } = useUserData();
  const { userOptionData, setUserOptionData } = useUserOptionData();
  const isMounted = useRef(true);

  const { register : registerFormOne, handleSubmit : handleSubmitFormOne, errors : errorsFormOne } = useForm({
    mode: "onChange"
  });

  const { register : registerFormTwo, handleSubmit : handleSubmitFormTwo, setValue : setValueFormTwo, control : controlFormTwo } = useForm({
    mode: "onChange"
  });

  const { register : registerFormThree, handleSubmit : handleSubmitFormThree, errors : errorsFormThree, setValue: setValueFormThree, control: controlFormThree } = useForm({
    mode: "onChange"
  });

  const { register : registerFormFour, handleSubmit : handleSubmitFormFour } = useForm({
    mode: "onChange"
  });

  useEffect(() => {
    return () => {
      isMounted.current = false;
    }
  }, []);

  useEffect(() => {
    if(userOptionData){
      if (userOptionData.dateMailGlobal) {
        setValueFormTwo("dateMailGlobal", { value: userOptionData.dateMailGlobal.value, label: userOptionData.dateMailGlobal.label });
      }
      if (userOptionData.dateMailGlobal) {
        setValueFormTwo("dateMailShoppingList", { value: userOptionData.dateMailShoppingList.value, label: userOptionData.dateMailShoppingList.label });
      }
      if (userOptionData.warningExpirationDate) {
        setValueFormThree("warningExpirationDate", { value: userOptionData.warningExpirationDate.value, label: userOptionData.warningExpirationDate.label });
      }
    }
  }, [userOptionData, setValueFormTwo, setValueFormThree]);

  let userForm = <>
    {userData && 
      <>
        <div className="input-form-container-with-error">
          <label htmlFor="firstname">Prénom *</label>
          <input name="firstname" className="input-form" type="text" id="firstname" placeholder="Prénom..." defaultValue={userData.firstname} ref={registerFormOne({ required: true })} />
          {errorsFormOne.firstname && <span className="error-message-form">Ce champ est requis</span>}
        </div>

        <div className="input-form-container-with-error">
          <label htmlFor="lastname">Nom *</label>
          <input name="lastname" className="input-form" type="text" id="lastname" placeholder="Nom..." defaultValue={userData.lastname} ref={registerFormOne({ required: true })} />
          {errorsFormOne.firstname && <span className="error-message-form">Ce champ est requis</span>}
        </div>

        <div className="input-form-container-with-error">
          <label htmlFor="email">E-mail *</label>
          <input name="email" className="input-form" type="mail" id="email" placeholder="Prénom..." defaultValue={userData.email} ref={registerFormOne({ required: true })} />
          {errorsFormOne.firstname && <span className="error-message-form">Ce champ est requis</span>}
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

  let userOptionMailingForm = 
  <>
    {userOptionData && 
      <>
        <label className="container-checkbox-input-form" htmlFor="sendMailGlobal">Recevoir le mail d'information sur vos stocks : 
          <input type="checkbox" name="sendMailGlobal" id="sendMailGlobal" defaultChecked={userOptionData.sendMailGlobal} ref={registerFormTwo()}/>
          <span className="checkmark-checkbox"></span>
        </label>

        <div className="input-form-container">
          <ReactSelect
            format="select"
            label="Interval d'envoi du mail d'information"
            Controller={Controller}
            name="dateMailGlobal"
            inputId="date-mail-global"
            classNamePrefix="date-mail-global"
            isClearable={false}
            placeholder="Interval d'envoi..."
            arrayOptions={dateSendMailGlobal}
            control={controlFormTwo}
            defaultValue={""}
          />
        </div>

        <label className="container-checkbox-input-form" htmlFor="sendMailShoppingList">Recevoir le mail liste de course : 
          <input type="checkbox" name="sendMailShoppingList" id="sendMailShoppingList" defaultChecked={userOptionData.sendMailShoppingList} ref={registerFormTwo()}/>
          <span className="checkmark-checkbox"></span>
        </label>

        <div className="input-form-container">
          <ReactSelect
            format="select"
            label="Interval d'envoi du mail liste de course"
            Controller={Controller}
            name="dateMailShoppingList"
            inputId="date-mail-shopping-list"
            classNamePrefix="date-mail-shopping-list"
            isClearable={false}
            placeholder="Interval d'envoi..."
            arrayOptions={dateSendMailShoppingList}
            control={controlFormTwo}
            defaultValue={""}
          />
        </div>

        <button className="default-btn-action-form" type="submit"><FontAwesomeIcon icon={faPen} /> Éditer</button>
      </>
    }
  </>;

  let userOptionProductForm = <>
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
            control={controlFormThree}
            defaultValue={""}
          />
        </div>

        <div className="input-form-container">
          <label htmlFor="minimalProductStockGlobal">Stock minimum global *</label>
          <input className="input-form" name="minimalProductStockGlobal" type="number" id="minimalProductStockGlobal" placeholder="Stock minimum..." defaultValue={userOptionData.minimalProductStockGlobal} ref={registerFormThree({required: true})} />
          {errorsFormThree.minimalProductStockGlobal && <span className="error-message-form">Ce champ est requis</span>}
        </div>

        <label className="container-checkbox-input-form" htmlFor="updateAllMinimalProductStock">Utiliser le stock global pour les stocks entrées manuellement : 
          <input type="checkbox" name="updateAllMinimalProductStock" id="updateAllMinimalProductStock" defaultChecked={userOptionData.updateAllMinimalProductStock} ref={registerFormThree()}/>
          <span className="checkmark-checkbox"></span>
        </label>

        <button className="default-btn-action-form" type="submit"><FontAwesomeIcon icon={faPen} /> Éditer</button>
      </>
    }
  </>;

  let userOptionProductTableForm = 
  <>
    {userOptionData && 
      <>
        <label className="container-checkbox-input-form" htmlFor="colorCodeDate">Afficher le code couleur pour les dates de péremption : 
          <input type="checkbox" name="colorCodeDate" id="colorCodeDate" defaultChecked={userOptionData.colorCodeDate} ref={registerFormFour()}/>
          <span className="checkmark-checkbox"></span>
        </label>

        <label className="container-checkbox-input-form" htmlFor="colorCodeStock">
          Afficher le code couleur pour les stock minimum de produits : 
          <input type="checkbox" name="colorCodeStock" id="colorCodeStock" defaultChecked={userOptionData.colorCodeStock} ref={registerFormFour()}/>
          <span className="checkmark-checkbox"></span>
        </label>

        <button className="default-btn-action-form" type="submit"><FontAwesomeIcon icon={faPen} /> Éditer</button>
      </>
    }
  </>;

  const patchOptionData = async (data) => {
    const patchUserOptionDataEndPoint = `${apiDomain}/api/${apiVersion}/options/${userData._id}`;
    await axiosInstance.patch(patchUserOptionDataEndPoint, data)
      .then((response) => {
        if(isMounted.current){
          setUserOptionData(response.data);
        }
      });
  }

  const updateUserOptionMailingData = async (data) => {
    patchOptionData(data);
  };

  const updateUserOptionProductData = async (data) => {
    patchOptionData(data);
  };

  const updateUserOptionProductTableData = async (data) => {
    patchOptionData(data);
  };

  return (
    
    <div className="default-wrapper">
      {userData && 
        <>
          <div className="default-title-container">
            <h1 className="default-h">Profil de {userData.firstname} {userData.lastname}</h1>
          </div>

          <form onSubmit={handleSubmitFormOne(updateUserData)}>
            {userForm}
          </form>

          <div className="default-title-container delimiter-title">
            <h1 className="default-h">Options e-mailing</h1>
          </div>
          
          <form onSubmit={handleSubmitFormTwo(updateUserOptionMailingData)}>
            {userOptionMailingForm}
          </form>

          <div className="default-title-container delimiter-title">
            <h1 className="default-h">Options produit</h1>
          </div>

          <form onSubmit={handleSubmitFormThree(updateUserOptionProductData)}>
            {userOptionProductForm}
          </form>

          <div className="default-title-container delimiter-title">
            <h1 className="default-h">Options tableau de produits</h1>
          </div>

          <form onSubmit={handleSubmitFormFour(updateUserOptionProductTableData)}>
            {userOptionProductTableForm}
          </form>
        </>
      }
    </div>
  )
}

export default Profile
