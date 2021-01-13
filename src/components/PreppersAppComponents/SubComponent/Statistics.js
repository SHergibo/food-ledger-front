import React, { useState, useEffect, useCallback } from 'react';
import { useUserData } from './../DataContext';
import axiosInstance from '../../../utils/axiosInstance';
import { apiDomain, apiVersion } from '../../../apiConfig/ApiConfig';
import { Bar, Doughnut, Pie, Line } from 'react-chartjs-2';

function Statistics() {
  const { userData } = useUserData();
  const labelChartOne = ['Janvier', 'Février', 'Mars', 'Avril', 'Mais', 'Juin', 'Juillet', 'Aôut', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
  const [dataChartOne, setDataChartOne] = useState([]);
  const labelChartTypeProduct = ['Légume', 'Viande', 'Poisson', 'Fruit', 'Boisson', 'Produit sucré', 'Produit laitier', 'Farineux', 'Céréale', 'Légumineuse'];
  const [dataChartTwo, setDataChartTwo] = useState([]);
  const [dataChartThree, setDataChartThree] = useState([]);
  const [labelChartFour, setLabelChartFour] = useState([]);
  const [dataChartFour, setDataChartFour] = useState([]);
  const [allDataChart, setAllDataChart] = useState({});

  const loadChartOneData = useCallback(async () => {
    if(userData){
      const getChartOneDataEndPoint = `${apiDomain}/api/${apiVersion}/statistics/chart-data/${userData.householdCode}`;
      await axiosInstance.get(getChartOneDataEndPoint)
        .then((response) => {
          setDataChartOne(response.data.chartOne[new Date().getFullYear()]);
          setDataChartTwo(response.data.chartTwo);
          setDataChartThree(response.data.chartThree);
          let arrayLabelChartFour = [];
          response.data.chartFour[new Date().getFullYear()].forEach((data, index) => {
            arrayLabelChartFour.push(`${index + 1}`);
          });
          setLabelChartFour(arrayLabelChartFour);
          setDataChartFour(response.data.chartFour[new Date().getFullYear()]);
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
        backgroundColor: 'rgba(3, 62, 129, 0.5)',
        borderColor: 'rgba(3, 62, 129, 1)',
        borderWidth: 1,
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
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)',
          'rgba(0, 128, 0, 0.2)',
          'rgba(255, 255, 0, 0.2)',
          'rgba(128, 0, 128, 0.2)',
          'rgba(128, 0, 0, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
          'rgba(0, 128, 0, 1)',
          'rgba(255, 255, 0, 1)',
          'rgba(128, 0, 128, 1)',
          'rgba(128, 0, 0, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const data_ChartThree = {
    labels: labelChartTypeProduct,
    datasets: [
      {
        data: dataChartThree,
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)',
          'rgba(0, 128, 0, 0.2)',
          'rgba(255, 255, 0, 0.2)',
          'rgba(128, 0, 128, 0.2)',
          'rgba(128, 0, 0, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
          'rgba(0, 128, 0, 1)',
          'rgba(255, 255, 0, 1)',
          'rgba(128, 0, 128, 1)',
          'rgba(128, 0, 0, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const data_ChartFour = {
    labels: labelChartFour,
    datasets: [
      {
        label: 'N° de produit',
        data: dataChartFour,
        fill: false,
        backgroundColor: 'rgba(3, 62, 129, 0.5)',
        borderColor: 'rgba(3, 62, 129, 1)',
      },
    ],
  };
  
  const options_ChartFour = {
    responsive: true,
    scales: {
      xAxes: [
        {
          ticks: {
            autoSkip: false,
          },
          scaleLabel: {
            display: true,
            labelString: 'Semaine'
          }
        }
      ],
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
          },
        },
      ]
    },
  };

  const switchDataChartOne = (year) => {
    setDataChartOne(allDataChart.chartOne[year]);
  };

  const switchDataChartFour = (year) => {
    setDataChartFour(allDataChart.chartFour[year]);
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
        <div className="chart">
          <h4>Nombre de produit par semaine</h4>
            <ul className="chart-menu-interaction">
              {Object.keys(allDataChart).length >= 1 && Object.keys(allDataChart.chartFour).map((keyName, i) => (
                <li onClick={()=>switchDataChartFour(keyName)} key={i}>
                    {keyName}
                </li>
              ))}
            </ul>
            <Line 
            data={data_ChartFour} 
            options={options_ChartFour} />
        </div>
      </div>
    </div>
  )
}

export default Statistics
