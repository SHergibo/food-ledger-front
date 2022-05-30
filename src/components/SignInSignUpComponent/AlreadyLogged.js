import React from "react";
import { useNavigate } from "react-router-dom";
import { loginIn, logout } from "./../../utils/Auth";
import PropTypes from "prop-types";

function AlreadyLogged({ loginData }) {
  const navigate = useNavigate;
  const stayLogged = () => {
    navigate("/app/liste-produit");
  };

  const disconnect = async () => {
    let localStore = {
      access_token: localStorage.getItem("access_token"),
      refresh_token: localStorage.getItem("refresh_token"),
      user_id: localStorage.getItem("user_id"),
      user_email: localStorage.getItem("user_email"),
    };
    let responseLogin = await loginIn(loginData);
    localStorage.setItem("needRefresh", true);
    await logout(localStore);
    if (responseLogin !== 401) {
      navigate("/app/liste-produit");
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <p>{`Vous êtes déjà connecté avec l'addresse mail : ${localStorage.getItem(
        "user_email"
      )}.`}</p>
      <button onClick={stayLogged}>Rester connecté avec ce compte.</button>
      <button onClick={disconnect}>
        Se déconnecter et se connecter avec un autre compte.
      </button>
    </div>
  );
}

AlreadyLogged.propTypes = {
  loginData: PropTypes.object.isRequired,
};

export default AlreadyLogged;
