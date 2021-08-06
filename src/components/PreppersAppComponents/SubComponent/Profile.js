import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { useLocation } from "react-router-dom";
import { useUserData, useUserHouseHoldData, useNotificationData } from './../DataContext';
import UserOptionProfile from './ProfileComponents/UserOptionProfile';
import NotificationOptionProfile from './ProfileComponents/NotificationOptionProfile';
import HouseholdOptionProfile from './ProfileComponents/HouseholdOptionProfile';
import CreateHouseholdForm from './ProfileComponents/CreateHouseholdForm';
import SwitchFamillyForm from './ProfileComponents/SwitchHouseholdForm';
import EmailOptionProfile from './ProfileComponents/EmailOptionProfile';
import ProductOptionProfile from './ProfileComponents/ProductOptionProfile';
import ProductTableOptionProfile from './ProfileComponents/ProductTableOptionProfile';
import BrandOption from './ProfileComponents/BrandOption';
import { useForm } from 'react-hook-form';
import axiosInstance from '../../../utils/axiosInstance';
import { apiDomain, apiVersion } from '../../../apiConfig/ApiConfig';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import TitleButtonInteraction from './../UtilitiesComponent/TitleButtonInteraction';
import { SwitchTransition, CSSTransition } from 'react-transition-group';
import Select from 'react-select';
import PropTypes from 'prop-types';

