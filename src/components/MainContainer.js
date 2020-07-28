import React, { memo } from 'react';
import { Route } from "react-router-dom";
import Home from './Home';
import ProductList from './ProductList';
import EditProduct from './EditProduct';
import Historic from './Historic';
import Profile from './Profile';
import Statistics from './Statistics';
import PropTypes from 'prop-types';

function MainContainer({ userData }) {
  return (
    <div>
      <Route exact path="/app" component={Home} />
      <Route path="/app/liste-produit" component={() => <ProductList userData={userData} />} />
      <Route path="/app/edition-produit/:id" component={EditProduct} />
      <Route path="/app/historique" component={Historic} />
      <Route path="/app/profil" component={Profile} />
      <Route path="/app/statistiques" component={Statistics} />
      {/* {location.pathname === "/app" && (
        <Home />
      )}
      {location.pathname === "/app/liste-produit" && (
        <ProductList
          userData={userData}
        />
      )}
      {matchPath(location.pathname, { path: '/app/edition-produit/:id' }) && (
        <EditProduct />
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
      )} */}
    </div>
  )
}

MainContainer.propTypes = {
  userData: PropTypes.object,
}

export default memo(MainContainer)

