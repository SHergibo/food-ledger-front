import React from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo';
import PropTypes from 'prop-types';

function Nav({ logOut }) {

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

  return (
    <div className="main-menu">
      <Logo />
      
      <nav className="menu">
        <ul onClick={burgerMenu}>
          <li>
            <Link to="/app">Accueil</Link>
          </li>
          <li>
            <Link to="/app/liste-produit">Liste Produit</Link>
          </li>
          <li>
            <Link to="/app/historique">Historique</Link>
          </li>
          <li>
            <Link to="/app/options">Options</Link>
          </li>
          <li>
            <Link to="/app/statistiques">Statistique</Link>
          </li>
          <li>
            <Link onClick={logOut}>Logout</Link>
          </li>
        </ul>
      </nav>
      <div id="burger-svg" className="burger-menu-svg" onClick={burgerMenu}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" aria-labelledby="title"
          aria-describedby="desc" role="img" xmlnsXlink="http://www.w3.org/1999/xlink">
          <path data-name="layer2"
            fill="#202020" d="M2 8h60v8H2zm0 20h60v8H2z"></path>
          <path data-name="layer1" fill="#202020" d="M2 48h60v8H2z"></path>
        </svg>
      </div>
      <div id="delete-svg" className="burger-menu-svg display-svg-menu" onClick={burgerMenu}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" aria-labelledby="title"
          aria-describedby="desc" role="img" xmlnsXlink="http://www.w3.org/1999/xlink">
          <path data-name="layer1"
            fill="#202020" d="M51 17.25L46.75 13 32 27.75 17.25 13 13 17.25 27.75 32 13 46.75 17.25 51 32 36.25 46.75 51 51 46.75 36.25 32 51 17.25z"></path>
        </svg>
      </div>
    </div>
  )
}

Nav.propTypes = {
  logOut : PropTypes.func.isRequired,
}

export default Nav;