function Profile({ history }) {
  const location = useLocation();
  const { userData } = useUserData();
  const { userHouseholdData } = useUserHouseHoldData();
  const { notificationReceived } = useNotificationData();
  const [ openTitleMessage, setOpenTitleMessage ] = useState(false);
  const [ delegate, setDelegate ] = useState(false);
  const [ didNoTAcceptDelegate, setdidNoTAcceptDelegate ] = useState(false);
  const [ requestDelegateAdmin, setRequestDelegateAdmin ] = useState(false);
  const [ otherMemberEligible, setOtherMemberEligible ] = useState(false);
  const [option, setOption] = useState({label : 'Profil', value: 'userOptions'});
  const [objectTitle, setObjectTitle] = useState({});
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const isMounted = useRef(true);
  const btnMenuRef = useRef([]);

  const { register : registerFormDelegateWhenDeleting, handleSubmit : handleSubmitFormDelegateWhenDeleting } = useForm({
    mode: "onChange"
  });

  let btnOptionMenu = useMemo(() => {
    return [
      {label : 'Profil', value: 'userOptions'},
      {label : 'Notification', value: 'notification'},
      {label : 'Famille', value: 'householdOptions'},
      {label : 'E-mailing', value: 'emailingOptions'},
      {label : 'Produits', value: 'productOptions'},
      {label : 'Tableau produits', value: 'productTableOptions'},
      {label : 'Marques', value: 'brandOptions'},
    ]
  }, []);

  const switchMenu = (menuId, optionObject) => {
    let oldActive = btnMenuRef.current.find((element) => element.className.includes('btn-option-active') === true);
    if(oldActive) oldActive.classList.remove('btn-option-active');
    let newActive = btnMenuRef.current.find((element) => element.attributes.id.value === menuId);
    if(newActive) newActive.classList.add('btn-option-active');
    setOption(optionObject);
  };

  useEffect(() => {
    if(location?.state?.householdOptions || location?.state?.brandOptions || location?.state?.notification){
      switchMenu(Object.keys(location.state)[0], btnOptionMenu.find(option => option.value === Object.keys(location.state)[0]));
    }
    window.history.replaceState({}, document.title);
  }, [location, btnOptionMenu]);

  const responsive = useCallback(() => {
    setWindowWidth(window.innerWidth);
  }, []);

  useEffect(() => {
    window.addEventListener('resize', responsive);
    return () => {
      window.removeEventListener('resize', responsive);
    }
  }, [responsive]);

  useEffect(() => {
    if(userData){
      setObjectTitle({
        userOptions : `Profil de ${userData.firstname} ${userData.lastname}`,
        notification: 'Listes des notifications reçues/envoyées',
        householdOptions : 'Gestion de votre Famille',
        emailingOptions : 'Options e-mailing',
        productOptions : 'Options produit',
        productTableOptions : 'Options tableau de produits',
        brandOptions : 'Gestion marque de produit',
      })
    }
  }, [userData]);

  useEffect(() => {
    if(!openTitleMessage){
      setDelegate(false);
      setdidNoTAcceptDelegate(false);
    }
  }, [openTitleMessage]);

  useEffect(() => {
    if(notificationReceived.length >= 1){
      const notificationRequestDelegateAdmin = notificationReceived.find(notif => notif.type === "request-delegate-admin");
      if(notificationRequestDelegateAdmin !== undefined){
        setRequestDelegateAdmin(true);
      }else{
        setRequestDelegateAdmin(false);
      }
    }
  }, [notificationReceived]);

  useEffect(() => {
    if(userHouseholdData && requestDelegateAdmin){
      const memberEligible = userHouseholdData.members.filter(member => member.isFlagged === false);
      if(memberEligible.length > 1 ){
        setOtherMemberEligible(true);
      }else{
        setOtherMemberEligible(false);
      }
    }
  }, [userHouseholdData, requestDelegateAdmin]);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    }
  }, []);

  const deleteUser = async (data) => {
    let deleteUserDataEndPoint;
    if(data){
      deleteUserDataEndPoint = `${apiDomain}/api/${apiVersion}/users/${userData._id}?delegateUserId=${data.delegateRadioInput}`;
    }else{
      deleteUserDataEndPoint = `${apiDomain}/api/${apiVersion}/users/${userData._id}`;
    }
    await axiosInstance.delete(deleteUserDataEndPoint)
    .then((response) => {
      if(isMounted.current){
        if(response.status === 200){
          localStorage.clear();
          sessionStorage.clear();
          history.push("/");
        }
      }
    });
  }

  let contentTitleInteraction = <>
    {openTitleMessage && 
      <>
        {((userData.role === "admin" && userHouseholdData.members.length === 1) || (userData.role === "admin" && didNoTAcceptDelegate) || userData.role === "user") &&
          <div className="title-message-container-delete-action">
            {requestDelegateAdmin ?
              <p>Vous ne pouvez effectuer cette action tant que vous avez une délégation de droit d'administration en cours!</p> :
              <p>Êtes-vous sur et certain de vouloir supprimer votre compte? Toutes vos données seront perdues!</p>
            }
            <div className="btn-delete-action-container">
              <button 
              className={requestDelegateAdmin ? "btn-delete-action-disabled" : 'btn-delete-action-yes'}
              disabled={requestDelegateAdmin}
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
        {(userData.role === "admin" && userHouseholdData.members.length > 1 && !didNoTAcceptDelegate) &&
          <div className="title-message-container-delete-action">
            {!delegate &&
              <>
                <p>Voulez-vous déléguer vos droits d'administrations à un.e membre de votre famille avant de supprimer votre compte ?</p>
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
                <p>Choississez le/la membre à qui vous voulez déléguer les droits d'administrations de cette famille !</p>
                <form className="form-delegate" onSubmit={handleSubmitFormDelegateWhenDeleting(deleteUser)}>
                  {userHouseholdData.members.map((member, index) => {
                    if(userData._id !== member.userData._id && member.isFlagged === false){
                      let defaultChecked = false;
                      if(index === 1){
                        defaultChecked = true;
                      }
                      return (
                        <label key={`delMember-${index}`} className="container-radio-input" htmlFor={`delegateMemberDelete${index}`}>{member.userData.firstname} {member.userData.lastname} : 
                          <input type="radio" name="delegateRadioInput" id={`delegateMemberDelete${index}`} value={member.userData._id} defaultChecked={defaultChecked} {...registerFormDelegateWhenDeleting("delegateRadioInput")} />
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
      </>
    }
  </>;

  let switchToHouseholdOptions = () => {
    switchMenu('householdOptions',{label : 'Famille', value: 'householdOptions'}); 
  }

  return (
    <div className="default-wrapper">
      {userData && 
        <>
          <div className="btn-option-container">
            {windowWidth <= 992 ?
              <Select
                className="select-option"
                defaultValue={option}
                options={btnOptionMenu}
                onChange={(selectedOption)=> {
                  setOption(selectedOption)
                }}
              /> :
              <>
              {btnOptionMenu.map((btn, index) => {
                return <button ref={(el) => (btnMenuRef.current[index] = el)} id={`${btn.value}`} key={`${btn.value}-${index}`} className={`default-btn-action-form ${btn.value === 'userOptions' ? 'btn-option-active' : ''}`} onClick={(e) => {
                  e.persist();
                  let oldActive = btnMenuRef.current.find((element) => element.className.includes('btn-option-active') === true);
                  if(oldActive) oldActive.classList.remove('btn-option-active');
                  e.target.classList.add('btn-option-active');
                  setOption(btn)
                  }}>
                  {btn.label}
                </button>
              })}
            </>
            }

          </div>
          
          <div className="default-title-container delimiter-title">
            <h1 className="default-h1">{objectTitle[option.value]}</h1>
            {option.value === "userOptions" && 
              <TitleButtonInteraction 
                title={"Supprimer son compte"}
                openTitleMessage={openTitleMessage}
                setOpenTitleMessage={setOpenTitleMessage}
                icon={<FontAwesomeIcon icon="trash" />}
                contentDiv={contentTitleInteraction}
              />
            }
          </div>

          <SwitchTransition mode={'out-in'}>
            <CSSTransition
              key={option.value}
              addEndListener={(node, done) => {
                node.addEventListener("transitionend", done, false);
              }}
              classNames="fade"
            >
              <div>
                {option.value === 'userOptions' && <UserOptionProfile />}
                {option.value === 'notification' && 
                  <NotificationOptionProfile 
                    otherMemberEligible={otherMemberEligible}
                    switchToHouseholdOptions={switchToHouseholdOptions}
                  />
                }
                {option.value === 'householdOptions' && 
                  <>
                    {userData?.householdId ?
                      <HouseholdOptionProfile 
                        requestDelegateAdmin={requestDelegateAdmin}
                        otherMemberEligible={otherMemberEligible}
                      /> :
                      <CreateHouseholdForm />
                    }
                    <SwitchFamillyForm 
                      requestDelegateAdmin={requestDelegateAdmin}
                    />
                  </>
                }
                {option.value === 'emailingOptions' && <EmailOptionProfile />}
                {option.value === 'productOptions' && <ProductOptionProfile />}
                {option.value === 'productTableOptions' && <ProductTableOptionProfile />}
                {option.value === 'brandOptions' && <BrandOption />}
              </div>
            </CSSTransition>
          </SwitchTransition>
        </>
      }
    </div>
  )
}

Profile.propTypes = {
  history: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
}

export default Profile;