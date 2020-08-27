import React, { Fragment, useState } from 'react';
import { useLocation, withRouter } from "react-router-dom";
import axiosInstance from '../../../utils/axiosInstance';
import { apiDomain, apiVersion } from '../../../apiConfig/ApiConfig';
import AddEditProductForm from './AddEditProductForm';
import PropTypes from 'prop-types';

function AddProduct({ userData, history }) {
  const location = useLocation();
  const [arrayExpDate, setArrayExpDate] = useState([]);
  let requestUrl = location.pathname.split('/')[2].split('-')[1] === "produit" ? "products" : "historics";

  const addProduct = async (data) => {
    
    if (!data.number) {
      data.number = 0;
    }
    if (arrayExpDate.length >= 1) {
      data.expirationDate = arrayExpDate
    }

    data.brand = data.brand.value;
    data.type = data.type.value;

    const postDataEndPoint = `${apiDomain}/api/${apiVersion}/${requestUrl}`;
    await axiosInstance.post(postDataEndPoint, data)
      .then((response) => {
        //TODO faire un message de succes + refresh form
      });
  }

  //TODO ajout btn pour revenir à la page suivante (utiliser history??)

  return (
    <Fragment>
      <AddEditProductForm
        userData={userData}
        history={history}
        handleFunction={addProduct}
        formType="add"
        arrayExpDate={arrayExpDate}
        setArrayExpDate={setArrayExpDate}
        requestUrl={requestUrl}
      />
    </Fragment>
  )
}

AddProduct.propTypes = {
  userData: PropTypes.object,
  history: PropTypes.object.isRequired
}

export default withRouter(AddProduct);
