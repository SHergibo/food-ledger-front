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
  const [notificationReceived, setNotificationReceived] = useState([]);
  const [notificationSended, setNotificationSended] = useState([]);
  const isMounted = useRef(true);
  const socketRef = useRef();

  useEffect(() => {
    const getUserData = async () => {
      const getUserDataEndPoint = `${apiDomain}/api/${apiVersion}/users/${localStorage.getItem('user_id')}`;
      await axiosInstance.get(getUserDataEndPoint)
        .then(async (response) => {
          if(isMounted.current){
            setUserData(response.data);
            getUserHouseholdData(response.data.householdId);
            getUserOptionData(response.data._id);
            fetchNotification(response.data._id);
          }
        });
    };
    getUserData();

    const getUserHouseholdData = async (householdId) => {
      if(householdId !== null){
        const getUserHouseholdDataEndPoint = `${apiDomain}/api/${apiVersion}/households/${householdId}`;
        await axiosInstance.get(getUserHouseholdDataEndPoint)
          .then((response) => {
            if(isMounted.current){
              setUserHouseholdData(response.data);
            }
          });
      }
    };

    const getUserOptionData = async (userId) => {
      const getUserOptionDataEndPoint = `${apiDomain}/api/${apiVersion}/options/${userId}`;
      await axiosInstance.get(getUserOptionDataEndPoint)
        .then((response) => {
          if(isMounted.current){
            setUserOptionData(response.data);
          }
        });
    };

    const fetchNotification = async (userId) => {
      const getNotificationEndPoint = `${apiDomain}/api/${apiVersion}/notifications/${userId}`;
      await axiosInstance.get(getNotificationEndPoint)
        .then((response) => {
          if(isMounted.current){
            setNotificationReceived(response.data.notificationsReceived);
            setNotificationSended(response.data.notificationsSended)
          }
        });
    };

    socketRef.current = io(apiDomain);
    socketRef.current.on("connect", () => {
      socketRef.current.emit('setUserRoom', {userId: localStorage.getItem('user_id')});
    });

    socketRef.current.on("updateNotificationReceived", (notif) => {
      setNotificationReceived(notificationReceived => [...notificationReceived, notif]);
    });

    socketRef.current.on("updateNotificationSended", (notif) => {
      setNotificationSended(notificationSended => [...notificationSended, notif]);
    });

    socketRef.current.on("deleteNotificationSended", (notifId) => {
      setNotificationSended(notificationSended => notificationSended.filter((notif) => notif._id !== notifId));
    });

    socketRef.current.on("deleteNotificationReceived", (notifId) => {
      setNotificationReceived(notificationReceived => notificationReceived.filter((notif) => notif._id !== notifId));
    });

    socketRef.current.on("updateAllNotifications", (data) => {
      setNotificationReceived(data.notificationsReceived);
      setNotificationSended(data.notificationsSended);
    });

    socketRef.current.on("updateAllNotificationsReceived", (allNotifReceived) => {
      setNotificationReceived(allNotifReceived);
    });

    socketRef.current.on("updateUserAndFamillyData", (data) => {
      setUserData(data.userData);
      setUserHouseholdData(data.householdData);
    });

    socketRef.current.on("updateFamilly", (householdData) => {
      setUserHouseholdData(householdData);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    }
  }, []);

  return(
    <UserDataContext.Provider value={{ userData, setUserData }}>
      <UserHouseholdDataContext.Provider value={{ userHouseholdData, setUserHouseholdData }}>
        <UserOptionContext.Provider value={{ userOptionData, setUserOptionData }}>
          <NotificationContext.Provider value={{ notificationReceived, setNotificationReceived, notificationSended, setNotificationSended }}>
            {children}
          </NotificationContext.Provider>
        </UserOptionContext.Provider>
      </UserHouseholdDataContext.Provider>
    </UserDataContext.Provider>
  )
}
