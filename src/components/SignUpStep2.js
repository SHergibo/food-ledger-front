import React from "react";
import { useForm, ErrorMessage } from "react-hook-form";
import { useStateMachine } from "little-state-machine";
import updateAction from "../utils/updateAction";

function SignUpStep2({setForm}) {
  const { state, action } = useStateMachine(updateAction);
  const { handleSubmit, register, errors } = useForm({
    defaultValues: state.yourDetails
  });

  const onSubmit = data => {
    action(data);
    setForm('result');
  };

  return (
    <form className="form-sign-in-up" onSubmit={handleSubmit(onSubmit)}>
      <h2>Création de compte : étape 1</h2>
      <label>
        Age:
        <input
          name="age"
          type="number"
          ref={register({
            min: {
              value: 18,
              message: "You are required to be 18 above."
            }
          })}
        />
        <ErrorMessage errors={errors} name="age" as="p" />
      </label>
      <label>
        Years of experience:
        <input
          name="yearsOfExp"
          type="number"
          ref={register({
            required: "This is required",
            min: {
              value: 1,
              message: "you need 1 year of exp."
            }
          })}
        />
        <ErrorMessage errors={errors} name="yearsOfExp" as="p" />
      </label>
      <input type="submit" />
    </form>
  )
}

export default SignUpStep2

