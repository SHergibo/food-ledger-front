import React from "react";
import { useNavigate } from "react-router-dom";

function Page404() {
  const navigate = useNavigate();

  const returnHome = () => {
    navigate("/");
  };

  return (
    <div className="not-found-container">
      <h1>Gestion de stock</h1>
      <div className="not-found-action">
        <p>404 page non trouvée !</p>
        <button className="btn-purple" onClick={returnHome}>
          Retour
        </button>
      </div>
    </div>
  );
}

export default Page404;
