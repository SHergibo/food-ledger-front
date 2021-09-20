import React, { useContext, useState, createContext, useEffect, useRef, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import axiosInstance from './../../utils/axiosInstance';
import { apiDomain, apiVersion } from './../../apiConfig/ApiConfig';
import { io } from "socket.io-client";

const UserDataContext = createContext();
const UserHouseholdDataContext = createContext();
const UserOptionContext = createContext();
const NotificationContext = createContext();
const SocketContext = createContext();
const WindowWidthContext = createContext();

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

export function useSocket(){
  return useContext(SocketContext);
}

export function useWindowWidth(){
  return useContext(WindowWidthContext);
}

export function DataProvider({children}) {
  const history = useHistory();
  const [userData, setUserData] = useState();
  const [userHouseholdData, setUserHouseholdData] = useState();
  const [userOptionData, setUserOptionData] = useState();
  const [notificationReceived, setNotificationReceived] = useState([]);
  const [notificationType, setNotificationType] = useState("");
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const isMounted = useRef(true);
  const socketRef = useRef();

  useEffect(() => {
    const getUserData = async () => {
      const getUserDataEndPoint = `${apiDomain}/api/${apiVersion}/users/${localStorage.getItem('user_id')}`;
      await axiosInstance.get(getUserDataEndPoint)
        .then((response) => {
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
      const getNotificationEndPoint = `${apiDomain}/api/${apiVersion}/notifications/received-notification/${userId}`;
      await axiosInstance.get(getNotificationEndPoint)
        .then((response) => {
          if(isMounted.current){
            setNotificationReceived(response.data);
          }
        });
    };

    const connectSocketIo = () => {
      socketRef.current = io(apiDomain);
      socketRef.current.on("connect", () => {
        socketRef.current.emit('setUserRoom', {userId: localStorage.getItem('user_id')});
      });

      socketRef.current.on("refreshData", () => {
        if(JSON.parse(localStorage.getItem('needRefresh')) === true){
          getUserData();
          socketRef.current.disconnect();
          connectSocketIo();
          localStorage.removeItem('needRefresh');
        }
      });
  
      socketRef.current.on("updateNotificationReceived", (notif) => {
        setNotificationReceived(notificationReceived => [...notificationReceived, notif]);
      });
  
      socketRef.current.on("deleteNotificationReceived", (notifId) => {
        setNotificationReceived(notificationReceived => notificationReceived.filter((notif) => notif._id !== notifId));
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

      socketRef.current.on("logoutSameNavigator", () => {
        if(!localStorage.getItem('access_token')){
          history.push('/');
        }
      });
    }

    connectSocketIo();

    return () => {
      socketRef.current.disconnect();
    };
  }, [history]);


  const responsiveWidth = useCallback(() =>{
    setWindowWidth(window.innerWidth);
  }, []);

  useEffect(() => {
    window.addEventListener('resize', responsiveWidth);
    return () =>{
      window.removeEventListener('resize', responsiveWidth);
    }
  }, [responsiveWidth]);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    }
  }, []);

  return(
    <UserDataContext.Provider value={{ userData, setUserData }}>
      <UserHouseholdDataContext.Provider value={{ userHouseholdData, setUserHouseholdData }}>
        <UserOptionContext.Provider value={{ userOptionData, setUserOptionData }}>
          <NotificationContext.Provider value={{ notificationReceived, setNotificationReceived, notificationType, setNotificationType }}>
            <SocketContext.Provider value={{socketRef}}>
              <WindowWidthContext.Provider value={{windowWidth}}>
                {children}
              </WindowWidthContext.Provider>
            </SocketContext.Provider>
          </NotificationContext.Provider>
        </UserOptionContext.Provider>
      </UserHouseholdDataContext.Provider>
    </UserDataContext.Provider>
  )
}
