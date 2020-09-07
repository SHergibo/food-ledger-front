import React from 'react';
import PropTypes from 'prop-types';

function Loading({ loading }) {
  return (
    <>
      {loading && 
        <div className="loading-container">
          <p>Loading</p>
        </div>
      }
    </>
  )
}

Loading.propTypes = {
  loading : PropTypes.bool.isRequired
}

export default Loading


