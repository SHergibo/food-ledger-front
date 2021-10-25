import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useUserData, useNotificationData } from './../DataContext';
import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';

function SubNav({ showNotif, optionSubTitle }) {
  const location = useLocation();
  const { userData } = useUserData();
  const { notificationReceived } = useNotificationData();
  const [firstChar, setFirstChar] = useState("P"); //TODO download l'image si l'user a une image de profil???
  const [hasNotif, setHasNotif] = useState(false);
  const [subTitle, setSubTitle] = useState("");
  const [arrayNotifLength, setArrayNotifLength] = useState(0);
  const subNavContainerRef = useRef(null);

  let pathNameArray = useMemo(() => {
    return {
      "liste-produit" : "Liste des produits",
      "ajout-produit" : "Ajouter un produit",
      "edition-produit" : "Édition produit",
      "liste-historique" : "Liste des historiques",
      "ajout-historique" : "Ajouter un historique",
      "edition-historique" : "Édition historique",
      "liste-de-course" : "Liste de courses",
      "statistiques" : "Statistiques des stocks",
      "registre-produit" : "Registre des produits",
      "options" : "Options / ",
      "edition-marque" : "Édition marque",
    }
  }, []);

  useEffect(() => {
    let pathName  = location.pathname.split("/")[2];
    setSubTitle(pathNameArray[pathName]);
  }, [location, pathNameArray])
  
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

  const interactNotif = () => {
    showNotif();
    subNavContainerRef.current.classList.toggle('border-menu-open-subnav');
  }

  return (
    <div ref={subNavContainerRef} className="container-subnav">
    {location.pathname.split("/")[2] === "options" ?
      <h1>{subTitle}{optionSubTitle}</h1> : 
      <h1>{subTitle}</h1> 
    }
      <div className="interaction-sub-menu">
        <button className="svg-icon info-notification" onClick={interactNotif}>
          {hasNotif &&
            <div className="number-nofitication">{arrayNotifLength}</div>
          }
          <FontAwesomeIcon icon="bell" />
        </button>
        <Link className="user-profile-link" to="/app/options">
          <span>{firstChar}</span>
        </Link>
      </div>
    </div>
  )
}

SubNav.propTypes = {
  showNotif: PropTypes.func.isRequired,
  optionSubTitle: PropTypes.string.isRequired
}

export default SubNav


