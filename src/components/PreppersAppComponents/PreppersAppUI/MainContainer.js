import React, { memo } from 'react';
import { Route } from "react-router-dom";
import HasHousehold from '../../Route/HasHousehold.route';
import ProductList from './../SubComponent/ProductList';
import EditProduct from './../ProductHistoricComponents/EditProduct';
import AddProduct from './../ProductHistoricComponents/AddProduct';
import HistoricList from './../SubComponent/HistoricList';
import Profile from './../SubComponent/Profile';
import Statistics from './../SubComponent/Statistics';
import ProductLog from './../SubComponent/ProductLog';
import ShoppingList from './../SubComponent/ShoppingList';
import SubContainer from './../PreppersAppUI/SubContainer'

function MainContainer() {
  return (
    <>
      <HasHousehold exact path="/app/liste-produit" component={ProductList} />
      <HasHousehold path="/app/edition-produit/:id" component={EditProduct} />
      <HasHousehold path="/app/ajout-produit" component={AddProduct} />
      <HasHousehold path="/app/liste-historique" component={HistoricList} />
      <HasHousehold path="/app/edition-historique/:id" component={EditProduct} />
      <HasHousehold path="/app/ajout-historique" component={AddProduct} />
      <Route path="/app/profil" component={Profile} />
      <HasHousehold path="/app/statistiques" component={Statistics} />
      <HasHousehold path="/app/registre-produit" component={ProductLog} />
      <HasHousehold path="/app/liste-de-course" component={ShoppingList} />
      <Route path="/app/notification" component={SubContainer} />
    </>
  )
}

export default memo(MainContainer)
