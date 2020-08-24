import React, { Fragment, useEffect, useCallback, useState } from 'react';
import ComponentProductList from './../ProductHistoricComponents/ComponentProductList';
import {columnsProductMobile, columnsProductTablet, columnsProductFullScreen} from "../../../utils/localData";
import PropTypes from 'prop-types';

function ProductList({ userData }) {
  const [columns, setColumns] = useState([]);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const responsiveColumns = useCallback(() =>{
    setWindowWidth(window.innerWidth);
  }, []);

  useEffect(() => {
    window.addEventListener('resize', responsiveColumns);
    return () =>{
      window.removeEventListener('resize', responsiveColumns);
    }
  }, [responsiveColumns]);

  useEffect(() => {
    setColumns(columnsProductMobile);

    if(windowWidth >= 640){
      setColumns(columnsProductTablet)
    }

    if(windowWidth >= 960){
      setColumns(columnsProductFullScreen)
    }
  }, [setColumns, windowWidth]);

  return (
    <Fragment>
      <ComponentProductList
        userData={userData}
        requestTo="products"
        urlTo="produit"
        columns={columns}
      />
    </Fragment>
  )
}

ProductList.propTypes = {
  userData: PropTypes.object,
}

export default ProductList;