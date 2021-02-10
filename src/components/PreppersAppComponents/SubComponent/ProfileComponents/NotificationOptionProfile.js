import React, { useRef, useEffect, useState } from 'react';
import { useNotificationData } from '../../DataContext';
import axiosInstance from '../../../../utils/axiosInstance';
import { apiDomain, apiVersion } from '../../../../apiConfig/ApiConfig';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function NotificationOptionProfile() {
  const { notificationReceived, setNotificationReceived, notificationSended } = useNotificationData();
  const [notificationTable, setNotificationTable] = useState(true);
  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    }
  }, []);

  const notificationRequest = async (id, isAccepted) => {
    const requestNotificationEndpoint = `${apiDomain}/api/${apiVersion}/requests/add-user-respond/${id}?acceptedRequest=${isAccepted}`;
    await axiosInstance.get(requestNotificationEndpoint)
      .then((response) => {
        if(isMounted.current){
          setNotificationReceived(response.data);
        }
      });
  };

  const notificationTypes = (type) => {
    switch (type) {
      case "information" :
        return "Information";
      case "need-switch-admin" :
        return "Délégation droits administrateurs";
      case "request-admin" :
        return "Délégation droits administrateurs";
      case "last-chance-request-admin" :
        return "Délégation droits administrateurs";
      case "request-addUser" :
        return "Invitation";
  
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
                    {notificationTypes(notification.type)}
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
                {notificationTypes(notification.type)}
              </td>
              <td className="td-align-center">
                {notification.userId.firstname} {notification.userId.lastname}
              </td>
              <td>
                <div className="div-list-table-action">
                  <button title="Annuler la notification" type="button" className="list-table-one-action" onClick={()=>{}}><FontAwesomeIcon icon="trash"/></button>
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

  return (
    <>
      <div className="default-title-container delimiter-title">
        <h1 className="default-h1">Listes des notifications reçues/envoyées</h1>
      </div>

      <div>
          <div>
            <h2 className="default-h2">Notifications</h2>
            <button onClick={()=> setNotificationTable(true)}>Notif reçues</button>
            <button onClick={()=> setNotificationTable(false)}>Notif envoyées</button>
            {notificationTable ? <>{tableNotificationReceived}</> : <><>{tableNotificationSended}</></>}
            
          </div>
      </div>
    </>

  )
}

export default NotificationOptionProfile
