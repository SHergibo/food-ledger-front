import React  from 'react';
import { Link } from 'react-router-dom';

function NoHousehold() {
  return (
    <div className="no-household-container">
      <div className="no-household-content">
        <p>Il semblerait que vous n'ayez pas de famille, pour pouvoir avoir accès à cette page, il faut d'abord créer ou rejoindre une famille !</p> 
        <Link className="default-btn-blue" to="/app/profil">
          Créer / rejoindre une famille
        </Link>
      </div>
    </div>
  )
}

export default NoHousehold
