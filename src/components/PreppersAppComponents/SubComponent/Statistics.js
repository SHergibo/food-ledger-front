import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useUserData } from './../DataContext';
import Loading from '../UtilitiesComponent/Loading';
import axiosInstance from '../../../utils/axiosInstance';
import { apiDomain, apiVersion } from '../../../apiConfig/ApiConfig';
import { Bar, Doughnut, Pie, Line } from 'react-chartjs-2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';

function Statistics() {
  const { userData } = useUserData();
  const isMounted = useRef(true);
  const [hasStat, setHasStat] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errorFetch, setErrorFetch] = useState(false);
  const labelChartOne = ['Janvier', 'Février', 'Mars', 'Avril', 'Mais', 'Juin', 'Juillet', 'Aôut', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
  const [dataChartOne, setDataChartOne] = useState([]);
  const labelChartTypeProduct = ['Légume', 'Viande', 'Poisson', 'Fruit', 'Boisson', 'Produit sucré', 'Produit laitier', 'Farineux', 'Céréale', 'Légumineuse'];
  const [dataChartTwo, setDataChartTwo] = useState([]);
  const [dataChartThree, setDataChartThree] = useState([]);
  const [labelChartFour, setLabelChartFour] = useState([]);
  const [dataChartFour, setDataChartFour] = useState([]);
  const linkChartOneData = useRef([]);
  const linkChartFourData = useRef([]);

  const loadChartData = useCallback(async () => {
    if(userData){
      setErrorFetch(false);
      setLoading(true);
      const getChartOneDataEndPoint = `${apiDomain}/api/${apiVersion}/statistics/chart-data/${userData.householdId}`;
      await axiosInstance.get(getChartOneDataEndPoint)
        .then((response) => {
          if(isMounted.current){
            if(Object.keys(response.data.statistics).length === 4){
              sessionStorage.setItem('allDataChart', JSON.stringify(response.data.statistics));
              setDataChartOne(response.data.statistics.chartOne[new Date().getFullYear()]);
              setDataChartTwo(response.data.statistics.chartTwo);
              setDataChartThree(response.data.statistics.chartThree);
              let arrayLabelChartFour = [];
              response.data.statistics.chartFour[new Date().getFullYear()].forEach((data, index) => {
                arrayLabelChartFour.push(`${index + 1}`);
              });
              setLabelChartFour(arrayLabelChartFour);
              setDataChartFour(response.data.statistics.chartFour[new Date().getFullYear()]);
              setHasStat(true);
            }else{
              setHasStat(false);
            }
            setLoading(false);
          }
        })
        .catch((error)=> {
          let jsonError = JSON.parse(JSON.stringify(error));
          if(isMounted.current){
            if(error.code === "ECONNABORTED" || jsonError.name === "Error"){
              setErrorFetch(true);
            }
          }
        });
    }
  }, [userData]);

  useEffect(() => {
    if (userData) {
      loadChartData();
    }
  }, [userData, loadChartData]);

  useEffect(() => {
    return () => {
      isMounted.current = false;
      sessionStorage.removeItem('allDataChart');
    }
  }, [isMounted]);


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
    maintainAspectRatio: false,
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

  const options_ChartTwoThree = {
    maintainAspectRatio: false,
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
    maintainAspectRatio: false,
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

  const switchDataChartOne = (year, index) => {
    try {
      let oldLinkChartOneData = linkChartOneData.current.find(element => element.className === 'chart-menu-interaction-active');
      oldLinkChartOneData.classList.remove('chart-menu-interaction-active');
      linkChartOneData.current[index].classList.add('chart-menu-interaction-active');
      setDataChartOne(JSON.parse(sessionStorage.getItem('allDataChart')).chartOne[year]);
    } catch (error) {
      loadChartData();
    }
    
  };

  const switchDataChartFour = (year, index) => {
    try {
      let oldLinkChartFourData = linkChartFourData.current.find(element => element.className === 'chart-menu-interaction-active');
      oldLinkChartFourData.classList.remove('chart-menu-interaction-active');
      linkChartFourData.current[index].classList.add('chart-menu-interaction-active');
      setDataChartFour(JSON.parse(sessionStorage.getItem('allDataChart')).chartFour[year]);
    } catch (error) {
      loadChartData();
    }
  };


  return (
    <div className="default-wrapper">
      <div className="sub-header">
        <div className="sub-option">
          <h1>Statistiques des stocks</h1>
        </div>
      </div>

      <div className="container-loading">
        <Loading
          loading={loading}
          errorFetch={errorFetch}
          retryFetch={loadChartData}
        />
        {!hasStat &&
          <div className="no-data">
            <p>Pas de statistiques disponibles !</p>
            <p>Ajoutez au minimum un produit pour avoir des statistiques !</p>
            <Link className="default-btn-blue" to={`/app/ajout-produit`}>Ajouter un produit <FontAwesomeIcon icon="plus" /></Link>
          </div>
        }

        {hasStat &&
          <div className="chart-container">
            <div className="chart">
              <h4>Nombre de produit périmé par mois</h4>
              <ul className="chart-menu-interaction">
                {sessionStorage.getItem('allDataChart') && JSON.parse(sessionStorage.getItem('allDataChart')).chartOne && Object.keys(JSON.parse(sessionStorage.getItem('allDataChart')).chartOne).map((keyName, i) => {
                  let cssClass;
                  if(i === 0){
                    cssClass = "chart-menu-interaction-active";
                  }
                  return <li ref={(el) => (linkChartOneData.current[i] = el)} className={cssClass} onClick={()=>switchDataChartOne(keyName, i)} key={i}>
                            {keyName}
                        </li>
                })}
              </ul>
              <div className="canvas-chart-container">
                <Bar 
                data={data_ChartOne} 
                options={options_ChartOne} />
              </div>
            </div>

            <div className="chart">
              <h4>Nombre de produit par type de produit</h4>
              <div className="canvas-chart-container-pie">
                <Doughnut 
                data={data_ChartTwo} 
                options={options_ChartTwoThree} />
              </div>
            </div>
            <div className="chart">
              <h4>Nombre de Kcal par type de produit</h4>
              <div className="canvas-chart-container-pie">
                <Pie 
                data={data_ChartThree} 
                options={options_ChartTwoThree} />
              </div>
            </div>
            <div className="chart">
              <h4>Nombre de produit par semaine</h4>
                <ul className="chart-menu-interaction">
                  {sessionStorage.getItem('allDataChart') && JSON.parse(sessionStorage.getItem('allDataChart')).chartFour && Object.keys(JSON.parse(sessionStorage.getItem('allDataChart')).chartFour).map((keyName, i) => {
                  let cssClass;
                  if(i === 0){
                    cssClass = "chart-menu-interaction-active";
                  }
                  return <li ref={(el) => (linkChartFourData.current[i] = el)} className={cssClass} onClick={()=>switchDataChartFour(keyName, i)} key={i}>
                            {keyName}
                        </li>
                })}
                </ul>
                <div className="canvas-chart-container">
                  <Line 
                  data={data_ChartFour} 
                  options={options_ChartFour} />
                </div>
            </div>
          </div>
        }
      </div>
    </div>
  )
}

export default Statistics
