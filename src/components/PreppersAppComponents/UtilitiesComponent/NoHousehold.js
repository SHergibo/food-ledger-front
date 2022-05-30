import React from "react";
import { useNavigate } from "react-router-dom";

function NoHousehold() {
  const navigate = useNavigate();
  const navigateToHouseholdOption = () => {
    navigate("/app/options", {
      state: {
        householdOptions: true,
      },
    });
  };

  return (
    <div className="no-household-container">
      <div className="no-household-content">
        <p>
          Il semblerait que vous n'ayez pas de famille, pour pouvoir avoir accès
          à cette page, il faut d'abord créer ou rejoindre une famille !
        </p>
        <button className="btn-purple" onClick={navigateToHouseholdOption}>
          Créer / rejoindre une famille
        </button>
      </div>
    </div>
  );
}

export default NoHousehold;
