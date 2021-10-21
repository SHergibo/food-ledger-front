import React, { Fragment, useEffect, useState } from 'react';
import { useWindowWidth } from './../DataContext';
import ComponentProductList from '../ProductHistoricComponents/ComponentProductList';
import {columnsHistoricMobile, columnsHistoricTablet, columnsHistoricFullScreen} from "./../../../utils/localData";

function HistoricList() {
  const { windowWidth } = useWindowWidth();
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    setColumns(columnsHistoricMobile);

    if(windowWidth >= 768){
      setColumns(columnsHistoricTablet)
    }

    if(windowWidth >= 1320){
      setColumns(columnsHistoricFullScreen)
    }
  }, [setColumns, windowWidth]);

  return (
    <Fragment>
      <ComponentProductList
        requestTo="historics"
        urlTo="historique"
        columns={columns}
        title="Historique des produits"
      />
    </Fragment>
  )
}

export default HistoricList;
