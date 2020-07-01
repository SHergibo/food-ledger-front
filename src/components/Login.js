import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { useForm, ErrorMessage } from 'react-hook-form';
import { loginIn } from './../utils/Auth';

function Login({history, successCreateAccount, setSuccessCreateAccount}) {
  const [errorMessage, setErrorMessage] = useState(false);
  const { register, handleSubmit, errors } = useForm({
    mode: "onChange"
  });

  useEffect(() => {
    if(successCreateAccount){
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
    }else{
      setErrorMessage(true);
    }
  };

  return (
    <form className="form-sign-in-up" onSubmit={handleSubmit(onSubmit)}>
      <h2>Login</h2>

      <label>
        Email :
        <input
          name="email"
          type="email"
          ref={register({ required: "Ce champ est requis." })}
        />
        <ErrorMessage errors={errors} name="email" as="span" />
      </label>

      <label>
        Mot de passe :
        <input
          name="password"
          type="password"
          ref={register({ required: "Ce champ est requis." })}
        />
        <ErrorMessage errors={errors} name="password" as="span" />
      </label>

      {errorMessage && <span>Adresse mail ou mot de passe invalide !</span>}
      {successCreateAccount && <span className="success-message">Votre compte a été créé avec succés !</span>}
      <input type="submit" />
    </form>
  )
}

export default withRouter(Login);
