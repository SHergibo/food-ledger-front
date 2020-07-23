import React from 'react'
import PropTypes from 'prop-types'

function Page404({ history }) {

  const returnHome = () => {
    history.push("/");
  };

  return (
    <div>
      <p>404 not found</p>
      <button onClick={returnHome}>Retour</button>
    </div>
  )
}

Page404.propTypes = {
  history: PropTypes.object.isRequired,
}

export default Page404

