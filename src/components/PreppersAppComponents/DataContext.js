import React, { useContext, useState, createContext, useEffect, useRef } from 'react';
import axiosInstance from './../../utils/axiosInstance';
import { apiDomain, apiVersion } from './../../apiConfig/ApiConfig';

const DataContext = createContext();
const NotificationContext = createContext();

export function useUserData(){
  return useContext(DataContext);
}

export function useNotificationData(){
  return useContext(NotificationContext);
}

export function DataProvider({children}) {
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


    return () => {
      isMounted.current = false;
      clearInterval(getNotification);
    };
  }, []);

  return(
    <DataContext.Provider value={userData}>
      <NotificationContext.Provider value={notification}>
        {children}
      </NotificationContext.Provider>
    </DataContext.Provider>
  )
}
