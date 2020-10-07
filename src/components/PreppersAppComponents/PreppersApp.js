import React, { useEffect } from 'react';
import { DataProvider } from './DataContext';
import { logout, refreshToken } from './../../utils/Auth';
import Nav from './PreppersAppUI/Nav';
import SubNav from './PreppersAppUI/SubNav';
import MainContainer from './PreppersAppUI/MainContainer';
import SubContainer from './PreppersAppUI/SubContainer';
import PropTypes from 'prop-types';

function PreppersApp({ history }) {

  useEffect(() => {
    const refreshTokenInterval = setInterval(() => {
      refreshToken();
    }, 870000);

    return () => {
      clearInterval(refreshTokenInterval);
    };
  }, []);

  let logOut = async () => {
    await logout();
    history.push("/");
  };

  return (
    <DataProvider>
      <div className="container-prepper-app">
        <Nav
          logOut={logOut}
        />
        <div className="container-column">
          <SubNav
            logOut={logOut}
          />
          <div className="container-row">
            <MainContainer />
            <SubContainer />
          </div>
        </div>
      </div>
    </DataProvider>
  )
}

PreppersApp.propTypes = {
  history: PropTypes.object.isRequired,
}

export default PreppersApp;

