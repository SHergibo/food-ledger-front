import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useUserData, useSocket, useNotificationData } from '../../DataContext';
import axiosInstance from '../../../../utils/axiosInstance';
import { apiDomain, apiVersion } from '../../../../apiConfig/ApiConfig';
import Table from './../../UtilitiesComponent/Table';
import { columnsNotifSended } from "./../../../../utils/localData";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function NotificationSendedOption() {
  const { userData } = useUserData();
  const { socketRef } = useSocket();
  const { setNotificationType } = useNotificationData();
  const [notificationSended, setNotificationSended] = useState([]);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const [hasNotif, setHasNotif] = useState(false);
  const isMounted = useRef(true);
  const pageSize = 12;

  useEffect(() => {
    setNotificationType("sended");
    return () => {
      setNotificationType('');
    }
  }, [setNotificationType]);

  useEffect(() => {
    let socket = null;

    if(socketRef.current && userData){
      socket = socketRef.current;
      socket.emit('enterNotificationRoom', {userId: userData._id, type: "notificationSended", pageIndex: pageIndex - 1});

      socket.on("connect", () => {
        socket.emit('enterNotificationRoom', {userId: userData._id, type: "notificationSended", pageIndex: pageIndex - 1});
      });
    }

    return () => {
      if(socket && userData) {
        socket.emit('leaveNotificationRoom', {userId: userData._id, type: "notificationSended", pageIndex: pageIndex - 1});
        socket.off('connect');
      }
    };
  }, [userData, socketRef, pageIndex]);

  const updateNotifArray = useCallback((data) => {
    if(data.totalNotifSended >= 1){
      setNotificationSended(data.arrayData);
      setPageCount(Math.ceil(data.totalNotifSended / pageSize));
      setHasNotif(true);
      if(data.arrayData.length === 0){
        setPageIndex(currPageIndex => currPageIndex - 1);
      }
    }else{
      setHasNotif(false);
    }
  },[]);

  const updatePageCount = useCallback((data) => {
      setPageCount(Math.ceil(data.totalNotif / pageSize));
  },[]);

  useEffect(() => {
    let socket = null;

    if(socketRef.current){
      socket = socketRef.current;
      socket.on("updateNotifArray", (data) => {
        updateNotifArray(data);
      });

      socket.on("updatePageCount", (data) => {
        updatePageCount(data);
      });
    }

    return () => {
      if(socket) {
        socket.off('updateNotifArray');
        socket.off('updatePageCount');
      }
    }
  }, [socketRef, updateNotifArray, updatePageCount]);

  const getNotificationSended = useCallback(async () => {
    // setErrorFetch(false);
    // setLoading(true);
    const getNotificationSendedEndPoint = `${apiDomain}/api/${apiVersion}/notifications/pagination-sended-notification/${userData._id}?page=${pageIndex - 1}`;
    await axiosInstance.get(getNotificationSendedEndPoint)
      .then(async (response) => {
        if(isMounted.current){
          if(response.data.totalNotifSended >=1){
            setNotificationSended(response.data.arrayData);
            setPageCount(Math.ceil(response.data.totalNotifSended / pageSize));
            setHasNotif(true);
          }else{
            setHasNotif(false);
          }
          // setLoading(false);
        }
      })
      .catch((error)=> {
        let jsonError = JSON.parse(JSON.stringify(error));
        if(isMounted.current){
          if(error.code === "ECONNABORTED" || jsonError.name === "Error"){
            // setErrorFetch(true);
          }
        }
      });
  }, [userData, pageIndex]);

  useEffect(() => {
    if(userData){
      getNotificationSended();
    }
  }, [userData, getNotificationSended]);


  useEffect(() => {
    return () => {
      isMounted.current = false;
    }
  }, []);

  const deleteNotification = async (notificationId) => {
    const removeNotificationEndpoint = `${apiDomain}/api/${apiVersion}/notifications/${notificationId}?type=sended&page=${pageIndex - 1}`;
    await axiosInstance.delete(removeNotificationEndpoint)
    .then((response) => {
      if(isMounted.current){
        if(response.data.totalNotif >=1){
          setNotificationSended(response.data.arrayData);
          setPageCount(Math.ceil(response.data.totalNotif / pageSize));
          setHasNotif(true);
        }else{
          setHasNotif(false);
        }
        // setLoading(false);
      }
    })
  }

  const notificationSendedTypes = (type) => {
    switch (type) {
      case "need-switch-admin" :
        return "Invitation nouveau membre";
      case "request-admin" :
        return "Délégation droits administrateurs";
      case "invitation-household-to-user" :
        return "Invitation nouveau membre";
      case "invitation-user-to-household" :
          return "Invitation nouvelle famille";
  
      default:
        break;
    }
  }

  let trTableNotification = notificationSended.map((notification, index) => {
    return (
      <tr key={`notificiation-${index}`}>
        <td className="td-align-center">
          {notificationSendedTypes(notification.type)}
        </td>
        <td className="td-align-center">
          {notification.userId.firstname} {notification.userId.lastname}
        </td>
        <td className="td-notif-action">
          <div className="div-list-table-action">
            <button title="Annuler la notification" type="button" className="list-table-one-action" onClick={()=>{deleteNotification(notification._id)}}><FontAwesomeIcon icon="trash"/></button>
          </div>
        </td>
      </tr>  
    )
  });

  return (
    <div className="container-option-data">
      <div className="option-component">
        {hasNotif && 
          <Table 
            columns={columnsNotifSended}
            customTableClass={{customThead: "centered-thead"}}
            trTable={trTableNotification}
            pagination={true}
            paginationInfo={{pageIndex : pageIndex, setPageIndex: setPageIndex, pageCount : pageCount}}
          />
        }
        
        {!hasNotif && 
          <div className="no-data-option">
            <p>Pas de notification!</p>
          </div>
        }
      </div>
    </div>
  )
}

export default NotificationSendedOption

