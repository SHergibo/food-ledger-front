import React, { memo } from 'react';
import { Route } from "react-router-dom";
import Home from './../SubComponent/Home';
import ProductList from './../SubComponent/ProductList';
import EditProduct from './../ProductHistoricComponents/EditProduct';
import AddProduct from './../ProductHistoricComponents/AddProduct';
import HistoricList from './../SubComponent/HistoricList';
import Profile from './../SubComponent/Profile';
import Statistics from './../SubComponent/Statistics';
import PropTypes from 'prop-types';

function MainContainer({ userData }) {
  return (
    <div>
      <Route exact path="/app" component={Home} />
      <Route path="/app/liste-produit" component={() => <ProductList userData={userData} />} />
      <Route path="/app/edition-produit/:id" component={() => <EditProduct userData={userData} />} />
      <Route path="/app/ajout-produit" component={() => <AddProduct userData={userData} />} />
      <Route path="/app/liste-historique" component={() => <HistoricList userData={userData} />} />
      <Route path="/app/edition-historique/:id" component={() => <EditProduct userData={userData} />} />
      <Route path="/app/ajout-historique" component={() => <AddProduct userData={userData} />} />
      <Route path="/app/profil" component={Profile} />
      <Route path="/app/statistiques" component={Statistics} />
    </div>
  )
}

MainContainer.propTypes = {
  userData: PropTypes.object,
}

export default memo(MainContainer)

