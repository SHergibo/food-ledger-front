import React, { useEffect, useState, Fragment } from 'react';
import { useLocation, withRouter } from "react-router-dom";
import axiosInstance from './../utils/axiosInstance';
import { apiDomain, apiVersion } from './../apiConfig/ApiConfig';
import AddEditProductForm from './AddEditProductForm';

function EditProduct() {
  const location = useLocation();
  const [product, setProduct] = useState({});
  let productId = location.pathname.split('/')[3];

  useEffect(() => {
    const getProductData = async () => {
      const getProductDataEndPoint = `${apiDomain}/api/${apiVersion}/products/${productId}`;
      await axiosInstance.get(getProductDataEndPoint)
        .then((response) => {
          setProduct(response.data);
        });
    };
    getProductData();
  }, [productId])


  const EditProduct = async (data) => {
    const patchProductDataEndPoint = `${apiDomain}/api/${apiVersion}/products/${productId}`;
    await axiosInstance.patch(patchProductDataEndPoint, data)
      .then((response) => {
        // console.log(response.data);
      });
  }

    //TODO ajout btn pour revenir à la page suivante (utiliser history??)

  return (
    <Fragment>
      <AddEditProductForm
        handleFunction={EditProduct}
        formType="edit"
        value={product}
      />
    </Fragment>
  )
}

export default withRouter(EditProduct);
