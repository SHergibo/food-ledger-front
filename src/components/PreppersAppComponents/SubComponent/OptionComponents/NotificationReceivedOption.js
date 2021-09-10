import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useUserData, useSocket } from '../../DataContext';
import axiosInstance from '../../../../utils/axiosInstance';
import { apiDomain, apiVersion } from '../../../../apiConfig/ApiConfig';
import Table from '../../UtilitiesComponent/Table';
import { columnsNotifReceived } from "../../../../utils/localData";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';

function NotificationReceivedOption({switchToHouseholdOptions, otherMemberEligible}) {
  const { userData } = useUserData();
  const { socketRef } = useSocket();
  const [notificationReceived, setNotificationReceived] = useState([]);
  const [notificationDelegateAdmin, setNotificationDelegateAdmin] = useState(false);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const [hasNotif, setHasNotif] = useState(false);
  const isMounted = useRef(true);
  const pageSize = 12;

  useEffect(() => {
    let socket = null;

    if(socketRef.current && userData){
      socket = socketRef.current;
      socket.emit('enterNotificationRoom', {userId: userData._id, type: "notificationReceived", pageIndex: pageIndex - 1});

      socket.on("connect", () => {
        socket.emit('enterNotificationRoom', {userId: userData._id, type: "notificationReceived", pageIndex: pageIndex - 1});
      });
    }

    return () => {
      if(socket && userData) {
        socket.emit('leaveNotificationRoom', {userId: userData._id, type: "notificationReceived", pageIndex: pageIndex - 1});
        socket.off('connect');
      }
    };
  }, [userData, socketRef, pageIndex]);

  const updateNotifArray = useCallback((data) => {
    if(data.totalNotifReceived >= 1){
      setNotificationReceived(data.arrayData);
      setPageCount(Math.ceil(data.totalNotifReceived / pageSize));
      setHasNotif(true);
    }else{
      setHasNotif(false);
    }
  },[]);

  const updatePageCount = useCallback((data) => {
      setPageCount(data.totalNotif / pageSize);
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

  const getNotificationReceived = useCallback(async () => {
    // setErrorFetch(false);
    // setLoading(true);
    const getNotificationReceivedEndPoint = `${apiDomain}/api/${apiVersion}/notifications/pagination-notification-received/${userData._id}?page=${pageIndex - 1}`;
    await axiosInstance.get(getNotificationReceivedEndPoint)
      .then(async (response) => {
        if(isMounted.current){
          if(response.data.totalNotifReceived >= 1){
            setNotificationReceived(response.data.arrayData);
            setPageCount(Math.ceil(response.data.totalNotifReceived / pageSize));
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
      getNotificationReceived();
    }
  }, [userData, getNotificationReceived]);


  useEffect(() => {
    return () => {
      isMounted.current = false;
    }
  }, []);

  const notificationRequest = async (urlRequest, id, isAccepted) => {
    const requestNotificationEndpoint = `${apiDomain}/api/${apiVersion}/requests/${urlRequest}/${id}?acceptedRequest=${isAccepted}&type=received&page=${pageIndex - 1}`;
    await axiosInstance.get(requestNotificationEndpoint)
    .then((response) => {
      if(isMounted.current){
        if(response.data.totalNotifReceived >=1){
          setNotificationReceived(response.data.arrayData);
          setPageCount(Math.ceil(response.data.totalNotifReceived / pageSize));
          setHasNotif(true);
        }else{
          setHasNotif(false);
        }
        // setLoading(false);
      }
    })
  };

  const deleteNotification = async (notificationId) => {
    const removeNotificationEndpoint = `${apiDomain}/api/${apiVersion}/notifications/${notificationId}?type=received&page=${pageIndex - 1}`;
    await axiosInstance.delete(removeNotificationEndpoint)
    .then((response) => {
      if(isMounted.current){
        if(response.data.totalNotifReceived >=1){
          setNotificationReceived(response.data.arrayData);
          setPageCount(Math.ceil(response.data.totalNotifReceived / pageSize));
          setHasNotif(true);
        }else{
          setHasNotif(false);
        }
        // setLoading(false);
      }
    })
  }

  useEffect(() => {
    if(notificationReceived.length >= 1){
      const notifDelegateAdmin = notificationReceived.find(notif => notif.type === "request-admin" || notif.type === "need-switch-admin" || notif.type === "request-delegate-admin" || notif.type === "last-chance-request-delegate-admin");
      if(notifDelegateAdmin !== undefined){
        setNotificationDelegateAdmin(true);
      }else{
        setNotificationDelegateAdmin(false);
      }
    }
  }, [notificationReceived]);

  const notificationReceivedTypes = (type) => {
    switch (type) {
      case "information" :
        return "Information";
      case "need-switch-admin" :
        return "Délégation droits administrateurs";
      case "request-admin" :
        return "Délégation droits administrateurs";
      case "request-delegate-admin" :
          return "Délégation droits administrateurs";
      case "last-chance-request-delegate-admin" :
          return "Délégation droits administrateurs";
      case "invitation-household-to-user" :
        return "Invitation nouvelle famille";
      case "invitation-user-to-household" :
          return "Invitation nouveau membre";
  
      default:
        break;
    }
  }

  let trTableNotification = notificationReceived.map((notification) => {
    return (
      <tr key={`notification-${notification._id}`}>
        <td className="all-info">
          {notification.message}
        </td>
        <td className="td-align-center">
          {notificationReceivedTypes(notification.type)}
        </td>
        <td>
          <div className="div-list-table-action">
            {notification.type === "need-switch-admin" &&
              <button title="Déléguer" type="button" className="list-table-action" onClick={switchToHouseholdOptions}><FontAwesomeIcon icon="random"/></button>
            }
            {(notification.type === "invitation-household-to-user" || notification.type === "invitation-user-to-household") &&
              <button 
              title={notificationDelegateAdmin ? "Veuillez accepter ou non la délégation de droits administrateurs avant de pouvoir effectuer cette action !" : "Accepter"}
              type="button" 
              className={notificationDelegateAdmin ? "list-table-action-disabled" : "list-table-action"}
              disabled={notificationDelegateAdmin} 
              onClick={() => notificationRequest(notification.urlRequest, notification._id, "yes")}>
                <FontAwesomeIcon icon="check"/>
              </button>
            }
            {(notification.type === "request-admin" || notification.type === "request-delegate-admin" || notification.type === "last-chance-request-delegate-admin")  &&
            <button title="Accepter" type="button" className="list-table-action" onClick={() => notificationRequest(notification.urlRequest, notification._id, "yes")}><FontAwesomeIcon icon="check"/></button>
            }
            {(notification.type === "request-delegate-admin" || notification.type === "last-chance-request-delegate-admin") && otherMemberEligible ?
              <button title="Déléguer" type="button" className="list-table-action" onClick={switchToHouseholdOptions}><FontAwesomeIcon icon="random"/></button> :
              notification.type === "information" ? <button title="Supprimer la notification" type="button" className="list-table-one-action" onClick={()=>{deleteNotification(notification._id)}}><FontAwesomeIcon icon="trash"/></button> : <button title="Refuser" type="button" className="list-table-action" onClick={() => notificationRequest(notification.urlRequest, notification._id, "no")}><FontAwesomeIcon icon="times"/></button>
            }
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
            columns={columnsNotifReceived}
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

NotificationReceivedOption.propTypes = {
  switchToHouseholdOptions: PropTypes.func.isRequired,
  otherMemberEligible: PropTypes.bool.isRequired
}

export default NotificationReceivedOption
