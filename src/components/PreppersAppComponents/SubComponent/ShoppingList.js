import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  useUserData,
  useUserHouseHoldData,
  useWindowWidth,
  useSocket,
} from "./../DataContext";
import Loading from "../UtilitiesComponent/Loading";
import axiosInstance from "../../../utils/axiosInstance";
import { apiDomain, apiVersion } from "../../../apiConfig/ApiConfig";
import exportFromJSON from "export-from-json";
import { transformDate } from "../../../helpers/transformDate.helper";
import TitleButtonInteraction from "./../UtilitiesComponent/TitleButtonInteraction";
import {
  columnsShoppingListMobile,
  columnsShoppingListTablet,
  columnsShoppingListFullScreen,
} from "./../../../utils/localData";
import { pageSize } from "./../../../utils/globalVariable";
import Table from "./../UtilitiesComponent/Table";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function ShoppingList() {
  const [loading, setLoading] = useState(true);
  const [errorFetch, setErrorFetch] = useState(false);
  const isMounted = useRef(true);
  const [openTitleMessage, setOpenTitleMessage] = useState(false);
  const [deleteAllMessage, setDeleteAllMessage] = useState(false);
  const { userData } = useUserData();
  const { userHouseholdData } = useUserHouseHoldData();
  const { windowWidth } = useWindowWidth();
  const { socketRef } = useSocket();
  const [shoppingList, setShoppingList] = useState([]);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const [hasProduct, setHasProduct] = useState(false);
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    let socket = null;

    if (socketRef.current && userHouseholdData) {
      socket = socketRef.current;
      socket.emit("enterSocketRoom", {
        socketRoomName: `${userHouseholdData._id}/shoppingList/${
          pageIndex - 1
        }`,
      });

      socket.on("connect", () => {
        socket.emit("enterSocketRoom", {
          socketRoomName: `${userHouseholdData._id}/shoppingList/${
            pageIndex - 1
          }`,
        });
      });
    }

    return () => {
      if (socket && userHouseholdData) {
        socket.emit("leaveSocketRoom", {
          socketRoomName: `${userHouseholdData._id}/shoppingList/${
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
      let newDataArray = [data, ...shoppingList];
      if (newDataArray.length > pageSize) newDataArray.pop();
      setShoppingList(newDataArray);
      if (newDataArray.length === 1) {
        setHasProduct(true);
        setPageCount(1);
      }
    },
    [shoppingList]
  );

  const updatedData = useCallback(
    (data) => {
      let { arrayData, dataIndex } = findIndexData(shoppingList, data._id);
      arrayData[dataIndex] = data;
      setShoppingList(arrayData);
    },
    [shoppingList]
  );

  const updateDataArray = useCallback((data) => {
    setShoppingList(data.arrayData);
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
    setColumns(columnsShoppingListMobile);

    if (windowWidth >= 992) {
      setColumns(columnsShoppingListTablet);
    }

    if (windowWidth >= 1312) {
      setColumns(columnsShoppingListFullScreen);
    }
  }, [setColumns, windowWidth]);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, [isMounted]);

  const loadShoppingList = useCallback(async () => {
    if (userData) {
      setErrorFetch(false);
      setLoading(true);
      const getShoppingListEndPoint = `${apiDomain}/api/${apiVersion}/shopping-lists/pagination/${
        userData.householdId
      }?page=${pageIndex - 1}`;
      await axiosInstance
        .get(getShoppingListEndPoint)
        .then((response) => {
          if (isMounted.current) {
            if (response.data.totalData >= 1) {
              setShoppingList(response.data.arrayData);
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
      loadShoppingList();
    }
  }, [userData, loadShoppingList]);

  const downloadShoppingList = async () => {
    let downloadShoppingListEndPoint = `${apiDomain}/api/${apiVersion}/shopping-lists/download/${userData.householdId}`;

    await axiosInstance.get(downloadShoppingListEndPoint).then((response) => {
      const data = response.data;
      const date = transformDate(new Date());
      const fileName = `Liste-de-course-${date}`;
      const exportType = "xls";

      exportFromJSON({ data, fileName, exportType });
    });
  };

  const sendShoppingListEmail = async () => {
    let sendShoppingListEmailEndPoint = `${apiDomain}/api/${apiVersion}/shopping-lists/send-mail/${userData.householdId}`;

    await axiosInstance.get(sendShoppingListEmailEndPoint);
  };

  const deleteAllShoppingList = async () => {
    let deleteDataEndPoint = `${apiDomain}/api/${apiVersion}/shopping-lists/delete-all/${userData.householdId}`;

    await axiosInstance.delete(deleteDataEndPoint).then((response) => {
      if (response.status === 204) {
        setShoppingList([]);
        setPageCount(0);
        setHasProduct(false);
      }
    });
  };

  const closeAllTitleMessage = () => {
    setOpenTitleMessage(!openTitleMessage);
    setDeleteAllMessage(false);
  };

  let contentTitleInteractionSmartPhone = (
    <>
      {openTitleMessage && (
        <>
          {!deleteAllMessage && (
            <div className="multiple-action-container">
              <button className="small-btn-purple" onClick={() => {}}>
                <FontAwesomeIcon className="btn-icon" icon="download" />{" "}
                Télécharger la liste
              </button>
              <button
                className="small-btn-purple"
                onClick={sendShoppingListEmail}
              >
                <FontAwesomeIcon className="btn-icon" icon="envelope" /> Envoyer
                la liste par mail
              </button>
              <button
                className="small-btn-red"
                onClick={() => {
                  setDeleteAllMessage(!deleteAllMessage);
                }}
              >
                <FontAwesomeIcon className="btn-icon" icon="trash" /> Supprimer
                la liste!
              </button>
            </div>
          )}
          {deleteAllMessage && (
            <div className="title-message-container-delete-action">
              <p>
                Êtes-vous sur et certain de vouloir supprimer toute la liste de
                course? Toutes les courses seront perdues !
              </p>
              <div className="btn-delete-action-container">
                <button
                  className={
                    userHouseholdData.isWaiting
                      ? "small-btn-disabled"
                      : "small-btn-red"
                  }
                  onClick={() => {
                    deleteAllShoppingList();
                  }}
                  disabled={userHouseholdData.isWaiting}
                >
                  Oui
                </button>
                <button
                  className="small-btn-purple"
                  onClick={() => {
                    setDeleteAllMessage(!deleteAllMessage);
                  }}
                >
                  Non
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );

  let contentTitleInteractionFullScreen = (
    <>
      {openTitleMessage && (
        <div className="title-message-container-delete-action">
          {userHouseholdData.isWaiting ? (
            <p>
              Vous ne pouvez effectuer cette action tant qu'il n'y a pas
              d'administrateur dans votre famille!
            </p>
          ) : (
            <p>
              Êtes-vous sur et certain de vouloir supprimer toute la liste de
              course? Toutes les courses seront perdues !
            </p>
          )}
          <div className="btn-delete-action-container">
            <button
              className={
                userHouseholdData.isWaiting
                  ? "small-btn-disabled"
                  : "small-btn-red"
              }
              onClick={() => {
                deleteAllShoppingList();
              }}
              disabled={userHouseholdData.isWaiting}
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

  const deleteShopping = async (rowId) => {
    if (shoppingList.length === 1 && pageIndex > 1) {
      setPageIndex((currPageIndex) => currPageIndex - 1);
    }

    let deleteDataEndPoint = `${apiDomain}/api/${apiVersion}/shopping-lists/${rowId}`;

    await axiosInstance.delete(deleteDataEndPoint);
  };

  let trTable = shoppingList.map((row, indexRow) => {
    let objectPropertyName;
    if (row.product) {
      objectPropertyName = "product";
    } else {
      objectPropertyName = "historic";
    }
    return (
      <tr key={`${row}-${indexRow}`}>
        {columns.map((column, index) => {
          if (column.id === "action") {
            return (
              <td key={`${column.id}-${index}`}>
                <div className="div-list-table-action">
                  <button
                    className={
                      userHouseholdData.isWaiting
                        ? "list-table-one-action-disabled "
                        : "list-table-one-action"
                    }
                    onClick={() => deleteShopping(row._id)}
                    disabled={userHouseholdData.isWaiting}
                  >
                    <FontAwesomeIcon icon="trash" />
                  </button>
                </div>
              </td>
            );
          }
          if (column.id === "name") {
            let tdProps = {};
            if (row[objectPropertyName].name.length >= 24) {
              tdProps = {
                title: `${row[objectPropertyName].name}`,
                className: "ellipsis-info",
              };
            }
            return (
              <td key={`${column.id}-${index}`} {...tdProps}>
                {row[objectPropertyName].name}
              </td>
            );
          }
          if (column.id === "brand") {
            return (
              <td key={`${column.id}-${index}`}>
                {row[objectPropertyName].brand.brandName.label}
              </td>
            );
          }
          if (column.id === "weight") {
            return (
              <td key={`${column.id}-${index}`}>
                {row[objectPropertyName].weight}
              </td>
            );
          }
          if (column.id === "numberProduct") {
            return <td key={`${column.id}-${index}`}>{row[column.id]}</td>;
          }
          return null;
        })}
      </tr>
    );
  });

  return (
    <>
      {(windowWidth < 1320 || (windowWidth >= 1320 && hasProduct)) && (
        <div className="sub-header only-option-interaction">
          <div className="sub-option">
            {shoppingList.length > 1 && <h1>Liste de courses</h1>}
            {shoppingList.length <= 1 && <h1>Liste de course</h1>}
            {hasProduct && (
              <>
                {windowWidth >= 1320 && (
                  <div className="multiple-button-option">
                    <button
                      className="btn-action-title"
                      title="Télécharger la liste"
                      onClick={downloadShoppingList}
                    >
                      <FontAwesomeIcon icon="download" />
                    </button>
                    <button
                      className="btn-action-title"
                      title="Envoyer la liste par mail"
                      onClick={sendShoppingListEmail}
                    >
                      <FontAwesomeIcon icon="envelope" />
                    </button>
                    <TitleButtonInteraction
                      title={"Supprimer toute la liste !"}
                      openTitleMessage={openTitleMessage}
                      setOpenTitleMessage={setOpenTitleMessage}
                      icon={<FontAwesomeIcon icon="trash" />}
                      contentDiv={contentTitleInteractionFullScreen}
                    />
                  </div>
                )}
                {windowWidth < 1320 && (
                  <TitleButtonInteraction
                    title={"Actions liste de course"}
                    openTitleMessage={openTitleMessage}
                    setOpenTitleMessage={closeAllTitleMessage}
                    icon={<FontAwesomeIcon icon="cog" />}
                    contentDiv={contentTitleInteractionSmartPhone}
                  />
                )}
              </>
            )}
          </div>
        </div>
      )}

      <div className="container-loading">
        <Loading
          loading={loading}
          errorFetch={errorFetch}
          retryFetch={loadShoppingList}
        />
        {!hasProduct && (
          <div className="no-data">
            <p>Pas de produit dans la liste de course !</p>
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

export default ShoppingList;
