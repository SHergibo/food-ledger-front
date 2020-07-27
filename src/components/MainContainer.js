import React from 'react';
import { useLocation } from "react-router-dom";
import Home from './Home';
import ProductList from './ProductList';
import Historic from './Historic';
import Profile from './Profile';
import Statistics from './Statistics';
import PropTypes from 'prop-types';

function MainContainer({ userData }) {
  const location = useLocation();
  return (
    <div>
      {location.pathname === "/app" && (
        <Home />
      )}
      {location.pathname === "/app/liste-produit" && (
        <ProductList
          userData={userData}
        />
      )}
      {location.pathname === "/app/historique" && (
        <Historic />
      )}
      {location.pathname === "/app/profil" && (
        <Profile
          userData={userData}
        />
      )}
      {location.pathname === "/app/statistiques" && (
        <Statistics />
      )}
    </div>
  )
}

MainContainer.propTypes = {
  userData: PropTypes.object,
}

export default MainContainer

