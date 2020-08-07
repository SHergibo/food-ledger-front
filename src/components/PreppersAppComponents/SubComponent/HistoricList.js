import React, { Fragment } from 'react';
import ComponentProductList from '../ProductHistoricComponents/ComponentProductList';
import PropTypes from 'prop-types';

function HistoricList({ userData }) {

  return (
    <Fragment>
      <ComponentProductList
        userData={userData}
        requestTo="historics"
        urlTo="historique"
      />
    </Fragment>
  )
}

HistoricList.propTypes = {
  userData: PropTypes.object,
}

export default HistoricList;
