import React, { useState, useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { isAuthenticated } from "../../utils/Auth";

const ProtectedRoute = () => {
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

  return logged ? <Outlet /> : <Navigate replace to="/" />;
};

export default ProtectedRoute;
