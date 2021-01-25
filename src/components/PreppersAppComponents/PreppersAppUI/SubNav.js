import React, { useState, useEffect } from 'react';
import { useUserData, useNotificationData } from './../DataContext';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';

function SubNav({ showNotif, logOut }) {
  const { userData } = useUserData();
  const { notification } = useNotificationData();
  const [firstChar, setFirstChar] = useState("P"); //TODO download l'image si l'user a une image de profil???
  const [hasNotif, setHasNotif] = useState(false);
  const [arrayNotifLength, setArrayNotifLength] = useState(0);
  
  useEffect(() => {
    if (userData) {
      const userName = userData.firstname;
      setFirstChar(userName.charAt(0));
    }
    if (notification.length >= 1) {
      let arrayLength = notification.length;
      setArrayNotifLength(arrayLength);
      setHasNotif(true);
    }else{
      setHasNotif(false);
    }
  }, [userData, notification]);

  return (
    <div className="container-subnav">
      <div className="interaction-sub-menu">
        <div className="svg-icon info-notification" onClick={showNotif}>
          {hasNotif &&
            <div className="number-nofitication">{arrayNotifLength}</div>
          }
          <FontAwesomeIcon id="svg-bell" icon="bell" />
        </div>
        <Link className="user-profile-link" to="/app/profil">
          <span>{firstChar}</span>
        </Link>
        <div className="svg-icon svg-no-margin" onClick={logOut}>
          <FontAwesomeIcon id="svg-logout-sub-menu" icon="sign-out-alt" />
        </div>

      </div>
    </div>
  )
}

SubNav.propTypes = {
  showNotif: PropTypes.func.isRequired,
  logOut: PropTypes.func.isRequired
}

export default SubNav


