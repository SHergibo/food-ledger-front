import React, { useState, useEffect } from 'react';
import { useUserData, useNotificationData } from './../DataContext';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';

function SubNav({ showNotif }) {
  const { userData } = useUserData();
  const { notificationReceived } = useNotificationData();
  const [firstChar, setFirstChar] = useState("P"); //TODO download l'image si l'user a une image de profil???
  const [hasNotif, setHasNotif] = useState(false);
  const [arrayNotifLength, setArrayNotifLength] = useState(0);
  
  useEffect(() => {
    if (userData) {
      const userName = userData.firstname;
      setFirstChar(userName.charAt(0));
    }
    if (notificationReceived.length >= 1) {
      let arrayLength = notificationReceived.length;
      setArrayNotifLength(arrayLength);
      setHasNotif(true);
    }else{
      setHasNotif(false);
    }
  }, [userData, notificationReceived]);

  return (
    <div className="container-subnav">
      <h1>Liste des produits</h1>
      <div className="interaction-sub-menu">
        <div className="svg-icon info-notification" onClick={showNotif}>
          {hasNotif &&
            <div className="number-nofitication">{arrayNotifLength}</div>
          }
          <div className="number-nofitication">5</div>
          <FontAwesomeIcon icon="bell" />
        </div>
        <Link className="user-profile-link" to="/app/profil">
          <span>{firstChar}</span>
        </Link>
      </div>
    </div>
  )
}

SubNav.propTypes = {
  showNotif: PropTypes.func.isRequired
}

export default SubNav


