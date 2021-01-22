import React from 'react';
import { useNotificationData } from './../DataContext';

function SubContainer() {
  const { notification } = useNotificationData();
  
  return (
    <div className="container-sub">
    {notification.map((notif) => {
      return(
        <div className="notification" key={notif._id}>
          <div className="notification-message">
            {notif.message}
          </div>
          <div className="notification-interaction">
            <button>Accepter</button>
            <button>Refuser</button>
          </div>
        </div>
      )
    })}
    </div>
  )
}

export default SubContainer
