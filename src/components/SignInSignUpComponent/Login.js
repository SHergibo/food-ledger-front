import React, { useState, useEffect, useRef } from 'react';
import { withRouter } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';
import { loginIn } from './../../utils/Auth';
import AlreadyLogged from './AlreadyLogged';
import PropTypes from 'prop-types';

function Login({ history, successCreateAccount, setSuccessCreateAccount, createUserForm }) {
  const [errorMessage, setErrorMessage] = useState(false);
  const [alreadyLogged, setAlreadyLogged] = useState(false);
  const [loginData, setLoginData] = useState({});
  const successMessage = useRef(null);
  const { register, handleSubmit, formState: { errors } } = useForm({
    mode: "onChange"
  });

  useEffect(() => {
    let timeOutStyle;
    let timeOutSetSuccess
    if (successCreateAccount) {
      timeOutStyle = setTimeout(() => {
        successMessage.current.style.opacity = 0;
        successMessage.current.style.height = 0;
      }, 3000);
      timeOutSetSuccess = setTimeout(() => {
        setSuccessCreateAccount(false);
      }, 3500);
    }

    return () => {
      clearTimeout(timeOutStyle);
      clearTimeout(timeOutSetSuccess);
    }
  }, [successCreateAccount, setSuccessCreateAccount, successMessage]);


  const onSubmit = async (data) => {
    let localStore = {
      access_token:  localStorage.getItem("access_token"),
      refresh_token: localStorage.getItem('refresh_token'),
      user_id: localStorage.getItem('user_id'),
      user_email: localStorage.getItem('user_email')
    }
    if(data.email === localStore.user_email){
      history.push("/app/liste-produit");
      return;
    }
    if(localStore.access_token && localStore.refresh_token && localStore.user_id && localStore.user_email){
      setLoginData(data);
      return setAlreadyLogged(true);
    }
    let responseLogin = await loginIn(data);
    if (responseLogin !== 401) {
      history.push("/app/liste-produit");
    } else {
      setErrorMessage(true);
    }
  };

  return (
    <>
    {alreadyLogged ?
      <AlreadyLogged 
        history={history}
        loginData={loginData}
      />
    :
      <div className="form-container">
        <form className="form-sign-in" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <h2>Login</h2>

            <div className="input-group">
              <input
                name="email"
                type="email"
                id="email"
                placeholder="email"
                className="form-input"
                {...register("email", { required: "Ce champ est requis !" })}
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
                {...register("password", { required: "Ce champ est requis !" })}
              />
              <label htmlFor="password" className="form-label">Mot de passe *</label>
              <div className="error-message">
                <ErrorMessage errors={errors} name="password" as="span" />
              </div>
            </div>

            {errorMessage && <span className="error-message">Adresse mail ou mot de passe invalide !</span>}
            {successCreateAccount && <span ref={successMessage} className="success-message">Votre compte a été créé avec succés !</span>}
            <button type="submit" className="btn-form-sign-in">
              Connexion
            </button>
          </div>

          <div className="switch-form-container">
            {/* <p className="switch-form" onClick={() => createUserForm()}>
              Créer un compte
            </p> */}
          </div>
        </form>
      </div>
    }
  </>
  )
}

Login.propTypes = {
  history : PropTypes.object.isRequired,
  successCreateAccount : PropTypes.bool.isRequired,
  setSuccessCreateAccount : PropTypes.func.isRequired,
  createUserForm : PropTypes.func.isRequired,
}

export default withRouter(Login);
