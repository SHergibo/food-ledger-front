import React, { useState, useRef } from 'react';
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
  const formRef = useRef(null);
  const [successCreateAccount, setSuccessCreateAccount] = useState(false);
  const [form, setForm] = useState('login');

  const createUserForm = () => {
    setForm('step1');
    setFormTitle('Créer un compte');
    formRef.current.classList.add('active');
  }

  const returnToLogin = () => {
    setForm('login');
    setFormTitle('Connexion');
    formRef.current.classList.remove('active');
  }

  return (
    <div className="wrapper-sign-in-up">

      <StateMachineProvider>
        <div className={`${form === "login" ? "container-sign-in": "container-sign-up"}`}>
          <div ref={formRef} className="interactive-container">
            <div className="title-container">
              <div className="logo-container">
                <img src={logo} alt="food ledger logo"/>
                <div className="title-interaction">
                  {(form === "step2" || form === "confirm")  &&
                    <div className="back-to-interaction">
                      <FontAwesomeIcon className="btn-icon" icon="chevron-left" onClick={
                        () => {
                          if (form === "step2") {
                            setForm("step1");
                          }
                          if (form === "confirm") {
                            setForm("step2")
                          }
                        }
                      }/>
                      <p>Étape précédente</p>
                    </div>
                  }
                  <h1>{formTitle}</h1>
                </div>
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
              />
            )}
            {form === "step2" && (
              <Step2
                setForm={setForm}
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
            {form === "login" &&
              <div>
                <p>Pas encore de compte ?</p>
                <button className="btn-white" onClick={() => createUserForm()}>
                  <FontAwesomeIcon className="btn-icon" icon="user-plus" />
                  Créer un compte
                </button>
              </div>
            }
            {form !== "login" &&
              <div>
                <p>Déjà un compte ?</p>
                <button className="btn-white" onClick={() => returnToLogin()}>
                  <FontAwesomeIcon className="btn-icon" icon="sign-in-alt" />
                  Se connecter
                </button>
              </div>
            }
          </div>
        </div>
      </StateMachineProvider>
    </div>
  )
}

export default SignInUp;