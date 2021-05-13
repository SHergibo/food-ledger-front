import React, { useState, useEffect } from 'react';
import { useLocation, withRouter } from "react-router-dom";
import { useUserHouseHoldData } from './../DataContext';
import axiosInstance from '../../../utils/axiosInstance';
import { apiDomain, apiVersion } from '../../../apiConfig/ApiConfig';
import AddEditProductForm from './AddEditProductForm';
import slugUrl from './../../../utils/slugify';
import PropTypes from 'prop-types';

function AddProduct({ history }) {
  const location = useLocation();
  const { userHouseholdData } = useUserHouseHoldData();
  const [arrayExpDate, setArrayExpDate] = useState([]);
  const [success, setSuccess] = useState(false);
  let requestUrl = location.pathname.split('/')[2].split('-')[1] === "produit" ? "products" : "historics";

  useEffect(() => {
    if(userHouseholdData?.isWaiting){
      let url = requestUrl === "historics" ? "/app/liste-historique" : "/app/liste-produit";
      history.push(url);
    }
  }, [userHouseholdData, requestUrl, history]);
  
  useEffect(() => {
    let timerSuccess;
    if(success){
      timerSuccess = setTimeout(() => {
        setSuccess(false);
      }, 3500);
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

    data.brand.value = slugUrl(data.brand.value);

    let totalNumber = 0;
    arrayExpDate.forEach(item => {
      totalNumber = totalNumber + parseInt(item.productLinkedToExpDate);
    });

    data.number = totalNumber;

    if(requestUrl === "products"){
      if(data.minimumInStock === ""){
        data.minimumInStock = { minInStock : 0, updatedBy: "user" };
      }else{
        data.minimumInStock = { minInStock : parseInt(data.minimumInStock), updatedBy: "user" };
      }
    }

    data.householdId = userHouseholdData._id;

    const postDataEndPoint = `${apiDomain}/api/${apiVersion}/${requestUrl}`;
    await axiosInstance.post(postDataEndPoint, data)
      .then((response) => {
        if(response.status === 200){
          setSuccess(true);
        }
      });
  }

  return (
    <>
      <AddEditProductForm
        history={history}
        handleFunction={addProduct}
        formType="add"
        arrayExpDate={arrayExpDate}
        setArrayExpDate={setArrayExpDate}
        requestUrl={requestUrl}
        success={success}
      />
    </>
  )
}

AddProduct.propTypes = {
  history: PropTypes.object.isRequired
}

export default withRouter(AddProduct);
