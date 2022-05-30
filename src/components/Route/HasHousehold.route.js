import React, { useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { useUserData } from "../PreppersAppComponents/DataContext";
import NoHousehold from "./../PreppersAppComponents/UtilitiesComponent/NoHousehold";

const HasHousehold = ({ component: Component, ...rest }) => {
  const { userData } = useUserData();
  const navigate = useNavigate();

  useEffect(() => {
    if (userData?.householdId === null) {
      navigate("/app/liste-produit");
    }
  }, [userData, navigate]);

  if (userData === undefined) return null;

  return userData && userData.householdId ? <Outlet /> : <NoHousehold />;
};

export default HasHousehold;
