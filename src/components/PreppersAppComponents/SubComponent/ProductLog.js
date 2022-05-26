import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  useUserData,
  useWindowWidth,
  useSocket,
  useUserHouseHoldData,
} from "./../DataContext";
import Loading from "../UtilitiesComponent/Loading";
import axiosInstance from "../../../utils/axiosInstance";
import { apiDomain, apiVersion } from "../../../apiConfig/ApiConfig";
import TitleButtonInteraction from "./../UtilitiesComponent/TitleButtonInteraction";
import { transformDate } from "../../../helpers/transformDate.helper";
import {
  columnsLogMobile,
  columnsLogTablet,
  columnsLogFullScreen,
} from "./../../../utils/localData";
import { pageSize } from "./../../../utils/globalVariable";
import Table from "./../UtilitiesComponent/Table";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PropTypes from "prop-types";

function ProductLog({ history }) {
  const [loading, setLoading] = useState(true);
  const [errorFetch, setErrorFetch] = useState(false);
  const isMounted = useRef(true);
  const [openTitleMessage, setOpenTitleMessage] = useState(false);
  const { userData } = useUserData();
  const { windowWidth } = useWindowWidth();
  const { socketRef } = useSocket();
  const { userHouseholdData } = useUserHouseHoldData();
  const [productLog, setProductLog] = useState([]);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const [hasProduct, setHasProduct] = useState(false);
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    if (userData && userData.role !== "admin") {
      history.push({
        pathname: "/app/liste-produit",
      });
    }
  }, [userData, history]);

  useEffect(() => {
    let socket = null;

    if (socketRef.current && userHouseholdData) {
      socket = socketRef.current;
      socket.emit("enterSocketRoom", {
        socketRoomName: `${userHouseholdData._id}/productLog/${pageIndex - 1}`,
      });

      socket.on("connect", () => {
        socket.emit("enterSocketRoom", {
          socketRoomName: `${userHouseholdData._id}/productLog/${
            pageIndex - 1
          }`,
        });
      });
    }

    return () => {
      if (socket && userHouseholdData) {
        socket.emit("leaveSocketRoom", {
          socketRoomName: `${userHouseholdData._id}/productLog/${
            pageIndex - 1
          }`,
        });
        socket.off("connect");
      }
    };
  }, [userHouseholdData, socketRef, pageIndex]);

  const findIndexData = (data, dataId) => {
    let arrayData = [...data];
    let dataIndex = arrayData.findIndex((data) => data._id === dataId);
    return { arrayData, dataIndex };
  };

  const addedData = useCallback(
    (data) => {
      let newDataArray = [data, ...productLog];
      if (newDataArray.length > pageSize) newDataArray.pop();
      setProductLog(newDataArray);
      if (newDataArray.length === 1) {
        setHasProduct(true);
        setPageCount(1);
      }
    },
    [productLog]
  );

  const updatedData = useCallback(
    (data) => {
      let { arrayData, dataIndex } = findIndexData(productLog, data._id);
      arrayData[dataIndex] = data;
      setProductLog(arrayData);
    },
    [productLog]
  );

  const updateDataArray = useCallback((data) => {
    setProductLog(data.arrayData);
    if (data.totalData >= 1) {
      setPageCount(Math.ceil(data.totalData / pageSize));
      setHasProduct(true);
      if (data.arrayData.length === 0) {
        setPageIndex((currPageIndex) => currPageIndex - 1);
      }
    } else {
      setHasProduct(false);
    }
  }, []);

  const updatePageCount = useCallback((data) => {
    setPageCount(Math.ceil(data.totalData / pageSize));
  }, []);

  useEffect(() => {
    let socket = null;

    if (socketRef.current) {
      socket = socketRef.current;

      socket.on("addedData", (data) => {
        addedData(data);
      });

      socket.on("updatedData", (data) => {
        updatedData(data);
      });

      socket.on("updateDataArray", (data) => {
        updateDataArray(data);
      });

      socket.on("updatePageCount", (data) => {
        updatePageCount(data);
      });
    }

    return () => {
      if (socket) {
        socket.off("addedData");
        socket.off("updatedData");
        socket.off("updateDataArray");
        socket.off("updatePageCount");
      }
    };
  }, [socketRef, addedData, updatedData, updateDataArray, updatePageCount]);

  useEffect(() => {
    setColumns(columnsLogMobile);

    if (windowWidth >= 992) {
      setColumns(columnsLogTablet);
    }

    if (windowWidth >= 1312) {
      setColumns(columnsLogFullScreen);
    }
  }, [setColumns, windowWidth]);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, [isMounted]);

  const loadProductLog = useCallback(async () => {
    if (userData) {
      setErrorFetch(false);
      setLoading(true);
      const getProductLogEndPoint = `${apiDomain}/api/${apiVersion}/product-logs/pagination/${
        userData.householdId
      }?page=${pageIndex - 1}`;
      await axiosInstance
        .get(getProductLogEndPoint)
        .then((response) => {
          if (isMounted.current) {
            if (response.data.totalData >= 1) {
              setProductLog(response.data.arrayData);
              setPageCount(Math.ceil(response.data.totalData / pageSize));
              setHasProduct(true);
            } else {
              setHasProduct(false);
            }
            setLoading(false);
          }
        })
        .catch((error) => {
          let jsonError = JSON.parse(JSON.stringify(error));
          if (isMounted.current) {
            if (error.code === "ECONNABORTED" || jsonError.name === "Error") {
              setErrorFetch(true);
            }
          }
        });
    }
  }, [userData, pageIndex]);

  useEffect(() => {
    if (userData) {
      loadProductLog();
    }
  }, [userData, loadProductLog]);

  const deleteAllProductLog = async () => {
    let deleteDataEndPoint = `${apiDomain}/api/${apiVersion}/product-logs/delete-all/${userData.householdId}`;

    await axiosInstance.delete(deleteDataEndPoint).then(() => {
      setProductLog([]);
      setPageCount(0);
      setHasProduct(false);
    });
  };

  let contentTitleInteraction = (
    <>
      {openTitleMessage && (
        <div className="title-message-container-delete-action">
          <p>
            Êtes-vous sur et certain de vouloir supprimer tout le registre? Tous
            les registres seront perdus !
          </p>
          <div className="btn-delete-action-container">
            <button
              className="small-btn-red"
              onClick={() => {
                deleteAllProductLog();
              }}
            >
              Oui
            </button>
            <button
              className="small-btn-purple"
              onClick={() => {
                setOpenTitleMessage(!openTitleMessage);
              }}
            >
              Non
            </button>
          </div>
        </div>
      )}
    </>
  );

  const deleteProductLog = async (rowId) => {
    if (productLog.length === 1 && pageIndex > 1) {
      setPageIndex((currPageIndex) => currPageIndex - 1);
    }

    let deleteDataEndPoint = `${apiDomain}/api/${apiVersion}/product-logs/${rowId}`;

    await axiosInstance.delete(deleteDataEndPoint);
  };

  let trTable = productLog.map((row, indexRow) => {
    return (
      <tr key={`${row}-${indexRow}`}>
        {columns.map((column, index) => {
          if (column.id === "action") {
            return (
              <td key={`${column.id}-${index}`}>
                <div className="div-list-table-action">
                  <button
                    className="list-table-one-action"
                    onClick={() => deleteProductLog(row._id)}
                  >
                    <FontAwesomeIcon icon="trash" />
                  </button>
                </div>
              </td>
            );
          }
          if (
            column.id !== "user" &&
            column.id !== "createdAt" &&
            column.id !== "infoProduct"
          ) {
            if (column.id === "productName") {
              let tdProps = {};
              if (row[column.id].length >= 24) {
                tdProps = {
                  title: `${row[column.id]}`,
                  className: "ellipsis-info",
                };
              }
              return (
                <td key={`${column.id}-${index}`} {...tdProps}>
                  {row[column.id]}
                </td>
              );
            } else {
              return <td key={`${column.id}-${index}`}>{row[column.id]}</td>;
            }
          }
          if (column.id === "user") {
            return (
              <td key={`${column.id}-${index}`}>{row[column.id].firstname}</td>
            );
          }
          if (column.id === "infoProduct") {
            if (row[column.id] === "Ajout") {
              return (
                <td key={`${column.id}-${index}`}>
                  <span className="color-code-green">{row[column.id]}</span>
                </td>
              );
            } else if (row[column.id] === "Suppression") {
              return (
                <td key={`${column.id}-${index}`}>
                  <span className="color-code-red">{row[column.id]}</span>
                </td>
              );
            } else if (row[column.id] === "Mise à jour") {
              if (row.numberProduct.indexOf("-") === -1) {
                return (
                  <td key={`${column.id}-${index}`}>
                    <span className="color-code-green">{row[column.id]}</span>
                  </td>
                );
              } else {
                return (
                  <td key={`${column.id}-${index}`}>
                    <span className="color-code-red">{row[column.id]}</span>
                  </td>
                );
              }
            }
          }
          if (column.id === "createdAt") {
            return (
              <td key={`${column.id}-${index}`}>
                {transformDate(row[column.id])}
              </td>
            );
          }
          return null;
        })}
      </tr>
    );
  });

  return (
    <>
      {(windowWidth < 1320 ||
        (windowWidth >= 1320 && productLog.length >= 1)) && (
        <div className="sub-header only-option-interaction">
          <div className="sub-option">
            <h1>Registre des produits</h1>
            {productLog.length >= 1 && (
              <TitleButtonInteraction
                title={"Supprimer tout le registre"}
                openTitleMessage={openTitleMessage}
                setOpenTitleMessage={setOpenTitleMessage}
                icon={<FontAwesomeIcon icon="trash" />}
                contentDiv={contentTitleInteraction}
              />
            )}
          </div>
        </div>
      )}

      <div className="container-loading">
        <Loading
          loading={loading}
          errorFetch={errorFetch}
          retryFetch={loadProductLog}
        />
        {!hasProduct && (
          <div className="no-data">
            <p>Pas de produit dans le registre !</p>
          </div>
        )}

        {hasProduct && (
          <Table
            columns={columns}
            trTable={trTable}
            pagination={true}
            paginationInfo={{ pageIndex, setPageIndex, pageCount }}
          />
        )}
      </div>
    </>
  );
}

ProductLog.propTypes = {
  history: PropTypes.object.isRequired,
};

export default ProductLog;
