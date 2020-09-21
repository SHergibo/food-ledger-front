import React, { Fragment, useEffect, useCallback, useState } from 'react';
import ComponentProductList from './../ProductHistoricComponents/ComponentProductList';
import {columnsProductMobile, columnsProductTablet, columnsProductFullScreen} from "../../../utils/localData";

function ProductList() {
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

    if(windowWidth >= 992){
      setColumns(columnsProductTablet)
    }

    if(windowWidth >= 1312){
      setColumns(columnsProductFullScreen)
    }
  }, [setColumns, windowWidth]);

  return (
    <Fragment>
      <ComponentProductList
        requestTo="products"
        urlTo="produit"
        columns={columns}
        title="Liste des produits"
      />
    </Fragment>
  )
}

export default ProductList;