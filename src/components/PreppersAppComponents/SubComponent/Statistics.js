import React, { useState, useEffect, useCallback } from 'react';
import { useUserData } from './../DataContext';
import axiosInstance from '../../../utils/axiosInstance';
import { apiDomain, apiVersion } from '../../../apiConfig/ApiConfig';
import { Bar } from 'react-chartjs-2';

function Statistics() {
  const { userData } = useUserData();
  const labelChartOne = ['Janvier', 'Février', 'Mars', 'Avril', 'Mais', 'Juin', 'Juillet', 'Aôut', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
  const [dataChartOne, setDataChartOne] = useState([]);
  const [allDataChartOne, setAllDataChartOne] = useState({});

  const loadChartOneData = useCallback(async () => {
    if(userData){
      const getChartOneDataEndPoint = `${apiDomain}/api/${apiVersion}/statistics/chart-one/${userData.householdCode}`;
      await axiosInstance.get(getChartOneDataEndPoint)
        .then((response) => {
          setDataChartOne(response.data[Object.keys(response.data)[0]]);
          setAllDataChartOne(response.data);
          console.log(response.data)
      })
    }
  }, [userData]);

  useEffect(() => {
    if (userData) {
      loadChartOneData();
    }
  }, [userData, loadChartOneData]);


  const data = {
    labels: labelChartOne,
    datasets: [
      {
        label: 'N° de produit périmé',
        data: dataChartOne,
      },
    ],
  }
  
  const options = {
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
          },
        },
      ],
    },
  }

  const switchDataChartOne = (year) => {
    setDataChartOne(allDataChartOne[year]);
  };


  return (
    <div>
      <h4>Nombre de produit périmé par mois</h4>
      <ul>
      {Object.keys(allDataChartOne).map((keyName, i) => (
          <li onClick={()=>switchDataChartOne(keyName)} key={i}>
              {keyName}
          </li>
      ))}
      </ul>
      <Bar 
      data={data} 
      options={options}  
      width={600}
      height={300}/>
    </div>
  )
}

export default Statistics
