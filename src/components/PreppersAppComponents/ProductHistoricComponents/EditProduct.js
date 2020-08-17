import React, { useEffect, useState, Fragment } from 'react';
import { useLocation, withRouter } from "react-router-dom";
import axiosInstance from '../../../utils/axiosInstance';
import { apiDomain, apiVersion } from '../../../apiConfig/ApiConfig';
import AddEditProductForm from './AddEditProductForm';

function EditProduct() {
  const location = useLocation();
  const [product, setProduct] = useState({});
  const [arrayExpDate, setArrayExpData] = useState([]);
  let productId = location.pathname.split('/')[3];
  let requestUrl = location.pathname.split('/')[2].split('-')[1] === "produit" ? "products" : "historics";


  useEffect(() => {

    const getProductData = async () => {
      const getDataEndPoint = `${apiDomain}/api/${apiVersion}/${requestUrl}/${productId}`;
      await axiosInstance.get(getDataEndPoint)
        .then((response) => {
          setProduct(response.data);
          setArrayExpData(response.data.expirationDate);
        });
    };
    getProductData();
  }, [productId, requestUrl]);


  const EditProduct = async (data) => {
    console.log(data);
    // let newData = {
    //   brand: data.brand,
    //   kcal: data.kcal,
    //   location: data.location,
    //   name: data.name,
    //   number: data.number,
    //   expirationDate: arrayExpDate,
    //   type: data.type,
    //   weight: data.weight,
    // }
    // const patchDataEndPoint = `${apiDomain}/api/${apiVersion}/${requestUrl}/${productId}`;
    // await axiosInstance.patch(patchDataEndPoint, newData)
    //   .then((response) => {
    //     //TODO Si produit switch entre produit et historique, mettre tout les champs en grisé avec un message stipulant que le produit ne peut plus être éditer ici et qu'il se trouve maintenant dans l'historique ou dans les produits
    //   });
  }

  //TODO ajout btn pour revenir à la page suivante (utiliser history??)

  return (
    <Fragment>
      <AddEditProductForm
        handleFunction={EditProduct}
        formType="edit"
        value={product}
        arrayExpDate={arrayExpDate}
        setArrayExpData={setArrayExpData}
      />
    </Fragment>
  )
}

export default withRouter(EditProduct);
