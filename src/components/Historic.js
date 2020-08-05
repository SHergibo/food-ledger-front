import React, { Fragment } from 'react';
import ComponentProductList from './ComponentProductLit';
import PropTypes from 'prop-types';

function Historic({ userData }) {

  return (
    <Fragment>
      <ComponentProductList
        userData={userData}
        listType="historic"
      />
    </Fragment>
  )
}

Historic.propTypes = {
  userData: PropTypes.object,
}

export default Historic;
