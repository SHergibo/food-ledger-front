import React, { useEffect, useState } from 'react';
import { useLocation, withRouter } from "react-router-dom";
import axiosInstance from './../utils/axiosInstance';
import { apiDomain, apiVersion } from './../apiConfig/ApiConfig';

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

  return (
    <div>
      Edit product
      <pre>
        <code>
          {JSON.stringify(product)}
        </code>
      </pre>
    </div>
  )
}

export default withRouter(EditProduct);
