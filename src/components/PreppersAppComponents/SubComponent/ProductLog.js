import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useUserData } from './../DataContext';
import axiosInstance from '../../../utils/axiosInstance';
import { apiDomain, apiVersion } from '../../../apiConfig/ApiConfig';
import { transformDate } from '../../../helpers/transformDate.helper';
import {columnsLogMobile, columnsLogTablet, columnsLogFullScreen} from "./../../../utils/localData";
import Table from './../UtilitiesComponent/Table';

function ProductLog({ history }) {
  const { userData } = useUserData();
  const [productLog, setProductLog] = useState([]);
  let btnSortRef = useRef([]);

  useEffect(() => {
    if(userData && userData.role !== "admin"){
      history.push({
        pathname: '/app',
      });
    }
  }, [userData, history]);

  const [columns, setColumns] = useState([]);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const responsiveColumns = useCallback(() =>{
    setWindowWidth(window.innerWidth);
  }, []);

  useEffect(() => {
    window.addEventListener('resize', responsiveColumns);
    return () =>{
      window.removeEventListener('resize', responsiveColumns);
    }
  }, [responsiveColumns]);

  useEffect(() => {
    setColumns(columnsLogMobile);

    if(windowWidth >= 992){
      setColumns(columnsLogTablet)
    }

    if(windowWidth >= 1312){
      setColumns(columnsLogFullScreen)
    }
  }, [setColumns, windowWidth]);

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

  let trTable = productLog.map((row, indexRow) => {
    return (
      <tr key={`${row}-${indexRow}`}>
        {columns.map((column, index) => {
          if (column.id === 'action') {
            return (
              <td key={`${column.id}-${index}`}>
                <div className="div-list-table-action">
                  {/* <button className="list-table-action" onClick={() => deleteData(row._id)}><FontAwesomeIcon icon="trash"/></button> */}
                </div>
              </td>
            )
          }
          if (column.id !== "user" && column.id !== "createdAt") {
            return (
              <td key={`${column.id}-${index}`}>
                {row[column.id]}
              </td>
            )
          }
          if (column.id === "user") {
            return (
              <td key={`${column.id}-${index}`}>
                {row[column.id].firstname}
              </td>
            )
          }
          if (column.id === "createdAt") {
            return (
              <td key={`${column.id}-${index}`}>
                {transformDate(row[column.id])}
              </td>
            )
          }
          return null;
        })}
      </tr>
    )
  });

  

  return (
    <div className="default-wrapper">
      <div className="default-title-container">
        <h1 className="default-h1">Registre des produits</h1>
      </div>
      {/* <ul>
        {productLog.map((log, index) => {
          return <li key={log._id}>
           {index+1}) {log.user.firstname} - {log.productName} - {log.productBrand} - {log.productWeight} - {log.infoProduct} - {log.numberProduct} - {transformDate(log.createdAt)}
          </li>
        })}
      </ul> */}
      <Table 
        columns={columns}
        btnSortRef={btnSortRef}
        trTable={trTable}
      />
    </div>
  )
}

export default ProductLog

