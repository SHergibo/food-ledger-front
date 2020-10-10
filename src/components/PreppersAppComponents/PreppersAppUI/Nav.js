import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo';
import { useUserData, useUserOptionData } from './../DataContext';
import axiosInstance from '../../../utils/axiosInstance';
import { apiDomain, apiVersion } from '../../../apiConfig/ApiConfig';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';

function Nav({ logOut }) {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const { userData } = useUserData();
  const { userOptionData, setUserOptionData } = useUserOptionData();
  const [stateMainMenu, setStateMainMenu] = useState();
  const menuResp = useRef(null);
  const burgerSvg = useRef(null);
  const deleteSvg = useRef(null);
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
  }, [userOptionData, windowWidth])

  const burgerMenu = () => {
    menuResp.current.classList.toggle('display-block');

    if (burgerSvg.current.classList.contains('display-svg-menu')) {
      burgerSvg.current.classList.remove('display-svg-menu');
      deleteSvg.current.classList.add('display-svg-menu');
    } else {
      burgerSvg.current.classList.add('display-svg-menu');
      deleteSvg.current.classList.remove('display-svg-menu');
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
  }

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
            <Link to="/app">
              <div className="svg-icon">
                <FontAwesomeIcon id="svg-home" icon="home"/>
              </div>
              <span>Accueil</span>
            </Link>
          </li>
          <li>
            <Link to="/app/liste-produit">
              <div className="svg-icon">
                <FontAwesomeIcon id="svg-list" icon="list" />
              </div>
              <span>Liste Produit</span>
            </Link>
          </li>
          <li>
            <Link to="/app/liste-historique">
              <div className="svg-icon">
                <FontAwesomeIcon id="svg-history" icon="history" />
              </div>
              <span>Historique</span>
            </Link>
          </li>
          <li>
            <Link to="/app/profil">
              <div className="svg-icon">
                <FontAwesomeIcon id="svg-user" icon="user" />
              </div>
              <span>Profil</span>
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
                <span>registre</span>
              </Link>
            </li>
          }
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
      <div ref={burgerSvg} id="burger-svg" className="svg-icon-responsive burger-menu-svg" onClick={burgerMenu}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" aria-labelledby="title" //TODO changer le svg avec fontAwesome
          aria-describedby="desc" role="img" xmlnsXlink="http://www.w3.org/1999/xlink">
          <path data-name="layer2"
            fill="#202020" d="M2 8h60v8H2zm0 20h60v8H2z"></path>
          <path data-name="layer1" fill="#202020" d="M2 48h60v8H2z"></path>
        </svg>
      </div>
      <div ref={deleteSvg} id="delete-svg" className="svg-icon-responsive burger-menu-svg display-svg-menu" onClick={burgerMenu}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" aria-labelledby="title" //TODO changer le svg avec fontAwesome
          aria-describedby="desc" role="img" xmlnsXlink="http://www.w3.org/1999/xlink">
          <path data-name="layer1"
            fill="#202020" d="M51 17.25L46.75 13 32 27.75 17.25 13 13 17.25 27.75 32 13 46.75 17.25 51 32 36.25 46.75 51 51 46.75 36.25 32 51 17.25z"></path>
        </svg>
      </div>
    </div>
  )
}

Nav.propTypes = {
  logOut: PropTypes.func.isRequired,
}

export default Nav;
