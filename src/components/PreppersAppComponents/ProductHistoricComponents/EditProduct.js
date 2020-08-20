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
  let productId = location.pathname.split('/')[3];
  let requestUrl = location.pathname.split('/')[2].split('-')[1] === "produit" ? "products" : "historics";


  useEffect(() => {

    const getProductData = async () => {
      const getDataEndPoint = `${apiDomain}/api/${apiVersion}/${requestUrl}/${productId}`;
      await axiosInstance.get(getDataEndPoint)
        .then((response) => {
          setProduct(response.data);
          setArrayExpDate(response.data.expirationDate);
        });
    };
    getProductData();
  }, [productId, requestUrl]);


  const EditProduct = async (data) => {
    let newData = {
      kcal: data.kcal,
      location: data.location,
      name: data.name,
      number: data.number,
      expirationDate: arrayExpDate,
      type: data.type,
      weight: data.weight,
    }

    if (product.brand !== data.brand.value) {
      newData.brand = data.brand.value;
    }

    const patchDataEndPoint = `${apiDomain}/api/${apiVersion}/${requestUrl}/${productId}`;
    await axiosInstance.patch(patchDataEndPoint, newData)
      .then((response) => {
        //TODO Si produit switch entre produit et historique, mettre tout les champs en grisé avec un message stipulant que le produit ne peut plus être éditer ici et qu'il se trouve maintenant dans l'historique ou dans les produits
      });
  }

  //TODO ajout btn pour revenir à la page suivante (utiliser history??)

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
      />
    </Fragment>
  )
}

EditProduct.propTypes = {
  userData: PropTypes.object,
  history: PropTypes.object.isRequired
}

export default withRouter(EditProduct);
