import React, { Fragment, useState } from 'react';
import { StateMachineProvider, createStore } from "little-state-machine";
import Login from "./Login";
import Step1 from "./SignUpStep1";
import Step2 from "./SignUpStep2";
import Result from "./SignUpConfirm.js";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';

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
  const [formTitle, setFormTitle] = useState("Bienvenue");
  const [successCreateAccount, setSuccessCreateAccount] = useState(false);
  const [form, setForm] = useState('login');

  const createUserForm = () => {
    setForm('step1');
    setFormTitle('Création de votre compte');
  }

  const returnToLogin = () => {
    setForm('login');
    setFormTitle('Bienvenue');
  }

  return (
    <Fragment>

      <StateMachineProvider>
        <div className={`${form === "login" ? "container-sign-in": "container-sign-up"}`}>
          <div className={`welcome-container ${form === "login" ? "welcome-container-login": ""}`}>
            {form !== "login" && (
              <FontAwesomeIcon icon={faChevronLeft} onClick={
                () => {
                  if (form === "step1") {
                    returnToLogin();
                  } else if (form === "step2") {
                    setForm("step1");
                  } else if (form === "confirm") {
                    setForm("step2")
                  }
                }
              } />
            )}
            <div className="welcome-title">
              <h1>{formTitle}</h1>
            </div>
          </div>

          {form === "login" && (
            <Fragment>
              <Login
                setSuccessCreateAccount={setSuccessCreateAccount}
                successCreateAccount={successCreateAccount}
                createUserForm={createUserForm}
              />
            </Fragment>
          )}
          {form === "step1" && (
            <Fragment>
              <Step1
                setForm={setForm}
                returnToLogin={returnToLogin}
              />
            </Fragment>
          )}
          {form === "step2" && (
            <Fragment>
              <Step2
                setForm={setForm}
                returnToLogin={returnToLogin}
              />
            </Fragment>
          )}
          {form === "confirm" && (
            <Fragment>
              <Result
                setForm={setForm}
                setFormTitle={setFormTitle}
                setSuccessCreateAccount={setSuccessCreateAccount}
                returnToLogin={returnToLogin}
              />
            </Fragment>
          )}
        </div>
      </StateMachineProvider>
    </Fragment>
  )
}

export default SignInUp;