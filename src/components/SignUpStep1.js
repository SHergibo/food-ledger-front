import React from "react";
import { useForm, ErrorMessage } from "react-hook-form";
import { useStateMachine } from "little-state-machine";
import updateAction from "../utils/updateAction";

function SignUpStep1({setForm}) {
  const { state, action } = useStateMachine(updateAction);
  const { handleSubmit, errors, register } = useForm({
    defaultValues: state.yourDetails
  });

  const onSubmit = data => {
    //TODO confirm password avant d'action data
    action(data);
    setForm('step2');
  };

  return (
    <form className="form-sign-in-up" onSubmit={handleSubmit(onSubmit)}>
      <h2>Création de compte : étape 1</h2>
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

      <input type="submit" />
    </form>
  )
}

export default SignUpStep1

