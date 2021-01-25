import React, { useContext, useState, createContext, useEffect, useRef } from 'react';
import axiosInstance from './../../utils/axiosInstance';
import { apiDomain, apiVersion } from './../../apiConfig/ApiConfig';
import { io } from "socket.io-client";

const UserDataContext = createContext();
const UserHouseholdDataContext = createContext();
const UserOptionContext = createContext();
const NotificationContext = createContext();

export function useUserData(){
  return useContext(UserDataContext);
}

export function useUserHouseHoldData(){
  return useContext(UserHouseholdDataContext);
}

export function useUserOptionData(){
  return useContext(UserOptionContext);
}

export function useNotificationData(){
  return useContext(NotificationContext);
}

export function DataProvider({children}) {
  const [userData, setUserData] = useState();
  const [userHouseholdData, setUserHouseholdData] = useState();
  const [userOptionData, setUserOptionData] = useState();
  const [notification, setNotification] = useState([]);
  const isMounted = useRef(true);
  const socketRef = useRef();

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

    socketRef.current = io(apiDomain);
    socketRef.current.on("connect", () => {
      socketRef.current.emit('setSocketId', {userId: localStorage.getItem('user_id'), socketId: socketRef.current.id});
    });

    socketRef.current.on("notifSocketIo", (notif) => {
      setNotification(notification => [...notification, notif]);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  useEffect(() => {
    const getUserHouseHoldData = async () => {
      const getUserHouseholdDataEndPoint = `${apiDomain}/api/${apiVersion}/households/${userData.householdCode}`;
      await axiosInstance.get(getUserHouseholdDataEndPoint)
        .then((response) => {
          if(isMounted.current){
            setUserHouseholdData(response.data);
          }
        });
    };

    const getUserOptionData = async () => {
      const getUserOptionDataEndPoint = `${apiDomain}/api/${apiVersion}/options/${userData._id}`;
      await axiosInstance.get(getUserOptionDataEndPoint)
        .then((response) => {
          if(isMounted.current){
            setUserOptionData(response.data);
          }
        });
    };
    if(userData){
      getUserHouseHoldData();
      getUserOptionData();
    }
  }, [userData]);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    }
  }, []);

  return(
    <UserDataContext.Provider value={{ userData, setUserData }}>
      <UserHouseholdDataContext.Provider value={{ userHouseholdData, setUserHouseholdData }}>
        <UserOptionContext.Provider value={{ userOptionData, setUserOptionData }}>
          <NotificationContext.Provider value={{ notification, setNotification }}>
            {children}
          </NotificationContext.Provider>
        </UserOptionContext.Provider>
      </UserHouseholdDataContext.Provider>
    </UserDataContext.Provider>
  )
}
