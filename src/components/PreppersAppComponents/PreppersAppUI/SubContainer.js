import React from 'react';
import { useNotificationData } from './../DataContext';
import axiosInstance from '../../../utils/axiosInstance';
import { apiDomain, apiVersion } from '../../../apiConfig/ApiConfig';

function SubContainer() {
  const { notification, setNotification } = useNotificationData();
  console.log(notification)

  const interactionNotification = async (urlRequest, id, accepted) => {
    const requestNotificationEndPoint = `${apiDomain}/api/${apiVersion}/requests/${urlRequest}/${id}?acceptedRequest=${accepted}`;
    await axiosInstance.get(requestNotificationEndPoint)
      .then((response) => {
        setNotification(response.data);
      });
  };
  return (
    <div className="container-sub">
    {notification.map((notif) => {
      return(
        <div className="notification" key={notif._id}>
          <div className="notification-message">
            {notif.message}
          </div>
          <div className="notification-interaction">
            <button onClick={()=>interactionNotification(notif.urlRequest, notif._id, "yes")}>Accepter</button>
            <button onClick={()=>interactionNotification(notif.urlRequest, notif._id, "no")}>Refuser</button>
          </div>
        </div>
      )
    })}
    </div>
  )
}

export default SubContainer
