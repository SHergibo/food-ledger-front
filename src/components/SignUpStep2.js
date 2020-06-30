import React, { useState, Fragment } from "react";
import { useForm, ErrorMessage } from "react-hook-form";
import { useStateMachine } from "little-state-machine";
import updateAction from "../utils/updateAction";

function SignUpStep2({ setForm }) {
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
    state.yourDetails.otherMemberArray.push(inputOtherMember.value);
    action(state.yourDetails);
    inputOtherMember.value = "";
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
      setForm('result');
    } else {
      setErrorMessage(true);
    }

  };

  return (
    <form className="form-sign-in-up" onSubmit={handleSubmit(onSubmit)}>
      <h2>Création de compte : étape 2</h2>
      {state.yourDetails.householdNameCheck !== true && (
        <label>
          Voulez-vous rejoindre une famille existante (code famille demandé).
          <input
            name="householdCodeCheck"
            type="checkbox"
            onClick={pressHouseHoldCodeCheck}
            ref={register()}
          />
        </label>
      )}
      {state.yourDetails.householdCodeCheck === true && (
        <label>
          Code famille:
          <input
            name="householdCode"
            type="text"
            ref={register({ required: "Ce champ est requis." })}
          />
          <ErrorMessage errors={errors} name="householdCode" as="span" />
        </label>
      )}
      {state.yourDetails.householdCodeCheck !== true && (
        <label>
          Voulez-vous créer une famille.
          <input
            name="householdNameCheck"
            type="checkbox"
            onClick={pressHouseHoldNameCheck}
            ref={register()}
          />
        </label>
      )}
      {state.yourDetails.householdNameCheck === true && (
        <Fragment>
          <label>
            Nom de la famille:
          <input
              name="householdName"
              type="text"
              ref={register({ required: "Ce champ est requis." })}
            />
            <ErrorMessage errors={errors} name="householdName" as="span" />
          </label>
          <label>
            Avez-vous un ou plusieurs code utilisateur ?
          <input
              name="otherMemberCheck"
              type="checkbox"
              onClick={pressOtherMemberCodeCheck}
              ref={register()}
            />
          </label>
          {state.yourDetails.otherMemberCheck === true && (
            <Fragment>
            <div>
              <input type="text" name="otherMember" id="otherMember" />
              <button onClick={addOtherMember}>+</button>
            </div>
            <ul>
              {
                state.yourDetails.otherMemberArray.map((item, index) => {
                  return <li key={`userCode-${index}`}>{item} <button onClick={(e) => deleteOtherMember(e, index)}>x</button></li> 
                })
              }
            </ul>
            </Fragment>
          )}
        </Fragment>
      )}
      {errorMessage === true && (
        <span>Vous devez repondre à une de ces deux questions et remplire le formulaire.</span>
      )}
      <button type="submit">
        Submit
      </button>
    </form>
  )
}

export default SignUpStep2

