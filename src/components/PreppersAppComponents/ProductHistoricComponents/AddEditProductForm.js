import React, { Fragment, useState, useEffect, useCallback } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { productType } from "../../../utils/localData";
import DatePicker, { registerLocale } from "react-datepicker";
import { fr } from 'date-fns/locale';
import { transformDate } from '../../../helpers/transformDate.helper';
import CreatableSelect from 'react-select/creatable';
import Select from 'react-select';
import axiosInstance from '../../../utils/axiosInstance';
import { apiDomain, apiVersion } from '../../../apiConfig/ApiConfig';
import PropTypes from 'prop-types';
registerLocale("fr", fr);

function AddEditProductForm({ userData, history, handleFunction, formType, value, arrayExpDate, setArrayExpDate, requestUrl }) {
  const [number, setNumber] = useState(0);
  const [expDate, setExpDate] = useState(null);
  const [showDateList, setShowDateList] = useState(true);
  const [totalExpDate, setTotalExpDate] = useState(0);
  const [arrayOptions, setArrayOptions] = useState([]);

  const { register, handleSubmit, errors, control, setValue } = useForm({
    mode: "onChange"
  });

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

  let titleForm = "Ajout";
  let button = "Ajouter";

  if (formType === "edit") {
    titleForm = "Édition";
    button = "Éditer";
  }

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
      totalNumber = totalNumber + item.productLinkedToExpDate;
    });
    setTotalExpDate(totalNumber);

  }, [arrayExpDate, setTotalExpDate]);

  const addExpDate = useCallback(() => {
    let dateNow = new Date();
    let sameDate = false;
    if (!expDate) return;
    if (!isNaN(expDate.getTime())) {
      if (expDate > dateNow) {

        arrayExpDate.forEach((date, index) => {
          if (date.expDate === transformDate(expDate)) {
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
      }
    }
    if (number === totalExpDate) {
      setNumber(number + 1);
    }
    setExpDate(null)
  }, [arrayExpDate, expDate, number, setArrayExpDate, totalExpDate]);

  const updateExpDate = useCallback((e, index) => {
    let newArray = [...arrayExpDate];
    newArray[index].productLinkedToExpDate = parseInt(e.target.value);
    setArrayExpDate(newArray);

    let totalNumber = 0;
    arrayExpDate.forEach(item => {
      totalNumber = totalNumber + item.productLinkedToExpDate;
    });


    if (totalNumber > number) {
      setNumber(number + 1);
    }

  }, [arrayExpDate, number, setArrayExpDate]);

  useEffect(() => {
    const loadOptions = async () => {
      let newArray = arrayOptions;
      const getBrandListEndPoint = `${apiDomain}/api/${apiVersion}/brands/${userData.householdCode}`;
      await axiosInstance.get(getBrandListEndPoint)
        .then((response) => {
          response.data.forEach(element => {
            newArray.push({ value: element.brandName, label: element.brandName })
          });
        });
      setArrayOptions(newArray);
    }
    if (userData) {
      loadOptions();
    }
  }, [arrayOptions, userData]);

  const onCreateOption = async (inputValue) => {
    let newOption = { value: inputValue, label: inputValue };
    let newArray = arrayOptions
    newArray.push(newOption)
    setArrayOptions(newArray);
  }

  const updateNumber = useCallback((inputValue) => {
    if (isNaN(inputValue)) return;
    let newArray = [...arrayExpDate];

    if (arrayExpDate.length === 1) {
      newArray[0].productLinkedToExpDate = parseInt(inputValue);
      setArrayExpDate(newArray);
    }

    if (inputValue === 0 && arrayExpDate.length === 1) {
      newArray = [];
      setArrayExpDate(newArray);
    }

    setNumber(inputValue);

  }, [arrayExpDate, setArrayExpDate]);

  const deleteExpDate = useCallback((id) => {
    let newArray = [...arrayExpDate];
    let numberSubstract = newArray[id].productLinkedToExpDate;
    if (number !== 0 && newArray.length <= number) {
      setNumber(number - numberSubstract);
    }
    setArrayExpDate(newArray.filter((item, index) => index !== id));
  }, [arrayExpDate, number, setArrayExpDate]);

  const form = <Fragment>
    <div>
      <div>
        <label htmlFor="name">Nom du produit *</label>
        <div>
          {formType === "add" && <input name="name" type="text" id="name" placeholder="Nom du produit" ref={register({ required: true })} />}
          {formType === "edit" && <input name="name" type="text" id="name" placeholder="Nom du produit" defaultValue={value.name} ref={register({ required: true })} />}
        </div>
        {errors.name && <span className="error-message">Ce champ est requis</span>}
      </div>
      <div>
        <label htmlFor="brand">Marque du produit *</label>
        <div>
          {value && value.brand &&
            <Controller
              name="brand"
              id="brand"
              as={CreatableSelect}
              placeholder="Marque..."
              isClearable
              options={arrayOptions}
              onCreateOption={onCreateOption}
              control={control}
              defaultValue={""}
            />
          }

          {!value &&
            <Controller
              name="brand"
              id="brand"
              as={CreatableSelect}
              placeholder="Marque..."
              isClearable
              options={arrayOptions}
              onCreateOption={onCreateOption}
              control={control}
              defaultValue={""}
            />
          }
            

        </div>
        {errors.brand && <span className="error-message">Ce champ est requis</span>}
      </div>
      <div>
        <label htmlFor="type">Type de produit</label>
        <div>

          {value && value.type &&
            <Controller
              name="type"
              id="type"
              as={Select}
              placeholder="Type..."
              options={productType}
              control={control}
              defaultValue={""}
            />
          }

          {!value &&
            <Controller
              name="type"
              id="type"
              as={Select}
              placeholder="Type..."
              options={productType}
              control={control}
              defaultValue={""}
            />
          }
        </div>
      </div>
      <div>
        <label htmlFor="weight">Poids du produit</label>
        <div>
          {formType === "add" && <input name="weight" type="text" id="weight" placeholder="Poids du produit" ref={register()} />}
          {formType === "edit" && <input name="weight" type="text" id="weight" placeholder="Poids du produit" defaultValue={value.weight} ref={register()} />}
        </div>
      </div>
      <div>
        <label htmlFor="kcal">Valeur énergetique du produit</label>
        <div>
          {formType === "add" && <input name="kcal" type="text" id="kcal" placeholder="Valeur énergetique du produit" ref={register()} />}
          {formType === "edit" && <input name="kcal" type="text" id="kcal" placeholder="Valeur énergetique du produit" defaultValue={value.kcal} ref={register()} />}
        </div>
      </div>

      <div>
        <label htmlFor="location">Emplacement du produit</label>
        <div>
          {formType === "add" && <input name="location" type="text" id="location" placeholder="Emplacement du produit" ref={register()} />}
          {formType === "edit" && <input name="location" type="text" id="location" placeholder="Emplacement du produit" defaultValue={value.location} ref={register()} />}
        </div>
      </div>
      <div>
        {formType === "add" && requestUrl !== "historics" && <label htmlFor="number">Nombre de produit *</label>}
        {formType !== "add" && requestUrl !== "products" && <label htmlFor="number">Nombre de produit *</label>}
        <div>
          {showDateList &&
            <>
              <input
                name="number"
                type="number"
                id="number"
                min={0}
                placeholder="Nombre de produit"
                value={number}
                ref={register({ required: true })}
                onChange={(e) => {
                  updateNumber(parseInt(e.target.value));
                }}
              />
              {errors.number && <span className="error-message">Ce champ est requis</span>}
            </>
          }

        </div>
      </div>
    </div>
  </Fragment>;

  return (
    <Fragment>
      <button
        onClick={() => {
          history.goBack()
        }}>
        Retour
      </button>
      <h3>{titleForm}</h3>
      <form>
        {form}
      </form>
      {number === totalExpDate &&
        <button onClick={handleSubmit(handleFunction)}>
          {button}
        </button>
      }

      {number !== totalExpDate &&
        <button>
          {button} NOPE
        </button>
      }

      {showDateList &&
        <>
          <div>
            <label htmlFor="expirationDate">Date d'expiration du produit *</label>
            <DatePicker
              id="expirationDate"
              isClearable
              placeholderText="Date d'expiration"
              dateFormat="dd/MM/yyyy"
              locale="fr"
              selected={expDate}
              onChange={val => {
                setExpDate(val);
              }}
            />
            <button onClick={addExpDate}>+</button>
          </div>

          {arrayExpDate &&
            <ul>
              {arrayExpDate.map((date, index) => {
                return <li key={`expirationDate-${index}`}>
                  <div>
                    {transformDate(date.expDate)}
                    <input type="number" min={1} name="" id={`numberOfExpDate-${index}`} value={date.productLinkedToExpDate} onChange={(e) => { updateExpDate(e, index) }} />
                    <button onClick={() => { deleteExpDate(index) }}>X</button>
                  </div>
                </li>
              })}
            </ul>
          }
        </>
      }

    </Fragment>
  )
}

AddEditProductForm.propTypes = {
  userData: PropTypes.object,
  history: PropTypes.object.isRequired,
  handleFunction: PropTypes.func.isRequired,
  formType: PropTypes.string.isRequired,
  value: PropTypes.object,
  arrayExpDate: PropTypes.array.isRequired,
  setArrayExpDate: PropTypes.func.isRequired,
  requestUrl: PropTypes.string
}

export default AddEditProductForm