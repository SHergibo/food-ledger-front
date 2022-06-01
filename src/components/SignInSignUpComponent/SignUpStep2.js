import React, { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import { useStateMachine } from "little-state-machine";
import updateAction from "../../utils/updateAction";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PropTypes from "prop-types";

function SignUpStep2({ setForm, formRef }) {
  const { actions, state } = useStateMachine({ updateAction });
  const [errorMessage, setErrorMessage] = useState(false);
  const [errorUsercode, setErrorUsercode] = useState(false);
  const [errorUsercodeMessage, setErrorUsercodeMessage] = useState("");
  const otherMemberInput = useRef(null);
  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm({});

  const pressHouseHoldCodeCheck = () => {
    let householdCodeCheck = {
      householdCodeCheck: !state.yourDetails.householdCodeCheck,
    };
    actions.updateAction(householdCodeCheck);
  };

  useEffect(() => {
    if (state.yourDetails.householdCodeCheck === false) {
      reset({ householdCode: null });
      reset({ householdCodeCheck: false });
      actions.updateAction({ householdCode: "" });
    }
  }, [
    state.yourDetails.householdCodeCheck,
    state.yourDetails.householdCode,
    actions,
    reset,
  ]);

  const pressHouseHoldNameCheck = () => {
    let householdNameCheck = {
      householdNameCheck: !state.yourDetails.householdNameCheck,
    };
    actions.updateAction(householdNameCheck);
  };

  useEffect(() => {
    if (state.yourDetails.householdNameCheck === false) {
      reset({ householdName: null });
      reset({ householdNameCheck: false });
      actions.updateAction({
        householdName: "",
      });
    }
    if (
      state.yourDetails.householdNameCheck === false &&
      state.yourDetails.otherMemberCheck === true
    ) {
      actions.updateAction({
        otherMemberArray: [],
        otherMemberCheck: false,
      });
    }
  }, [
    state.yourDetails.householdNameCheck,
    state.yourDetails.otherMemberCheck,
    actions,
    reset,
  ]);

  const pressOtherMemberCodeCheck = () => {
    let otherMemberCheck = {
      otherMemberCheck: !state.yourDetails.otherMemberCheck,
    };
    actions.updateAction(otherMemberCheck);
    state.yourDetails.otherMemberCheck
      ? formRef.classList.remove("active-step2")
      : formRef.classList.add("active-step2");
  };

  useEffect(() => {
    if (state.yourDetails.otherMemberCheck === false) {
      actions.updateAction({ otherMemberArray: [] });
    }
  }, [state.yourDetails.otherMemberCheck, actions]);

  const addOtherMember = (e) => {
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
          "Vous ne pouvez pas ajouter plus de 6 codes utilisateur!"
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

  const onSubmit = (data) => {
    delete data.otherMemberArray;
    if (data.householdCode || data.householdName) {
      setErrorMessage(false);
      let newData;
      if (state.yourDetails.householdName.length >= 1 && data.householdCode) {
        newData = state.yourDetails;
        newData.householdCodeCheck = true;
        newData.householdCode = data.householdCode;
        newData.householdNameCheck = false;
        newData.householdName = "";
        newData.otherMemberCheck = false;
        newData.otherMemberArray = [];
      }
      if (state.yourDetails.householdCode.length >= 1 && data.householdName) {
        newData = state.yourDetails;
        newData.householdCodeCheck = false;
        newData.householdCode = "";
        newData.householdNameCheck = true;
        newData.householdName = data.householdName;
      }
      actions.updateAction(data);
      setForm("confirm");
      if (data.otherMemberCheck) {
        formRef.classList.add("active-confirm-usercode");
      } else {
        formRef.classList.add("active-confirm");
      }
      formRef.classList.remove("active-step2");
    } else {
      setErrorMessage(true);
    }
  };

  return (
    <div className="form-sign-up-container">
      <form className="form-sign-up" onSubmit={handleSubmit(onSubmit)}>
        <h2 className="sign-up-subtitle">Étape 2 : Infos famille</h2>
        {state.yourDetails.householdNameCheck !== true && (
          <label className="container-checkbox">
            Avez-vous un code famille ?
            <input
              name="householdCodeCheck"
              type="checkbox"
              onClick={pressHouseHoldCodeCheck}
              checked={state.yourDetails.householdCodeCheck}
              {...register("householdCodeCheck")}
            />
            <span className="checkmark-checkbox"></span>
          </label>
        )}
        {state.yourDetails.householdCodeCheck === true && (
          <div className="input-group">
            <input
              name="householdCode"
              type="text"
              id="householdCode"
              defaultValue={state.yourDetails.householdCode}
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
        {state.yourDetails.householdCodeCheck !== true && (
          <label className="container-checkbox">
            Voulez-vous créer une famille ?
            <input
              name="householdNameCheck"
              type="checkbox"
              checked={state.yourDetails.householdNameCheck}
              onClick={pressHouseHoldNameCheck}
              {...register("householdNameCheck")}
            />
            <span className="checkmark-checkbox"></span>
          </label>
        )}
        {state.yourDetails.householdNameCheck === true && (
          <>
            <div className="input-group">
              <input
                name="householdName"
                type="text"
                id="householdName"
                defaultValue={state.yourDetails.householdName}
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
            <label className="container-checkbox">
              Autre code utilisateur ?
              <input
                name="otherMemberCheck"
                type="checkbox"
                checked={state.yourDetails.otherMemberCheck}
                onClick={pressOtherMemberCodeCheck}
                {...register("otherMemberCheck")}
              />
              <span className="checkmark-checkbox"></span>
            </label>
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
                          <p>{item}</p>
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
        {errorMessage === true && (
          <p className="error-message">
            Vous devez répondre à une de ces deux questions et remplir le
            formulaire.
          </p>
        )}
        <button type="submit" className="btn-purple">
          <FontAwesomeIcon className="btn-icon" icon="angle-right" />
          Étape suivante
        </button>
      </form>
    </div>
  );
}

SignUpStep2.propTypes = {
  setForm: PropTypes.func.isRequired,
  formRef: PropTypes.object.isRequired,
};

export default SignUpStep2;
