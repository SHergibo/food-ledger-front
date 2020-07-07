import React from "react";
import { useForm, ErrorMessage } from "react-hook-form";
import { useStateMachine } from "little-state-machine";
import updateAction from "../utils/updateAction";

function SignUpStep1({ setForm }) {
  const { state, action } = useStateMachine(updateAction);
  const { handleSubmit, errors, register } = useForm({
    defaultValues: state.yourDetails
  });

  const onSubmit = data => {
    //TODO confirm password avant d'action data
    action(data);
    setForm('step2');
  };

  return (
    <div className="form-container">


      <form className="form-sign-in" onSubmit={handleSubmit(onSubmit)}>
        <h2>Création de compte : étape 1</h2>

        <div className="input-group">
          <input
            name="firstName"
            type="text"
            id="fistName"
            placeholder="Nom"
            className="form-input"
            ref={register({ required: "Ce champ est requis !" })}
          />
          <label htmlFor="fistName" className="form-label">Nom *</label>
          <div className="error-message">
            <ErrorMessage errors={errors} name="firstName" as="span" />
          </div>
        </div>

        <div className="input-group">
          <input
            name="lastName"
            type="text"
            id="lastName"
            placeholder="Prénom"
            className="form-input"
            ref={register({ required: "Ce champ est requis !" })}
          />
          <label htmlFor="lastName" className="form-label">Prénom *</label>
          <div className="error-message">
            <ErrorMessage errors={errors} name="lastName" as="span" />
          </div>
        </div>

        <div className="input-group">
          <input
            name="email"
            type="email"
            id="email"
            placeholder="email"
            className="form-input"
            ref={register({ required: "Ce champ est requis !" })}
          />
          <label htmlFor="email" className="form-label">Email *</label>
          <div className="error-message">
            <ErrorMessage errors={errors} name="email" as="span" />
          </div>
        </div>

        <div className="input-group">
          <input
            name="password"
            type="password"
            id="password"
            placeholder="Mot de passe"
            className="form-input"
            ref={register({ required: "Ce champ est requis !" })}
          />
          <label htmlFor="password" className="form-label">Mot de passe *</label>
          <div className="error-message">
            <ErrorMessage errors={errors} name="password" as="span" />
          </div>
        </div>

        <div className="input-group">
          <input
            name="confirmPassword"
            type="password"
            id="confirmPassword"
            placeholder="Confirmer mot de passe"
            className="form-input"
            ref={register({ required: "Ce champ est requis !" })}
          />
          <label htmlFor="confirmPassword" className="form-label">Confirmation mot de passe *</label>
          <div className="error-message">
            <ErrorMessage errors={errors} name="confirmPassword" as="span" />
          </div>
        </div>

        <button type="submit" className="btn-form-sign-in">
          Étape suivante
        </button>
      </form>
    </div>
  )
}

export default SignUpStep1

