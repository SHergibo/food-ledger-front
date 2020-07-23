import React from 'react';
import PropTypes from 'prop-types';

function SubNav({ logOut }) {
  return (
    <div className="container-subnav">
      <div className="interaction-sub-menu">
        <p>Notifications</p>
        <p>Img profil</p>
        <p onClick={logOut}>Logout</p>
      </div>
    </div>
  )
}

SubNav.propTypes = {
  logOut : PropTypes.func.isRequired,
}

export default SubNav


