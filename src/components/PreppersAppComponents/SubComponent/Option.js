import React, { useEffect, useRef, useState, useMemo } from "react";
import { useLocation, useNavigate, useOutletContext } from "react-router-dom";
import {
  useUserData,
  useUserHouseHoldData,
  useNotificationData,
  useWindowWidth,
} from "../DataContext";
import UserOptionProfile from "./OptionComponents/UserOptionProfile";
import NotificationReceivedOption from "./OptionComponents/NotificationReceivedOption";
import NotificationSendedOption from "./OptionComponents/NotificationSendedOption";
import HouseholdOptionProfile from "./OptionComponents/HouseholdOptionProfile";
import CreateHouseholdForm from "./OptionComponents/CreateHouseholdForm";
import EmailOptionProfile from "./OptionComponents/EmailOptionProfile";
import ProductOptionProfile from "./OptionComponents/ProductOptionProfile";
import ProductTableOptionProfile from "./OptionComponents/ProductTableOptionProfile";
import BrandOption from "./OptionComponents/BrandOption";
import { useForm } from "react-hook-form";
import axiosInstance from "../../../utils/axiosInstance";
import { apiDomain, apiVersion } from "../../../apiConfig/ApiConfig";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import TitleButtonInteraction from "../UtilitiesComponent/TitleButtonInteraction";
import { SwitchTransition, CSSTransition } from "react-transition-group";
import Select from "react-select";

const customStyles = {
  control: (styles) => ({
    ...styles,
    width: "100%",
    marginRight: "0.5rem",
    padding: "2.5px 10px",
    transition: ".2s ease-in-out",
    outline: "none",
    boxShadow: "none",
    backgroundColor: "transparent",
    color: "hsl(0, 0%, 35%)",
    borderColor: "hsl(257, 63%, 52%)",
    borderRadius: "0.625rem",
    "@media (min-width: 768px)": {
      padding: "8.5px 10px",
    },
  }),
  option: (styles, { isFocused, isSelected }) => ({
    ...styles,
    color: isSelected || isFocused ? "#fff" : "hsl(0, 0%, 35%)",
    backgroundColor: isSelected || isFocused ? "hsl(257, 63%, 52%)" : "#fff",
  }),
  singleValue: (styles) => ({
    ...styles,
    color: "hsl(0, 0%, 35%)",
    fontSize: "1.125rem",
  }),
  menu: (styles) => ({
    ...styles,
    marginTop: "1px",
    borderRadius: "0.625rem",
    overflow: "hidden",
    zIndex: "11",
  }),
  dropdownIndicator: (styles) => ({
    ...styles,
    color: "hsl(257, 63%, 52%)",
  }),
  indicatorSeparator: (styles) => ({
    ...styles,
    backgroundColor: "transparent",
  }),
};

