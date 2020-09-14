import React, { Fragment, useState, useEffect, useCallback, useRef } from 'react';
import { useUserData } from './../DataContext';
import { useForm, Controller } from 'react-hook-form';
import { productType } from "../../../utils/localData";
import DatePicker, { registerLocale } from "react-datepicker";
import { fr } from 'date-fns/locale';
import { transformDate } from '../../../helpers/transformDate.helper';
import ReactSelect from './../UtilitiesComponent/ReactSelect';
import axiosInstance from '../../../utils/axiosInstance';
import { apiDomain, apiVersion } from '../../../apiConfig/ApiConfig';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faCheck, faExclamation, faPlus, faTimes, faPen } from '@fortawesome/free-solid-svg-icons';
import InformationIcon from './../UtilitiesComponent/InformationIcons';
import Loading from '../UtilitiesComponent/Loading';
import PropTypes from 'prop-types';
registerLocale("fr", fr);

function AddEditProductForm({ history, handleFunction, formType, value, arrayExpDate, setArrayExpDate, requestUrl, success, loading, errorFetch, getProductData }) {
  const { userData } = useUserData();
  const [titleForm, setTitleForm] = useState("");
  const [button, setButton] = useState("");
  const [number, setNumber] = useState(0);
  const [expDate, setExpDate] = useState(null);
  const [errorExpDate, setErrorExpDate] = useState(false);
  const [errorExpDateEmpty, setErrorExpDateEmpty] = useState(false);
  const [showDateList, setShowDateList] = useState(true);
  const [totalExpDate, setTotalExpDate] = useState(0);
  const [arrayOptions, setArrayOptions] = useState([]);
  const isMounted = useRef(true);

  const { register, handleSubmit, errors, control, setValue, reset } = useForm({
    mode: "onChange"
  });

  useEffect(() => {
    if(formType === "add"){
      setTitleForm("Ajouter produit");
      setButton("Ajouter");
    }
    if(formType === "edit"){
      setTitleForm("Édition produit");
      setButton("Éditer");
    }
  }, [formType, requestUrl])

  useEffect(() => {
    if(success && formType === "add"){
      reset();
      setNumber(0);
      setArrayExpDate([]);
    }
  }, [success, reset, setArrayExpDate, formType]);

  useEffect(() => {
    if(value){
      if (value.brand) {
        setValue("brand", { value: value.brand, label: value.brand });
      }
      if (value.type) {
        setValue("type", { value: value.type, label: value.type });
      }
    }
  }, [value, setValue]);

  useEffect(() => {
    register({ name: "brand" }, {required : true});
  }, [register]);

  useEffect(() => {

    if (formType === "add" && requestUrl === "historics") {
      setShowDateList(false);
    }

    if (formType === "edit") {
      if (value.number) {
        setNumber(value.number);
      }
    }
  }, [formType, requestUrl, value]);

  useEffect(() => {
    let totalNumber = 0;
    arrayExpDate.forEach(item => {
      let value = item.productLinkedToExpDate;
      if(value === ""){
        value = 0;
      }
      totalNumber = totalNumber + parseInt(value);
    });
    setTotalExpDate(totalNumber);

    if(arrayExpDate.filter(item => item.productLinkedToExpDate === "").length >= 1){
      setErrorExpDateEmpty(true);
    }else{
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
            productLinkedToExpDate: 1
          }
          setArrayExpDate([...arrayExpDate, objectExpDate])
        }

        if (number === totalExpDate) {
          setNumber(number + 1);
        }

        if(errorExpDate){
          setErrorExpDate(false);
        }
      }
    }

    setExpDate(null);
  }, [arrayExpDate, expDate, number, setArrayExpDate, totalExpDate, errorExpDate]);

  const updateExpDate = useCallback((e, index) => {
    let newArray = [...arrayExpDate];
    newArray[index].productLinkedToExpDate = e.target.value;
    setArrayExpDate(newArray);

    let totalNumber = 0;
    arrayExpDate.forEach(item => {
      let value = item.productLinkedToExpDate;
      if(value === ""){
        value = 0;
      }
      totalNumber = totalNumber + parseInt(value);
    });

    setNumber(totalNumber);

  }, [arrayExpDate, setArrayExpDate]);

  useEffect(() => {
    const loadOptions = async () => {
      let newArray = arrayOptions;
      const getBrandListEndPoint = `${apiDomain}/api/${apiVersion}/brands/${userData.householdCode}`;
      await axiosInstance.get(getBrandListEndPoint)
        .then((response) => {
          if(isMounted.current){
            response.data.forEach(element => {
              newArray.push({ value: element.brandName, label: element.brandName })
            });
          }
        });
      setArrayOptions(newArray);
    }
    
    if (userData) {
      loadOptions();
    }

    return () => {
      isMounted.current = false;
    }
  }, [arrayOptions, userData]);

  const deleteExpDate = useCallback((id) => {
    let newArray = [...arrayExpDate];
    let numberSubstract = newArray[id].productLinkedToExpDate;
    if (number !== 0 && newArray.length <= number) {
      setNumber(number - numberSubstract);
    }
    setArrayExpDate(newArray.filter((item, index) => index !== id));
  }, [arrayExpDate, number, setArrayExpDate]);

  const expErrorMessageLogic = () => {
    if(arrayExpDate.length === 0 && formType === "add" && requestUrl === "products"){
      setErrorExpDate(true);
    }
  }

  const form = <Fragment>
    <div className="input-form-container-with-error">
      <label htmlFor="name">Nom du produit *</label>
      {formType === "add" && <input name="name" className="input-form" type="text" id="name" placeholder="Nom..." ref={register({ required: true })} />}
      {formType === "edit" && <input name="name" className="input-form" type="text" id="name" placeholder="Nom..." defaultValue={value.name} ref={register({ required: true })} />}
      {errors.name && <span className="error-message-form">Ce champ est requis</span>}
    </div>

    <div className="input-form-container-with-error">
      <ReactSelect
        format="creatable"
        label="Marque de produit *"
        Controller={Controller}
        name="brand"
        inputId="product-brand"
        classNamePrefix="select-brand"
        isClearable={true}
        placeholder="Marque..."
        arrayOptions={arrayOptions}
        setArrayOptions={setArrayOptions}
        control={control}
        defaultValue={""}
      />
      {errors.brand && <span className="error-message-form">Ce champ est requis</span>}
    </div>

    <div className="input-form-container-with-error">
      <ReactSelect
        format="select"
        label="Type de produit"
        Controller={Controller}
        name="type"
        inputId="product-type"
        classNamePrefix="select-type"
        isClearable={false}
        placeholder="Type..."
        arrayOptions={productType}
        control={control}
        defaultValue={""}
      />
    </div>

    <div className="input-form-container-with-error">
      <label htmlFor="weight">Poids du produit</label>
      {formType === "add" && <input className="input-form" name="weight" type="text" id="weight" placeholder="Poids..." ref={register()} />}
      {formType === "edit" && <input className="input-form" name="weight" type="text" id="weight" placeholder="Poids..." defaultValue={value.weight} ref={register()} />}
    </div>
    <div className="input-form-container-with-error">
      <label htmlFor="kcal">Valeur énergetique du produit</label>
      {formType === "add" && <input className="input-form" name="kcal" type="text" id="kcal" placeholder="Valeur énergetique..." ref={register()} />}
      {formType === "edit" && <input className="input-form" name="kcal" type="text" id="kcal" placeholder="Valeur énergetique..." defaultValue={value.kcal} ref={register()} />}
    </div>

    <div className="input-form-container-with-error">
      <label htmlFor="location">Emplacement du produit</label>
      {formType === "add" && <input className="input-form" name="location" type="text" id="location" placeholder="Emplacement..." ref={register()} />}
      {formType === "edit" && <input className="input-form" name="location" type="text" id="location" placeholder="Emplacement..." defaultValue={value.location} ref={register()} />}
    </div>

    {requestUrl === "products" && 
      <>
        <div className="input-form-container-with-error">
          <label htmlFor="minimumInStock">Stock minimum {formType === "edit" && " *"} </label>
          {formType === "add" && <input className="input-form" name="minimumInStock" type="number" min={0} id="minimumInStock" placeholder="Stock minimum..." ref={register()} />}
          {formType === "edit" && value.minimumInStock && <input className="input-form" name="minimumInStock" type="number" min={0} id="minimumInStock" placeholder="Stock minimum..." defaultValue={value.minimumInStock.minInStock} ref={register({ required: true })} />}
          {errors.minimumInStock && <span className="error-message-form">Ce champ est requis</span>}
        </div>
        <div className="total-product-count-container">
          <p>Nombre total de produit :</p>
          <p className="total-product-count">{number}</p>
        </div>
      </>
    }
  </Fragment>;

  return (
    <div className="default-wrapper">
      <div className="default-title-container">
        <button
          onClick={() => {
            if(requestUrl === "products"){
              history.push({
                pathname: '/app/liste-produit',
              })
            }else if(requestUrl === "historics"){
              history.push({
                pathname: '/app/liste-historique',
              })
            }else{
              history.push({
                pathname: '/app',
              })
            }
          }}>
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>
        <h1 className="default-h">{titleForm}</h1>
      </div>
      
      <div className="container-loading">
        {formType === "edit" && 
          <Loading
            loading={loading}
            errorFetch={errorFetch}
            retryFetch={getProductData}
          />
        }
        <div>
          <div className="form-add-edit-product-container">
            <form>
              {form}
            </form>
            <div>
              {showDateList &&
                <>
                  <div className="input-form-container-with-error">
                    {formType === "add" && <label htmlFor="expirationDate">Date(s) d'expiration du produit *</label>}
                    {formType === "edit" && <label htmlFor="expirationDate">Date(s) d'expiration du produit</label>}
                    <div className="input-add">
                      <DatePicker
                        className="input-form input-form-date-picker"
                        id="expirationDate"
                        isClearable
                        placeholderText="Date d'expiration"
                        dateFormat="dd/MM/yyyy"
                        locale="fr"
                        autoComplete="off"
                        minDate={new Date()}
                        showDisabledMonthNavigation
                        selected={expDate}
                        onChange={val => {
                          setExpDate(val);
                        }}
                      />
                      <button className="action-input-add" onClick={addExpDate}><FontAwesomeIcon icon={faPlus} /></button>
                    </div>
                    {errorExpDate && <span className="error-message-form">Minimum une date d'expiration requise !</span>}
                    {errorExpDateEmpty && <span className="error-message-form">Minimum un produit lié à une date !</span>}
                  </div>

                  {arrayExpDate.length >= 1 &&
                    <>
                      <ul className="list-exp-date">
                        {arrayExpDate.map((date, index) => {
                          return <li className="expiration-date" key={`expirationDate-${index}`}>
                            {`${index+1}) ${transformDate(date.expDate)}`}
                            <div className="small-input-form-container">
                              <div className="input-add">
                                <input type="number" className="input-form" min={1} name="" id={`numberOfExpDate-${index}`} value={date.productLinkedToExpDate} onChange={(e) => { updateExpDate(e, index) }} />
                                <button className="action-input-add" onClick={() => { deleteExpDate(index) }}><FontAwesomeIcon icon={faTimes} /></button>
                              </div>
                            </div>
                          </li>
                        })}
                      </ul>
                    </>
                  }
                </>
              }
            </div>
          </div>

          {number === totalExpDate &&
            <div className="default-action-form-container">
              <button className="default-btn-action-form" onClick={(e) => {
                handleSubmit(handleFunction)();
                expErrorMessageLogic();
                }}>
                {formType === "add" &&
                  <FontAwesomeIcon icon={faPlus} /> 
                }
                {formType === "edit" &&
                  <FontAwesomeIcon icon={faPen} /> 
                }
                {button}
              </button>
              {success && 
                <InformationIcon 
                  className="success-icon"
                  icon={<FontAwesomeIcon icon={faCheck} />}
                />
              }
              {formType === "edit" && number === 0 && requestUrl === "products" &&
                <InformationIcon 
                  className="warning-icon"
                  icon={<FontAwesomeIcon icon={faExclamation} />}
                  message="Attention, après édition de ce produit, ce produit se trouvera dans la liste des historiques car le nombre total de produits est égal à 0 !"
                />
              }
              {formType === "edit" && number >= 1 && requestUrl === "historics" &&
                <InformationIcon 
                  className="warning-icon"
                  icon={<FontAwesomeIcon icon={faExclamation} />}
                  message="Attention, après édition de ce produit, ce produit se trouvera dans la liste des produits car le nombre total de produits est supérieur à 0 !"
                />
              }
            </div>
          }
          {number !== totalExpDate &&
            <div className="default-action-form-container">
              <button className="default-btn-disabled-form" disabled>
                {button}
              </button>
              <InformationIcon 
                className="error-icon"
                icon={<FontAwesomeIcon icon={faTimes} />}
                message="Attention, il n'est pas possible d'ajouter/éditer un produit si le nombre de produits est différent du nombre de dates de péremption liée à ce produit !"
              />
            </div>
          }
        </div>
      </div>
      
      
    </div>
  )
}

AddEditProductForm.propTypes = {
  history: PropTypes.object.isRequired,
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
}

export default AddEditProductForm