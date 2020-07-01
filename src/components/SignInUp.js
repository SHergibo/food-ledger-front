import React, { Fragment, useState } from 'react';
import { StateMachineProvider, createStore } from "little-state-machine";
import Login from "./Login";
import Step1 from "./SignUpStep1";
import Step2 from "./SignUpStep2";
import Result from "./SignUpConfirm.js";

createStore({
  yourDetails: {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    householdCodeCheck: false,
    householdCode: "",
    householdNameCheck: false,
    householdName: "",
    otherMemberCheck: false,
    otherMemberArray: [],
  }
});

function SignInUp() {
  const [formTitle, setFormTitle] = useState("Sign In");
  const [successCreateAccount, setSuccessCreateAccount] = useState(false);
  const [form, setForm] = useState('login');

  const createUserForm = () => {
    setForm('step1');
    setFormTitle('Sign up');
  }

  return (
    <Fragment>

      <StateMachineProvider>
        <div className="container">
          <h1>{formTitle}</h1>
          {form !== "login" && (
            <nav className="container">
              <ul className="steps">
                <li className={form === "step1" ? "active" : ""}>
                  <span onClick={() => setForm("step1")}>Étape 1</span>
                </li>
                <li className={form === "step2" ? "active" : ""}>
                  <span onClick={() => setForm("step2")}>Étape 2</span>
                </li>
                <li className={form === "result" ? "active" : ""}>
                  <span onClick={() => setForm("result")}>Confirmation</span>
                </li>
              </ul>
            </nav>
          )}

          {form === "login" && (
            <Fragment>
              <Login
                setSuccessCreateAccount={setSuccessCreateAccount}
                successCreateAccount={successCreateAccount}
              />
              <button onClick={() => createUserForm()}>
                Créer un compte
              </button>
            </Fragment>
          )}
          {form === "step1" && (
            <Step1
              setForm={setForm}
            />
          )}
          {form === "step2" && (
            <Step2
              setForm={setForm}
            />
          )}
          {form === "result" && (
            <Fragment>
              <Result
                setForm={setForm}
                setFormTitle={setFormTitle}
                setSuccessCreateAccount={setSuccessCreateAccount}
              />
            </Fragment>
          )}
        </div>
      </StateMachineProvider>
    </Fragment>
  )
}

export default SignInUp;