import React, { useEffect, useRef, useState } from 'react';
import { useUserData, useUserHouseHoldData } from './../DataContext';
import UserOptionProfile from './ProfileComponents/UserOptionProfile';
import NotificationOptionProfile from './ProfileComponents/NotificationOptionProfile';
import HouseholdOptionProfile from './ProfileComponents/HouseholdOptionProfile';
import EmailOptionProfile from './ProfileComponents/EmailOptionProfile';
import ProductOptionProfile from './ProfileComponents/ProductOptionProfile';
import ProductTableOptionProfile from './ProfileComponents/ProductTableOptionProfile';
import { useForm } from 'react-hook-form';
import axiosInstance from '../../../utils/axiosInstance';
import { apiDomain, apiVersion } from '../../../apiConfig/ApiConfig';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import TitleButtonInteraction from './../UtilitiesComponent/TitleButtonInteraction';
import { logout } from './../../../utils/Auth';

function Profile({ history }) {
  const { userData } = useUserData();
  const { userHouseholdData } = useUserHouseHoldData();
  const [ openTitleMessage, setOpenTitleMessage ] = useState(false);
  const [ delegate, setDelegate ] = useState(false);
  const [ didNoTAcceptDelegate, setdidNoTAcceptDelegate ] = useState(false);
  const isMounted = useRef(true);

  const { register : registerFormDelegateWhenDeleting, handleSubmit : handleSubmitFormDelegateWhenDeleting } = useForm({
    mode: "onChange"
  });

  useEffect(() => {
    if(!openTitleMessage){
      setDelegate(false);
      setdidNoTAcceptDelegate(false);
    }
  }, [openTitleMessage]);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    }
  }, []);

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
                <form className="form-delegate" onSubmit={handleSubmitFormDelegateWhenDeleting(deleteUser)}>
                  {userHouseholdData.member.map((item, index) => {
                    if(userData._id !== item.userId && item.isFlagged === false){
                      let defaultChecked = false;
                      if(index === 1){
                        defaultChecked = true;
                      }
                      return (
                        <label key={`delMember-${index}`} className="container-radio-input" htmlFor={`delegateMemberDelete${index}`}>{item.firstname} {item.lastname} : 
                          <input type="radio" name="delegateRadioInput" id={`delegateMemberDelete${index}`} value={item.usercode} defaultChecked={defaultChecked} ref={registerFormDelegateWhenDeleting()}/>
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
  </>;

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

          <UserOptionProfile />

          <NotificationOptionProfile />

          <div className="default-title-container delimiter-title">
            <h1 className="default-h1">Options Famille</h1>
          </div>

          <HouseholdOptionProfile />

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

          <ProductTableOptionProfile />
        </>
      }
    </div>
  )
}

export default Profile;