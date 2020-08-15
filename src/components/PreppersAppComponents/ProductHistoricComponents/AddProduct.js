import React, { Fragment, useState } from 'react';
import { useLocation, withRouter } from "react-router-dom";
import axiosInstance from '../../../utils/axiosInstance';
import { apiDomain, apiVersion } from '../../../apiConfig/ApiConfig';
import AddEditProductForm from './AddEditProductForm';

function AddProduct() {
  const location = useLocation();
  const [arrayExpDate, setArrayExpData] = useState([]);
  let requestUrl = location.pathname.split('/')[2].split('-')[1] === "produit" ? "products" : "historics";

  const addProduct = async (data) =>{
    if(!data.number){
      data.number = 0;
    }
    if(arrayExpDate.length >= 1){
      data.expirationDate = arrayExpDate
    }

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
        arrayExpDate={arrayExpDate}
        setArrayExpData={setArrayExpData}
        requestUrl={requestUrl}
      />
    </Fragment>
  )
}

export default withRouter(AddProduct);
