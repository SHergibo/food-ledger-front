import React, { useEffect, useRef, useState } from 'react';
import { useUserData, useUserHouseHoldData, useNotificationData } from './../DataContext';
import UserOptionProfile from './ProfileComponents/UserOptionProfile';
import NotificationOptionProfile from './ProfileComponents/NotificationOptionProfile';
import HouseholdOptionProfile from './ProfileComponents/HouseholdOptionProfile';
import CreateHouseholdForm from './ProfileComponents/CreateHouseholdForm';
import SwitchFamillyForm from './ProfileComponents/SwitchHouseholdForm';
import EmailOptionProfile from './ProfileComponents/EmailOptionProfile';
import ProductOptionProfile from './ProfileComponents/ProductOptionProfile';
import ProductTableOptionProfile from './ProfileComponents/ProductTableOptionProfile';
import { useForm } from 'react-hook-form';
import axiosInstance from '../../../utils/axiosInstance';
import { apiDomain, apiVersion } from '../../../apiConfig/ApiConfig';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import TitleButtonInteraction from './../UtilitiesComponent/TitleButtonInteraction';
import { SwitchTransition, CSSTransition } from 'react-transition-group';
import PropTypes from 'prop-types';

function Profile({ history }) {
  const { userData } = useUserData();
  const { userHouseholdData } = useUserHouseHoldData();
  const { notificationReceived } = useNotificationData();
  const [ openTitleMessage, setOpenTitleMessage ] = useState(false);
  const [ delegate, setDelegate ] = useState(false);
  const [ didNoTAcceptDelegate, setdidNoTAcceptDelegate ] = useState(false);
  const [ requestDelegateAdmin, setRequestDelegateAdmin ] = useState(false);
  const [ otherMemberEligible, setOtherMemberEligible ] = useState(false);
  const [option, setOption] = useState('userOptions');
  const [objectTitle, setObjectTitle] = useState({});
  // const householdOptions = useRef(null);
  const isMounted = useRef(true);

  const { register : registerFormDelegateWhenDeleting, handleSubmit : handleSubmitFormDelegateWhenDeleting } = useForm({
    mode: "onChange"
  });

  // useEffect(() => {
  //   if(location.state && location.state.scrollDelegate && householdOptions.current){
  //     householdOptions.current.scrollIntoView();
  //   }
  // }, [location]);

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

  // const scrollToHouseholdOptions = () =>{
  //   householdOptions.current.scrollIntoView();
  // }

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
                          <input type="radio" name="delegateRadioInput" id={`delegateMemberDelete${index}`} value={member.userData._id} defaultChecked={defaultChecked} ref={registerFormDelegateWhenDeleting()}/>
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

  let btnOptionMenu = [
    {title : 'Profil', option: 'userOptions'},
    {title : 'Notification', option: 'notification'},
    {title : 'Famille', option: 'householdOptions'},
    {title : 'E-mailing', option: 'emailingOptions'},
    {title : 'Produits', option: 'productOptions'},
    {title : 'Tableau produits', option: 'productTableOptions'},
    {title : 'Marques', option: 'brandOptions'},
  ];

  return (
    <div className="default-wrapper">
      {userData && 
        <>
          <div className="btn-option-container">
            {btnOptionMenu.map((btn, index) => {
              return <button key={`${btn.option}-${index}`} className="default-btn-action-form" onClick={() => setOption(btn.option)}>
                {btn.title}
              </button>
            })}
          </div>
          
          <div className="default-title-container delimiter-title">
            <h1 className="default-h1">{objectTitle[option]}</h1>
            {option === "userOptions" && 
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
              key={option}
              addEndListener={(node, done) => {
                node.addEventListener("transitionend", done, false);
              }}
              classNames="fade"
            >
              <div>
                {option === 'userOptions' && <UserOptionProfile />}
                {option === 'notification' && 
                  <NotificationOptionProfile 
                    otherMemberEligible={otherMemberEligible}
                  />
                }
                {option === 'householdOptions' && 
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
                {option === 'emailingOptions' && <EmailOptionProfile />}
                {option === 'productOptions' && <ProductOptionProfile />}
                {option === 'productTableOptions' && <ProductTableOptionProfile />}
              </div>
            </CSSTransition>
          </SwitchTransition>
          {/* <div className="default-title-container">
            <h1 className="default-h1">Profil de {userData.firstname} {userData.lastname}</h1>
            <TitleButtonInteraction 
              title={"Supprimer son compte"}
              openTitleMessage={openTitleMessage}
              setOpenTitleMessage={setOpenTitleMessage}
              icon={<FontAwesomeIcon icon="trash" />}
              contentDiv={contentTitleInteraction}
            />
          </div>

          <UserOptionProfile />

          <div className="default-title-container delimiter-title">
            <h1 className="default-h1">Listes des notifications reçues/envoyées</h1>
          </div>

          <NotificationOptionProfile 
            scrollToHouseholdOptions = {scrollToHouseholdOptions}
            otherMemberEligible={otherMemberEligible}
          />

          <div ref={householdOptions} className="default-title-container delimiter-title">
            <h1 className="default-h1">Options Famille</h1>
          </div>

          {userData.householdId ?
            <HouseholdOptionProfile 
              requestDelegateAdmin={requestDelegateAdmin}
              otherMemberEligible={otherMemberEligible}
            /> :
            <CreateHouseholdForm />
          }
          <SwitchFamillyForm 
            requestDelegateAdmin={requestDelegateAdmin}
          />
          

          <div className="default-title-container delimiter-title">
            <h1 className="default-h1">Options e-mailing</h1>
          </div>

          <EmailOptionProfile />

          <div className="default-title-container delimiter-title">
            <h1 className="default-h1">Options produit</h1>
          </div>

          <ProductOptionProfile />

          <div className="default-title-container delimiter-title">
            <h1 className="default-h1">Options tableau de produits</h1>
          </div>

          <ProductTableOptionProfile /> */}
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