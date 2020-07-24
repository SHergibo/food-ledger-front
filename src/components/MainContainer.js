import React from 'react';
import { Route } from "react-router-dom";
import Home from './Home';
import ProductList from './ProductList';
import Historic from './Historic';
import Profile from './profile';
import Statistics from './Statistics';

function MainContainer() {
  return (
    <div>
      <Route exact path="/app" component={Home} />
      <Route path="/app/liste-produit" component={ProductList} />
      <Route path="/app/historique" component={Historic} />
      <Route path="/app/profil" component={Profile} />
      <Route path="/app/statistiques" component={Statistics} />
    </div>
  )
}

export default MainContainer

