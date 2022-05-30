import React, { useState, useEffect } from "react";
// import { Route, Redirect } from 'react-router-dom';
import { Navigate, Outlet } from "react-router-dom";
import { isAuthenticated } from "./../../utils/Auth";

const IsLoggedRoute = () => {
  const [logged, setLogged] = useState();

  useEffect(() => {
    const checkAuth = async () => {
      isAuthenticated().then((res) => {
        setLogged(res);
      });
    };
    checkAuth();
  }, []);

  if (logged === undefined) return null;

  return logged ? <Navigate replace to="/app/liste-produit" /> : <Outlet />;
};

export default IsLoggedRoute;
