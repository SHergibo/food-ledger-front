import React, {useEffect, useState, useCallback} from 'react';
import { withRouter } from "react-router-dom";
import { useNotificationData } from './../DataContext';
import axiosInstance from '../../../utils/axiosInstance';
import { apiDomain, apiVersion } from '../../../apiConfig/ApiConfig';

function SubContainer({history}) {
  const { notification, setNotification } = useNotificationData();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const responsive = useCallback(() => {
    setWindowWidth(window.innerWidth);
  }, []);

  useEffect(() => {
    window.addEventListener('resize', responsive);
    return () => {
      window.removeEventListener('resize', responsive);
    }
  }, [responsive]);

  //TODO créer une route comme protected.route pour gérer la route notification hors responsive mobile
  useEffect(() => {
      if(windowWidth > 640 && history.location.pathname === "/app/notification" && history.length <= 2){
        history.push({
          pathname: '/app/liste-produit',
        })
      }else if (windowWidth > 640 && history.location.pathname === "/app/notification" && history.length > 2){
        history.goBack();
      }
  }, [windowWidth, history]);

  const interactionNotification = async (urlRequest, id, accepted) => {
    const requestNotificationEndPoint = `${apiDomain}/api/${apiVersion}/requests/${urlRequest}/${id}?acceptedRequest=${accepted}`;
    await axiosInstance.get(requestNotificationEndPoint)
      .then((response) => {
        setNotification(response.data);
      });
  };
  return (
    <div className="container-sub">
      {notification.length <= 0 ?
        <p className="zero-notification">Pas de notification !</p> :
        <>
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
      </>
      }
    </div>
  )
}

export default withRouter(SubContainer)
