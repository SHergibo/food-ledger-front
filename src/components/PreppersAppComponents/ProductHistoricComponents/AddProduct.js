import React, { Fragment, useState, useEffect } from 'react';
import { useLocation, withRouter } from "react-router-dom";
import axiosInstance from '../../../utils/axiosInstance';
import { apiDomain, apiVersion } from '../../../apiConfig/ApiConfig';
import AddEditProductForm from './AddEditProductForm';
import PropTypes from 'prop-types';

function AddProduct({ userData, history }) {
  const location = useLocation();
  const [arrayExpDate, setArrayExpDate] = useState([]);
  const [success, setSuccess] = useState(false);
  let requestUrl = location.pathname.split('/')[2].split('-')[1] === "produit" ? "products" : "historics";

  useEffect(() => {
    let timerSuccess;
    if(success){
      timerSuccess = setTimeout(() => {
        setSuccess(false);
      }, 5000);
    }

    return () => {
      clearTimeout(timerSuccess);
    }
  }, [success]);


  const addProduct = async (data) => {
    if(requestUrl === "products" && arrayExpDate.length === 0) return;

    if (arrayExpDate.length >= 1) {
      data.expirationDate = arrayExpDate
    }

    data.brand = data.brand.value;
    data.type = data.type.value;

    let totalNumber = 0;
    arrayExpDate.forEach(item => {
      totalNumber = totalNumber + item.productLinkedToExpDate;
    });

    data.number = totalNumber;

    const postDataEndPoint = `${apiDomain}/api/${apiVersion}/${requestUrl}`;
    await axiosInstance.post(postDataEndPoint, data)
      .then((response) => {
        if(response.status === 200){
          setSuccess(true);
        }
      });
  }

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
        success={success}
      />
    </Fragment>
  )
}

AddProduct.propTypes = {
  userData: PropTypes.object,
  history: PropTypes.object.isRequired
}

export default withRouter(AddProduct);
