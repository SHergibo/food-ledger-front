import React, { useEffect, useCallback, useState, Fragment, useRef } from 'react';
import { useLocation, withRouter } from "react-router-dom";
import axiosInstance from '../../../utils/axiosInstance';
import { apiDomain, apiVersion } from '../../../apiConfig/ApiConfig';
import AddEditProductForm from './AddEditProductForm';
import PropTypes from 'prop-types';

function EditProduct({ userData, history }) {
  const isMounted = useRef(true);
  const location = useLocation();
  const [product, setProduct] = useState({});
  const [arrayExpDate, setArrayExpDate] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorFetch, setErrorFetch] = useState(false);
  const [success, setSuccess] = useState(false);
  let productId = location.pathname.split('/')[3];
  let requestUrl = location.pathname.split('/')[2].split('-')[1] === "produit" ? "products" : "historics";

  const getProductData = useCallback(async () => {
    setErrorFetch(false);
    const getDataEndPoint = `${apiDomain}/api/${apiVersion}/${requestUrl}/${productId}`;
    await axiosInstance.get(getDataEndPoint)
      .then((response) => {
        if(isMounted){
          setProduct(response.data);
          setArrayExpDate(response.data.expirationDate);
          setLoading(false);
        }
      })
      .catch(error => {
        if(isMounted){
          if (error.response.status === 404 || error.response.status === 500) {
            history.goBack();
          }
          if(error.code === "ECONNABORTED"){
            setErrorFetch(true);
          }
        }
      });
  }, [history, productId, requestUrl]);

  useEffect(() => {
    getProductData();
    return () => {
      isMounted.current = false;
    }
  }, [getProductData]);

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



  const EditProduct = async (data) => {
    let newData = {
      kcal: data.kcal,
      location: data.location,
      name: data.name,
      expirationDate: arrayExpDate,
      weight: data.weight,
      brand: data.brand.value,
      type: data.type.value,
    }

    let totalNumber = 0;
    let emptyProductLinkedToExpDate = false;
    arrayExpDate.forEach(item => {
      if(item.productLinkedToExpDate === ""){
        emptyProductLinkedToExpDate = true;
        return;
      }
      totalNumber = totalNumber + parseInt(item.productLinkedToExpDate);
    });

    if(emptyProductLinkedToExpDate) return;

    newData.number = totalNumber;

    if(data.minimumInStock === ""){
      newData.minimumInStock = { minInStock : 0 };
    }else{
      newData.minimumInStock = { minInStock : parseInt(data.minimumInStock), updatedBy: "user" };
    }


    const patchDataEndPoint = `${apiDomain}/api/${apiVersion}/${requestUrl}/${productId}`;
    await axiosInstance.patch(patchDataEndPoint, newData)
      .then((response) => {
        if (response.status === 200) {
          if (productId === response.data._id) {
            setSuccess(true);
          }
          if (parseInt(newData.number) === 0 && newData.expirationDate.length === 0 && requestUrl === "products") {
            history.push({
              pathname: `/app/edition-historique/${response.data._id}`,
            })
          }
          if (newData.number >= 1 && newData.expirationDate.length >= 1 && requestUrl === "historics") {
            history.push({
              pathname: `/app/edition-produit/${response.data._id}`,
            })
          }
        }
      });
  }

  return (
    <Fragment>
      <AddEditProductForm
        userData={userData}
        history={history}
        handleFunction={EditProduct}
        formType="edit"
        value={product}
        arrayExpDate={arrayExpDate}
        setArrayExpDate={setArrayExpDate}
        requestUrl={requestUrl}
        success={success}
        loading={loading}
        errorFetch={errorFetch}
        getProductData={getProductData}
      />
    </Fragment>
  )
}

EditProduct.propTypes = {
  userData: PropTypes.object,
  history: PropTypes.object.isRequired
}

export default withRouter(EditProduct);
