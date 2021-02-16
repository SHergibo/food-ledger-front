import React, { useEffect, useState, useRef } from 'react';
import { useUserData, useUserHouseHoldData, useNotificationData } from '../../DataContext';
import { useForm } from 'react-hook-form';
import axiosInstance from '../../../../utils/axiosInstance';
import { apiDomain, apiVersion } from '../../../../apiConfig/ApiConfig';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import InformationIcon from '../../UtilitiesComponent/InformationIcons';

function HouseholdOptionProfile() {
  const { userData } = useUserData();
  const { userHouseholdData, setUserHouseholdData } = useUserHouseHoldData();
  const { setNotificationSended } = useNotificationData();
  const [ successFormFamillyName, setSuccessFormFamillyName ] = useState(false);
  const [ successFormAddUser, setSuccessFormAddUser ] = useState(false);
  const [ successFormSwitchFamilly, setSuccessFormSwitchFamilly ] = useState(false);
  const [ successFormDelegate, setSuccessFormDelegate ] = useState(false);
  const [ btnDisabledFormDelegate, setBtnDisabledFormDelegate ] = useState(true);
  const [ warningMessageDelegate, setWarningMessageDelegate ] = useState(false);
  const [ errorMessageDelegate, setErrorMessageDelegate ] = useState(false);
  const [ messageErrorDelegate, setMessageErrorDelegate ] = useState("");
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

  const { register : registerFormSwitchFamilly, handleSubmit : handleSubmitFormSwitchFamilly} = useForm({
    mode: "onChange"
  });

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
      btnDelegateForm.current.classList.remove('default-btn-action-form');
      btnDelegateForm.current.classList.add('default-btn-disabled-form');
    }else{
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
          }
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
          }
        }
      });
  };


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
              </tr>
            </thead>
            <tbody>
              {userHouseholdData.member.map((member, index) => {
                if(member.isFlagged === false){
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
                              <label key={`switchingMember-${index}`} htmlFor={`delegateMemberSwitching${index}`} onClick={() => {enableSubmitBtn(member.usercode)}}> 
                                <input type="radio" name="delegateRadioInput" id={`delegateMemberSwitching${index}`} value={member.userId} defaultChecked={true} ref={registerFormDelegateWhenSwitching()}/>
                                <span className="radio-checkmark"></span>
                              </label>
                            </td>
                          }
                          {userData.role !== "user" && member.usercode !== userData.usercode &&
                            <td className="td-align-center"> 
                              <label key={`switchingMember-${index}`} htmlFor={`delegateMemberSwitching${index}`} onClick={() => {enableSubmitBtn(member.usercode)}}> 
                                <input type="radio" name="delegateRadioInput" id={`delegateMemberSwitching${index}`} value={member.userId} defaultChecked={false} ref={registerFormDelegateWhenSwitching()}/>
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
                  </tr>  
                  )
                }else{
                  return null
                }
              })}
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
          </form>

          {userData.role === 'user' && 
            <div>
            {tableMemberFamilly}
            </div>
          }

          {userData.role === "admin" &&
            <>
              <form className="form-profile-list-table" onSubmit={handleSubmitFormDelegateWhenSwitching(delegateUser)}>
                {tableMemberFamilly}
                <div className="default-action-form-container">
                  <button ref={btnDelegateForm} disabled={btnDisabledFormDelegate} className="default-btn-disabled-form" type="submit">Déléguer droits administrateurs</button>
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
                      message="Vous êtes sur le point de déléguer vos droits d'administrateurs à une autre personne de votre famille !"
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
            </>
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
    </>
  )
}

export default HouseholdOptionProfile
