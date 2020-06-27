import React from "react";
import { useStateMachine } from "little-state-machine";
import updateAction from "../utils/updateAction";

function SingUpConfirm({setForm, setFormTitle}) {
  const { state, action } = useStateMachine(updateAction);
  const resetStore = () =>{
    const data = {
      firstName: "",
      lastName: "",
      email:"",
      password:"",
      confirmPassword: "",
      age: "",
      yearsOfExp: ""
    };
    action(data);
    setForm('login');
    setFormTitle('Sign In')
  };
  return (
    <div className="container">
      <h2>Confirmation d'information</h2>
      <pre>{JSON.stringify(state, null, 2)}</pre>
      <button onClick={resetStore}>reset store</button>
    </div>
  )
}

export default SingUpConfirm
