import React, { useState, Fragment } from "react";
import { useForm } from "react-hook-form";
import { ErrorMessage } from '@hookform/error-message';
import { useStateMachine } from "little-state-machine";
import updateAction from "../../utils/updateAction";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight, faTimes } from '@fortawesome/free-solid-svg-icons';
import PropTypes from 'prop-types';

function SignUpStep2({ setForm, returnToLogin }) {
  const { state, action } = useStateMachine(updateAction);
  const [errorMessage, setErrorMessage] = useState(false);
  const { handleSubmit, register, errors } = useForm({
    defaultValues: state.yourDetails
  });

  const pressHouseHoldCodeCheck = () => {
    state.yourDetails.householdCodeCheck = !state.yourDetails.householdCodeCheck;
    action(state.yourDetails);
  };

  const pressHouseHoldNameCheck = () => {
    state.yourDetails.householdNameCheck = !state.yourDetails.householdNameCheck;
    action(state.yourDetails);
  };

  const pressOtherMemberCodeCheck = () => {
    state.yourDetails.otherMemberCheck = !state.yourDetails.otherMemberCheck;
    action(state.yourDetails);
  };

  const addOtherMember = (e) => {
    e.preventDefault();
    let inputOtherMember = document.getElementById('otherMember');
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

  const onSubmit = (data) => {
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
      action(data);
      setForm('confirm');
    } else {
      setErrorMessage(true);
    }

  };

  return (
    <div className="form-container">
      <form className="form-sign-up" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <h2>Création de compte : étape 2</h2>
          {state.yourDetails.householdNameCheck !== true && (
            <label className="container-checkbox">
              Avez-vous un code famille ?
              <input
                name="householdCodeCheck"
                type="checkbox"
                onClick={pressHouseHoldCodeCheck}
                ref={register()}
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
                placeholder="Code famille"
                className="form-input"
                ref={register({ required: "Ce champ est requis !" })}
              />
              <label htmlFor="householdCode" className="form-label">Code famille *</label>
              <div className="error-message">
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
                onClick={pressHouseHoldNameCheck}
                ref={register()}
              />
              <span className="checkmark-checkbox"></span>
            </label>
          )}
          {state.yourDetails.householdNameCheck === true && (
            <Fragment>
              <div className="input-group">
                <input
                  name="householdName"
                  type="text"
                  id="householdName"
                  placeholder="Nom de la famille"
                  className="form-input"
                  ref={register({ required: "Ce champ est requis !" })}
                />
                <label htmlFor="householdName" className="form-label">Nom de la famille *</label>
                <div className="error-message">
                  <ErrorMessage errors={errors} name="householdName" as="span" />
                </div>
              </div>
              <label className="container-checkbox">
                Autre code utilisateur ?
              <input
                  name="otherMemberCheck"
                  type="checkbox"
                  onClick={pressOtherMemberCodeCheck}
                  ref={register()}
                />
                <span className="checkmark-checkbox"></span>
              </label>
              {state.yourDetails.otherMemberCheck === true && (
                <Fragment>
                  <div className="div-usercode">
                    <div className="input-group">
                      <input
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
                  {state.yourDetails.otherMemberArray.length >= 1 && (
                    <ul className="list-usercode">
                      {
                        state.yourDetails.otherMemberArray.map((item, index) => {
                          return (
                          <li key={`userCode-${index}`}><div>{item}</div> <button onClick={(e) => deleteOtherMember(e, index)}><FontAwesomeIcon icon={faTimes} /></button></li>
                          )
                        })
                      }
                    </ul>
                  )}
                </Fragment>
              )}
            </Fragment>
          )}
          {errorMessage === true && (
            <span className="error-message">Vous devez repondre à une de ces deux questions et remplire le formulaire.</span>
          )}
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

SignUpStep2.propTypes = {
  setForm : PropTypes.func.isRequired,
  returnToLogin : PropTypes.func.isRequired,
}

export default SignUpStep2

