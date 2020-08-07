import React, { Fragment } from 'react';
import { useForm } from 'react-hook-form';
import PropTypes from 'prop-types';

function AddEditProductForm({ handleFunction, formType, value }) {
  const { register, handleSubmit, errors } = useForm({
    mode: "onChange"
  });

  let titleForm = "Ajout";
  let button = "Ajouter";

  if (formType === "edit") {
    titleForm = "Édition";
    button = "Éditer";
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
          {formType === "edit" && <input name="expirationDate" type="text" id="expirationDate" placeholder="Date d'expiration du produit" defaultValue={value.expirationDate} ref={register({ required: true })} />}
          {errors.expirationDate && <span className="error-message">Ce champ est requis</span>}
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
        <label htmlFor="number">Nomber de produit *</label>
        <div>
          {formType === "add" && <input name="number" type="text" id="number" placeholder="Nomber de produit" ref={register({ required: true })} />}
          {formType === "edit" && <input name="number" type="text" id="number" placeholder="Nomber de produit" defaultValue={value.number} ref={register({ required: true })} />}
          {errors.number && <span className="error-message">Ce champ est requis</span>}
        </div>
      </div>
    </div>

    <div>
      <button type="submit">
        {button}
      </button>
    </div>
  </Fragment>;

  return (
    <Fragment>
      <h3>{titleForm}</h3>
      <form onSubmit={handleSubmit(handleFunction)}>
        {form}
      </form>
    </Fragment>
  )
}

AddEditProductForm.propTypes = {
  handleFunction: PropTypes.func.isRequired,
  formType: PropTypes.string.isRequired,
  value: PropTypes.object,
}

export default AddEditProductForm
