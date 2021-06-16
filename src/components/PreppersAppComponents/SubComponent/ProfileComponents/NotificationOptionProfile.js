import React, { useRef, useEffect, useState } from 'react';
import { useNotificationData } from '../../DataContext';
import axiosInstance from '../../../../utils/axiosInstance';
import { apiDomain, apiVersion } from '../../../../apiConfig/ApiConfig';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';

function NotificationOptionProfile({switchToHouseholdOptions, otherMemberEligible}) {
  const { notificationReceived, notificationSended } = useNotificationData();
  const [notificationTable, setNotificationTable] = useState(true);
  const [notificationDelegateAdmin, setNotificationDelegateAdmin] = useState(false);
  const isMounted = useRef(true);
  const btnSwitchReceivedNotif = useRef(null);
  const btnSwitchSendedNotif = useRef(null);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    }
  }, []);

  useEffect(() => {
    if(notificationReceived.length >= 1 && notificationSended.length === 0){
      btnSwitchReceivedNotif.current.classList.add("btn-switch-notification-active");
      btnSwitchReceivedNotif.current.classList.remove("btn-switch-notification-inactive");
    }else if(notificationSended.length >= 1 && notificationReceived.length === 0){
      btnSwitchSendedNotif.current.classList.add("btn-switch-notification-active");
      btnSwitchSendedNotif.current.classList.remove("btn-switch-notification-inactive");
    }else if(notificationReceived.length >= 1 && notificationSended.length >= 1 && !btnSwitchSendedNotif.current.classList.contains("btn-switch-notification-active")){
      btnSwitchReceivedNotif.current.classList.add("btn-switch-notification-active");
      btnSwitchSendedNotif.current.classList.add("btn-switch-notification-inactive");
    }else if(notificationReceived.length >= 1 && notificationSended.length >= 1 && !btnSwitchReceivedNotif.current.classList.contains("btn-switch-notification-active")){
      btnSwitchReceivedNotif.current.classList.add("btn-switch-notification-active");
      btnSwitchSendedNotif.current.classList.add("btn-switch-notification-inactive");
    }
  }, [notificationReceived, notificationSended]);

  const notificationRequest = async (urlRequest, id, isAccepted) => {
    const requestNotificationEndpoint = `${apiDomain}/api/${apiVersion}/requests/${urlRequest}/${id}?acceptedRequest=${isAccepted}`;
    await axiosInstance.get(requestNotificationEndpoint);
  };

  const deleteNotification = async (notificationId) => {
    const removeNotificationEndpoint = `${apiDomain}/api/${apiVersion}/notifications/${notificationId}`;
    await axiosInstance.delete(removeNotificationEndpoint);
  }

  useEffect(() => {
    if(notificationSended.length === 0){
      setNotificationTable(true);
    }
  }, [notificationSended, setNotificationTable]);

  useEffect(() => {
    if(notificationReceived.length >= 1){
      const notifDelegateAdmin = notificationReceived.find(notif => notif.type === "request-admin" || notif.type === "need-switch-admin" || notif.type === "request-delegate-admin" || notif.type === "last-chance-request-delegate-admin");
      if(notifDelegateAdmin !== undefined){
        setNotificationDelegateAdmin(true);
      }else{
        setNotificationDelegateAdmin(false);
      }
    }
  }, [notificationReceived]);

  const notificationReceivedTypes = (type) => {
    switch (type) {
      case "information" :
        return "Information";
      case "need-switch-admin" :
        return "Délégation droits administrateurs";
      case "request-admin" :
        return "Délégation droits administrateurs";
      case "request-delegate-admin" :
          return "Délégation droits administrateurs";
      case "last-chance-request-delegate-admin" :
          return "Délégation droits administrateurs";
      case "invitation-household-to-user" :
        return "Invitation nouvelle famille";
      case "invitation-user-to-household" :
          return "Invitation nouveau membre";
  
      default:
        break;
    }
  }

  const notificationSendedTypes = (type) => {
    switch (type) {
      case "need-switch-admin" :
        return "Invitation nouveau membre";
      case "request-admin" :
        return "Délégation droits administrateurs";
      case "invitation-household-to-user" :
        return "Invitation nouveau membre";
      case "invitation-user-to-household" :
          return "Invitation nouvelle famille";
  
      default:
        break;
    }
  }

  let tableNotificationReceived = <>
    <>
      <div className="container-list-table list-table-profile">
        <table className="list-table">
          <thead className="thead-no-cursor">
            <tr>
              <th>Message</th>
              <th>Type</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {notificationReceived.map((notification, index) => {
              return (
                <tr key={`memberTable-${index}`}>
                  <td className="all-info">
                    {notification.message}
                  </td>
                  <td className="td-align-center">
                    {notificationReceivedTypes(notification.type)}
                  </td>
                  <td>
                    <div className="div-list-table-action">
                      {notification.type === "need-switch-admin" &&
                        <button title="Déléguer" type="button" className="list-table-action" onClick={switchToHouseholdOptions}><FontAwesomeIcon icon="random"/></button>
                      }
                      {(notification.type === "invitation-household-to-user" || notification.type === "invitation-user-to-household") &&
                        <button 
                        title={notificationDelegateAdmin ? "Veuillez accepter ou non la délégation de droits administrateurs avant de pouvoir effectuer cette action !" : "Accepter"}
                        type="button" 
                        className={notificationDelegateAdmin ? "list-table-action-disabled" : "list-table-action"}
                        disabled={notificationDelegateAdmin} 
                        onClick={() => notificationRequest(notification.urlRequest, notification._id, "yes")}>
                          <FontAwesomeIcon icon="check"/>
                        </button>
                      }
                      {(notification.type === "request-admin" || notification.type === "request-delegate-admin" || notification.type === "last-chance-request-delegate-admin")  &&
                       <button title="Accepter" type="button" className="list-table-action" onClick={() => notificationRequest(notification.urlRequest, notification._id, "yes")}><FontAwesomeIcon icon="check"/></button>
                      }
                      {(notification.type === "request-delegate-admin" || notification.type === "last-chance-request-delegate-admin") && otherMemberEligible ?
                        <button title="Déléguer" type="button" className="list-table-action" onClick={switchToHouseholdOptions}><FontAwesomeIcon icon="random"/></button> :
                        notification.type === "information" ? <button title="Supprimer la notification" type="button" className="list-table-one-action" onClick={()=>{deleteNotification(notification._id)}}><FontAwesomeIcon icon="trash"/></button> : <button title="Refuser" type="button" className="list-table-action" onClick={() => notificationRequest(notification.urlRequest, notification._id, "no")}><FontAwesomeIcon icon="times"/></button>
                      }
                    </div>
                  </td>
                </tr>  
              )
            })}
          </tbody>
        </table>
      </div>     
    </>
  </>;

  let tableNotificationSended = <>
    <div className="container-list-table list-table-profile">
      <table className="list-table">
        <thead className="thead-no-cursor">
          <tr>
            <th>Type</th>
            <th>Destinataire</th>
            <th>Annuler la notification</th>
          </tr>
        </thead>
        <tbody>
          {notificationSended.map((notification, index) => {
            return (
              <tr key={`memberTable-${index}`}>
                <td className="td-align-center">
                  {notificationSendedTypes(notification.type)}
                </td>
                <td className="td-align-center">
                  {notification.userId.firstname} {notification.userId.lastname}
                </td>
                <td>
                  <div className="div-list-table-action">
                    <button title="Annuler la notification" type="button" className="list-table-one-action" onClick={()=>{deleteNotification(notification._id)}}><FontAwesomeIcon icon="trash"/></button>
                  </div>
                </td>
              </tr>  
            )
          })}
        </tbody>
      </table>
    </div>     
  </>;

  const switchTableNotification = (tableName) => {
    if(tableName === "received"){
      if(notificationSended.length >= 1){
        btnSwitchReceivedNotif.current.classList.add("btn-switch-notification-active");
        btnSwitchReceivedNotif.current.classList.remove("btn-switch-notification-inactive");
        btnSwitchSendedNotif.current.classList.add("btn-switch-notification-inactive");
        btnSwitchSendedNotif.current.classList.remove("btn-switch-notification-active");
        setNotificationTable(true);
      }
    }else if (tableName === "sended"){
      if(notificationReceived.length >= 1){
        btnSwitchReceivedNotif.current.classList.add("btn-switch-notification-inactive");
        btnSwitchReceivedNotif.current.classList.remove("btn-switch-notification-active");
        btnSwitchSendedNotif.current.classList.add("btn-switch-notification-active");
        btnSwitchSendedNotif.current.classList.remove("btn-switch-notification-inactive");
        setNotificationTable(false);
      }
    }
  }

  return (
    <div className="option-component">
      <div className="container-btn-switch-notification-table">
        {notificationReceived.length >= 1 && <button ref={btnSwitchReceivedNotif} onClick={()=> switchTableNotification("received")}>Notif. reçues</button>}
        {notificationSended.length >= 1 && <button ref={btnSwitchSendedNotif} onClick={()=> switchTableNotification("sended")}>Notif. envoyées</button>}
      </div>
      {notificationReceived.length >= 1 && notificationSended.length === 0 && <>{tableNotificationReceived}</>}
      {notificationSended.length >= 1 && notificationReceived.length === 0 && <>{tableNotificationSended}</>}
      {notificationReceived.length >= 1 && notificationSended.length >= 1 && <>{notificationTable ? <>{tableNotificationReceived}</> : <>{tableNotificationSended}</>}</>}
      {notificationSended.length === 0 && notificationReceived.length === 0 && 
        <p>Pas de notification!</p>
      }
    </div>
  )
}

NotificationOptionProfile.propTypes = {
  switchToHouseholdOptions: PropTypes.func.isRequired,
  otherMemberEligible: PropTypes.bool.isRequired
}

export default NotificationOptionProfile
