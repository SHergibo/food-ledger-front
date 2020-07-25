import React from 'react';
import { Route } from "react-router-dom";
import Home from './Home';
import ProductList from './ProductList';
import Historic from './Historic';
import Profile from './Profile';
import Statistics from './Statistics';
import PropTypes from 'prop-types';

function MainContainer({userData}) {
  return (
    <div>
      <Route exact path="/app" component={Home} />
      <Route path="/app/liste-produit" component={() => <ProductList userData={userData} />} /> 
      <Route path="/app/historique" component={Historic} />
      <Route path="/app/profil" component={() => <Profile userData={userData} />} />
      <Route path="/app/statistiques" component={Statistics} />
    </div>
  )
}

MainContainer.propTypes = {
  userData: PropTypes.object,
}

export default MainContainer

