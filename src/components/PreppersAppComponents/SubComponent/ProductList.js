import React, { Fragment, useEffect, useState } from 'react';
import { useWindowWidth } from './../DataContext';
import ComponentProductList from './../ProductHistoricComponents/ComponentProductList';
import {columnsProductMobile, columnsProductTablet, columnsProductFullScreen} from "../../../utils/localData";

function ProductList() {
  const { windowWidth } = useWindowWidth();
  const [columns, setColumns] = useState([]);

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