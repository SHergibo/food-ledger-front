import React, { useEffect, useRef, useState } from 'react';
import { useUserData, useUserOptionData, useUserHouseHoldData, useNotificationData } from './../DataContext';
import { useForm, Controller } from 'react-hook-form';
import ReactSelect from './../UtilitiesComponent/ReactSelect';
import { dateSendMailGlobal, dateSendMailShoppingList, warningExpirationDate } from "../../../utils/localData";
import axiosInstance from '../../../utils/axiosInstance';
import { apiDomain, apiVersion } from '../../../apiConfig/ApiConfig';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import TitleButtonInteraction from './../UtilitiesComponent/TitleButtonInteraction';
import { logout } from './../../../utils/Auth';
import InformationIcon from './../UtilitiesComponent/InformationIcons';

function Profile({ history }) {
  const { userData, setUserData } = useUserData();
  const { userHouseholdData, setUserHouseholdData } = useUserHouseHoldData();
  const { userOptionData, setUserOptionData } = useUserOptionData();
  const { notification, setNotification } = useNotificationData();
  const [ openTitleMessage, setOpenTitleMessage ] = useState(false);
  const [ delegate, setDelegate ] = useState(false);
  const [ didNoTAcceptDelegate, setdidNoTAcceptDelegate ] = useState(false);
  const [ successFormOne, setSuccessFormOne ] = useState(false);
  const [ successFormTwo, setSuccessFormTwo ] = useState(false);
  const [ successFormThree, setSuccessFormThree ] = useState(false);
  const [ successFormFour, setSuccessFormFour ] = useState(false);
  const isMounted = useRef(true);

  const { register : registerFormDelegate, handleSubmit : handleSubmitFormDelegate } = useForm({
    mode: "onChange"
  });

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
    if(!openTitleMessage){
      setDelegate(false);
      setdidNoTAcceptDelegate(false);
    }
  }, [openTitleMessage])

  useEffect(() => {
    let timerSuccessOne;
    if(successFormOne){
      timerSuccessOne = setTimeout(() => {
        setSuccessFormOne(false);
      }, 5000);
    }
    return () => {
      clearTimeout(timerSuccessOne);
    }
  }, [successFormOne]);

  useEffect(() => {
    let timerSuccessTwo;
    if(successFormTwo){
      timerSuccessTwo = setTimeout(() => {
        setSuccessFormTwo(false);
      }, 5000);
    }
    return () => {
      clearTimeout(timerSuccessTwo);
    }
  }, [successFormTwo]);

  useEffect(() => {
    let timerSuccessThree;
    if(successFormThree){
      timerSuccessThree = setTimeout(() => {
        setSuccessFormThree(false);
      }, 5000);
    }
    return () => {
      clearTimeout(timerSuccessThree);
    }
  }, [successFormThree]);

  useEffect(() => {
    let timerSuccessFour;
    if(successFormFour){
      timerSuccessFour = setTimeout(() => {
        setSuccessFormFour(false);
      }, 5000);
    }
    return () => {
      clearTimeout(timerSuccessFour);
    }
  }, [successFormFour]);


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


  const deleteUser = async (data) => {

    let logOut = async () => {
      await logout();
      history.push("/");
    };

    let deleteUserDataEndPoint;
    if(data){
      deleteUserDataEndPoint = `${apiDomain}/api/${apiVersion}/users/${userData._id}?delegateUserCode=${data.delegateRadioInput}`;
    }else{
      deleteUserDataEndPoint = `${apiDomain}/api/${apiVersion}/users/${userData._id}`;
    }
    await axiosInstance.delete(deleteUserDataEndPoint)
    .then((response) => {
      if(isMounted.current){
        if(response.status === 200){
          logOut();
        }
      }
    });
  }

  let contentTitleInteraction = <>
    {openTitleMessage && 
      <div className="title-message">
        {userHouseholdData.member.length === 1 &&
          <div>
            <p>Êtes-vous sur et certain de vouloir supprimer votre compte? Toutes vos données seront perdues !</p>
            <div className="btn-delete-action-container">
              <button 
              className="btn-delete-action-yes"
              onClick={()=>{deleteUser()}}>
                Oui
              </button>
              <button 
              className="btn-delete-action-no" 
              onClick={() => {setOpenTitleMessage(!openTitleMessage)}}>
                Non
              </button>
            </div>
          </div>
        }
        {userHouseholdData.member.length > 1 && !didNoTAcceptDelegate &&
          <div>
            {!delegate &&
              <>
                <p>Voulez-vous déléguer vos droits d'administrations à un membre de votre famille avant de supprimer votre compte ?</p>
                <p>Si vous ne déléguez pas vos droits d'administrations, la famille sera supprimée définitivement !</p>
                <div className="btn-delete-action-container">
                  <button 
                  className="btn-delete-action-no"
                  onClick={()=>{setDelegate(true)}}>
                    Oui
                  </button>
                  <button 
                  className="btn-delete-action-yes" 
                  onClick={() => {setdidNoTAcceptDelegate(true)}}>
                    Non
                  </button>
                </div>
              </>
            }
            {delegate &&
              <>
                <p>Choississez le membre à qui vous voulez déléguer les droits administrations de cette famille !</p>
                <form className="form-delegate" onSubmit={handleSubmitFormDelegate(deleteUser)}>
                  {userHouseholdData.member.map((item, index) => {
                    if(userData._id !== item.userId && item.isFlagged === false){
                      let defaultChecked = false;
                      if(index === 1){
                        defaultChecked = true;
                      }
                      return (
                        <label key={index} className="container-radio-input" htmlFor={`delegateMember${index}`}>{item.firstname} {item.lastname} : 
                          <input type="radio" name="delegateRadioInput" id={`delegateMember${index}`} value={item.usercode} defaultChecked={defaultChecked} ref={registerFormDelegate()}/>
                          <span className="radio-checkmark"></span>
                        </label>
                      )
                    }else{
                      return null
                    }
                  })}
                  <button className="btn-delete-action-yes" type="submit">Déléguer les droits et supprimer son compte !</button>
                </form>
              </>
            }
          </div>
        }
        {userHouseholdData.member.length > 1 && didNoTAcceptDelegate &&
          <div>
            <p>Êtes-vous sur et certain de vouloir supprimer votre compte? Toutes vos données seront perdues !</p>
            <div className="btn-delete-action-container">
              <button 
              className="btn-delete-action-yes"
              onClick={()=>{deleteUser()}}>
                Oui
              </button>
              <button 
              className="btn-delete-action-no" 
              onClick={() => {setOpenTitleMessage(!openTitleMessage)}}>
                Non
              </button>
            </div>
          </div>
        }
      </div>
    }
  </>

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

        <div className="default-action-form-container">
          <button className="default-btn-action-form" type="submit"><FontAwesomeIcon icon="pen" /> Éditer</button>
          {successFormOne && 
            <InformationIcon 
              className="success-icon"
              icon={<FontAwesomeIcon icon="check" />}
            />
          }
        </div>
      </>
    }
  </>;

  const updateUserData = async (data) => {
    const patchUserDataEndPoint = `${apiDomain}/api/${apiVersion}/users/${userData._id}`;
    await axiosInstance.patch(patchUserDataEndPoint, data)
      .then((response) => {
        if(isMounted.current){
          setUserData(response.data);
          setSuccessFormOne(true);
        }
      });
  };

  let userAdminOption = 
  <div>
    {notification.length >= 1 &&
      <div>
        <h2 className="default-h2">Notifications</h2>
        <ul>
          {notification.map(item => {
            return (
              <li key={item._id}>
                {item.fullName} {item.senderUserCode}
                <button onClick={()=> {notificatioRequest(item._id, "yes")}}>Accepter</button>
                <button onClick={()=> {notificatioRequest(item._id, "no")}}>Refuser</button>
              </li>
            )
          })}
        </ul>
      </div>
    }
  </div>;

