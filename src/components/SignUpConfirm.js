import React, { Fragment } from "react";
import { useForm, ErrorMessage } from "react-hook-form";
import { useStateMachine } from "little-state-machine";
import updateAction from "../utils/updateAction";
import axios from 'axios';
import { apiDomain, apiVersion } from './../apiConfig/ApiConfig';

function SingUpConfirm({ setForm, setFormTitle }) {
  const { state, action } = useStateMachine(updateAction);
  const { handleSubmit, errors, register } = useForm({
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
    setForm('login');
    setFormTitle('Sign In')
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

  const finalData = (data) => {
    const baseObject = {
      firstname : data.firstName,
      lastname : data.lastName,
      email : data.email,
      password : data.password
    };

    if(data.householdNameCheck && data.householdName){
      baseObject.role = "admin";
      baseObject.householdname = data.householdName;
    }

    if(data.otherMemberCheck && data.otherMemberArray.length >= 1 ){
      baseObject.othermember = data.otherMemberArray;
    }

    if(data.householdCodeCheck && data.householdCode){
      baseObject.role = "user";
    }

    return baseObject;
  };

  const onSubmit = async(data) => {
    action(data);
    const objectData = await finalData(state.yourDetails);
    let createAccountEndPoint =`${apiDomain}/api/${apiVersion}/users`;
    
    if(state.yourDetails.householdCodeCheck && state.yourDetails.householdCode){
      createAccountEndPoint = `${apiDomain}/api/${apiVersion}/users?householdcode=${state.yourDetails.householdCode}`;
    }
    await axios.post(createAccountEndPoint, objectData)
    .then((response) => {
      if(response.status === 200){
        resetStore();
      }else{
      //TODO gérer erreur
      }
    });
  };
  return (
    <form className="form-sign-in-up" onSubmit={handleSubmit(onSubmit)}>
      <h2>Création de compte : Confirmation</h2>
      <label>
        Nom :
        <input
          name="firstName"
          type="text"
          ref={register({ required: "Ce champ est requis." })}
        />
        <ErrorMessage errors={errors} name="firstName" as="span" />
      </label>

      <label>
        Prénom :
        <input
          name="lastName"
          type="text"
          ref={register({ required: "Ce champ est requis." })}
        />
        <ErrorMessage errors={errors} name="lastName" as="span" />
      </label>

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

      <label>
        Confirmer mot de passe :
        <input
          name="confirmPassword"
          type="password"
          ref={register({ required: "Ce champ est requis." })} //TODO check si il n'y à pas un equal avec un autre champs dans la doc de react-hook-form
        />
        <ErrorMessage errors={errors} name="confirmPassword" as="span" />
      </label>

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
          {state.yourDetails.otherMemberCheck === true && (
            <Fragment>
            <label>
              Code utilisateur:
              <input type="text" name="otherMember" id="otherMember" />
              <button onClick={addOtherMember}>+</button>
            </label>
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

      <input type="submit" />
    </form>
  )
}

export default SingUpConfirm
