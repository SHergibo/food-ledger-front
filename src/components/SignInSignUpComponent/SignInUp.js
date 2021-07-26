import React, { useState } from 'react';
import { StateMachineProvider, createStore } from "little-state-machine";
import logo from "./../../images/foodledger_logo.png";
import Login from "./Login";
import Step1 from "./SignUpStep1";
import Step2 from "./SignUpStep2";
import Result from "./SignUpConfirm.js";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

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
  const [formTitle, setFormTitle] = useState("Connexion");
  const [successCreateAccount, setSuccessCreateAccount] = useState(false);
  const [form, setForm] = useState('login');

  const createUserForm = () => {
    setForm('step1');
    setFormTitle('Créer un compte');
  }

  const returnToLogin = () => {
    setForm('login');
    setFormTitle('Connexion');
  }

  return (
    <div className="wrapper-sign-in-up">

      <StateMachineProvider>
        <div className={`${form === "login" ? "container-sign-in": "container-sign-up"}`}>
          <div className="interactive-container">
            <div className="title-container">
              <div className="logo-container">
                <img src={logo} alt="food ledger logo"/>
                {form !== "login" && (
                  <FontAwesomeIcon icon="chevron-left" onClick={
                    () => {
                      if (form === "step1") {
                        returnToLogin();
                      } else if (form === "step2") {
                        setForm("step1");
                      } else if (form === "confirm") {
                        setForm("step2")
                      }
                    }
                  }/>
                )}
              </div>
              
              <h1>{formTitle}</h1>
            </div>

            {form === "login" && (
              <Login
                setSuccessCreateAccount={setSuccessCreateAccount}
                successCreateAccount={successCreateAccount}
              />
            )}
            {form === "step1" && (
              <Step1
                setForm={setForm}
                returnToLogin={returnToLogin}
              />
            )}
            {form === "step2" && (
              <Step2
                setForm={setForm}
                returnToLogin={returnToLogin}
              />
            )}
            {form === "confirm" && (
              <Result
                setForm={setForm}
                setFormTitle={setFormTitle}
                setSuccessCreateAccount={setSuccessCreateAccount}
                returnToLogin={returnToLogin}
              />
            )}
          </div>
          
          <div className="switch-form-container">
            <div>
              <p>Pas encore de compte ?</p>
              <button className="btn-white" onClick={() => createUserForm()}>
                <FontAwesomeIcon className="btn-icon" icon="user-plus" />
                Créer un compte
              </button>
            </div>
            
          </div>
        </div>
      </StateMachineProvider>
    </div>
  )
}

export default SignInUp;