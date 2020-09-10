import React, { useEffect, useState, useRef } from 'react';
import { logout, refreshToken } from './../../utils/Auth';
import axiosInstance from './../../utils/axiosInstance';
import { apiDomain, apiVersion } from './../../apiConfig/ApiConfig';
import Nav from './PreppersAppUI/Nav';
import SubNav from './PreppersAppUI/SubNav';
import MainContainer from './PreppersAppUI/MainContainer';
import SubContainer from './PreppersAppUI/SubContainer';
import PropTypes from 'prop-types';

function PreppersApp({ history }) {
  const [userData, setUserData] = useState();
  const [notification, setNotification] = useState([]);
  const isMounted = useRef(true);

  useEffect(() => {

    const getUserData = async () => {
      const getUserDataEndPoint = `${apiDomain}/api/${apiVersion}/users/${localStorage.getItem('user_id')}`;
      await axiosInstance.get(getUserDataEndPoint)
        .then((response) => {
          if(isMounted.current){
            setUserData(response.data);
          }
        });
    };
    getUserData();


    const fetchNotification = async () => {
      const getNotificationEndPoint = `${apiDomain}/api/${apiVersion}/notifications/${localStorage.getItem('user_id')}`;
      await axiosInstance.get(getNotificationEndPoint)
        .then((response) => {
          if(isMounted.current){
            setNotification(response.data);
          }
          //TODO mettre lu ou non lu dans le back pour ne pas ré-afficher les notifcations déjà lu
        });

    };
    fetchNotification();

    const getNotification = setInterval(() => {
      fetchNotification();
    }, 30000);


    const refreshTokenInterval = setInterval(() => {
      refreshToken();
    }, 900000);

    return () => {
      isMounted.current = false;
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
      <Nav
        logOut={logOut}
      />
      <div className="container-column">
        <SubNav
          userData={userData}
          notification={notification}
          logOut={logOut}
        />
        <div className="container-row">
          <MainContainer
            userData={userData}
          />
          <SubContainer />
        </div>
      </div>
    </div>
  )
}

PreppersApp.propTypes = {
  history: PropTypes.object.isRequired,
}

export default PreppersApp;

