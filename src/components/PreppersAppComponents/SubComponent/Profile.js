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
  const [ successFormUser, setSuccessFormUser ] = useState(false);
  const [ successFormFamillyName, setSuccessFormFamillyName ] = useState(false);
  const [ successFormAddUser, setSuccessFormAddUser ] = useState(false);
  const [ successFormSwitchFamilly, setSuccessFormSwitchFamilly ] = useState(false);
  const [ successFormEmailing, setSuccessFormEmailing ] = useState(false);
  const [ successFormProduct, setSuccessFormProduct ] = useState(false);
  const [ successFormProductTable, setSuccessFormProductTable ] = useState(false);
  const isMounted = useRef(true);

  const { register : registerFormDelegate, handleSubmit : handleSubmitFormDelegate } = useForm({
    mode: "onChange"
  });

  const { register : registerFormUser, handleSubmit : handleSubmitFormUser, errors : errorsFormUser } = useForm({
    mode: "onChange"
  });

  const { register : registerFormFamillyName, handleSubmit : handleSubmitFormFamillyName, errors : errorsFormFamillyName } = useForm({
    mode: "onChange"
  });

  const { register : registerFormAddUser, handleSubmit : handleSubmitFormAddUser} = useForm({
    mode: "onChange"
  });

  const { register : registerFormSwitchFamilly, handleSubmit : handleSubmitFormSwitchFamilly} = useForm({
    mode: "onChange"
  });

  const { register : registerFormEmailing, handleSubmit : handleSubmitFormEmailing, setValue : setValueFormEmailing, control : controlFormEmailing } = useForm({
    mode: "onChange"
  });

  const { register : registerFormProduct, handleSubmit : handleSubmitFormProduct, errors : errorsFormProduct, setValue: setValueFormProduct, control: controlFormProduct } = useForm({
    mode: "onChange"
  });

  const { register : registerFormProductTable, handleSubmit : handleSubmitProductTable } = useForm({
    mode: "onChange"
  });

  useEffect(() => {
    if(!openTitleMessage){
      setDelegate(false);
      setdidNoTAcceptDelegate(false);
    }
  }, [openTitleMessage])

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
    let timerSuccessFormFamillyName;
    if(successFormFamillyName){
      timerSuccessFormFamillyName = setTimeout(() => {
        setSuccessFormFamillyName(false);
      }, 5000);
    }
    return () => {
      clearTimeout(timerSuccessFormFamillyName);
    }
  }, [successFormFamillyName]);

  useEffect(() => {
    let timerSuccessFormAddUser;
    if(successFormAddUser){
      timerSuccessFormAddUser = setTimeout(() => {
        setSuccessFormAddUser(false);
      }, 5000);
    }
    return () => {
      clearTimeout(timerSuccessFormAddUser);
    }
  }, [successFormAddUser]);

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

  useEffect(() => {
    let timerSuccessFormEmailing;
    if(successFormEmailing){
      timerSuccessFormEmailing = setTimeout(() => {
        setSuccessFormEmailing(false);
      }, 5000);
    }
    return () => {
      clearTimeout(timerSuccessFormEmailing);
    }
  }, [successFormEmailing]);

  useEffect(() => {
    let timerSuccessFormProduct;
    if(successFormProduct){
      timerSuccessFormProduct = setTimeout(() => {
        setSuccessFormProduct(false);
      }, 5000);
    }
    return () => {
      clearTimeout(timerSuccessFormProduct);
    }
  }, [successFormProduct]);

  useEffect(() => {
    let timerSuccessProductTable;
    if(successFormProductTable){
      timerSuccessProductTable = setTimeout(() => {
        setSuccessFormProductTable(false);
      }, 5000);
    }
    return () => {
      clearTimeout(timerSuccessProductTable);
    }
  }, [successFormProductTable]);


  useEffect(() => {
    return () => {
      isMounted.current = false;
    }
  }, []);

  useEffect(() => {
    if(userOptionData){
      if (userOptionData.dateMailGlobal) {
        setValueFormEmailing("dateMailGlobal", { value: userOptionData.dateMailGlobal.value, label: userOptionData.dateMailGlobal.label });
      }
      if (userOptionData.dateMailGlobal) {
        setValueFormEmailing("dateMailShoppingList", { value: userOptionData.dateMailShoppingList.value, label: userOptionData.dateMailShoppingList.label });
      }
      if (userOptionData.warningExpirationDate) {
        setValueFormProduct("warningExpirationDate", { value: userOptionData.warningExpirationDate.value, label: userOptionData.warningExpirationDate.label });
      }
    }
  }, [userOptionData, setValueFormEmailing, setValueFormProduct]);


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
      <>
        {userHouseholdData.member.length === 1 &&
          <div className="title-message-container-delete-action">
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
          <div className="title-message-container-delete-action">
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
          <div className="title-message-container-delete-action">
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
      </>
    }
  </>

  let userForm = <>
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
  </>;

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

  let notificationList =
  <>
    {notification.length >= 1 &&
    <>
      <div className="default-title-container delimiter-title">
        <h1 className="default-h1">Listes des notifications</h1>
      </div>

      <div>
        
          <div>
            <h2 className="default-h2">Notifications</h2>
            <ul>
              {notification.map(item => {
                return (
                  <li key={item._id}>
                    {item.fullName} {item.senderUserCode}
                    <button onClick={()=> {notificationRequest(item._id, "yes")}}>Accepter</button>
                    <button onClick={()=> {notificationRequest(item._id, "no")}}>Refuser</button>
                  </li>
                )
              })}
            </ul>
          </div>
      </div>
    </>
    }
  </>;

  const updateFamillyName = async (data) => {
    const patchHouseholdDataEndPoint = `${apiDomain}/api/${apiVersion}/households/${userHouseholdData._id}`;
    await axiosInstance.patch(patchHouseholdDataEndPoint, data)
      .then((response) => {
        if(isMounted.current){
          setUserHouseholdData(response.data);
          setSuccessFormFamillyName(true);
        }
      });
  };

  const switchFamilly = async (data) => {
    let switchFamillyData = {
      usercode : `${userData.usercode}`, 
      type : "userToHousehold",
      householdCode : `${data.switchFamillyCode}`
    }
    const switchFamillyEndPoint = `${apiDomain}/api/${apiVersion}/requests/add-user-request`;

    await axiosInstance.post(switchFamillyEndPoint, switchFamillyData)
      .then((response) => {
        if(isMounted.current){
          setSuccessFormSwitchFamilly(true);
        }
      });
  };

  const addUserToFamilly = async (data) => {
    let addUserData = {
      usercode : `${data.addUserCode}`, 
      type : "householdToUser",
      householdCode : `${userData.householdCode}`
    }

    const addUserToFamillyEndPoint = `${apiDomain}/api/${apiVersion}/requests/add-user-request`;
    await axiosInstance.post(addUserToFamillyEndPoint, addUserData)
      .then((response) => {
        if(isMounted.current){
          setSuccessFormAddUser(true);
        }
      });
  };

  let famillyOptions = 
  <>
    {userHouseholdData && userData &&
      <>
        <form className="form-inline" onSubmit={handleSubmitFormFamillyName(updateFamillyName)}>
          <div className="input-form-container-with-error">
            <label htmlFor="famillyName">Nom de la famille *</label>
            <input name="famillyName" className="input-form" type="mail" id="famillyName" placeholder="Nom de la famille..." defaultValue={userHouseholdData.householdName} ref={registerFormFamillyName({ required: true })} />
            {errorsFormFamillyName.famillyName && <span className="error-message-form">Ce champ est requis</span>}
          </div>
          <div className="default-action-form-container">
            <button className="default-btn-action-form" type="submit"><FontAwesomeIcon icon="pen" /> Éditer</button>
            {successFormFamillyName && 
              <InformationIcon 
                className="success-icon"
                icon={<FontAwesomeIcon icon="check" />}
              />
            }
          </div>
        </form>

        <div>
          <h2 className="default-h2">Membres de la famille</h2>
          <ul>
            {userHouseholdData.member.map(member => {
              return (
                <li key={`member-${member.userId}`}>
                  {member.firstname} {member.lastname} 
                  {member.userId === userHouseholdData.userId ? " admin" : " user"}
                  {userData.role === "admin" && 
                  //TODO ne pas affiche le btn pour son propre compte user
                    <button>Retirer de la famille</button>
                  }
                </li>
              )
            })}
          </ul>
        </div>
        
        {userData.role === "admin" &&
          <form className="form-inline" onSubmit={handleSubmitFormAddUser(addUserToFamilly)}>
            <div className="input-form-container">
              <label htmlFor="addUserCode">Ajouter un membre</label>
              <input name="addUserCode" className="input-form" type="mail" id="addUserCode" placeholder="Code utilisateur..." ref={registerFormAddUser()} />
            </div>
            <div className="default-action-form-container">
              <button className="default-btn-action-form" type="submit"><FontAwesomeIcon icon="plus" /> Ajouter</button>
              {successFormAddUser && 
                <InformationIcon 
                  className="success-icon"
                  icon={<FontAwesomeIcon icon="check" />}
                />
              }
            </div>
          </form>
        }

        <form className="form-inline" onSubmit={handleSubmitFormSwitchFamilly(switchFamilly)}>
          <div className="input-form-container">
            <label htmlFor="switchFamillyCode">Changer de famille</label>
            <input name="switchFamillyCode" className="input-form" type="mail" id="switchFamillyCode" placeholder="Code famille..." ref={registerFormSwitchFamilly()} />
          </div>
          <div className="default-action-form-container">
            <button className="default-btn-action-form" type="submit"><FontAwesomeIcon icon="exchange-alt" /> Changer</button>
            {successFormSwitchFamilly && 
              <InformationIcon 
                className="success-icon"
                icon={<FontAwesomeIcon icon="check" />}
              />
            }
          </div>
        </form>
      </>
    }
  </>;

