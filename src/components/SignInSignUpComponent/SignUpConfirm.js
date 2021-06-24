import React, { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { ErrorMessage } from '@hookform/error-message';
import { useStateMachine } from "little-state-machine";
import updateAction from "../../utils/updateAction";
import axios from 'axios';
import { apiDomain, apiVersion } from './../../apiConfig/ApiConfig';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';

function SingUpConfirm({ setForm, setFormTitle, setSuccessCreateAccount, returnToLogin }) {
  const { state, action } = useStateMachine(updateAction);
  const [errorMessage, setErrorMessage] = useState("");
  const [errorBool, setErrorBool] = useState(false);
  const [passwordChanged, setPasswordChanged] = useState(false);
  const otherMemberInput = useRef(null);
  const otherMemberList = useRef([]);
  const { handleSubmit, formState: { errors }, register, getValues } = useForm({
    defaultValues: state.yourDetails
  });
  const resetStore = () => {
    const data = {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      householdCodeCheck: false,
      householdCode: "",
      householdNameCheck: false,
      householdName: "",
      otherMemberCheck: false,
      otherMemberArray: [],
    };
    action(data);
    setSuccessCreateAccount(true);
    setForm('login');
    setFormTitle('Sign In')
  };

  const changePassword = (e) => {
    e.preventDefault();
    setPasswordChanged(true);
    if (e.target.value === state.yourDetails.password) {
      setPasswordChanged(false);
    }
  };

  const addOtherMember = (e) => {
    e.preventDefault();
    let inputOtherMember = otherMemberInput.current;
    if(inputOtherMember.value){
      state.yourDetails.otherMemberArray.push(inputOtherMember.value);
      action(state.yourDetails);
      inputOtherMember.value = "";
    }
  }

  const deleteOtherMember = (e, index) => {
    e.preventDefault();
    state.yourDetails.otherMemberArray.splice(index, 1);
    action(state.yourDetails);
  }

  const finalData = (data) => {
    const baseObject = {
      firstname: data.firstName,
      lastname: data.lastName,
      email: data.email,
      password: data.password
    };

    if (data.householdNameCheck && data.householdName) {
      baseObject.householdName = data.householdName;
    }

    if (data.otherMemberCheck && data.otherMemberArray.length >= 1) {
      baseObject.othermember = data.otherMemberArray;
    }

    return baseObject;
  };

  const onSubmit = async (data) => {
    action(data);
    const finalState = updateAction(state, data);
    
    const objectData = await finalData(finalState.yourDetails);

    let createAccountEndPoint = `${apiDomain}/api/${apiVersion}/users`;

    if (state.yourDetails.householdCodeCheck && state.yourDetails.householdCode) {
      createAccountEndPoint = `${apiDomain}/api/${apiVersion}/users?householdCode=${state.yourDetails.householdCode}`;
    }
    await axios.post(createAccountEndPoint, objectData, {
      validateStatus: function (status) {
        return status < 500;
      }
    }).then((response) => {
      if (response.status === 200) {
        resetStore();
        setErrorBool(false);
        setErrorMessage('');
      } else if (response.status === 404 && response.data.data) {
        let responseDataArray = response.data.data;
        responseDataArray.forEach(dataBadUserCode => {
          const errorUserCodes = otherMemberList.current.filter(usercode => usercode.innerHTML === dataBadUserCode.usercode);
          errorUserCodes.forEach(errorUserCode => {
            errorUserCode.classList.add('bad-user-code');
            errorUserCode.title = dataBadUserCode.errorType === "userCodeNotFound" ? "Ce code utilisateur n'existe pas!" : "Cet.te utilisateur.trice ne pas pas rejoindre votre famille pour le moment !"
          });
        });
        setErrorBool(true);
        if (response.data.data.length === 1) {
          setErrorMessage('Il y a un problème avec un code utilisateur!');
        } else {
          setErrorMessage('Il y a un problème avec plusieurs codes utilisateur!');
        }
      } else if (response.status === 400) {
        setErrorBool(true);
        setErrorMessage('Code famille invalide!');
      }
    });
  };
  return (
    <div className="form-container">
      <form className="form-sign-up" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <h2>Création de compte : Confirmation</h2>

          <div className="input-flex-group">
            <div className="input-group input-siblings">
              <input
                name="firstName"
                type="text"
                id="fistName"
                placeholder="Prénom"
                className="form-input"
                {...register("firstName", { required: "Ce champ est requis !" })}
              />
              <label htmlFor="fistName" className="form-label">Prénom *</label>
              <div className="error-message">
                <ErrorMessage errors={errors} name="firstName" as="span" />
              </div>
            </div>

            <div className="input-group">
              <input
                name="lastName"
                type="text"
                id="lastName"
                placeholder="Nom"
                className="form-input"
                {...register("lastName", { required: "Ce champ est requis !" })}
              />
              <label htmlFor="lastName" className="form-label">Nom *</label>
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
              {...register("email", { required: "Ce champ est requis !" })}
            />
            <label htmlFor="email" className="form-label">Email *</label>
            <div className="error-message">
              <ErrorMessage errors={errors} name="email" as="span" />
            </div>
          </div>

          <div className="input-flex-group">
            <div className={`input-group ${passwordChanged ? "input-siblings": ""}`}>
              <input
                name="password"
                type="password"
                id="password"
                placeholder="Mot de passe"
                className="form-input"
                {...register("password", { required: true, minLength: 7 })}
                onChange={changePassword}
              />
              <label htmlFor="password" className="form-label">Mot de passe *</label>
              <div className="error-message">
                {errors.password?.type === "required" && <span>Ce champ est requis !</span>}
                {errors.password?.type === "minLength" && <span>Le mot de passe doit contenir minimum 7 caractères !</span>}
              </div>
            </div>

            {passwordChanged === true && (
              <div className="input-group">
                <input
                  name="confirmPassword"
                  type="password"
                  id="confirmPassword"
                  placeholder="Confirmer mot de passe"
                  className="form-input"
                  {...register("confirmPassword", {
                    validate: (value) => value === getValues('password') || "Le mot de passe ne correspond pas !"
                  })}
                />
                <label htmlFor="confirmPassword" className="form-label">Confirmation mot de passe *</label>
                <div className="error-message">
                  <ErrorMessage errors={errors} name="confirmPassword" as="span" />
                </div>
              </div>
            )}
          </div>


          {state.yourDetails.householdCodeCheck === true && (
            <div className="input-group">
              <input
                name="householdCode"
                type="text"
                id="householdCode"
                placeholder="Code famille"
                className="form-input"
                {...register("householdCode", { required: "Ce champ est requis !" })}
              />
              <label htmlFor="householdCode" className="form-label">Code famille *</label>
              <div className="error-message">
                <ErrorMessage errors={errors} name="householdCode" as="span" />
              </div>
            </div>
          )}

          {state.yourDetails.householdNameCheck === true && (
            <>
              <div className="input-group">
                <input
                  name="householdName"
                  type="text"
                  id="householdName"
                  placeholder="Nom de la famille"
                  className="form-input"
                  {...register("householdName", { required: "Ce champ est requis !" })}
                />
                <label htmlFor="householdName" className="form-label">Nom de la famille *</label>
                <div className="error-message">
                  <ErrorMessage errors={errors} name="householdName" as="span" />
                </div>
              </div>
              {state.yourDetails.otherMemberCheck === true && (
                <>
                  <div className="div-usercode">
                    <div className="input-group">
                      <input
                        ref={otherMemberInput}
                        name="otherMember"
                        type="text"
                        id="otherMember"
                        placeholder="Code utilisateur"
                        className="form-input"
                      />
                      <label htmlFor="otherMember" className="form-label">Code utilisateur *</label>
                    </div>
                    <button className="btn-add-usercode" onClick={addOtherMember}>+</button>
                  </div>
                  {state.yourDetails.otherMemberArray.length === 0 && (
                    <p>Aucun code utilisateur.</p>
                  )}
                  {state.yourDetails.otherMemberArray.length >= 1 && (
                    <ul className="list-usercode">
                      {
                        state.yourDetails.otherMemberArray.map((item, index) => {
                          return (
                            <li key={`userCode-${index}`}><div ref={(el) => (otherMemberList.current[index] = el)}>{item}</div> <button onClick={(e) => deleteOtherMember(e, index)}><FontAwesomeIcon icon="times" /></button></li>
                          )
                        })
                      }
                    </ul>
                  )}

                </>
              )}
            </>
          )}
          {errorBool && <span className="error-message">{errorMessage}</span>}
          <button type="submit" className="btn-form-sign-in">
            Créer son compte
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

SingUpConfirm.propTypes = {
  setForm : PropTypes.func.isRequired,
  setFormTitle : PropTypes.func.isRequired,
  setSuccessCreateAccount : PropTypes.func.isRequired,
  returnToLogin : PropTypes.func.isRequired,
}

export default SingUpConfirm
