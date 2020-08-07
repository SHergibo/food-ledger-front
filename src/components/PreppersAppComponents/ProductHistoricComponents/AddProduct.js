import React, { Fragment } from 'react';
import { useLocation, withRouter } from "react-router-dom";
import axiosInstance from '../../../utils/axiosInstance';
import { apiDomain, apiVersion } from '../../../apiConfig/ApiConfig';
import AddEditProductForm from './AddEditProductForm';

function AddProduct() {
  const location = useLocation();
  let requestUrl = location.pathname.split('/')[2].split('-')[1] === "produit" ? "products" : "historics";

  const addProduct = async (data) =>{
    const postDataEndPoint = `${apiDomain}/api/${apiVersion}/${requestUrl}`;
    await axiosInstance.post(postDataEndPoint, data)
      .then((response) => {
        console.log(response.data);
      });
  }

  //TODO ajout btn pour revenir à la page suivante (utiliser history??)

  return (
    <Fragment>
      <AddEditProductForm
        handleFunction={addProduct}
        formType="add"
      />
    </Fragment>
  )
}

export default withRouter(AddProduct);