const notificationRequest = async (id, isAccepted) => {
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
          <input type="checkbox" name="sendMailGlobal" id="sendMailGlobal" defaultChecked={userOptionData.sendMailGlobal} ref={registerFormEmailing()}/>
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
            control={controlFormEmailing}
            defaultValue={""}
          />
        </div>

        <label className="container-checkbox-input" htmlFor="sendMailShoppingList">Recevoir le mail liste de course : 
          <input type="checkbox" name="sendMailShoppingList" id="sendMailShoppingList" defaultChecked={userOptionData.sendMailShoppingList} ref={registerFormEmailing()}/>
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
            control={controlFormEmailing}
            defaultValue={""}
          />
        </div>

        <div className="default-action-form-container">
          <button className="default-btn-action-form" type="submit"><FontAwesomeIcon icon="pen" /> Éditer</button>
          {successFormEmailing && 
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
            control={controlFormProduct}
            defaultValue={""}
          />
        </div>

        <div className="input-form-container">
          <label htmlFor="minimalProductStockGlobal">Stock minimum global *</label>
          <input className="input-form" name="minimalProductStockGlobal" type="number" id="minimalProductStockGlobal" placeholder="Stock minimum..." defaultValue={userOptionData.minimalProductStockGlobal} ref={registerFormProduct({required: true})} />
          {errorsFormProduct.minimalProductStockGlobal && <span className="error-message-form">Ce champ est requis</span>}
        </div>

        <label className="container-checkbox-input" htmlFor="updateAllMinimalProductStock">Utiliser le stock global pour les stocks entrées manuellement : 
          <input type="checkbox" name="updateAllMinimalProductStock" id="updateAllMinimalProductStock" defaultChecked={userOptionData.updateAllMinimalProductStock} ref={registerFormProduct()}/>
          <span className="checkmark-checkbox"></span>
        </label>
        <div className="default-action-form-container">
          <button className="default-btn-action-form" type="submit"><FontAwesomeIcon icon="pen" /> Éditer</button>
          {successFormProduct && 
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
          <input type="checkbox" name="colorCodeDate" id="colorCodeDate" defaultChecked={userOptionData.colorCodeDate} ref={registerFormProductTable()}/>
          <span className="checkmark-checkbox"></span>
        </label>

        <label className="container-checkbox-input" htmlFor="colorCodeStock">
          Afficher le code couleur pour les stock minimum de produits : 
          <input type="checkbox" name="colorCodeStock" id="colorCodeStock" defaultChecked={userOptionData.colorCodeStock} ref={registerFormProductTable()}/>
          <span className="checkmark-checkbox"></span>
        </label>

        <div className="default-action-form-container">
          <button className="default-btn-action-form" type="submit"><FontAwesomeIcon icon="pen" /> Éditer</button>
          {successFormProductTable && 
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
      setSuccessFormEmailing(true);
    }
  };

  const updateUserOptionProductData = async (data) => {
    let success = patchOptionData(data);
    if(success){
      setSuccessFormProduct(true);
    }
  };

  const updateUserOptionProductTableData = async (data) => {
    let success = patchOptionData(data);
    if(success){
      setSuccessFormProductTable(true);
    }
  };

  return (
    
    <div className="default-wrapper">
      {userData && 
        <>
          <div className="default-title-container">
            <h1 className="default-h1">Profil de {userData.firstname} {userData.lastname}</h1>
            <TitleButtonInteraction 
              title={"Supprimer son compte"}
              openTitleMessage={openTitleMessage}
              setOpenTitleMessage={setOpenTitleMessage}
              icon={<FontAwesomeIcon icon="trash" />}
              contentDiv={contentTitleInteraction}
            />
          </div>

          <form onSubmit={handleSubmitFormUser(updateUserData)}>
            {userForm}
          </form>

          {notificationList}

          <div className="default-title-container delimiter-title">
            <h1 className="default-h1">Options Famille</h1>
          </div>

          {famillyOptions}

          <div className="default-title-container delimiter-title">
            <h1 className="default-h1">Options e-mailing</h1>
          </div>
          
          <form onSubmit={handleSubmitFormEmailing(updateUserOptionMailingData)}>
            {userOptionMailingForm}
          </form>

          <div className="default-title-container delimiter-title">
            <h1 className="default-h1">Options produit</h1>
          </div>

          <form onSubmit={handleSubmitFormProduct(updateUserOptionProductData)}>
            {userOptionProductForm}
          </form>

          <div className="default-title-container delimiter-title">
            <h1 className="default-h1">Options tableau de produits</h1>
          </div>

          <form onSubmit={handleSubmitProductTable(updateUserOptionProductTableData)}>
            {userOptionProductTableForm}
          </form>
        </>
      }
    </div>
  )
}

export default Profile;