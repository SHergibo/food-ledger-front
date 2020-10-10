import React, { memo } from 'react';
import { Route } from "react-router-dom";
import Home from './../SubComponent/Home';
import ProductList from './../SubComponent/ProductList';
import EditProduct from './../ProductHistoricComponents/EditProduct';
import AddProduct from './../ProductHistoricComponents/AddProduct';
import HistoricList from './../SubComponent/HistoricList';
import Profile from './../SubComponent/Profile';
import Statistics from './../SubComponent/Statistics';
import ProductLog from './../SubComponent/ProductLog';

function MainContainer() {
  return (
    <>
      <Route exact path="/app" component={Home} />
      <Route path="/app/liste-produit" component={ProductList} />
      <Route path="/app/edition-produit/:id" component={EditProduct} />
      <Route path="/app/ajout-produit" component={AddProduct} />
      <Route path="/app/liste-historique" component={HistoricList} />
      <Route path="/app/edition-historique/:id" component={EditProduct} />
      <Route path="/app/ajout-historique" component={AddProduct} />
      <Route path="/app/profil" component={Profile} />
      <Route path="/app/statistiques" component={Statistics} />
      <Route path="/app/registre-produit" component={ProductLog} />
    </>
  )
}

export default memo(MainContainer)
