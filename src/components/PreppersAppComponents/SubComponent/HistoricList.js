import React, { Fragment, useEffect, useCallback, useState } from 'react';
import ComponentProductList from '../ProductHistoricComponents/ComponentProductList';
import {columnsHistoricMobile, columnsHistoricTablet, columnsHistoricFullScreen} from "./../../../utils/localData";
import PropTypes from 'prop-types';

function HistoricList({ userData }) {
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
    setColumns(columnsHistoricMobile);

    if(windowWidth >= 640){
      setColumns(columnsHistoricTablet)
    }

    if(windowWidth >= 960){
      setColumns(columnsHistoricFullScreen)
    }
  }, [setColumns, windowWidth]);

  return (
    <Fragment>
      <ComponentProductList
        userData={userData}
        requestTo="historics"
        urlTo="historique"
        columns={columns}
        title="Historique des produits"
      />
    </Fragment>
  )
}

HistoricList.propTypes = {
  userData: PropTypes.object,
}

export default HistoricList;
