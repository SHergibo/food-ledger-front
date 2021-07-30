import React from "react";
import { useForm } from "react-hook-form";
import { ErrorMessage } from '@hookform/error-message';
import { useStateMachine } from "little-state-machine";
import updateAction from "../../utils/updateAction";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';

function SignUpStep1({ setForm, formRef }) {
  const { state, action } = useStateMachine(updateAction);
  const { handleSubmit, formState: { errors }, register, getValues } = useForm({
    defaultValues: state.yourDetails
  });

  const onSubmit = data => {
    action(data);
    setForm('step2');
    formRef.classList.remove('active-step1');
    if(data.otherMemberCheck){
      formRef.classList.add('active-step2');
    }
  };

  return (
    <div className="form-sign-up-container">

      <form className="form-sign-up" onSubmit={handleSubmit(onSubmit)}>
        <h2 className="sign-up-subtitle">Étape 1 : Infos utilisateur</h2>

        <div className="input-flex-group">
          <div className="input-group">
            <input
              name="firstName"
              type="text"
              id="fistName"
              className={`form-input ${errors.firstName  ? "error-input" : ""}`}
              {...register("firstName", { required: "Ce champ est requis!" })}
            />
            <label htmlFor="fistName" className="form-label">Prénom *</label>
            <div className="error-message-input">
              <ErrorMessage errors={errors} name="firstName" as="span" />
            </div>
          </div>

          <div className="input-group">
            <input
              name="lastName"
              type="text"
              id="lastName"
              className={`form-input ${errors.lastName  ? "error-input" : ""}`}
              {...register("lastName", { required: "Ce champ est requis!" })}
            />
            <label htmlFor="lastName" className="form-label">Nom *</label>
            <div className="error-message-input">
              <ErrorMessage errors={errors} name="lastName" as="span" />
            </div>
          </div>
        </div>

        <div className="input-group">
          <input
            name="email"
            type="email"
            id="email"
            className={`form-input ${errors.email  ? "error-input" : ""}`}
            {...register("email", { required: "Ce champ est requis!" })}
          />
          <label htmlFor="email" className="form-label">E-mail *</label>
          <div className="error-message-input">
            <ErrorMessage errors={errors} name="email" as="span" />
          </div>
        </div>

        <div className="input-flex-group">
          <div className="input-group">
            <input
              name="password"
              type="password"
              id="password"
              className={`form-input ${errors.password  ? "error-input" : ""}`}
              {...register("password", { required: true, minLength: 7 })}
            />
            <label htmlFor="password" className="form-label">Mot de passe *</label>
            <div className="error-message-input">
              {errors.password?.type === "required" && <span>Ce champ est requis!</span>}
              {errors.password?.type === "minLength" && <span>Le mot de passe doit contenir minimum 7 caractères !</span>}
            </div>
          </div>

          <div className="input-group">
            <input
              name="confirmPassword"
              type="password"
              id="confirmPassword"
              className={`form-input ${errors.confirmPassword  ? "error-input" : ""}`}
              {...register("confirmPassword", {
                required: "Ce champ est requis!",
                validate: (value) => value === getValues('password') || "Le mot de passe ne correspond pas !"
              })}
            />
            <label htmlFor="confirmPassword" className="form-label">Confirmez le mot de passe *</label>
            <div className="error-message-input">
              <ErrorMessage errors={errors} name="confirmPassword" as="span" />
            </div>
          </div>
        </div>

        <button type="submit" className="btn-purple">
          <FontAwesomeIcon className="btn-icon" icon="angle-right" />
          Étape suivante 
        </button>
      </form>
    </div>
  )
}

SignUpStep1.propTypes = {
  setForm : PropTypes.func.isRequired,
  formRef : PropTypes.object.isRequired,
}

export default SignUpStep1

