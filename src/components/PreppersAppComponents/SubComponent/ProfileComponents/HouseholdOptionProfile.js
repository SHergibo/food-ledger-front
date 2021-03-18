import React, { useEffect, useState, useRef } from 'react';
import { useUserData, useUserHouseHoldData, useNotificationData } from '../../DataContext';
import { useForm } from 'react-hook-form';
import axiosInstance from '../../../../utils/axiosInstance';
import { apiDomain, apiVersion } from '../../../../apiConfig/ApiConfig';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import InformationIcon from '../../UtilitiesComponent/InformationIcons';
import PropTypes from 'prop-types';

function HouseholdOptionProfile({ otherMemberEligible, requestDelegateAdmin }) {
  const { userData } = useUserData();
  const { userHouseholdData, setUserHouseholdData } = useUserHouseHoldData();
  const { notificationReceived, setNotificationReceived, notificationSended, setNotificationSended } = useNotificationData();
  const [ defaultCheckedAdmin, setDefaultCheckedAdmin ] = useState(true);
  const [ delegateAdminAndSwitch, setDelegateAdminAndSwitch ] = useState(false);
  const [ requestAdminNotification, setRequestAdminNotification ] = useState(false);
  const [ dontWantToDelegate, setDontWantToDelegate ] = useState(false);
  const [ firstMemberEligible, setFirstMemberEligible ] = useState("");
  const [ successFormFamillyName, setSuccessFormFamillyName ] = useState(false);
  const [ successFormAddUser, setSuccessFormAddUser ] = useState(false);
  const [ successFormSwitchFamilly, setSuccessFormSwitchFamilly ] = useState(false);
  const [ successFormDelegate, setSuccessFormDelegate ] = useState(false);
  const [ btnDisabledFormDelegate, setBtnDisabledFormDelegate ] = useState(true);
  const [ warningMessageDelegate, setWarningMessageDelegate ] = useState(false);
  const [ errorMessageDelegate, setErrorMessageDelegate ] = useState(false);
  const [ messageErrorDelegate, setMessageErrorDelegate ] = useState("");
  const [ errorMessageAddUser, setErrorMessageAddUser ] = useState(false);
  const [ messageErrorAddUser, setMessageErrorAddUser ] = useState("");
  const [ errorMessageSwitchFamilly, setErrorMessageSwitchFamilly ] = useState(false);
  const [ messageErrorSwitchFamilly, setMessageErrorSwitchFamilly ] = useState("");
  const isMounted = useRef(true);
  const btnDelegateForm = useRef(null);

  const { register : registerFormFamillyName, handleSubmit : handleSubmitFormFamillyName, errors : errorsFormFamillyName } = useForm({
    mode: "onChange"
  });

  const { register : registerFormDelegateWhenSwitching, handleSubmit : handleSubmitFormDelegateWhenSwitching } = useForm({
    mode: "onChange"
  });

  const { register : registerFormAddUser, handleSubmit : handleSubmitFormAddUser} = useForm({
    mode: "onChange"
  });

  const { register : registerRequestDelegateAdmin, handleSubmit : handleSubmitFormRequestDelegateAdmin } = useForm({
    mode: "onChange"
  });

  const { register : registerFormSwitchFamilly, handleSubmit : handleSubmitFormSwitchFamilly} = useForm({
    mode: "onChange"
  });

  useEffect(() => {
    const needSwitchAdminNotif = notificationReceived.find(notif => notif.type === "need-switch-admin");
    if(needSwitchAdminNotif !== undefined){
      setDelegateAdminAndSwitch(true);
    }else{
      setDelegateAdminAndSwitch(false);
    }
  }, [notificationReceived]);

  useEffect(() => {
    if(userData){
      setDefaultCheckedAdmin(true);
    }
  }, [userData]);

  useEffect(() => {
    const requestAdminNotif = notificationSended.find(notif => notif.type === "request-admin");
    if(requestAdminNotif !== undefined && delegateAdminAndSwitch){
      setDefaultCheckedAdmin(true);
      setRequestAdminNotification(true);
      setBtnDisabledFormDelegate(true);
      setErrorMessageDelegate(true);
      setMessageErrorDelegate("Veuillez supprimer la requête de délégation des droits administrateurs dans vos notifications envoyées avant de pouvoir faire cette action !");
      btnDelegateForm.current.classList.remove('default-btn-action-form');
      btnDelegateForm.current.classList.add('default-btn-disabled-form');
    }else{
      setRequestAdminNotification(false);
      setBtnDisabledFormDelegate(false);
      setErrorMessageDelegate(false);
      setMessageErrorDelegate("");
    }
  }, [notificationSended, delegateAdminAndSwitch]);

  useEffect(() => {
    if(userHouseholdData && requestDelegateAdmin){
      const memberEligible = userHouseholdData.member.filter(member => member.isFlagged === false);

      if(memberEligible.length > 1){
        const firstMemberEligible = userHouseholdData.member.find(member => member.isFlagged === false && userData.usercode !== member.usercode);
        setFirstMemberEligible(firstMemberEligible.usercode)
      }
    }
  }, [userHouseholdData, requestDelegateAdmin, userData]);

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
    let timerSuccessFormDelegate;
    if(successFormDelegate){
      timerSuccessFormDelegate = setTimeout(() => {
        setSuccessFormDelegate(false);
      }, 5000);
    }
    return () => {
      clearTimeout(timerSuccessFormDelegate);
    }
  }, [successFormDelegate]);

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
    return () => {
      isMounted.current = false;
    }
  }, []);

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

  const enableSubmitBtn = (usercode) => {
    if(userData.role === "admin" && usercode === userData.usercode){
      setBtnDisabledFormDelegate(true);
      setWarningMessageDelegate(false);
      setDefaultCheckedAdmin("admin");
      if(dontWantToDelegate){
        setDontWantToDelegate(false);
      }
      btnDelegateForm.current.classList.remove('default-btn-action-form');
      btnDelegateForm.current.classList.add('default-btn-disabled-form');
    }else{
      if(usercode === undefined){
        setDontWantToDelegate(true);
      }else if(dontWantToDelegate){
        setDontWantToDelegate(false);
      }
      setDefaultCheckedAdmin(false);
      setBtnDisabledFormDelegate(false);
      setWarningMessageDelegate(true);
      btnDelegateForm.current.classList.remove('default-btn-disabled-form');
      btnDelegateForm.current.classList.add('default-btn-action-form');
    }
  }

  const kickUser = async (userId) => {
    const kicUserEndPoint = `${apiDomain}/api/${apiVersion}/households/kick-user/${userHouseholdData._id}`;

    await axiosInstance.patch(kicUserEndPoint, {userId : userId})
      .then((response) => {
        if(response.status === 200){
          setUserHouseholdData(response.data);
        }
      });
  }

  const delegateUser = async (data) => {
    const switchAdminRightsData = {
      userId : data.delegateRadioInput,
      householdId : userHouseholdData._id
    }
    const switchAdminRightsEndPoint = `${apiDomain}/api/${apiVersion}/requests/switch-admin-rights`;

    await axiosInstance.post(switchAdminRightsEndPoint, switchAdminRightsData)
      .then((response) => {
        if(response.status === 200){
          setErrorMessageDelegate(false);
          setNotificationSended(notificationSended => [...notificationSended, response.data]);
          setWarningMessageDelegate(false);
          if(isMounted.current){
            setSuccessFormDelegate(true);
          }
        }
      }).catch((error) => {
        if(isMounted.current){
          setErrorMessageDelegate(true);
          setMessageErrorDelegate(error.response.data.output.payload.message);
        }
        setSuccessFormDelegate(false);
        setWarningMessageDelegate(false);
      });
  };

  const delegateAndSwitch = async (data) => {
    const needSwitchAdminNotif = notificationReceived.find(notif => notif.type === "need-switch-admin");
    let switchAdminRightsEndPoint = `${apiDomain}/api/${apiVersion}/requests/add-user-respond/${needSwitchAdminNotif._id}?acceptedRequest=yes&otherMember=${data.delegateRadioInput}`;
    if(data === ""){
      switchAdminRightsEndPoint = `${apiDomain}/api/${apiVersion}/requests/add-user-respond/${needSwitchAdminNotif._id}?acceptedRequest=yes`;
    }
    await axiosInstance.get(switchAdminRightsEndPoint)
      .then((response) => {
        if(response.status === 200){
          setErrorMessageDelegate(false);
          setNotificationReceived(response.data.notificationsReceived);
          setWarningMessageDelegate(false);
          if(isMounted.current){
            setSuccessFormDelegate(true);
          }
        }
      }).catch((error) => {
        if(isMounted.current){
          setErrorMessageDelegate(true);
          setMessageErrorDelegate(error.response.data.output.payload.message);
        }
        setSuccessFormDelegate(false);
        setWarningMessageDelegate(false);
      });
  };

  const didNotAcceptRequestDelegateAdmin = async (data) => {
    const requestDelegateAdminNotif = notificationReceived.find(notif => notif.type === "request-delegate-admin");
    let requestDelegateAdminEndPoint = `${apiDomain}/api/${apiVersion}/requests/${requestDelegateAdminNotif.urlRequest}/${requestDelegateAdminNotif._id}?acceptedRequest=no`;
    if(data.otherUserIdDidNotAcceptDelegate){
      requestDelegateAdminEndPoint = `${requestDelegateAdminEndPoint}&otherMember=${data.otherUserIdDidNotAcceptDelegate}`;
    }
    await axiosInstance.get(requestDelegateAdminEndPoint)
      .then((response) => {
        if(response.status === 200){
          if(isMounted.current){
            setErrorMessageDelegate(false);
          }
          setNotificationReceived(response.data.notificationsReceived);
        }
      }).catch((error) => {
        if(isMounted.current){
          setErrorMessageDelegate(true);
          setMessageErrorDelegate(error.response.data.output.payload.message);
        }
      });
  }

  const switchFamilly = async (data) => {
    let switchFamillyData = {
      usercode : `${userData.usercode}`, 
      type : "userToHousehold",
      householdCode : `${data.switchFamillyCode}`
    }
    const switchFamillyEndPoint = `${apiDomain}/api/${apiVersion}/requests/add-user-request`;

    await axiosInstance.post(switchFamillyEndPoint, switchFamillyData)
      .then((response) => {
        if(response.status === 200){
          setNotificationSended(notificationSended => [...notificationSended, response.data]);
          if(isMounted.current){
            setSuccessFormSwitchFamilly(true);
            setErrorMessageSwitchFamilly(false);
          setMessageErrorSwitchFamilly("");
          }
        }
      })
      .catch((error) => {
        if(isMounted.current){
          setErrorMessageSwitchFamilly(true);
          setMessageErrorSwitchFamilly(error.response.data.output.payload.message);
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
        if(response.status === 200){
          setNotificationSended(notificationSended => [...notificationSended, response.data]);
          if(isMounted.current){
            setSuccessFormAddUser(true);
            setErrorMessageAddUser(false);
            setMessageErrorAddUser("");
          }
        }
      })
      .catch((error) => {
        if(isMounted.current){
          setErrorMessageAddUser(true);
          setMessageErrorAddUser(error.response.data.output.payload.message);
        }
      });
  };

  const clearErrorMessage = () =>{
    if(messageErrorAddUser){
      setErrorMessageAddUser(false);
    }else if(messageErrorSwitchFamilly){
      setErrorMessageSwitchFamilly(false);
    }
  }


  let tableMemberFamilly = <>
    {userData && userHouseholdData &&
      <>
        <h2 className="default-h2">Membres de la famille</h2>
        <div className="container-list-table list-table-profile">
          <table className="list-table">
            <thead className="thead-no-cursor">
              <tr>
                <th>Nom</th>
                <th>Rôle</th>
                {userData.role === "admin" && userHouseholdData.member.length > 1 &&
                  <>
                    <th>Droits administrateurs</th>
                    <th>Retirer le membre</th>
                  </>
                }
                {userHouseholdData.isWaiting && requestDelegateAdmin && 
                  <>
                    <th>Droits administrateurs</th>
                  </>
                }
              </tr>
            </thead>
            <tbody>
              {userHouseholdData.member.map((member, index) => {
                let checkedRadioBtn = false;
                if(requestDelegateAdmin && member.usercode !== userData.usercode && !member.isFlagged){
                  if(member.usercode === firstMemberEligible){
                    checkedRadioBtn = true;
                  }
                }
                return (
                  <tr key={`memberTable-${index}`}>
                    <td>
                      {member.firstname} {member.lastname}
                    </td>
                    <td>
                      {member.userId === userHouseholdData.userId ? " Administrateur" : " Utilisateur"}
                    </td>
                    {userData.role === "admin" && userHouseholdData.member.length > 1 &&
                      <>
                        {userData.role === "admin" && member.usercode === userData.usercode &&
                          <td className="td-align-center"> 
                            <label key={`switchingMember-${index}`} htmlFor={`delegateMemberSwitching${index}`} > 
                              <input type="radio" name="delegateRadioInput" id={`delegateMemberSwitching${index}`} value={member.userId} onChange={() => {enableSubmitBtn(member.usercode)}} checked={defaultCheckedAdmin} ref={registerFormDelegateWhenSwitching()}/>
                              <span className="radio-checkmark"></span>
                            </label>
                          </td>
                        }
                        {userData.role !== "user" && member.usercode !== userData.usercode &&
                          <td className="td-align-center"> 
                            <label key={`switchingMember-${index}`} htmlFor={`delegateMemberSwitching${index}`} onClick={() => {enableSubmitBtn(member.usercode)}}> 
                              <input type="radio" name="delegateRadioInput" id={`delegateMemberSwitching${index}`} value={member.userId}  disabled={requestAdminNotification} ref={registerFormDelegateWhenSwitching()} />
                              <span className="radio-checkmark"></span>
                            </label>
                          </td>
                        }
                        <td>
                          {(userData.role === "admin" && member.usercode === userData.usercode) 
                            ? "" 
                            : <div className="div-list-table-action">
                                <button title="Retirer le membre" type="button" className="list-table-one-action" onClick={() => kickUser(member.userId)}><FontAwesomeIcon icon="door-open"/></button>
                              </div>
                          }
                        </td>
                      </>
                    }
                    {userHouseholdData.isWaiting && requestDelegateAdmin && otherMemberEligible &&
                      <>
                        {member.usercode !== userData.usercode && !member.isFlagged ?
                          <td className="td-align-center"> 
                            <label key={`delegateMember-${index}`} htmlFor={`delegateMember${index}`}> 
                              <input type="radio" name="otherUserIdDidNotAcceptDelegate" id={`delegateMember${index}`} value={member.userId} defaultChecked={checkedRadioBtn} ref={registerRequestDelegateAdmin()}/>
                              <span className="radio-checkmark"></span>
                            </label>
                          </td> :
                          <td className="td-align-center"> 
                            <label key={`delegateMember-${index}`}> 
                              <input type="radio" name="otherUserIdDidNotAcceptDelegate" disabled />
                              <span className="radio-checkmark"></span>
                            </label>
                          </td>
                        }
                      </>
                    }
                </tr>  
                )
              })}
              {userData.role === "admin" && delegateAdminAndSwitch && userHouseholdData.member.length > 1 &&
                <tr>
                  <td>Ne pas déléguer / supprimer la famille</td>
                  <td></td>
                  <td className="td-align-center"> 
                    <label htmlFor={"no-delegate"} onClick={() => {enableSubmitBtn()}}> 
                      <input type="radio" name="delegateRadioInput" id={"no-delegate"} value={""} disabled={requestAdminNotification} ref={registerFormDelegateWhenSwitching()}/>
                      <span className="radio-checkmark"></span>
                    </label>
                  </td>
                  <td></td>
                </tr>
              }
            </tbody>
          </table>
        </div>     
      </>
    }
  </>;

  return (
    <>
      {userHouseholdData && userData &&
        <>
          {userData.role === "admin" ?
            <form className="form-inline" onSubmit={handleSubmitFormFamillyName(updateFamillyName)}>
              <div className="input-form-container-with-error">
                <label htmlFor="householdName">Nom de la famille *</label>
                <input name="householdName" className="input-form" type="mail" id="householdName" placeholder="Nom de la famille..." defaultValue={userHouseholdData.householdName} ref={registerFormFamillyName({ required: true })} />
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
            </form> :
            <p>Nom de la famille : {userHouseholdData.householdName}</p>
          }
          
          {userData.role === 'user' && !requestDelegateAdmin && 
            <div>
            {tableMemberFamilly}
            </div>
          }

          {userData.role === "admin" &&
            <>
              <form className="form-profile-list-table" onSubmit={handleSubmitFormDelegateWhenSwitching(delegateAdminAndSwitch ? delegateAndSwitch : delegateUser)}>
                {tableMemberFamilly}
                <div className="default-action-form-container">
                  <button ref={btnDelegateForm} disabled={btnDisabledFormDelegate} className="default-btn-disabled-form" type="submit">
                    {delegateAdminAndSwitch ? 
                      dontWantToDelegate ? "Ne pas déléguer et changer de famille" : "Déléguer droits administrateurs et changer de famille" :
                    "Déléguer droits administrateurs"}
                  </button>
                  {successFormDelegate && 
                    <InformationIcon 
                      className="success-icon"
                      icon={<FontAwesomeIcon icon="check" />}
                    />
                  }
                  {warningMessageDelegate && successFormDelegate !== true &&
                    <InformationIcon 
                      className="warning-icon"
                      icon={<FontAwesomeIcon icon="exclamation" />}
                      message={delegateAdminAndSwitch ? 
                        dontWantToDelegate ? "Vous êtes sur le point de changer de famille sans déléguer vos droits administrateurs à une autre personne, votre famille sera supprimée, cette action est irréversible ! Vous changerez tout de suite de famille après avoir cliqué sur ce bouton !" : "Vous êtes sur le point de déléguer vos droits d'administrateurs à une autre personne de votre famille ! Vous changerez tout de suite de famille après avoir cliqué sur ce bouton !" : 
                        "Vous êtes sur le point de déléguer vos droits d'administrateurs à une autre personne de votre famille !"
                      }
                    />
                  }
                  {errorMessageDelegate && warningMessageDelegate!==true && successFormDelegate !== true &&
                    <InformationIcon 
                      className="error-icon"
                      icon={<FontAwesomeIcon icon="times" />}
                      message={messageErrorDelegate}
                    />
                  }
                </div>
              </form>

              <form className="form-inline" onSubmit={handleSubmitFormAddUser(addUserToFamilly)}>
                <div className="input-form-container">
                  <label htmlFor="addUserCode">Ajouter un membre</label>
                  <input name="addUserCode" className="input-form" type="mail" id="addUserCode" placeholder="Code utilisateur..." onChange={clearErrorMessage} ref={registerFormAddUser()} />
                </div>
                <div className="default-action-form-container">
                  <button className="default-btn-action-form" type="submit"><FontAwesomeIcon icon="plus" /> Ajouter</button>
                  {successFormAddUser && !errorMessageAddUser &&
                    <InformationIcon 
                      className="success-icon"
                      icon={<FontAwesomeIcon icon="check" />}
                    />
                  }
                  {errorMessageAddUser &&
                    <InformationIcon 
                      className="error-icon"
                      icon={<FontAwesomeIcon icon="times" />}
                      message={messageErrorAddUser}
                    />
                  }
                </div>
              </form>
            </>
          }

          {userData.role === 'user' && requestDelegateAdmin && 
            <form className="form-profile-list-table" onSubmit={handleSubmitFormRequestDelegateAdmin(didNotAcceptRequestDelegateAdmin)}>
              {tableMemberFamilly}
              <div className="default-action-form-container">
                <button className="default-btn-action-form" type="submit">
                  {!otherMemberEligible ? "Refuser les droits administrateurs" : "Refuser et déléguer droits administrateurs"}
                </button>
                {!errorMessageDelegate && !otherMemberEligible &&
                  <InformationIcon 
                    className="warning-icon"
                    icon={<FontAwesomeIcon icon="exclamation" />}
                    message={"Attention vous êtes le dernier membre éligible de la famille, si vous refusez, la famille sera supprimer !"}
                  />
                }
                {errorMessageDelegate &&
                  <InformationIcon 
                    className="error-icon"
                    icon={<FontAwesomeIcon icon="times" />}
                    message={messageErrorDelegate}
                  />
                }
              </div>
            </form>
          }

          <form className="form-inline" onSubmit={handleSubmitFormSwitchFamilly(switchFamilly)}>
            <div className="input-form-container">
              <label htmlFor="switchFamillyCode">Changer de famille</label>
              <input name="switchFamillyCode" className="input-form" type="mail" id="switchFamillyCode" placeholder="Code famille..." onChange={clearErrorMessage} ref={registerFormSwitchFamilly()} />
            </div>
            <div className="default-action-form-container">
              <button className="default-btn-action-form" type="submit"><FontAwesomeIcon icon="exchange-alt" /> Changer</button>
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
        </>
      }
    </>
  )
}

HouseholdOptionProfile.propTypes = {
  otherMemberEligible: PropTypes.bool.isRequired,
  requestDelegateAdmin: PropTypes.bool.isRequired
}

export default HouseholdOptionProfile
