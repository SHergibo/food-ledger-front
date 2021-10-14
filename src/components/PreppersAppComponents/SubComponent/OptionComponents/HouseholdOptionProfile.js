import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useUserData, useUserHouseHoldData, useNotificationData } from '../../DataContext';
import { useForm, Controller } from 'react-hook-form';
import ReactSelect from './../../UtilitiesComponent/ReactSelect';
import axiosInstance from '../../../../utils/axiosInstance';
import { apiDomain, apiVersion } from '../../../../apiConfig/ApiConfig';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import SwitchFamillyForm from './../OptionComponents/SwitchHouseholdForm';
import InformationIcon from '../../UtilitiesComponent/InformationIcons';
import Table from './../../UtilitiesComponent/Table';
import { columnsHouseholdOptionAdmin, columnsHouseholdOptionUser } from "./../../../../utils/localData";
import PropTypes from 'prop-types';

function HouseholdOptionProfile({ otherMemberEligible, requestDelegateAdmin }) {
  const { userData } = useUserData();
  const { userHouseholdData, setUserHouseholdData } = useUserHouseHoldData();
  const { notificationReceived } = useNotificationData();
  const [householdMembers, setHouseholdMembers] = useState([]);
  const [ notificationSended, setNotificationSended ] = useState([]);
  const [ defaultCheckedAdmin, setDefaultCheckedAdmin ] = useState(true);
  const [ delegateAdminAndSwitch, setDelegateAdminAndSwitch ] = useState(false);
  const [ showSelectHousehold, setShowSelectHousehold ] = useState(false);
  const [ arrayOptionSelectHousehold, setArrayOptionSelectHousehold ] = useState([]);
  const [ requestAdminNotification, setRequestAdminNotification ] = useState(false);
  const [ dontWantToDelegate, setDontWantToDelegate ] = useState(false);
  const [ firstMemberEligible, setFirstMemberEligible ] = useState("");
  const [ successFormFamillyName, setSuccessFormFamillyName ] = useState(false);
  const [ successFormAddUser, setSuccessFormAddUser ] = useState(false);
  const [ successFormDelegate, setSuccessFormDelegate ] = useState(false);
  const [ btnDisabledFormDelegate, setBtnDisabledFormDelegate ] = useState(true);
  const [ warningMessageDelegate, setWarningMessageDelegate ] = useState(false);
  const [ errorMessageDelegate, setErrorMessageDelegate ] = useState(false);
  const [ messageErrorDelegate, setMessageErrorDelegate ] = useState("");
  const [ errorMessageAddUser, setErrorMessageAddUser ] = useState(false);
  const [ messageErrorAddUser, setMessageErrorAddUser ] = useState("");
  const [pageIndex, setPageIndex] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const isMounted = useRef(true);
  const btnDelegateForm = useRef(null);
  const [trTable, setTrTable] = useState([]);
  const pageSize = 5;

  const { register : registerFormFamillyName, handleSubmit : handleSubmitFormFamillyName, formState: { errors: errorsFormFamillyName } } = useForm({
    mode: "onChange"
  });

  const { register : registerFormDelegateWhenSwitching, handleSubmit : handleSubmitFormDelegateWhenSwitching, formState: { errors: errorsFormDelegateWhenSwitching }, control } = useForm({
    mode: "onChange"
  });

  const { register : registerFormAddUser, handleSubmit : handleSubmitFormAddUser, formState: { errors: errorsFormAddUser }} = useForm({
    mode: "onChange"
  });

  const { register : registerRequestDelegateAdmin, handleSubmit : handleSubmitFormRequestDelegateAdmin } = useForm({
    mode: "onChange"
  });

  // useEffect(() => {
  //   if(userHouseholdData){
  //     setPageCount(Math.ceil(userHouseholdData.members.length / pageSize));
  //   }
  // }, [userHouseholdData]);

  const getUserList = useCallback(async () => {
    //setErrorFetch(false);
    //setLoading(true);
    const getUserListEndPoint = `${apiDomain}/api/${apiVersion}/users/pagination/${userHouseholdData._id}?page=${pageIndex - 1}`;
    await axiosInstance.get(getUserListEndPoint)
      .then(async (response) => {
        if(isMounted.current){
          if(response.data.totalData >=1){
            setHouseholdMembers(response.data.arrayData);
            setPageCount(Math.ceil(response.data.totalData / pageSize));
            //setHasBrand(true);
          }else{
            //setHasBrand(false);
          }
          //setLoading(false);
        }
      })
      .catch((error)=> {
        let jsonError = JSON.parse(JSON.stringify(error));
        if(isMounted.current){
          if(error.code === "ECONNABORTED" || jsonError.name === "Error"){
            //setErrorFetch(true);
          }
        }
      });
  }, [userHouseholdData, pageIndex]);

  useEffect(() => {
    if(userHouseholdData){
      getUserList();
    }
  }, [userHouseholdData, getUserList]);

  useEffect(() => {
    if(showSelectHousehold) registerFormDelegateWhenSwitching("notifId", { required: true });
    if(!showSelectHousehold) registerFormDelegateWhenSwitching("notifId");
  }, [registerFormDelegateWhenSwitching, showSelectHousehold]);

  useEffect(() => {
    const needSwitchAdminNotif = notificationReceived.filter(notif => notif.type === "need-switch-admin");
    if(needSwitchAdminNotif.length >= 1) setDelegateAdminAndSwitch(true);
    if(needSwitchAdminNotif.length >= 2) {
      setShowSelectHousehold(true);
      setArrayOptionSelectHousehold([]);
      needSwitchAdminNotif.forEach(notif => {
        setArrayOptionSelectHousehold(arrayOptionSelectHousehold => [...arrayOptionSelectHousehold,{ value: notif._id, label: notif.householdId.householdName }]);
      });
    };
    if(needSwitchAdminNotif.length === 0) setDelegateAdminAndSwitch(false);
    if(needSwitchAdminNotif.length < 2)  setShowSelectHousehold(false);
  }, [notificationReceived]);

  const getSendedNotification = useCallback(async (userId) => {
    const getNotificationEndPoint = `${apiDomain}/api/${apiVersion}/notifications/sended-notification/${userId}`;
    await axiosInstance.get(getNotificationEndPoint)
      .then((response) => {
        if(isMounted.current){
          setNotificationSended(response.data);
        }
      });
    }, []);

  useEffect(() => {
    if(userData){
      setDefaultCheckedAdmin(true);
      getSendedNotification(userData._id);
    }
  }, [userData, getSendedNotification]);


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
      const memberEligible = userHouseholdData.members.filter(member => member.isFlagged === false);

      if(memberEligible.length > 1){
        const firstMemberEligible = userHouseholdData.members.find(member => member.isFlagged === false && userData.usercode !== member.userData.usercode);
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

  const enableSubmitBtn = useCallback((usercode) => {
    if(userData.role === "admin" && usercode === userData.usercode){
      setBtnDisabledFormDelegate(true);
      setWarningMessageDelegate(false);
      setDefaultCheckedAdmin("admin");
      if(dontWantToDelegate){
        setDontWantToDelegate(false);
      }
      btnDelegateForm.current.classList.remove('btn-purple');
      btnDelegateForm.current.classList.add('btn-disabled');
    }else{
      if(usercode === undefined){
        setDontWantToDelegate(true);
      }else if(dontWantToDelegate){
        setDontWantToDelegate(false);
      }
      setDefaultCheckedAdmin(false);
      setBtnDisabledFormDelegate(false);
      setWarningMessageDelegate(true);
      btnDelegateForm.current.classList.remove('btn-disabled');
      btnDelegateForm.current.classList.add('btn-purple');
    }
  }, [dontWantToDelegate, userData]);
  
  const kickUser = useCallback(async (userId) => {
    const kicUserEndPoint = `${apiDomain}/api/${apiVersion}/households/kick-user/${userHouseholdData._id}`;

    await axiosInstance.patch(kicUserEndPoint, {userId : userId});
  }, [userHouseholdData]);

  const delegateAdminRights = async (data) => {
    const switchAdminRightsData = {
      userId : data.delegateRadioInput,
      householdId : userHouseholdData._id
    }
    const switchAdminRightsEndPoint = `${apiDomain}/api/${apiVersion}/requests/switch-admin-rights`;

    await axiosInstance.post(switchAdminRightsEndPoint, switchAdminRightsData)
      .then((response) => {
        if(response.status === 204){
          setErrorMessageDelegate(false);
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
    const needSwitchAdminNotif = notificationReceived.filter(notif => notif.type === "need-switch-admin");
    let notifId;
    if(needSwitchAdminNotif.length === 1) notifId = needSwitchAdminNotif[0]._id;
    if(needSwitchAdminNotif.length >= 2) notifId = data.notifId.value;

    let switchAdminRightsEndPoint = `${apiDomain}/api/${apiVersion}/requests/add-user-respond/${notifId}?acceptedRequest=yes&type=received&otherMember=${data.delegateRadioInput}`;
    if(data.delegateRadioInput === ""){
      switchAdminRightsEndPoint = `${apiDomain}/api/${apiVersion}/requests/add-user-respond/${notifId}?acceptedRequest=yes&type=received`;
    }
    await axiosInstance.get(switchAdminRightsEndPoint)
      .then((response) => {
        if(response.status === 204){
          setErrorMessageDelegate(false);
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
    let requestDelegateAdminEndPoint = `${apiDomain}/api/${apiVersion}/requests/${requestDelegateAdminNotif.urlRequest}/${requestDelegateAdminNotif._id}?acceptedRequest=no&type=received`;
    if(data.otherUserIdDidNotAcceptDelegate){
      requestDelegateAdminEndPoint = `${requestDelegateAdminEndPoint}&otherMember=${data.otherUserIdDidNotAcceptDelegate}&type=received`;
    }
    await axiosInstance.get(requestDelegateAdminEndPoint)
      .then((response) => {
        if(response.status === 204 && isMounted.current){
          setErrorMessageDelegate(false);
        }
      }).catch((error) => {
        if(isMounted.current){
          setErrorMessageDelegate(true);
          setMessageErrorDelegate(error.response.data.output.payload.message);
        }
      });
  }

  const addUserToFamilly = async (data) => {
    let addUserData = {
      usercode : `${data.addUserCode}`, 
      type : "householdToUser",
      householdCode : `${userHouseholdData.householdCode}`
    }

    const addUserToFamillyEndPoint = `${apiDomain}/api/${apiVersion}/requests/add-user-request`;
    await axiosInstance.post(addUserToFamillyEndPoint, addUserData)
      .then((response) => {
        if(response.status === 204 && isMounted.current){
          setSuccessFormAddUser(true);
          setErrorMessageAddUser(false);
          setMessageErrorAddUser("");
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
    }
  };

  useEffect(() => {
    const memberTable = householdMembers.map((member, index) => {
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
            {member.role === "admin" ? " Administrateur.trice" : " Utilisateur.trice"}
          </td>
          {userData.role === "admin" && householdMembers.length > 1 &&
            <>
              {member.role === "admin" &&
                <td className="td-align-center"> 
                  <label key={`switchingMember-${index}`} htmlFor={`delegateMemberSwitching-${index}`} onClick={() => {enableSubmitBtn(member.usercode)}}> 
                    <input type="radio" name="delegateRadioInput" id={`delegateMemberSwitching-${index}`} value={member._id}  checked={defaultCheckedAdmin} {...registerFormDelegateWhenSwitching("delegateRadioInput")}/>
                    <span className="radio-checkmark"></span>
                  </label>
                </td>
              }
              {member.role === "user" &&
                <td className="td-align-center"> 
                  <label key={`switchingMember-${index}`} htmlFor={`delegateMemberSwitching-${index}`} onClick={() => {enableSubmitBtn(member.usercode)}}> 
                    <input type="radio" name="delegateRadioInput" id={`delegateMemberSwitching-${index}`} value={member._id}  disabled={requestAdminNotification} {...registerFormDelegateWhenSwitching("delegateRadioInput")} />
                    <span className="radio-checkmark"></span>
                  </label>
                </td>
              }
              <td>
                {member.role === "user" &&
                  <div className="div-list-table-action">
                    <button title="Retirer le membre" type="button" className="list-table-one-action" onClick={() => kickUser(member._id)}><FontAwesomeIcon icon="door-open"/></button>
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
                    <input type="radio" name="otherUserIdDidNotAcceptDelegate" id={`delegateMember${index}`} value={member._id} defaultChecked={checkedRadioBtn} {...registerRequestDelegateAdmin("otherUserIdDidNotAcceptDelegate")}/>
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
    )});

    setTrTable(memberTable);

    if(userData.role === "admin" && delegateAdminAndSwitch && householdMembers.length > 1){
      let actionNoDelegate = <tr key={`action-no-delegate`}>
        <td>Ne pas déléguer / supprimer la famille</td>
        <td></td>
        <td className="td-align-center"> 
          <label htmlFor={"no-delegate"} onClick={() => {enableSubmitBtn()}}> 
            <input type="radio" name="delegateRadioInput" id={"no-delegate"} value={""} disabled={requestAdminNotification} {...registerFormDelegateWhenSwitching("delegateRadioInput")}/>
            <span className="radio-checkmark"></span>
          </label>
        </td>
        <td></td>
      </tr>;
      setTrTable([...memberTable, actionNoDelegate]);
    }
  }, [userData, householdMembers, userHouseholdData, delegateAdminAndSwitch, enableSubmitBtn, registerFormDelegateWhenSwitching, requestAdminNotification, defaultCheckedAdmin, firstMemberEligible, kickUser, otherMemberEligible, registerRequestDelegateAdmin, requestDelegateAdmin]);

  return (
    <div className="container-data container-option ">
      <div className="option-component form-familly">
        {userHouseholdData && userData &&
          <>
            {userData.role === "admin" ?
            <>
              <div className="familly-name">
                <h2>Nom de la famille : {userHouseholdData.householdName}</h2>
                <p>Code famille : {userHouseholdData.householdCode}</p>
              </div>
              <form className="form-inline" onSubmit={handleSubmitFormFamillyName(updateFamillyName)}>
                <div className="input-group">
                  <input
                    name="householdName"
                    type="text"
                    id="householdName"
                    className={`form-input ${errorsFormFamillyName.householdName  ? "error-input" : ""}`}
                    onChange={clearErrorMessage}
                    {...registerFormFamillyName("householdName", { required: true })}
                  />
                  <label htmlFor="householdName" className="form-label">Nom de la famille *</label>
                  <div className="error-message-input">
                    {errorsFormFamillyName.householdName && <span >Ce champ est requis</span>}
                  </div>
                </div>
                <div className="btn-action-container">
                  <button className="btn-purple" type="submit"><FontAwesomeIcon className="btn-icon" icon="pen" /> Éditer</button>
                  {successFormFamillyName && 
                    <InformationIcon 
                      className="success-icon"
                      icon={<FontAwesomeIcon icon="check" />}
                    />
                  }
                </div>
              </form>
            </> :
              <div className="familly-name">
                <h2>Nom de la famille : {userHouseholdData.householdName}</h2>
                <p>Code famille : {userHouseholdData.householdCode}</p>
              </div>
            }

            <SwitchFamillyForm 
              requestDelegateAdmin={requestDelegateAdmin}
            /> 

            {userData.role === "admin" &&
              <form className="form-inline" onSubmit={handleSubmitFormAddUser(addUserToFamilly)}>
                <div className="input-group">
                  <input
                    name="addUserCode"
                    type="text"
                    id="addUserCode"
                    className={`form-input ${errorsFormAddUser.addUserCode  ? "error-input" : ""}`}
                    onChange={clearErrorMessage}
                    {...registerFormAddUser("addUserCode", { required: true })}
                  />
                  <label htmlFor="addUserCode" className="form-label">Ajouter un membre *</label>
                  <div className="error-message-input">
                    {errorsFormAddUser.addUserCode && <span >Ce champ est requis</span>}
                  </div>
                </div>
                <div className="btn-action-container">
                  <button className="btn-purple" type="submit"><FontAwesomeIcon className="btn-icon" icon="plus" /> Ajouter</button>
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
            }
            
            {userData.role === 'user' && !requestDelegateAdmin && 
              <>
                <h2>Membres de la famille</h2>
                <Table 
                  columns={columnsHouseholdOptionUser}
                  customTableClass={{customThead: "centered-thead"}}
                  trTable={trTable}
                  pagination={true}
                  paginationInfo={{pageIndex, setPageIndex, pageCount}}
                />
              </>
            }

            {userData.role === "admin" &&
              <form className="table-familly-member" onSubmit={handleSubmitFormDelegateWhenSwitching(delegateAdminAndSwitch ? delegateAndSwitch : delegateAdminRights)}>
                <h2>Membres de la famille</h2>
                <Table 
                  columns={householdMembers.length > 1 ? columnsHouseholdOptionAdmin : columnsHouseholdOptionUser}
                  customTableClass={{customThead: "centered-thead"}}
                  trTable={trTable}
                  pagination={true}
                  paginationInfo={{pageIndex, setPageIndex, pageCount}}
                />
                {showSelectHousehold &&
                  <div className="input-group">
                    <ReactSelect
                      format="select"
                      label="Choisir une famille *"
                      labelBackWhite={true}
                      respSelect={true}
                      Controller={Controller}
                      name="notifId"
                      inputId="householdName"
                      isClearable={true}
                      arrayOptions={arrayOptionSelectHousehold}
                      control={control}
                      defaultValue={""}
                    />
                    {errorsFormDelegateWhenSwitching.notifId && <span className="error-message-form">Ce champ est requis</span>}
                  </div>
                }
                {householdMembers.length > 1 &&
                  <div className="btn-action-container">
                    <button ref={btnDelegateForm} disabled={btnDisabledFormDelegate} className="btn-disabled" type="submit">
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
                }
              </form>
            }

            {userData.role === 'user' && requestDelegateAdmin && 
              <form className="table-familly-member" onSubmit={handleSubmitFormRequestDelegateAdmin(didNotAcceptRequestDelegateAdmin)}>
                <h2>Membres de la famille</h2>
                <Table 
                  columns={columnsHouseholdOptionUser}
                  customTableClass={{customThead: "centered-thead"}}
                  trTable={trTable}
                  pagination={true}
                  paginationInfo={{pageIndex, setPageIndex, pageCount}}
                />
                <div className="btn-action-container">
                  <button className="btn-purple" type="submit">
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
          </>
        }
      </div>
    </div>
  )
}

HouseholdOptionProfile.propTypes = {
  otherMemberEligible: PropTypes.bool.isRequired,
  requestDelegateAdmin: PropTypes.bool.isRequired
}

export default HouseholdOptionProfile
