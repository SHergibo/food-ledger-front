import React, { Fragment, useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import PropTypes from 'prop-types';

function AddEditProductForm({ handleFunction, formType, value, arrayExpDate, setArrayExpData }) {
  const [number, setNumber] = useState();
  const [test, setTest]= useState(["01/01/20"])

  const { register, handleSubmit, errors } = useForm({
    mode: "onChange"
  });

  let titleForm = "Ajout";
  let button = "Ajouter";

  if (formType === "edit") {
    titleForm = "Édition";
    button = "Éditer";
  }

  useEffect(() => {
    setNumber(value.number);
  }, [value]);

  useEffect(() => {
    console.log(test);
  }, [test]);

  const addExpDate = () => {
    let inputExpDate = document.getElementById('expirationDate');
    let dateNow = new Date();
    let dateExp = new Date(inputExpDate.value);
    if(!isNaN(dateExp.getTime())){
      if(dateExp > dateNow){
        setArrayExpData([...arrayExpDate, inputExpDate.value])
      }
    }
  }


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
          {formType === "add" && <input name="brand" type="text" id="brand" placeholder="Marque du produit" ref={register({ required: true })} />}
          {formType === "edit" && <input name="brand" type="text" id="brand" placeholder="Marque du produit" defaultValue={value.brand} ref={register({ required: true })} />}
        </div>
        {errors.brand && <span className="error-message">Ce champ est requis</span>}
      </div>
      <div>
        <label htmlFor="type">Type de produit</label>
        <div>
          {formType === "add" && <input name="type" type="text" id="type" placeholder="Type de produit" ref={register()} />}
          {formType === "edit" && <input name="type" type="text" id="type" placeholder="Type de produit" defaultValue={value.type} ref={register()} />}
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
        <label htmlFor="expirationDate">Date d'expiration du produit *</label>
        <div>
          {formType === "add" && <input name="expirationDate" type="text" id="expirationDate" placeholder="Date d'expiration du produit" ref={register({ required: true })} />}
          {/* {formType === "edit" &&
            <input
              name="expirationDate"
              type="date"
              id="expirationDate"
              placeholder="Date d'expiration du produit"
            />
          } */}
          {errors.expirationDate && <span className="error-message">Ce champ est requis</span>}
        </div>
      </div>
      {/* {arrayExpDate &&
        <ul>
          {arrayExpDate.map((date, index) => {
            return <li key={`expirationDate-${index}`}>{date}</li>
          })}
        </ul>
      } */}
      <div>
        <label htmlFor="location">Emplacement du produit</label>
        <div>
          {formType === "add" && <input name="location" type="text" id="location" placeholder="Emplacement du produit" ref={register()} />}
          {formType === "edit" && <input name="location" type="text" id="location" placeholder="Emplacement du produit" defaultValue={value.location} ref={register()} />}
        </div>
      </div>
      <div>
        <label htmlFor="number">Nombre de produit *</label>
        <div>
          {formType === "add" && <input name="number" type="number" id="number" placeholder="Nomber de produit" ref={register({ required: true })} />}
          {formType === "edit" &&
            <input
              name="number"
              type="number"
              id="number"
              placeholder="Nomber de produit"
              defaultValue={number}
              ref={register({ required: true })}
              onChange={(e) => {
                setNumber(e.target.value)
              }}
            />
          }
          {errors.number && <span className="error-message">Ce champ est requis</span>}
        </div>
      </div>
    </div>
  </Fragment>;

  return (
    <Fragment>
      <h3>{titleForm}</h3>
      <form >
        {form}
      </form>
      <button onClick={handleSubmit(handleFunction)}>
        {button}
      </button>
      <div>
        <input
          name="expirationDate"
          type="date"
          id="expirationDate"
          placeholder="Date d'expiration du produit"
        />
        {/* TODO utiliser datePicker */}
        <button onClick={addExpDate}>+</button>
      </div>

      {arrayExpDate &&
        <ul>
          {arrayExpDate.map((date, index) => {
            return <li key={`expirationDate-${index}`}>{date}</li>
          })}
        </ul>
      }
    </Fragment>
  )
}

AddEditProductForm.propTypes = {
  handleFunction: PropTypes.func.isRequired,
  formType: PropTypes.string.isRequired,
  value: PropTypes.object,
  arrayExpDate: PropTypes.array.isRequired,
  setArrayExpData: PropTypes.func.isRequired
}

export default AddEditProductForm


//Pour historique
//Si number > 1 date expi doit être au minimum 1
// Si 5 produit et un seul date (nbre de date automatique à 5) => btn edit pas en griser
// Si 5 produit mais 2 date => btn edit en grisé, obligation de choisir le nombre de date selon le nombre de produit
//exemple
// 5 produit
// 01/01/21 [x4]
// 05/10/23 [x1]
// Des que nombre de date === nbr produit btn edit non grisé