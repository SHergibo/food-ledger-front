import React, { Fragment } from 'react';
import axiosInstance from '../../../utils/axiosInstance';
import { apiDomain, apiVersion } from '../../../apiConfig/ApiConfig';
import AddEditProductForm from './AddEditProductForm';

function AddProduct() {

  const addProduct = async (data) =>{
    const postProductDataEndPoint = `${apiDomain}/api/${apiVersion}/products`;
    await axiosInstance.post(postProductDataEndPoint, data)
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

export default AddProduct
