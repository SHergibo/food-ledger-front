import React, { useState, useEffect, Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import { useForm, ErrorMessage } from 'react-hook-form';
import { loginIn } from './../utils/Auth';

function Login({ history, successCreateAccount, setSuccessCreateAccount, createUserForm }) {
  const [errorMessage, setErrorMessage] = useState(false);
  const { register, handleSubmit, errors } = useForm({
    mode: "onChange"
  });

  useEffect(() => {
    if (successCreateAccount) {
      let spanSuccess = document.getElementsByClassName('success-message')[0];
      setTimeout(() => {
        spanSuccess.style.opacity = 0;
        spanSuccess.style.height = 0;
      }, 3000);
      setTimeout(() => {
        setSuccessCreateAccount(false);
      }, 3500);
    }
  }, [successCreateAccount, setSuccessCreateAccount]);


  const onSubmit = async (data) => {
    let responseLogin = await loginIn(data);
    if (responseLogin !== 401) {
      history.push("/app");
    } else {
      setErrorMessage(true);
    }
  };

  return (
    <div className="form-container">
      <form className="form-sign-in" onSubmit={handleSubmit(onSubmit)}>
        <h2>Login</h2>

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
            placeholder="password"
            className="form-input"
            ref={register({ required: "Ce champ est requis !" })}
          />
          <label htmlFor="password" className="form-label">Mot de passe *</label>
          <div className="error-message">
            <ErrorMessage errors={errors} name="password" as="span" />
          </div>
        </div>
        
        {errorMessage && <span className="error-message">Adresse mail ou mot de passe invalide !</span>}
        {successCreateAccount && <span className="success-message">Votre compte a été créé avec succés !</span>}
        <button type="submit" className="btn-form-sign-in">
          Connexion
        </button>
      </form>

      <div className="switch-form-container">
        <p className="switch-form" onClick={() => createUserForm()}>
          Créer un compte
        </p>
      </div>

    </div>
  )
}

export default withRouter(Login);
