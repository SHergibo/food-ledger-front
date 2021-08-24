import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from "./../../../images/foodledger_logo.png";
import { useUserData, useUserOptionData, useNotificationData, useWindowWidth } from './../DataContext';
import axiosInstance from '../../../utils/axiosInstance';
import { apiDomain, apiVersion } from '../../../apiConfig/ApiConfig';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';

function Nav({ history, logOut, showNotif, showNotification }) {
  const location = useLocation();
  const { userData } = useUserData();
  const { notificationReceived } = useNotificationData();
  const { windowWidth } = useWindowWidth();
  const { userOptionData, setUserOptionData } = useUserOptionData();
  const [stateMainMenu, setStateMainMenu] = useState();
  const [closedMenu, setClosedMenu] = useState(false);
  const [hasNotif, setHasNotif] = useState(false);
  const [arrayNotifLength, setArrayNotifLength] = useState(0);
  const menuResp = useRef(null);
  const menu = useRef(null);
  const isMounted = useRef(true);

  useEffect(() => {
    if(location.pathname.split("/")[2] === "notification"){
      menu.current.classList.add('border-menu-open')
    }else{
      if(!menuResp.current.classList.contains('display-block')){
        menu.current.classList.remove('border-menu-open')
      }
    }
  }, [location])

  useEffect(() => {
    if(userOptionData){
      setStateMainMenu(userOptionData.openMenu);
      if(userOptionData.openMenu && windowWidth >= 992){
        menu.current.classList.add('main-menu-open');
      }else{
        menu.current.classList.remove('main-menu-open');
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
    if(showNotification && windowWidth >= 768){
      showNotif();
      menu.current.classList.toggle('border-menu-open');
    }
    menuResp.current.classList.toggle('display-block');
    if(location.pathname.split("/")[2] !== "notification") menu.current.classList.toggle('border-menu-open');
    
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
      menu.current.classList.remove('main-menu-open');
    } else {
      setStateMainMenu(false);
      patchOptionData({openMenu: false});
      menu.current.classList.add('main-menu-open');
    }
  };

  const interactNotif = () => {
    showNotif();
    if(menuResp.current.classList.contains('display-block')) menuResp.current.classList.remove('display-block');
    setClosedMenu(false);
    if(showNotification){
      if(menu.current.classList.contains('border-menu-open')) menu.current.classList.remove('border-menu-open');
    }else{
      if(!menu.current.classList.contains('border-menu-open')) menu.current.classList.add('border-menu-open');
    }
  }

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
          <FontAwesomeIcon icon={userOptionData?.openMenu ? "angle-left" : "angle-right"} />
        </div>
        <Link to={{ pathname: '/app/liste-produit', search: sessionStorage.getItem('productQueryParamsFilter') }}>
          <img src={logo} alt="food ledger app logo"/>
        </Link>
      </div>

      <nav ref={menuResp} className="menu">
        <ul onClick={burgerMenu}>
          <li>
            <Link to={{ pathname: '/app/liste-produit', search: sessionStorage.getItem('productQueryParamsFilter') }}>
              <div className="svg-menu">
                <FontAwesomeIcon icon="list" />
              </div>
              <span>Liste des Produits</span>
            </Link>
          </li>
          <li>
            <Link to={{ pathname: '/app/liste-historique', search: sessionStorage.getItem('historicQueryParamsFilter') }}>
              <div className="svg-menu">
                <FontAwesomeIcon icon="history" />
              </div>
              <span>Historique</span>
            </Link>
          </li>
          <li>
            <Link to="/app/liste-de-course">
              <div className="svg-menu">
                <FontAwesomeIcon icon="shopping-cart" />
              </div>
              <span>Liste de courses</span>
            </Link>
          </li>
          <li>
            <Link to="/app/statistiques">
              <div className="svg-menu">
                <FontAwesomeIcon icon="chart-pie" />
              </div>
              <span>Statistique</span>
            </Link>
          </li>
          {(userData && userData.role === "admin") &&
            <li>
              <Link to="/app/registre-produit">
                <div className="svg-menu">
                  <FontAwesomeIcon icon="clipboard-list" />
                </div>
                <span>Registre</span>
              </Link>
            </li>
          }
          <li>
            <Link to="/app/options">
              <div className="svg-menu">
                <FontAwesomeIcon icon="cog" />
              </div>
              <span>Options</span>
            </Link>
          </li>
          <li onClick={logOut}>
            <div className="div-logout">
              <div className="svg-menu" >
                <FontAwesomeIcon icon="sign-out-alt" />
              </div>
              <span>Déconnexion</span>
            </div>
          </li>
        </ul>
      </nav>
      {windowWidth < 992 &&
        <div className="svg-icon-responsive-container">
          <div className="svg-icon-responsive info-notification" onClick={windowWidth >= 768 ? interactNotif : goToNotification}>
            {hasNotif &&
              <div className="number-nofitication">{arrayNotifLength}</div>
            }
            <FontAwesomeIcon icon="bell" />
          </div>
          {!closedMenu ? 
            <div className="svg-icon-responsive" onClick={burgerMenu}>
              <FontAwesomeIcon icon="bars" />
            </div> :
            <div className="svg-icon-responsive" onClick={burgerMenu}>
              <FontAwesomeIcon id="svg-responsive-times" icon="times" />
            </div>
          }
        </div>
      }
    </div>
  )
}

Nav.propTypes = {
  history: PropTypes.object.isRequired,
  logOut: PropTypes.func.isRequired,
  showNotif: PropTypes.func.isRequired,
  showNotification: PropTypes.bool.isRequired,
}

export default Nav;
