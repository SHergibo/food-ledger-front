import React, { useRef, useEffect, useState } from 'react';
import { useNotificationData } from '../../DataContext';
import axiosInstance from '../../../../utils/axiosInstance';
import { apiDomain, apiVersion } from '../../../../apiConfig/ApiConfig';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function NotificationOptionProfile() {
  const { notificationReceived, setNotificationReceived, notificationSended, setNotificationSended } = useNotificationData();
  const [notificationTable, setNotificationTable] = useState(true);
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
    }
  }, [notificationReceived, notificationSended]);

  const notificationRequest = async (id, isAccepted) => {
    const requestNotificationEndpoint = `${apiDomain}/api/${apiVersion}/requests/add-user-respond/${id}?acceptedRequest=${isAccepted}`;
    await axiosInstance.get(requestNotificationEndpoint)
      .then((response) => {
        if(isMounted.current){
          setNotificationReceived(response.data);
        }
      });
  };

  const deleteNotification = async (notificationId) => {
    const removeNotificationEndpoint = `${apiDomain}/api/${apiVersion}/notifications/${notificationId}`;
    await axiosInstance.delete(removeNotificationEndpoint)
      .then((response) => {
        if(isMounted.current){
          setNotificationSended(notificationSended => notificationSended.filter((notif) => notif._id !== response.data._id));
        }
      });
  }

  useEffect(() => {
    if(notificationSended.length === 0){
      setNotificationTable(true);
    }
  }, [notificationSended, setNotificationTable]);

  const notificationReceivedTypes = (type) => {
    switch (type) {
      case "information" :
        return "Information";
      case "need-switch-admin" :
        return "Délégation droits administrateurs";
      case "request-admin" :
        return "Délégation droits administrateurs";
      case "last-chance-request-admin" :
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
      case "information" :
        return "Information";
      case "need-switch-admin" :
        return "Délégation droits administrateurs";
      case "request-admin" :
        return "Délégation droits administrateurs";
      case "last-chance-request-admin" :
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
                      <button title="Accepter" type="button" className="list-table-action" onClick={() => notificationRequest(notification._id, "yes")}><FontAwesomeIcon icon="check"/></button>
                      <button title="Refuser" type="button" className="list-table-action" onClick={() => notificationRequest(notification._id, "no")}><FontAwesomeIcon icon="trash"/></button>
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
  <>
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
  </>
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
    <>
      <div className="default-title-container delimiter-title">
        <h1 className="default-h1">Listes des notifications reçues/envoyées</h1>
      </div>

      <div>
        <>
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
        </>
      </div>
    </>

  )
}

export default NotificationOptionProfile
