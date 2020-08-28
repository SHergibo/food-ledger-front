import React, { useEffect, useState, Fragment } from 'react';
import { useLocation, withRouter } from "react-router-dom";
import axiosInstance from '../../../utils/axiosInstance';
import { apiDomain, apiVersion } from '../../../apiConfig/ApiConfig';
import AddEditProductForm from './AddEditProductForm';
import PropTypes from 'prop-types';

function EditProduct({ userData, history }) {
  const location = useLocation();
  const [product, setProduct] = useState({});
  const [arrayExpDate, setArrayExpDate] = useState([]);
  const [success, setSuccess] = useState(false);
  let productId = location.pathname.split('/')[3];
  let requestUrl = location.pathname.split('/')[2].split('-')[1] === "produit" ? "products" : "historics";

  useEffect(() => {
    let isRendered = false;
    const getProductData = async () => {
      const getDataEndPoint = `${apiDomain}/api/${apiVersion}/${requestUrl}/${productId}`;
      await axiosInstance.get(getDataEndPoint)
        .then((response) => {
          if(!isRendered){
            setProduct(response.data);
            setArrayExpDate(response.data.expirationDate);
          }
        });
    };
    getProductData();
    return () => {
      isRendered = true;
    }
  }, [productId, requestUrl]);



  const EditProduct = async (data) => {
    let newData = {
      kcal: data.kcal,
      location: data.location,
      name: data.name,
      number: data.number,
      expirationDate: arrayExpDate,
      weight: data.weight,
      brand: data.brand.value,
      type: data.type.value
    }

    const patchDataEndPoint = `${apiDomain}/api/${apiVersion}/${requestUrl}/${productId}`;
    await axiosInstance.patch(patchDataEndPoint, newData)
      .then((response) => {
        if(response.status === 200){
          setSuccess(true);
          setTimeout(() => {
            setSuccess(false);
          }, 4000);
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
        success={success}
      />
    </Fragment>
  )
}

EditProduct.propTypes = {
  userData: PropTypes.object,
  history: PropTypes.object.isRequired
}

export default withRouter(EditProduct);
