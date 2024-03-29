import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from "react";
import { useNavigate, createSearchParams } from "react-router-dom";
import { useUserData, useUserOptionData } from "./../DataContext";
import { useForm, Controller } from "react-hook-form";
import { productType } from "../../../utils/localData";
import DatePicker, { registerLocale } from "react-datepicker";
import { fr } from "date-fns/locale";
import {
  transformDate,
  addMonths,
} from "../../../helpers/transformDate.helper";
import ReactSelect from "./../UtilitiesComponent/ReactSelect";
import axiosInstance from "../../../utils/axiosInstance";
import { apiDomain, apiVersion } from "../../../apiConfig/ApiConfig";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import InformationIcon from "./../UtilitiesComponent/InformationIcons";
import Loading from "../UtilitiesComponent/Loading";
import TitleButtonInteraction from "./../UtilitiesComponent/TitleButtonInteraction";
import PropTypes from "prop-types";
registerLocale("fr", fr);

function AddEditProductForm({
  handleFunction,
  formType,
  value,
  arrayExpDate,
  setArrayExpDate,
  requestUrl,
  success,
  loading,
  errorFetch,
  getProductData,
}) {
  const navigate = useNavigate();
  const { userData } = useUserData();
  const { userOptionData } = useUserOptionData();
  const [titleForm, setTitleForm] = useState("");
  const [button, setButton] = useState("");
  const [number, setNumber] = useState(0);
  const [expDate, setExpDate] = useState(null);
  const [errorExpDate, setErrorExpDate] = useState(false);
  const [errorExpDateEmpty, setErrorExpDateEmpty] = useState(false);
  const [showDateList, setShowDateList] = useState(true);
  const [totalExpDate, setTotalExpDate] = useState(0);
  const [arrayOptions, setArrayOptions] = useState([]);
  const [minStock, setMinStock] = useState(0);
  const [cssNumberCodeColor, setCssNumberCodeColor] = useState("");
  const [openTitleMessage, setOpenTitleMessage] = useState(false);
  const isMounted = useRef(true);
  const valueRef = useRef({});
  const datePickerRef = useRef();

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm({
    defaultValues: useMemo(() => {
      return value;
    }, [value]),
  });

  useEffect(() => {
    valueRef.current = {
      name: value?.name,
      brand: value?.brand,
      type: value?.type,
      weight: value?.weight,
      kcal: value?.kcal,
      location: value?.location,
      minimumInStock: value?.minimumInStock?.minInStock,
      expirationDate: value?.expirationDate,
    };
    reset(valueRef.current);
  }, [reset, value]);

  useEffect(() => {
    if (value && value.minimumInStock) {
      setMinStock(value.minimumInStock.minInStock);
    }
  }, [value]);

  useEffect(() => {
    let parseIntMinStock;
    if (minStock !== "") {
      parseIntMinStock = parseInt(minStock);
    }
    if (number < parseIntMinStock) {
      setCssNumberCodeColor("color-code-red");
    } else if (
      minStock !== 0 &&
      number >= parseIntMinStock &&
      number < parseIntMinStock + 5
    ) {
      setCssNumberCodeColor("color-code-orange");
    } else {
      setCssNumberCodeColor("");
    }
  }, [number, minStock]);

  useEffect(() => {
    if (formType === "add") {
      setTitleForm("Ajouter un produit");
      setButton("Ajouter");
    }
    if (formType === "edit") {
      setTitleForm("Édition produit");
      setButton("Éditer");
    }
  }, [formType, requestUrl]);

  useEffect(() => {
    if (success && formType === "add") {
      reset();
      reset({ type: null });
      setNumber(0);
      setArrayExpDate([]);
    }
  }, [success, reset, setArrayExpDate, formType]);

  useEffect(() => {
    if (formType === "add" && requestUrl === "historics") {
      setShowDateList(false);
    }

    if (formType === "edit") {
      if (value?.number) {
        setNumber(value.number);
      }
    }
  }, [formType, requestUrl, value]);

  useEffect(() => {
    let totalNumber = 0;
    arrayExpDate.forEach((item) => {
      let value = item.productLinkedToExpDate;
      if (value === "") {
        value = 0;
      }
      totalNumber = totalNumber + parseInt(value);
    });
    setTotalExpDate(totalNumber);

    if (
      arrayExpDate.filter((item) => item.productLinkedToExpDate === "")
        .length >= 1
    ) {
      setErrorExpDateEmpty(true);
    } else {
      setErrorExpDateEmpty(false);
    }
  }, [arrayExpDate, setTotalExpDate]);

  const addExpDate = useCallback(() => {
    let dateNow = new Date();
    let sameDate = false;
    if (!expDate) return;
    if (!isNaN(expDate.getTime())) {
      if (expDate > dateNow) {
        arrayExpDate.forEach((date, index) => {
          if (transformDate(date.expDate) === transformDate(expDate)) {
            sameDate = true;
            let newArray = [...arrayExpDate];
            newArray[index].productLinkedToExpDate++;
            setArrayExpDate(newArray);
            return;
          }
        });

        if (sameDate === false) {
          let objectExpDate = {
            expDate: expDate.toISOString(),
            productLinkedToExpDate: 1,
          };
          setArrayExpDate([...arrayExpDate, objectExpDate]);
        }

        if (number === totalExpDate) {
          setNumber((currNumber) => currNumber + 1);
        }

        if (errorExpDate) {
          setErrorExpDate(false);
        }
      }
    }

    setExpDate(null);
  }, [
    arrayExpDate,
    expDate,
    number,
    setArrayExpDate,
    totalExpDate,
    errorExpDate,
  ]);

  const updateExpDate = useCallback(
    (e, index) => {
      let newArray = [...arrayExpDate];
      newArray[index].productLinkedToExpDate = e.target.value;
      setArrayExpDate(newArray);

      let totalNumber = 0;
      arrayExpDate.forEach((item) => {
        let value = item.productLinkedToExpDate;
        if (value === "") {
          value = 0;
        }
        totalNumber = totalNumber + parseInt(value);
      });

      setNumber(totalNumber);
    },
    [arrayExpDate, setArrayExpDate]
  );

  useEffect(() => {
    const loadOptions = async () => {
      let newArray = [];
      const getBrandListEndPoint = `${apiDomain}/api/${apiVersion}/brands/find-all/${userData.householdId}`;
      await axiosInstance.get(getBrandListEndPoint).then((response) => {
        response.data.forEach((element) => {
          newArray.push({
            value: element.brandName.value,
            label: element.brandName.label,
          });
        });
      });
      if (isMounted.current) {
        setArrayOptions(newArray);
      }
    };

    if (userData) {
      loadOptions();
    }
  }, [userData]);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, [isMounted]);

  const deleteExpDate = useCallback(
    (id) => {
      let newArray = [...arrayExpDate];
      let numberSubstract = newArray[id].productLinkedToExpDate;
      if (number !== 0 && newArray.length <= number) {
        setNumber((currNumber) => currNumber - numberSubstract);
      }
      setArrayExpDate(newArray.filter((item, index) => index !== id));
    },
    [arrayExpDate, number, setArrayExpDate]
  );

  const expErrorMessageLogic = () => {
    if (
      arrayExpDate.length === 0 &&
      formType === "add" &&
      requestUrl === "products"
    ) {
      setErrorExpDate(true);
    }
  };

  const deleteProductHistoric = async () => {
    let deleteDataEndPoint = `${apiDomain}/api/${apiVersion}/${requestUrl}/${value._id}`;

    await axiosInstance.delete(deleteDataEndPoint).then((response) => {
      if (response.status === 204) {
        if (requestUrl === "historics") {
          navigate("/app/liste-historique");
        } else {
          navigate("/app/liste-produit");
        }
      }
    });
  };

  let contentTitleInteractionDeleteProductHistoric = (
    <>
      {openTitleMessage && (
        <div className="title-message-container-delete-action">
          <p>Êtes-vous sur et certain de vouloir supprimer ce produit ?</p>
          <div className="btn-delete-action-container">
            <button
              className="small-btn-red"
              onClick={() => {
                deleteProductHistoric();
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

  const form = (
    <>
      <div className="input-group">
        <input
          name="name"
          type="text"
          id="name"
          className={`form-input ${errors.name ? "error-input" : ""}`}
          {...register("name", { required: true })}
        />
        <label htmlFor="name" className="form-label">
          Nom du produit *
        </label>
        <div className="error-message-input">
          {errors.name && <span>Ce champ est requis</span>}
        </div>
      </div>

      <div className="input-group">
        <ReactSelect
          format="creatable"
          label="Marque du produit *"
          respSelect={true}
          errorBorderColor={errors.brand}
          labelBackWhite={true}
          Controller={Controller}
          name="brand"
          inputId="product-brand"
          isClearable={true}
          arrayOptions={arrayOptions}
          control={control}
          defaultValue={""}
          success={success}
          inputValue={value}
          formType={formType}
        />
        <div className="error-message-input">
          {errors.brand && <span>Ce champ est requis</span>}
        </div>
      </div>

      <div className="input-group">
        <ReactSelect
          format="select"
          label="Type de produit"
          respSelect={true}
          labelBackWhite={true}
          Controller={Controller}
          name="type"
          inputId="product-type"
          isClearable={false}
          arrayOptions={productType}
          control={control}
          defaultValue={""}
        />
        <div className="error-message-input">
          {errors.type && <span>Ce champ est requis</span>}
        </div>
      </div>

      <div className="input-group">
        <input
          name="weight"
          type="number"
          id="weight"
          className={`form-input ${errors.weight ? "error-input" : ""}`}
          {...register("weight")}
        />
        <label htmlFor="weight" className="form-label">
          Poids du produit (gr)
        </label>
        <div className="error-message-input">
          {errors.weight && <span>Ce champ est requis</span>}
        </div>
      </div>

      <div className="input-group">
        <input
          name="kcal"
          type="number"
          id="kcal"
          className={`form-input ${errors.kcal ? "error-input" : ""}`}
          {...register("kcal")}
        />
        <label htmlFor="kcal" className="form-label">
          Valeur énergétique du produit (kcal)
        </label>
        <div className="error-message-input">
          {errors.kcal && <span>Ce champ est requis</span>}
        </div>
      </div>

      <div className="input-group">
        <input
          name="location"
          type="text"
          id="location"
          className={`form-input ${errors.location ? "error-input" : ""}`}
          {...register("location")}
        />
        <label htmlFor="location" className="form-label">
          Emplacement du produit
        </label>
        <div className="error-message-input">
          {errors.location && <span>Ce champ est requis</span>}
        </div>
      </div>

      {(requestUrl === "products" ||
        (requestUrl === "historics" && arrayExpDate.length >= 1)) && (
        <>
          <div className="input-group">
            <input
              name="minimumInStock"
              type="number"
              min={0}
              id="minimumInStock"
              className={`form-input ${
                errors.minimumInStock ? "error-input" : ""
              }`}
              onKeyUp={(e) => {
                if (e.key === "Tab") datePickerRef.current.setOpen(false);
              }}
              {...register("minimumInStock")}
            />
            <label htmlFor="minimumInStock" className="form-label">
              Stock minimum {formType === "edit" && " *"}
            </label>
            <div className="error-message-input">
              {errors.minimumInStock && <span>Ce champ est requis</span>}
            </div>
          </div>

          <div className="total-product-count-container">
            <p>Nombre total de produit :</p>
            <p className={`total-product-count ${cssNumberCodeColor}`}>
              {number}
            </p>
          </div>
        </>
      )}
    </>
  );

  return (
    <>
      <div className="sub-header">
        <div className="sub-option sub-option-return">
          <div className="title-return">
            <button
              className="btn-action-title"
              title="Retout à la page précédente."
              onClick={() => {
                if (requestUrl === "products") {
                  let url = "/app/liste-produit";
                  if (sessionStorage.getItem("productQueryParamsFilter")) {
                    url = `/app/liste-produit?${sessionStorage.getItem(
                      "productQueryParamsFilter"
                    )}`;
                  }
                  navigate(url);
                } else if (requestUrl === "historics") {
                  let url = "/app/liste-historique";
                  if (sessionStorage.getItem("historicQueryParamsFilter")) {
                    url = `/app/liste-historique?${sessionStorage.getItem(
                      "productQueryParamsFilter"
                    )}`;
                  }
                  navigate(url);
                } else {
                  navigate("/app/liste-produit");
                }
              }}
            >
              <FontAwesomeIcon className="btn-icon" icon="arrow-left" />
            </button>
            <h1>{titleForm}</h1>
          </div>
          {formType === "edit" && (
            <TitleButtonInteraction
              title={"Supprimer le produit !"}
              openTitleMessage={openTitleMessage}
              setOpenTitleMessage={setOpenTitleMessage}
              icon={<FontAwesomeIcon icon="trash" />}
              contentDiv={contentTitleInteractionDeleteProductHistoric}
            />
          )}
        </div>
      </div>

      <div className="container-loading">
        {formType === "edit" && (
          <Loading
            loading={loading}
            errorFetch={errorFetch}
            retryFetch={getProductData}
          />
        )}
        <div className="container-data">
          <div className="form-add-edit-product">
            <form>
              {form}
              {showDateList && (
                <>
                  <div className="input-group">
                    {formType === "add" && (
                      <label className="form-label" htmlFor="expirationDate">
                        Date d'expiration du produit *
                      </label>
                    )}
                    {formType === "edit" && (
                      <label className="form-label" htmlFor="expirationDate">
                        Date d'expiration du produit
                      </label>
                    )}
                    <div className="container-input-interaction">
                      <DatePicker
                        ref={datePickerRef}
                        className={`form-input ${
                          errorExpDate || errorExpDateEmpty ? "error-input" : ""
                        }`}
                        id="expirationDate"
                        isClearable
                        dateFormat="dd/MM/yyyy"
                        locale="fr"
                        autoComplete="off"
                        minDate={new Date()}
                        showDisabledMonthNavigation
                        selected={expDate}
                        enableTabLoop={false}
                        onChange={(val) => {
                          setExpDate(val);
                        }}
                      />
                      <button
                        className="btn-input-interaction"
                        type="button"
                        onClick={addExpDate}
                        onKeyUp={(e) => {
                          if (e.key === "Tab")
                            datePickerRef.current.setOpen(false);
                        }}
                      >
                        <FontAwesomeIcon className="btn-icon" icon="plus" />
                      </button>
                    </div>
                    <div className="error-message-input">
                      {errorExpDate && (
                        <span>Minimum une date d'expiration requise !</span>
                      )}
                      {errorExpDateEmpty && (
                        <span>Minimum un produit lié à une date !</span>
                      )}
                    </div>
                  </div>

                  {arrayExpDate.length >= 1 && (
                    <>
                      {arrayExpDate.map((date, index) => {
                        if (userOptionData) {
                          let cssDateColor;
                          let title;
                          if (
                            date.expDate <=
                            addMonths(
                              userOptionData.warningExpirationDate.value
                            )
                          ) {
                            cssDateColor = "color-code-red";
                            title = "Date d'expiration proche !";
                          } else if (
                            date.expDate >
                              addMonths(
                                userOptionData.warningExpirationDate.value
                              ) &&
                            date.expDate <=
                              addMonths(
                                userOptionData.warningExpirationDate.value + 1
                              )
                          ) {
                            cssDateColor = "color-code-orange";
                            title = "Date d'expiration moyennement proche !";
                          }
                          return (
                            <div
                              className="expiration-date"
                              key={`expirationDate-${index}`}
                            >
                              <span title={title}>
                                {`${index + 1})`}{" "}
                                <span
                                  className={cssDateColor}
                                >{`${transformDate(date.expDate)}`}</span>
                              </span>
                              <div className="container-input-interaction">
                                <div className="input-group">
                                  <input
                                    type="number"
                                    className="form-input"
                                    min={1}
                                    name=""
                                    id={`numberOfExpDate-${index}`}
                                    value={date.productLinkedToExpDate}
                                    onChange={(e) => {
                                      updateExpDate(e, index);
                                    }}
                                  />
                                  <button
                                    className="btn-input-interaction"
                                    type="button"
                                    onClick={() => {
                                      deleteExpDate(index);
                                    }}
                                  >
                                    <FontAwesomeIcon icon="times" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        } else {
                          return null;
                        }
                      })}
                    </>
                  )}
                </>
              )}
            </form>
            <div className="btn-action-container">
              <button
                className="btn-purple"
                onClick={() => {
                  handleSubmit(handleFunction)();
                  expErrorMessageLogic();
                }}
              >
                {formType === "add" && (
                  <FontAwesomeIcon className="btn-icon" icon="plus" />
                )}
                {formType === "edit" && (
                  <FontAwesomeIcon className="btn-icon" icon="pen" />
                )}
                {button}
              </button>
              {success && number !== 0 && requestUrl === "products" && (
                <InformationIcon
                  className="success-icon"
                  icon={<FontAwesomeIcon icon="check" />}
                />
              )}
              {success && number === 0 && requestUrl === "historics" && (
                <InformationIcon
                  className="success-icon"
                  icon={<FontAwesomeIcon icon="check" />}
                />
              )}
              {formType === "edit" &&
                number === 0 &&
                requestUrl === "products" && (
                  <InformationIcon
                    className="warning-icon"
                    icon={<FontAwesomeIcon icon="exclamation" />}
                    message="Attention, après édition de ce produit, ce produit se trouvera dans la liste des historiques car le nombre total de produits est égal à 0 !"
                  />
                )}
              {formType === "edit" &&
                number >= 1 &&
                requestUrl === "historics" && (
                  <InformationIcon
                    className="warning-icon"
                    icon={<FontAwesomeIcon icon="exclamation" />}
                    message="Attention, après édition de ce produit, ce produit se trouvera dans la liste des produits car le nombre total de produits est supérieur à 0 !"
                  />
                )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

AddEditProductForm.propTypes = {
  handleFunction: PropTypes.func.isRequired,
  formType: PropTypes.string.isRequired,
  value: PropTypes.object,
  arrayExpDate: PropTypes.array.isRequired,
  setArrayExpDate: PropTypes.func.isRequired,
  requestUrl: PropTypes.string.isRequired,
  success: PropTypes.bool.isRequired,
  loading: PropTypes.bool,
  errorFetch: PropTypes.bool,
  getProductData: PropTypes.func,
};

export default AddEditProductForm;
