import React, { useEffect, useState } from 'react';
import { useUserData } from './../DataContext';
import axiosInstance from '../../../utils/axiosInstance';
import { apiDomain, apiVersion } from '../../../apiConfig/ApiConfig';
import { transformDate } from '../../../helpers/transformDate.helper';

function ProductLog({ history }) {
  const { userData } = useUserData();
  const [productLog, setProductLog] = useState([]);

  useEffect(() => {
    if(userData && userData.role !== "admin"){
      history.push({
        pathname: '/app',
      });
    }
  }, [userData, history]);

  useEffect(() => {
    const loadProductLog = async () => {
      const getProductLogEndPoint = `${apiDomain}/api/${apiVersion}/product-logs/${userData.householdCode}`;
      await axiosInstance.get(getProductLogEndPoint)
        .then((response) => {
          setProductLog(response.data);
        });
    }
    if (userData) {
      loadProductLog();
    }
  }, [userData]);

  

  return (
    <div className="default-wrapper">
      <div className="default-title-container">
        <h1 className="default-h1">Registre des produits</h1>
      </div>
      <ul>
        {productLog.map((log, index) => {
          return <li key={log._id}>
           {index+1}) {log.user.firstname} - {log.productName} - {log.productBrand} - {log.productWeight} - {log.infoProduct} - {log.numberProduct} - {transformDate(log.createdAt)}
          </li>
        })}
      </ul>
    </div>
  )
}

export default ProductLog

