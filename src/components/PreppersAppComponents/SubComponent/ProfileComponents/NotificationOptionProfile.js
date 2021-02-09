import React, { useRef, useEffect } from 'react';
import { useNotificationData } from '../../DataContext';
import axiosInstance from '../../../../utils/axiosInstance';
import { apiDomain, apiVersion } from '../../../../apiConfig/ApiConfig';

function NotificationOptionProfile() {
  const { notificationReceived, setNotificationReceived, notificationSended } = useNotificationData();
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

  return (
    <>
      {notificationReceived.length >= 1 &&
        <>
          <div className="default-title-container delimiter-title">
            <h1 className="default-h1">Listes des notifications reçues</h1>
          </div>
    
          <div>
              <div>
                <h2 className="default-h2">Notifications</h2>
                <ul>
                  {notificationReceived.map(item => {
                    return (
                      <li key={item._id}>
                        {item.message}
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
        {notificationSended.length >= 1 &&
        <>
          <div className="default-title-container delimiter-title">
            <h1 className="default-h1">Listes des notifications envoyées</h1>
          </div>
    
          <div>
            
              <div>
                <h2 className="default-h2">Notifications</h2>
                <ul>
                  {notificationSended.map(item => {
                    return (
                      <li key={item._id}>
                        {item.message}
                        <button onClick={()=> {}}>Supprimer</button>
                      </li>
                    )
                  })}
                </ul>
              </div>
          </div>
        </>
      }
    </>
  )
}

export default NotificationOptionProfile
