import React, { useEffect } from 'react';
import { logout, refreshToken } from './../utils/Auth';
import axiosInstance from './../utils/axiosInstance';
import { apiDomain, apiVersion } from './../apiConfig/ApiConfig';

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
    <div>
      BRAVO
      <button onClick={logOut}>Logout</button>
    </div>
  )
}

export default PreppersApp

