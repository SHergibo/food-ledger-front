import React from "react";
import { useForm, ErrorMessage } from "react-hook-form";
import { useStateMachine } from "little-state-machine";
import updateAction from "../../utils/updateAction";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons';

function SignUpStep1({ setForm, returnToLogin }) {
  const { state, action } = useStateMachine(updateAction);
  const { handleSubmit, errors, register, getValues } = useForm({
    defaultValues: state.yourDetails
  });

  const onSubmit = data => {
    action(data);
    setForm('step2');
  };

  return (
    <div className="form-container">

      <form className="form-sign-up" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <h2>Création de compte : étape 1</h2>

          <div className="input-flex-group">
            <div className="input-group input-siblings">
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

          <div className="input-flex-group">
            <div className="input-group input-siblings">
              <input
                name="password"
                type="password"
                id="password"
                placeholder="Mot de passe"
                className="form-input"
                ref={register({ required: true, minLength: 7 })}
              />
              <label htmlFor="password" className="form-label">Mot de passe *</label>
              <div className="error-message">
                {errors.password?.type === "required" && <span>Ce champ est requis !</span>}
                {errors.password?.type === "minLength" && <span>Le mot de passe doit contenir minimum 7 caractères !</span>}
              </div>
            </div>

            <div className="input-group">
              <input
                name="confirmPassword"
                type="password"
                id="confirmPassword"
                placeholder="Confirmer mot de passe"
                className="form-input"
                ref={register({
                  validate: (value) => value === getValues('password') || "Le mot de passe ne correspond pas !"
                })}
              />
              <label htmlFor="confirmPassword" className="form-label">Confirmation mot de passe *</label>
              <div className="error-message">
                <ErrorMessage errors={errors} name="confirmPassword" as="span" />
              </div>
            </div>
          </div>

          <button type="submit" className="btn-form-sign-in">
            Étape suivante <FontAwesomeIcon icon={faAngleRight} />
          </button>
        </div>

        <div className="switch-form-container">
          <p className="switch-form" onClick={() => returnToLogin()}>
            Connexion
          </p>
        </div>

      </form>
    </div>
  )
}

export default SignUpStep1

