import React, { useEffect } from 'react';
import { logout, refreshToken } from './../utils/Auth';
import axiosInstance from './../utils/axiosInstance';
import { apiDomain, apiVersion } from './../apiConfig/ApiConfig';
import { BrowserRouter as Router } from "react-router-dom";
import Nav from './Nav';
import SubNav from './SubNav';
import MainContainer from './MainContainer';
import SubContainer from './SubContainer';
import PropTypes from 'prop-types';

function PreppersApp({ history }) {

  useEffect(() => {

    const getNotification = setInterval(async () => {
      const getNotificationEndPoint = `${apiDomain}/api/${apiVersion}/notifications/${localStorage.getItem('user_id')}`;
      await axiosInstance.get(getNotificationEndPoint)
        .then((response) => {
          console.log(response.data);
        });
    }, 30000);

    const refreshTokenInterval = setInterval(() => {
      refreshToken();
    }, 900000);

    return () => {
      clearInterval(getNotification);
      clearInterval(refreshTokenInterval);
    };
  }, []);

  let logOut = async () => {
    await logout();
    history.push("/");
  };

  return (
    <div className="container-prepper-app">
      <Router>
        <Nav
        logOut={logOut}
        />
        <div className="container-column">
          <SubNav
          logOut={logOut}
          />
          <div className="container-row">
            <MainContainer />
            <SubContainer />
          </div>
        </div>
      </Router>
    </div>
  )
}

PreppersApp.propTypes = {
  history : PropTypes.object.isRequired,
}

export default PreppersApp;

