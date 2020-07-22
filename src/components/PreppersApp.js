import React, { Fragment, useEffect } from 'react';
import { logout, refreshToken } from './../utils/Auth';
import axiosInstance from './../utils/axiosInstance';
import { apiDomain, apiVersion } from './../apiConfig/ApiConfig';
import Nav from './Nav';
import SubNav from './SubNav';
import MainContainer from './MainContainer';
import SubContainer from './SubContainer';

function PreppersApp({ history }) {

  // useEffect(() => {

  //   const getNotification = setInterval(async () => {
  //     const getNotificationEndPoint = `${apiDomain}/api/${apiVersion}/notifications/${localStorage.getItem('user_id')}`;
  //     await axiosInstance.get(getNotificationEndPoint)
  //     .then((response) => {
  //       console.log(response.data);
  //     });
  //   }, 30000);

  //   const refreshTokenInterval = setInterval(() => {
  //     refreshToken();
  //   }, 900000);

  //   return () => {
  //     clearInterval(getNotification);
  //     clearInterval(refreshTokenInterval);
  //   };
  // }, []);

  return (
    <div className="container-prepper-app">
      
      <div className="container-column">
        <SubNav />
        <div className="container-row">
          <Nav />
          <MainContainer />
          <SubContainer />
        </div>
      </div>

    </div>
  )
}

export default PreppersApp;

