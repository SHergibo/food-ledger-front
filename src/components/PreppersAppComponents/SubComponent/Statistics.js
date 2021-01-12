import React, { useState, useEffect, useCallback } from 'react';
import { useUserData } from './../DataContext';
import axiosInstance from '../../../utils/axiosInstance';
import { apiDomain, apiVersion } from '../../../apiConfig/ApiConfig';
import { Bar, Doughnut, Pie } from 'react-chartjs-2';

function Statistics() {
  const { userData } = useUserData();
  const labelChartOne = ['Janvier', 'Février', 'Mars', 'Avril', 'Mais', 'Juin', 'Juillet', 'Aôut', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
  const [dataChartOne, setDataChartOne] = useState([]);
  const labelChartTypeProduct = ['Légume', 'Viande', 'Poisson', 'Fruit', 'Boisson', 'Produit sucré', 'Produit laitier', 'Farineux', 'Céréale', 'Légumineuse'];
  const [dataChartTwo, setDataChartTwo] = useState([]);
  const [dataChartThree, setDataChartThree] = useState([]);
  const [allDataChart, setAllDataChart] = useState({});

  const loadChartOneData = useCallback(async () => {
    if(userData){
      const getChartOneDataEndPoint = `${apiDomain}/api/${apiVersion}/statistics/chart-data/${userData.householdCode}`;
      await axiosInstance.get(getChartOneDataEndPoint)
        .then((response) => {
          setDataChartOne(response.data.chartOne[Object.keys(response.data.chartOne)[0]]);
          setDataChartTwo(response.data.chartTwo);
          setDataChartThree(response.data.chartThree);
          setAllDataChart(response.data);
      })
    }
  }, [userData]);

  useEffect(() => {
    if (userData) {
      loadChartOneData();
    }
  }, [userData, loadChartOneData]);


  const data_ChartOne = {
    labels: labelChartOne,
    datasets: [
      {
        label: 'N° de produit périmé',
        data: dataChartOne,
      },
    ],
  };
  
  const options_ChartOne = {
    scales: {
      yAxes: [
        {
          ticks: {
            max: 30,
            beginAtZero: true,
          },
        },
      ],
    },
  };

  const data_ChartTwo = {
    labels: labelChartTypeProduct,
    datasets: [
      {
        data: dataChartTwo,
      },
    ],
  };

  const data_ChartThree = {
    labels: labelChartTypeProduct,
    datasets: [
      {
        data: dataChartThree,
      },
    ],
  };

  const switchDataChartOne = (year) => {
    setDataChartOne(allDataChart.chartOne[year]);
  };


  return (
    <div className="default-wrapper">
      <div className="default-title-container">
        <h1 className="default-h1">Statistiques des stocks</h1>
      </div>
      <div className="chart-container">
        <div className="chart">
          <h4>Nombre de produit périmé par mois</h4>
          <ul className="chart-menu-interaction">
            {Object.keys(allDataChart).length >= 1 && Object.keys(allDataChart.chartOne).map((keyName, i) => (
              <li onClick={()=>switchDataChartOne(keyName)} key={i}>
                  {keyName}
              </li>
            ))}
          </ul>
          <Bar 
          data={data_ChartOne} 
          options={options_ChartOne} />
        </div>

        <div className="chart">
          <h4>Nombre de produit par type de produit</h4>
            <Doughnut 
            data={data_ChartTwo} />
        </div>
        <div className="chart">
          <h4>Nombre de Kcal par type de produit</h4>
            <Pie 
            data={data_ChartThree} />
        </div>
      </div>
    </div>
  )
}

export default Statistics
