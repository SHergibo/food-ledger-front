import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useNotificationData, useWindowWidth } from "./../DataContext";
import axiosInstance from "../../../utils/axiosInstance";
import { apiDomain, apiVersion } from "../../../apiConfig/ApiConfig";

function SubContainer() {
  const navigate = useNavigate();
  const location = useLocation();
  const { notificationReceived, notificationType } = useNotificationData();
  const { windowWidth } = useWindowWidth();

  useEffect(() => {
    if (
      windowWidth >= 768 &&
      location.pathname === "/app/notification" &&
      location.length <= 2
    ) {
      navigate("/app/liste-produit");
    } else if (
      windowWidth >= 768 &&
      location.pathname === "/app/notification" &&
      location.length > 2
    ) {
      navigate(-1);
    }
  }, [windowWidth, navigate, location]);

  const interactionNotification = async (urlRequest, id, accepted) => {
    let requestNotificationEndPoint = `${apiDomain}/api/${apiVersion}/requests/${urlRequest}/${id}?acceptedRequest=${accepted}`;

    if (notificationType === "received" || notificationType === "sended") {
      requestNotificationEndPoint = `${requestNotificationEndPoint}&type=${notificationType}`;
    }
    await axiosInstance.get(requestNotificationEndPoint);
  };

  const delegateNotification = () => {
    navigate("/app/options", {
      state: {
        householdOptions: true,
      },
    });
  };

  const goToNotification = () => {
    navigate("/app/options", {
      state: {
        notificationReceived: true,
      },
    });
  };

  const deleteNotification = async (id) => {
    let deleteNotificationEndPoint = `${apiDomain}/api/${apiVersion}/notifications/${id}`;

    if (notificationType === "received" || notificationType === "sended") {
      deleteNotificationEndPoint = `${deleteNotificationEndPoint}?type=${notificationType}`;
    }

    await axiosInstance.delete(deleteNotificationEndPoint);
  };

  return (
    <div className="container-sub">
      <div className="container-notification">
        {notificationReceived.length <= 0 ? (
          <p className="zero-notification">Pas de notification !</p>
        ) : (
          <>
            <div className="scrollable-container-notif">
              {notificationReceived.map((notif) => {
                return (
                  <div className="notification" key={notif._id}>
                    <div className="notification-message">{notif.message}</div>
                    <div className="notification-interaction">
                      {notif.type !== "information" ? (
                        <>
                          {notif.type === "need-switch-admin" ? (
                            <button
                              className="small-btn-purple"
                              onClick={delegateNotification}
                            >
                              Déléguer
                            </button>
                          ) : (
                            <button
                              className="small-btn-purple"
                              onClick={() =>
                                interactionNotification(
                                  notif.urlRequest,
                                  notif._id,
                                  "yes"
                                )
                              }
                            >
                              Accepter
                            </button>
                          )}
                          {notif.type === "request-delegate-admin" ||
                          notif.type ===
                            "last-chance-request-delegate-admin" ? (
                            <button
                              className="small-btn-purple"
                              onClick={delegateNotification}
                            >
                              Déléguer
                            </button>
                          ) : (
                            <button
                              className="small-btn-purple"
                              onClick={() =>
                                interactionNotification(
                                  notif.urlRequest,
                                  notif._id,
                                  "no"
                                )
                              }
                            >
                              Refuser
                            </button>
                          )}
                        </>
                      ) : (
                        <button
                          className="small-btn-purple"
                          onClick={() => deleteNotification(notif._id)}
                        >
                          Supprimer
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="all-notif">
              <button onClick={goToNotification}>
                Voir toutes les notifications
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default SubContainer;