const notificatioRequest = async (id, isAccepted) => {
  const requestNotificationEndpoint = `${apiDomain}/api/${apiVersion}/requests/add-user-respond/${id}?acceptedRequest=${isAccepted}`;
  await axiosInstance.get(requestNotificationEndpoint)
    .then((response) => {
      if(isMounted.current){
        setNotification(response.data);
      }
    });
};

  let userOptionMailingForm = 
  <>
    {userOptionData && 
      <>
        <label className="container-checkbox-input" htmlFor="sendMailGlobal">Recevoir le mail d'information sur vos stocks : 
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

        <label className="container-checkbox-input" htmlFor="sendMailShoppingList">Recevoir le mail liste de course : 
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

        <div className="default-action-form-container">
          <button className="default-btn-action-form" type="submit"><FontAwesomeIcon icon="pen" /> Éditer</button>
          {successFormTwo && 
            <InformationIcon 
              className="success-icon"
              icon={<FontAwesomeIcon icon="check" />}
            />
          }
        </div>
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

        <label className="container-checkbox-input" htmlFor="updateAllMinimalProductStock">Utiliser le stock global pour les stocks entrées manuellement : 
          <input type="checkbox" name="updateAllMinimalProductStock" id="updateAllMinimalProductStock" defaultChecked={userOptionData.updateAllMinimalProductStock} ref={registerFormThree()}/>
          <span className="checkmark-checkbox"></span>
        </label>
        <div className="default-action-form-container">
          <button className="default-btn-action-form" type="submit"><FontAwesomeIcon icon="pen" /> Éditer</button>
          {successFormThree && 
            <InformationIcon 
              className="success-icon"
              icon={<FontAwesomeIcon icon="check" />}
            />
          }
        </div>
      </>
    }
  </>;

  let userOptionProductTableForm = 
  <>
    {userOptionData && 
      <>
        <label className="container-checkbox-input" htmlFor="colorCodeDate">Afficher le code couleur pour les dates de péremption : 
          <input type="checkbox" name="colorCodeDate" id="colorCodeDate" defaultChecked={userOptionData.colorCodeDate} ref={registerFormFour()}/>
          <span className="checkmark-checkbox"></span>
        </label>

        <label className="container-checkbox-input" htmlFor="colorCodeStock">
          Afficher le code couleur pour les stock minimum de produits : 
          <input type="checkbox" name="colorCodeStock" id="colorCodeStock" defaultChecked={userOptionData.colorCodeStock} ref={registerFormFour()}/>
          <span className="checkmark-checkbox"></span>
        </label>

        <div className="default-action-form-container">
          <button className="default-btn-action-form" type="submit"><FontAwesomeIcon icon="pen" /> Éditer</button>
          {successFormFour && 
            <InformationIcon 
              className="success-icon"
              icon={<FontAwesomeIcon icon="check" />}
            />
          }
        </div>
      </>
    }
  </>;

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

  const updateUserOptionMailingData = async (data) => {
    let success = patchOptionData(data);
    if(success){
      setSuccessFormTwo(true);
    }
  };

  const updateUserOptionProductData = async (data) => {
    let success = patchOptionData(data);
    if(success){
      setSuccessFormThree(true);
    }
  };

  const updateUserOptionProductTableData = async (data) => {
    let success = patchOptionData(data);
    if(success){
      setSuccessFormFour(true);
    }
  };

  return (
    
    <div className="default-wrapper">
      {userData && 
        <>
          <div className="default-title-container">
            <h1 className="default-h1">Profil de {userData.firstname} {userData.lastname}</h1>
            <TitleButtonInteraction 
              openTitleMessage={openTitleMessage}
              setOpenTitleMessage={setOpenTitleMessage}
              icon={<FontAwesomeIcon icon="trash" />}
              contentDiv={contentTitleInteraction}
            />
          </div>

          <form onSubmit={handleSubmitFormOne(updateUserData)}>
            {userForm}
          </form>

          {userData.role === "admin" &&
            <>
              <div className="default-title-container delimiter-title">
                <h1 className="default-h1">Options administrateur</h1>
              </div>

              {userAdminOption}
            </>
          }

          <div className="default-title-container delimiter-title">
            <h1 className="default-h1">Options e-mailing</h1>
          </div>
          
          <form onSubmit={handleSubmitFormTwo(updateUserOptionMailingData)}>
            {userOptionMailingForm}
          </form>

          <div className="default-title-container delimiter-title">
            <h1 className="default-h1">Options produit</h1>
          </div>

          <form onSubmit={handleSubmitFormThree(updateUserOptionProductData)}>
            {userOptionProductForm}
          </form>

          <div className="default-title-container delimiter-title">
            <h1 className="default-h1">Options tableau de produits</h1>
          </div>

          <form onSubmit={handleSubmitFormFour(updateUserOptionProductTableData)}>
            {userOptionProductTableForm}
          </form>
        </>
      }
    </div>
  )
}

export default Profile;