function Option() {
  const setOptionSubTitle = useOutletContext();
  const location = useLocation();
  const navigate = useNavigate();
  const { userData } = useUserData();
  const { userHouseholdData } = useUserHouseHoldData();
  const { notificationReceived } = useNotificationData();
  const { windowWidth } = useWindowWidth();
  const [openTitleMessage, setOpenTitleMessage] = useState(false);
  const [delegate, setDelegate] = useState(false);
  const [didNoTAcceptDelegate, setdidNoTAcceptDelegate] = useState(false);
  const [requestDelegateAdmin, setRequestDelegateAdmin] = useState(false);
  const [otherMemberEligible, setOtherMemberEligible] = useState(false);
  const [option, setOption] = useState({
    label: "Profil",
    value: "userOptions",
  });
  const [objectTitle, setObjectTitle] = useState({});
  const isMounted = useRef(true);
  const btnMenuRef = useRef([]);

  const {
    register: registerFormDelegateWhenDeleting,
    handleSubmit: handleSubmitFormDelegateWhenDeleting,
  } = useForm({
    mode: "onChange",
  });

  let btnOptionMenu = useMemo(() => {
    return [
      { label: "Profil", value: "userOptions" },
      { label: "Notification reçue", value: "notificationReceived" },
      { label: "Notification envoyée", value: "notificationSended" },
      { label: "Famille", value: "householdOptions" },
      { label: "E-mailing", value: "emailingOptions" },
      { label: "Produits", value: "productOptions" },
      { label: "Tableau produits", value: "productTableOptions" },
      { label: "Marques", value: "brandOptions" },
    ];
  }, []);

  const switchMenu = (menuId, optionObject) => {
    let oldActive = btnMenuRef.current.find((element) => {
      if (element)
        return element.className.includes("btn-option-active") === true;
      return null;
    });
    if (oldActive) oldActive.classList.remove("btn-option-active");
    let newActive = btnMenuRef.current.find((element) => {
      if (element) return element.attributes.id.value === menuId;
      return null;
    });
    if (newActive) newActive.classList.add("btn-option-active");
    setOption(optionObject);
  };

  useEffect(() => {
    setOptionSubTitle("Profil");
  }, [setOptionSubTitle]);

  useEffect(() => {
    if (
      location?.state?.householdOptions ||
      location?.state?.brandOptions ||
      location?.state?.notificationReceived
    ) {
      switchMenu(
        Object.keys(location.state)[0],
        btnOptionMenu.find(
          (option) => option.value === Object.keys(location.state)[0]
        )
      );
      setOptionSubTitle(
        btnOptionMenu.find(
          (option) => option.value === Object.keys(location.state)[0]
        ).label
      );
    }
    window.history.replaceState({}, document.title);
  }, [location, btnOptionMenu, setOptionSubTitle]);

  useEffect(() => {
    if (userData) {
      setObjectTitle({
        userOptions: `Profil de ${userData.firstname} ${userData.lastname}`,
        notificationReceived: "Listes des notifications reçue.s",
        notificationSended: "Listes des notifications envoyée.s",
        householdOptions: "Gestion de votre Famille",
        emailingOptions: "Options e-mailing",
        productOptions: "Options produit",
        productTableOptions: "Options tableau de produits",
        brandOptions: "Gestion marque de produit",
      });
    }
  }, [userData]);

  useEffect(() => {
    if (!openTitleMessage) {
      setDelegate(false);
      setdidNoTAcceptDelegate(false);
    }
  }, [openTitleMessage]);

  useEffect(() => {
    if (notificationReceived.length >= 1) {
      const notificationRequestDelegateAdmin = notificationReceived.find(
        (notif) => notif.type === "request-delegate-admin"
      );
      if (notificationRequestDelegateAdmin !== undefined) {
        setRequestDelegateAdmin(true);
      } else {
        setRequestDelegateAdmin(false);
      }
    }
  }, [notificationReceived]);

  useEffect(() => {
    if (userHouseholdData && requestDelegateAdmin) {
      const memberEligible = userHouseholdData.members.filter(
        (member) => member.isFlagged === false
      );
      if (memberEligible.length > 1) {
        setOtherMemberEligible(true);
      } else {
        setOtherMemberEligible(false);
      }
    }
  }, [userHouseholdData, requestDelegateAdmin]);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  const deleteUser = async (data) => {
    let deleteUserDataEndPoint;
    if (data) {
      deleteUserDataEndPoint = `${apiDomain}/api/${apiVersion}/users/${userData._id}?delegateUserId=${data.delegateRadioInput}`;
    } else {
      deleteUserDataEndPoint = `${apiDomain}/api/${apiVersion}/users/${userData._id}`;
    }
    await axiosInstance.delete(deleteUserDataEndPoint).then((response) => {
      if (isMounted.current) {
        if (response.status === 200) {
          localStorage.clear();
          sessionStorage.clear();
          navigate("/");
        }
      }
    });
  };

  let contentTitleInteraction = (
    <>
      {openTitleMessage && (
        <>
          {((userData.role === "admin" &&
            userHouseholdData.members.length === 1) ||
            (userData.role === "admin" && didNoTAcceptDelegate) ||
            userData.role === "user") && (
            <div className="title-message-container-delete-action">
              {requestDelegateAdmin ? (
                <p>
                  Vous ne pouvez effectuer cette action tant que vous avez une
                  délégation de droit d'administration en cours!
                </p>
              ) : (
                <p>
                  Êtes-vous sur et certain de vouloir supprimer votre compte?
                  Toutes vos données seront perdues!
                </p>
              )}
              <div className="btn-delete-action-container">
                <button
                  className={
                    requestDelegateAdmin
                      ? "small-btn-disabled"
                      : "small-btn-red"
                  }
                  disabled={requestDelegateAdmin}
                  onClick={() => {
                    deleteUser();
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
          {userData.role === "admin" &&
            userHouseholdData.members.length > 1 &&
            !didNoTAcceptDelegate && (
              <div className="title-message-container-delete-action">
                {!delegate && (
                  <>
                    <p>
                      Voulez-vous déléguer vos droits d'administrations à un.e
                      membre de votre famille avant de supprimer votre compte ?
                    </p>
                    <p>
                      Si vous ne déléguez pas vos droits d'administrations, la
                      famille sera supprimée définitivement !
                    </p>
                    <div className="btn-delete-action-container">
                      <button
                        className="small-btn-red"
                        onClick={() => {
                          setDelegate(true);
                        }}
                      >
                        Oui
                      </button>
                      <button
                        className="small-btn-purple"
                        onClick={() => {
                          setdidNoTAcceptDelegate(true);
                        }}
                      >
                        Non
                      </button>
                    </div>
                  </>
                )}
                {delegate && (
                  <>
                    <p>
                      Choississez le/la membre à qui vous voulez déléguer les
                      droits d'administrations de cette famille !
                    </p>
                    <form
                      className="form-delegate"
                      onSubmit={handleSubmitFormDelegateWhenDeleting(
                        deleteUser
                      )}
                    >
                      {userHouseholdData.members.map((member, index) => {
                        if (
                          userData._id !== member.userData._id &&
                          member.isFlagged === false
                        ) {
                          let defaultChecked = false;
                          if (index === 1) {
                            defaultChecked = true;
                          }
                          return (
                            <label
                              key={`delMember-${index}`}
                              className="container-radio-input"
                              htmlFor={`delegateMemberDelete${index}`}
                            >
                              {member.userData.firstname}{" "}
                              {member.userData.lastname} :
                              <input
                                type="radio"
                                name="delegateRadioInput"
                                id={`delegateMemberDelete${index}`}
                                value={member.userData._id}
                                defaultChecked={defaultChecked}
                                {...registerFormDelegateWhenDeleting(
                                  "delegateRadioInput"
                                )}
                              />
                              <span className="radio-checkmark"></span>
                            </label>
                          );
                        } else {
                          return null;
                        }
                      })}
                      <button className="small-btn-red" type="submit">
                        Déléguer les droits et supprimer son compte !
                      </button>
                    </form>
                  </>
                )}
              </div>
            )}
        </>
      )}
    </>
  );

  let switchToHouseholdOptions = () => {
    switchMenu("householdOptions", {
      label: "Famille",
      value: "householdOptions",
    });
  };

  let interactSubMenuBtn = (e, option, optionSubTitle) => {
    e.persist();
    let oldActive = btnMenuRef.current.find((element) => {
      if (element)
        return element.className.includes("btn-option-active") === true;
      return null;
    });
    if (oldActive) oldActive.classList.remove("btn-option-active");
    setOption(option);
    setOptionSubTitle(optionSubTitle);
  };

  return (
    <>
      {userData && (
        <>
          <div className="sub-header">
            <div className="sub-interaction">
              <div className="btn-option-container">
                {windowWidth < 1320 ? (
                  <div className="input-group">
                    <label className="form-label-grey" htmlFor="menuOption">
                      Menu options
                    </label>
                    <Select
                      inputId="menuOption"
                      styles={customStyles}
                      value={option}
                      options={btnOptionMenu}
                      onChange={(selectedOption) => {
                        setOption(selectedOption);
                      }}
                    />
                  </div>
                ) : (
                  <>
                    {btnOptionMenu.map((btn, index) => {
                      if (btn.value === "notificationReceived") {
                        return (
                          <div
                            tabIndex={0}
                            ref={(el) => (btnMenuRef.current[index] = el)}
                            id={`${btn.value}`}
                            key={`${btn.value}-${index}`}
                            className={`multiple-link-btn ${
                              btn.value === "userOptions"
                                ? "btn-option-active"
                                : ""
                            }`}
                            onKeyUp={(e) => {
                              e.stopPropagation();
                              if (
                                e.key === "Enter" &&
                                e.target.id === "notificationReceived"
                              ) {
                                interactSubMenuBtn(
                                  e,
                                  btn,
                                  "Notification reçue"
                                );
                                e.target.classList.add("btn-option-active");
                              }
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              interactSubMenuBtn(e, btn, "Notification reçue");
                              e.target.classList.add("btn-option-active");
                            }}
                          >
                            Notification
                            <div
                              onClick={(e) => {
                                e.stopPropagation();
                              }}
                            >
                              <button
                                onClick={(e) => {
                                  interactSubMenuBtn(
                                    e,
                                    btn,
                                    "Notification reçue"
                                  );
                                  e.target.offsetParent.offsetParent.classList.add(
                                    "btn-option-active"
                                  );
                                }}
                              >
                                reçue
                              </button>

                              <button
                                onClick={(e) => {
                                  interactSubMenuBtn(
                                    e,
                                    { value: "notificationSended" },
                                    "Notification envoyée"
                                  );
                                  e.target.offsetParent.offsetParent.classList.add(
                                    "btn-option-active"
                                  );
                                }}
                              >
                                envoyée
                              </button>
                            </div>
                          </div>
                        );
                      } else if (btn.value !== "notificationSended") {
                        return (
                          <button
                            ref={(el) => (btnMenuRef.current[index] = el)}
                            id={`${btn.value}`}
                            key={`${btn.value}-${index}`}
                            className={`btn-purple ${
                              btn.value === "userOptions"
                                ? "btn-option-active"
                                : ""
                            }`}
                            onClick={(e) => {
                              interactSubMenuBtn(e, btn, btn.label);
                              e.target.classList.add("btn-option-active");
                            }}
                          >
                            {btn.label}
                          </button>
                        );
                      } else {
                        return null;
                      }
                    })}
                  </>
                )}
              </div>
            </div>
            <div className="sub-option">
              <h1>{objectTitle[option.value]}</h1>
              {option.value === "userOptions" && (
                <TitleButtonInteraction
                  title={"Supprimer son compte"}
                  openTitleMessage={openTitleMessage}
                  setOpenTitleMessage={setOpenTitleMessage}
                  icon={<FontAwesomeIcon icon="trash" />}
                  contentDiv={contentTitleInteraction}
                />
              )}
            </div>
          </div>

          <SwitchTransition mode={"out-in"}>
            <CSSTransition
              key={option.value}
              addEndListener={(node, done) => {
                node.addEventListener("transitionend", done, false);
              }}
              classNames="fade"
            >
              <div>
                {option.value === "userOptions" && <UserOptionProfile />}
                {option.value === "notificationReceived" && (
                  <NotificationReceivedOption
                    otherMemberEligible={otherMemberEligible}
                    switchToHouseholdOptions={switchToHouseholdOptions}
                  />
                )}
                {option.value === "notificationSended" && (
                  <NotificationSendedOption />
                )}
                {option.value === "householdOptions" && (
                  <>
                    {userData?.householdId ? (
                      <HouseholdOptionProfile
                        requestDelegateAdmin={requestDelegateAdmin}
                        otherMemberEligible={otherMemberEligible}
                      />
                    ) : (
                      <CreateHouseholdForm
                        requestDelegateAdmin={requestDelegateAdmin}
                      />
                    )}
                  </>
                )}
                {option.value === "emailingOptions" && <EmailOptionProfile />}
                {option.value === "productOptions" && <ProductOptionProfile />}
                {option.value === "productTableOptions" && (
                  <ProductTableOptionProfile />
                )}
                {option.value === "brandOptions" && <BrandOption />}
              </div>
            </CSSTransition>
          </SwitchTransition>
        </>
      )}
    </>
  );
}

export default Option;
