import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo';
import { useUserData, useUserOptionData, useNotificationData } from './../DataContext';
import axiosInstance from '../../../utils/axiosInstance';
import { apiDomain, apiVersion } from '../../../apiConfig/ApiConfig';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';

function Nav({ history, logOut }) {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const { userData } = useUserData();
  const { notificationReceived } = useNotificationData();
  const { userOptionData, setUserOptionData } = useUserOptionData();
  const [stateMainMenu, setStateMainMenu] = useState();
  const [closedMenu, setClosedMenu] = useState(false);
  const [hasNotif, setHasNotif] = useState(false);
  const [arrayNotifLength, setArrayNotifLength] = useState(0);
  const menuResp = useRef(null);
  const menu = useRef(null);
  const isMounted = useRef(true);

  const responsive = useCallback(() => {
    setWindowWidth(window.innerWidth);
  }, []);

  useEffect(() => {
    window.addEventListener('resize', responsive);
    return () => {
      window.removeEventListener('resize', responsive);
    }
  }, [responsive]);

  useEffect(() => {
    if(userOptionData){
      setStateMainMenu(userOptionData.openMenu);
      if(userOptionData.openMenu && windowWidth >= 992){
        menu.current.style.width = '15rem';
      }else{
        menu.current.style.removeProperty('width');
      }
    }
  }, [userOptionData, windowWidth]);
  
  useEffect(() => {
    if (notificationReceived.length >= 1) {
      let arrayLength = notificationReceived.length;
      setArrayNotifLength(arrayLength);
      setHasNotif(true);
    }else{
      setHasNotif(false);
    }
  }, [userData, notificationReceived]);

  const burgerMenu = () => {
    menuResp.current.classList.toggle('display-block');

    if(closedMenu){
      setClosedMenu(false);
    }else{
      setClosedMenu(true);
    }
  };

  const patchOptionData = async (data) => {
    const patchUserOptionDataEndPoint = `${apiDomain}/api/${apiVersion}/options/${userData._id}`;
    await axiosInstance.patch(patchUserOptionDataEndPoint, data)
      .then((response) => {
        if(isMounted.current){
          setUserOptionData(response.data);
        }
      });
  };

  const interactMenu = () => {
    if (stateMainMenu === false) {
      setStateMainMenu(true);
      patchOptionData({openMenu: true});
      menu.current.style.width = '15rem';
    } else {
      setStateMainMenu(false);
      patchOptionData({openMenu: false});
      menu.current.style.removeProperty('width');
    }
  };

  const goToNotification = () => {
    if(history.location.pathname === "/app/notification"){
      history.goBack();
    }else{
      history.push({
        pathname: '/app/notification',
      })
    }
  };

  return (
    <div ref={menu} className="main-menu">
      <div className="interact-menu">
        <div className="svg-icon" onClick={interactMenu}>
          <FontAwesomeIcon id="svg-menu" icon="bars" />
        </div>
        <Logo />
      </div>

      <nav ref={menuResp} className="menu">
        <ul onClick={burgerMenu}>
          <li>
            <Link to={{ pathname: '/app/liste-produit', search: sessionStorage.getItem('productQueryParamsFilter') }}>
              <div className="svg-icon">
                <FontAwesomeIcon id="svg-list" icon="list" />
              </div>
              <span>Liste Produit</span>
            </Link>
          </li>
          <li>
            <Link to={{ pathname: '/app/liste-historique', search: sessionStorage.getItem('historicQueryParamsFilter') }}>
              <div className="svg-icon">
                <FontAwesomeIcon id="svg-history" icon="history" />
              </div>
              <span>Historique</span>
            </Link>
          </li>
          <li>
            <Link to="/app/liste-de-course">
              <div className="svg-icon">
                <FontAwesomeIcon id="svg-shopping" icon="shopping-cart" />
              </div>
              <span>Liste course</span>
            </Link>
          </li>
          <li>
            <Link to="/app/statistiques">
              <div className="svg-icon">
                <FontAwesomeIcon id="svg-stat" icon="chart-pie" />
              </div>
              <span>Statistique</span>
            </Link>
          </li>
          {(userData && userData.role === "admin") &&
            <li>
              <Link to="/app/registre-produit">
                <div className="svg-icon">
                  <FontAwesomeIcon id="svg-stat" icon="clipboard-list" />
                </div>
                <span>Registre</span>
              </Link>
            </li>
          }
          <li>
            <Link to="/app/profil">
              <div className="svg-icon">
                <FontAwesomeIcon id="svg-user" icon="user" />
              </div>
              <span>Profil</span>
            </Link>
          </li>
          <li onClick={logOut}>
            <div className="div-logout">
              <div className="svg-icon" >
                <FontAwesomeIcon id="svg-logout" icon="sign-out-alt" />
              </div>
              <span>Déconnexion</span>
            </div>
          </li>
        </ul>
      </nav>
      {windowWidth < 640 &&
        <div className="svg-icon-responsive-container">
          <div className="svg-icon-responsive info-notification burger-menu-svg" onClick={goToNotification}>
            {hasNotif &&
              <div className="number-nofitication">{arrayNotifLength}</div>
            }
            <FontAwesomeIcon id="svg-notification" icon="bell" />
          </div>
          {!closedMenu ? 
            <div className="svg-icon-responsive" onClick={burgerMenu}>
              <FontAwesomeIcon id="svg-burger" icon="bars" />
            </div> :
            <div className="svg-icon-responsive" onClick={burgerMenu}>
              <FontAwesomeIcon id="svg-close" icon="times" />
            </div>
          }
        </div>
      }
      
    </div>
  )
}

Nav.propTypes = {
  logOut: PropTypes.func.isRequired,
}

export default Nav;
