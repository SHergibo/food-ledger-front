import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useUserData } from '../../DataContext';
import axiosInstance from '../../../../utils/axiosInstance';
import { apiDomain, apiVersion } from '../../../../apiConfig/ApiConfig';
import Table from './../../UtilitiesComponent/Table';
import { columnsNotifReceived, columnsNotifSended } from "./../../../../utils/localData";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';

function NotificationOptionProfile({switchToHouseholdOptions, otherMemberEligible}) {
  const { userData } = useUserData();
  const [notificationReceived, setNotificationReceived] = useState([]);
  const [notificationSended, setNotificationSended] = useState([]);
  const [notificationTable, setNotificationTable] = useState(true);
  const [notificationDelegateAdmin, setNotificationDelegateAdmin] = useState(false);
  const [pageIndexReceived, setPageIndexReceived] = useState(1);
  const [pageCountReceived, setPageCountReceived] = useState(0);
  const [pageIndexSended, setPageIndexSended] = useState(1);
  const [pageCountSended, setPageCountSended] = useState(0);
  const [hasNotifReceived, setHasNotifReceived] = useState(false);
  const [hasNotifSended, setHasNotifSended] = useState(false);
  const isMounted = useRef(true);
  const btnSwitchReceivedNotif = useRef(null);
  const btnSwitchSendedNotif = useRef(null);
  const pageSize = 12;

  const getNotificationReceived = useCallback(async () => {
    // setErrorFetch(false);
    // setLoading(true);
    const getNotificationReceivedEndPoint = `${apiDomain}/api/${apiVersion}/notifications/pagination-notification-received/${userData._id}?page=${pageIndexReceived - 1}`;
    await axiosInstance.get(getNotificationReceivedEndPoint)
      .then(async (response) => {
        if(isMounted.current){
          if(response.data.totalNotifReceived >= 1){
            setNotificationReceived(response.data.arrayData);
            setPageCountReceived(Math.ceil(response.data.totalNotifReceived / pageSize));
            setHasNotifReceived(true);
          }else{
            setHasNotifReceived(false);
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
  }, [userData, pageIndexReceived]);

  const getNotificationSended = useCallback(async () => {
    // setErrorFetch(false);
    // setLoading(true);
    const getNotificationSendedEndPoint = `${apiDomain}/api/${apiVersion}/notifications/pagination-notification-sended/${userData._id}?page=${pageIndexSended - 1}`;
    await axiosInstance.get(getNotificationSendedEndPoint)
      .then(async (response) => {
        if(isMounted.current){
          if(response.data.totalNotifSended >=1){
            setNotificationSended(response.data.arrayData);
            setPageCountSended(Math.ceil(response.data.totalNotifSended / pageSize));
            setHasNotifSended(true);
          }else{
            setHasNotifSended(false);
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
  }, [userData, pageIndexSended]);

  useEffect(() => {
    if(userData){
      getNotificationReceived();
      getNotificationSended();
    }
  }, [userData, getNotificationReceived, getNotificationSended]);


  useEffect(() => {
    return () => {
      isMounted.current = false;
    }
  }, []);

  useEffect(() => {
    if(hasNotifReceived && !hasNotifSended){
      btnSwitchReceivedNotif.current.classList.add("btn-switch-notification-active");
      btnSwitchReceivedNotif.current.classList.remove("btn-switch-notification-inactive");
    }else if(hasNotifSended && !hasNotifReceived){
      btnSwitchSendedNotif.current.classList.add("btn-switch-notification-active");
      btnSwitchSendedNotif.current.classList.remove("btn-switch-notification-inactive");
    }else if(hasNotifReceived && hasNotifSended && !btnSwitchSendedNotif.current.classList.contains("btn-switch-notification-active")){
      btnSwitchReceivedNotif.current.classList.add("btn-switch-notification-active");
      btnSwitchSendedNotif.current.classList.add("btn-switch-notification-inactive");
    }else if(hasNotifReceived && hasNotifSended && !btnSwitchReceivedNotif.current.classList.contains("btn-switch-notification-active")){
      btnSwitchReceivedNotif.current.classList.add("btn-switch-notification-active");
      btnSwitchSendedNotif.current.classList.add("btn-switch-notification-inactive");
    }
  }, [hasNotifReceived, hasNotifSended]);

  const notificationRequest = async (urlRequest, id, isAccepted) => {
    const requestNotificationEndpoint = `${apiDomain}/api/${apiVersion}/requests/${urlRequest}/${id}?acceptedRequest=${isAccepted}`;
    await axiosInstance.get(requestNotificationEndpoint);
  };

  const deleteNotification = async (notificationId) => {
    const removeNotificationEndpoint = `${apiDomain}/api/${apiVersion}/notifications/${notificationId}`;
    await axiosInstance.delete(removeNotificationEndpoint);
  }

  useEffect(() => {
    if(!hasNotifSended){
      setNotificationTable(true);
    }
  }, [hasNotifSended, setNotificationTable]);

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

  let trTableNotificationReceived = notificationReceived.map((notification) => {
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

  let trTableNotificationSended = notificationSended.map((notification, index) => {
    return (
      <tr key={`notificiation-${index}`}>
        <td className="td-align-center">
          {notificationSendedTypes(notification.type)}
        </td>
        <td className="td-align-center">
          {notification.userId.firstname} {notification.userId.lastname}
        </td>
        <td>
          <div className="div-list-table-action">
            <button title="Annuler la notification" type="button" className="list-table-one-action" onClick={()=>{deleteNotification(notification._id)}}><FontAwesomeIcon icon="trash"/></button>
          </div>
        </td>
      </tr>  
    )
  });

  const switchTableNotification = (tableName) => {
    if(tableName === "received"){
      if(notificationSended.length >= 1){
        btnSwitchReceivedNotif.current.classList.add("btn-switch-notification-active");
        btnSwitchReceivedNotif.current.classList.remove("btn-switch-notification-inactive");
        btnSwitchSendedNotif.current.classList.add("btn-switch-notification-inactive");
        btnSwitchSendedNotif.current.classList.remove("btn-switch-notification-active");
        setNotificationTable(true);
      }
    }else if (tableName === "sended"){
      if(notificationReceived.length >= 1){
        btnSwitchReceivedNotif.current.classList.add("btn-switch-notification-inactive");
        btnSwitchReceivedNotif.current.classList.remove("btn-switch-notification-active");
        btnSwitchSendedNotif.current.classList.add("btn-switch-notification-active");
        btnSwitchSendedNotif.current.classList.remove("btn-switch-notification-inactive");
        setNotificationTable(false);
      }
    }
  }

  return (
    <div className="container-brand">
      <div className="option-component">
        <div className="container-btn-switch-notification-table">
        {console.log(hasNotifReceived)}
          {hasNotifReceived && <button ref={btnSwitchReceivedNotif} onClick={()=> switchTableNotification("received")}>Notif. reçues</button>}
          {hasNotifSended && <button ref={btnSwitchSendedNotif} onClick={()=> switchTableNotification("sended")}>Notif. envoyées</button>}
        </div>
        {hasNotifReceived && !hasNotifSended &&
          <Table 
            columns={columnsNotifReceived}
            customTableClass={{customThead: "centered-thead"}}
            trTable={trTableNotificationReceived}
            pagination={true}
            paginationInfo={{pageIndex : pageIndexReceived, setPageIndex: setPageIndexReceived, pageCount : pageCountReceived}}
          />
        }
        {hasNotifSended && !hasNotifReceived && 
          <Table 
            columns={columnsNotifSended}
            customTableClass={{customThead: "centered-thead"}}
            trTable={trTableNotificationSended}
            pagination={true}
            paginationInfo={{pageIndex : pageIndexSended, setPageIndex: setPageIndexSended, pageCount : pageCountSended}}
          />
        }
        {hasNotifReceived && hasNotifSended && 
          <>
            {notificationTable ? 
              <Table 
                columns={columnsNotifReceived}
                customTableClass={{customThead: "centered-thead"}}
                trTable={trTableNotificationReceived}
                pagination={true}
                paginationInfo={{pageIndex : pageIndexReceived, setPageIndex: setPageIndexReceived, pageCount : pageCountReceived}}
              />
              : 
              <Table 
                columns={columnsNotifSended}
                customTableClass={{customThead: "centered-thead"}}
                trTable={trTableNotificationSended}
                pagination={true}
                paginationInfo={{pageIndex : pageIndexSended, setPageIndex: setPageIndexSended, pageCount : pageCountSended}}
              />
            }
          </>
        }
        {!hasNotifReceived && !hasNotifSended && 
          <div className="no-data-option">
            <p>Pas de notification!</p>
          </div>
        }
      </div>
    </div>
  )
}

NotificationOptionProfile.propTypes = {
  switchToHouseholdOptions: PropTypes.func.isRequired,
  otherMemberEligible: PropTypes.bool.isRequired
}

export default NotificationOptionProfile
