import React from 'react'
import PropTypes from 'prop-types'

function Page404({ history }) {

  const returnHome = () => {
    history.push("/");
  };

  return (
    <div className="not-found-container">
      <h1>Gestion de stock</h1>
      <div className="not-found-action">
        <p>404 page non trouvée !</p>
        <button className="btn-purple" onClick={returnHome}>Retour</button>
      </div>
    </div>
  )
}

Page404.propTypes = {
  history: PropTypes.object.isRequired,
}

export default Page404

