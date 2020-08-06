import React, { Fragment } from 'react';
import ComponentProductList from './ComponentProductLit';
import PropTypes from 'prop-types';

function ProductList({ userData }) {

  return (
    <Fragment>
      <ComponentProductList
        userData={userData}
        requestTo="products"
        urlTo="produit"
      />
    </Fragment>
  )
}

ProductList.propTypes = {
  userData: PropTypes.object,
}

export default ProductList;