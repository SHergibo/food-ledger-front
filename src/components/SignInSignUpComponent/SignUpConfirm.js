import React, { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import { useStateMachine } from "little-state-machine";
import updateAction from "../../utils/updateAction";
import axios from "axios";
import { apiDomain, apiVersion } from "./../../apiConfig/ApiConfig";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PropTypes from "prop-types";

function SingUpConfirm({
  setForm,
  setFormTitle,
  setSuccessCreateAccount,
  formRef,
}) {
  const { actions, state } = useStateMachine({ updateAction });
  const [errorMessage, setErrorMessage] = useState("");
  const [errorUsercode, setErrorUsercode] = useState(false);
  const [errorUsercodeMessage, setErrorUsercodeMessage] = useState("");
  const [errorBool, setErrorBool] = useState(false);
  const [passwordChanged, setPasswordChanged] = useState(false);
  const otherMemberInput = useRef(null);
  const otherMemberList = useRef([]);
  const {
    handleSubmit,
    formState: { errors },
    register,
    getValues,
    setError,
  } = useForm({
    defaultValues: state.yourDetails,
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
    actions.updateAction(data);
    setSuccessCreateAccount(true);
    setForm("login");
    setFormTitle("Connexion");
    formRef.classList.remove("active");
    formRef.classList.remove("active-confirm");
    formRef.classList.remove("active-confirm-usercode");
  };

  const changePassword = (e) => {
    e.preventDefault();
    setPasswordChanged(true);
    if (e.target.value === state.yourDetails.password) {
      setPasswordChanged(false);
    }
  };

  const addOtherMember = (e) => {
    console.log("ici");
    e.preventDefault();
    setErrorUsercode(false);
    setErrorUsercodeMessage("");
    let inputOtherMember = otherMemberInput.current;
    let inputValue = inputOtherMember.value;
    inputOtherMember.value = "";
    if (inputValue) {
      let alreadyExist = state.yourDetails.otherMemberArray.find(
        (usercode) => usercode === inputValue
      );
      if (alreadyExist) {
        setErrorUsercode(true);
        setErrorUsercodeMessage("Ce code existe déjà!");
        return;
      }
      if (state.yourDetails.otherMemberArray.length >= 6) {
        setErrorUsercode(true);
        setErrorUsercodeMessage(
          "Vous ne pouvez pas ajouter plus de 6 code utilisateur!"
        );
        return;
      }
      state.yourDetails.otherMemberArray.push(inputValue);
      actions.updateAction(state.yourDetails);
    }
  };

  const deleteOtherMember = (e, index) => {
    e.preventDefault();
    state.yourDetails.otherMemberArray.splice(index, 1);
    actions.updateAction(state.yourDetails);
  };

  const finalData = (data) => {
    const baseObject = {
      firstname: data.firstName,
      lastname: data.lastName,
      email: data.email,
      password: data.password,
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
    resetStore();
    actions.updateAction(data);
    const finalState = updateAction(state, data);

    const objectData = await finalData(finalState.yourDetails);

    let createAccountEndPoint = `${apiDomain}/api/${apiVersion}/users`;

    if (
      state.yourDetails.householdCodeCheck &&
      state.yourDetails.householdCode
    ) {
      createAccountEndPoint = `${apiDomain}/api/${apiVersion}/users?householdCode=${state.yourDetails.householdCode}`;
    }
    await axios
      .post(createAccountEndPoint, objectData, {
        validateStatus: function (status) {
          return status < 500;
        },
      })
      .then((response) => {
        if (response.status === 200) {
          resetStore();
          setErrorBool(false);
          setErrorMessage("");
        } else if (response.status === 404 && response.data.data) {
          let responseDataArray = response.data.data;
          responseDataArray.forEach((dataBadUserCode) => {
            const errorUserCodes = otherMemberList.current.filter(
              (usercode) => usercode.innerHTML === dataBadUserCode.usercode
            );
            errorUserCodes.forEach((errorUserCode) => {
              errorUserCode.classList.add("bad-user-code");
              errorUserCode.title =
                dataBadUserCode.errorType === "userCodeNotFound"
                  ? "Ce code utilisateur n'existe pas!"
                  : "Cet.te utilisateur.trice ne pas pas rejoindre votre famille pour le moment !";
            });
          });
          setErrorBool(true);
          if (response.data.data.length === 1) {
            setErrorMessage("Il y a un problème avec un code utilisateur!");
          } else {
            setErrorMessage(
              "Il y a un problème avec plusieurs codes utilisateur!"
            );
          }
        } else if (response.status === 400) {
          setErrorBool(true);
          setErrorMessage("Code famille invalide!");
        } else if (response.status === 409) {
          setError("email", {
            type: "manual",
            message: "Cette adresse mail existe déjà!",
          });
        }
      });
  };
  return (
    <div className="form-sign-up-container">
      <form className="form-sign-up" onSubmit={handleSubmit(onSubmit)}>
        <h2 className="sign-up-subtitle">Étape 3 : confirmation</h2>

        <div className="input-flex-group">
          <div className="input-group">
            <input
              name="firstName"
              type="text"
              id="fistName"
              className={`form-input ${errors.firstName ? "error-input" : ""}`}
              {...register("firstName", { required: "Ce champ est requis!" })}
            />
            <label htmlFor="fistName" className="form-label">
              Prénom *
            </label>
            <div className="error-message-input">
              <ErrorMessage errors={errors} name="firstName" as="span" />
            </div>
          </div>

          <div className="input-group">
            <input
              name="lastName"
              type="text"
              id="lastName"
              className={`form-input ${errors.lastName ? "error-input" : ""}`}
              {...register("lastName", { required: "Ce champ est requis!" })}
            />
            <label htmlFor="lastName" className="form-label">
              Nom *
            </label>
            <div className="error-message-input">
              <ErrorMessage errors={errors} name="lastName" as="span" />
            </div>
          </div>
        </div>

        <div className="input-flex-group">
          <div className="input-group">
            <input
              name="email"
              type="email"
              id="email"
              className={`form-input ${errors.email ? "error-input" : ""}`}
              {...register("email", { required: "Ce champ est requis!" })}
            />
            <label htmlFor="email" className="form-label">
              E-mail *
            </label>
            <div className="error-message-input">
              <ErrorMessage errors={errors} name="email" as="span" />
            </div>
          </div>
          {state.yourDetails.householdCodeCheck === true && (
            <div className="input-group">
              <input
                name="householdCode"
                type="text"
                id="householdCode"
                className={`form-input ${
                  errors.householdCode ? "error-input" : ""
                }`}
                {...register("householdCode", {
                  required: "Ce champ est requis!",
                })}
              />
              <label htmlFor="householdCode" className="form-label">
                Code famille *
              </label>
              <div className="error-message-input">
                <ErrorMessage errors={errors} name="householdCode" as="span" />
              </div>
            </div>
          )}
          {state.yourDetails.householdNameCheck === true && (
            <div className="input-group">
              <input
                name="householdName"
                type="text"
                id="householdName"
                className={`form-input ${
                  errors.householdName ? "error-input" : ""
                }`}
                {...register("householdName", {
                  required: "Ce champ est requis!",
                })}
              />
              <label htmlFor="householdName" className="form-label">
                Nom de la famille *
              </label>
              <div className="error-message-input">
                <ErrorMessage errors={errors} name="householdName" as="span" />
              </div>
            </div>
          )}
        </div>

        <div className="input-flex-group">
          <div
            className={`input-group ${passwordChanged ? "input-siblings" : ""}`}
          >
            <input
              name="password"
              type="password"
              id="password"
              className={`form-input ${errors.password ? "error-input" : ""}`}
              {...register("password", { required: true, minLength: 7 })}
              onChange={changePassword}
            />
            <label htmlFor="password" className="form-label">
              Mot de passe *
            </label>
            <div className="error-message-input">
              {errors.password?.type === "required" && (
                <span>Ce champ est requis!</span>
              )}
              {errors.password?.type === "minLength" && (
                <span>
                  Le mot de passe doit contenir minimum 7 caractères !
                </span>
              )}
            </div>
          </div>

          {passwordChanged === true && (
            <div className="input-group">
              <input
                name="confirmPassword"
                type="password"
                id="confirmPassword"
                className={`form-input ${
                  errors.confirmPassword ? "error-input" : ""
                }`}
                {...register("confirmPassword", {
                  required: "Ce champ est requis!",
                  validate: (value) =>
                    value === getValues("password") ||
                    "Le mot de passe ne correspond pas !",
                })}
              />
              <label htmlFor="confirmPassword" className="form-label">
                Confirmez le mot de passe *
              </label>
              <div className="error-message-input">
                <ErrorMessage
                  errors={errors}
                  name="confirmPassword"
                  as="span"
                />
              </div>
            </div>
          )}
        </div>

        {state.yourDetails.householdNameCheck === true && (
          <>
            {state.yourDetails.otherMemberCheck === true && (
              <>
                <div className="container-input-interaction">
                  <div className="input-group">
                    <input
                      ref={otherMemberInput}
                      name="otherMember"
                      type="text"
                      id="otherMember"
                      className="form-input"
                    />
                    <label htmlFor="otherMember" className="form-label">
                      Code utilisateur
                    </label>
                    <div className="error-message-input">
                      {errorUsercode && (
                        <div className="error-message-input">
                          <span>{errorUsercodeMessage}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <button
                    className="btn-input-interaction"
                    onClick={addOtherMember}
                  >
                    <FontAwesomeIcon className="btn-icon" icon="plus" />
                  </button>
                </div>
                {state.yourDetails.otherMemberArray.length >= 1 && (
                  <ul className="list-usercode">
                    {state.yourDetails.otherMemberArray.map((item, index) => {
                      return (
                        <li key={`userCode-${index}`}>
                          <p
                            ref={(el) => (otherMemberList.current[index] = el)}
                          >
                            {item}
                          </p>
                          <button onClick={(e) => deleteOtherMember(e, index)}>
                            <FontAwesomeIcon
                              className="btn-icon"
                              icon="times"
                            />
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </>
            )}
          </>
        )}
        {errorBool && <p className="error-message">{errorMessage}</p>}
        <button type="submit" className="btn-purple">
          <FontAwesomeIcon className="btn-icon" icon="user-plus" />
          Créer son compte
        </button>
      </form>
    </div>
  );
}

SingUpConfirm.propTypes = {
  setForm: PropTypes.func.isRequired,
  setFormTitle: PropTypes.func.isRequired,
  setSuccessCreateAccount: PropTypes.func.isRequired,
  formRef: PropTypes.object.isRequired,
};

export default SingUpConfirm;
