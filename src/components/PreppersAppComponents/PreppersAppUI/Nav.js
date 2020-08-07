import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faList, faHistory, faSignOutAlt, faUser, faChartPie, faBars } from '@fortawesome/free-solid-svg-icons';
import PropTypes from 'prop-types';

function Nav({ logOut }) {
  const [stateMainMenu, setStateMainMenu] = useState(false); //TODO recupérer depuis les options user dans le back

  const burgerMenu = () => {
    let menuResp = document.getElementsByClassName('menu')[0];
    let burgerSvg = document.getElementById('burger-svg');
    let deleteSvg = document.getElementById('delete-svg');
    menuResp.classList.toggle('display-block');

    if (burgerSvg.classList.contains('display-svg-menu')) {
      burgerSvg.classList.remove('display-svg-menu');
      deleteSvg.classList.add('display-svg-menu');
    } else {
      burgerSvg.classList.add('display-svg-menu');
      deleteSvg.classList.remove('display-svg-menu');
    }
  };
  
  const interactMenu = () => {
    //TODO enregistrer l'état du menu dans les options de l'utilisateur dans le back
    let menu = document.getElementsByClassName('main-menu')[0];
    if (stateMainMenu === false) {
      setStateMainMenu(true)
      menu.style.width = '15rem';
    } else {
      setStateMainMenu(false)
      menu.style.removeProperty('width');
    }

  };

  return (
    <div className="main-menu">
      <div className="interact-menu">
        <div className="svg-icon" onClick={interactMenu}>
          <FontAwesomeIcon id="svg-menu" icon={faBars} />
        </div>
        <Logo />
      </div>


      <nav className="menu">
        <ul onClick={burgerMenu}>
          <li>
            <Link to="/app">
              <div className="svg-icon">
                <FontAwesomeIcon id="svg-home" icon={faHome} />
              </div>
              <span>Accueil</span>
            </Link>
          </li>
          <li>
            <Link to="/app/liste-produit">
              <div className="svg-icon">
                <FontAwesomeIcon id="svg-list" icon={faList} />
              </div>
              <span>Liste Produit</span>
            </Link>
          </li>
          <li>
            <Link to="/app/liste-historique">
              <div className="svg-icon">
                <FontAwesomeIcon id="svg-history" icon={faHistory} />
              </div>
              <span>Historique</span>
            </Link>
          </li>
          <li>
            <Link to="/app/profil">
              <div className="svg-icon">
                <FontAwesomeIcon id="svg-user" icon={faUser} />
              </div>
              <span>Profil</span>
            </Link>
          </li>
          <li>
            <Link to="/app/statistiques">
              <div className="svg-icon">
                <FontAwesomeIcon id="svg-stat" icon={faChartPie} />
              </div>
              <span>Statistique</span>
            </Link>
          </li>
          <li onClick={logOut}>
            <div className="div-logout">
              <div className="svg-icon" >
                <FontAwesomeIcon id="svg-logout" icon={faSignOutAlt} />
              </div>
              <span>Déconnexion</span>
            </div>
          </li>
        </ul>
      </nav>
      <div id="burger-svg" className="svg-icon-responsive burger-menu-svg" onClick={burgerMenu}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" aria-labelledby="title" //TODO changer le svg avec fontAwesome
          aria-describedby="desc" role="img" xmlnsXlink="http://www.w3.org/1999/xlink">
          <path data-name="layer2"
            fill="#202020" d="M2 8h60v8H2zm0 20h60v8H2z"></path>
          <path data-name="layer1" fill="#202020" d="M2 48h60v8H2z"></path>
        </svg>
      </div>
      <div id="delete-svg" className="svg-icon-responsive burger-menu-svg display-svg-menu" onClick={burgerMenu}>
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
