import React, { useEffect, useState } from 'react';
import { DataProvider } from './DataContext';
import { logout, refreshToken } from './../../utils/Auth';
import Nav from './PreppersAppUI/Nav';
import SubNav from './PreppersAppUI/SubNav';
import MainContainer from './PreppersAppUI/MainContainer';
import { CSSTransition } from 'react-transition-group';
import SubContainer from './PreppersAppUI/SubContainer';
import PropTypes from 'prop-types';

function PreppersApp({ history }) {
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    const refreshTokenInterval = setInterval(() => {
      refreshToken();
    }, 870000);

    return () => {
      clearInterval(refreshTokenInterval);
    };
  }, []);

  let showNotif = () => {
    setShowNotification(!showNotification);
  };

  let logOut = async () => {
    await logout();
    history.push("/");
  };

  return (
    <DataProvider>
      <div className="container-prepper-app">
        <Nav
          history={history}
          logOut={logOut}
        />
        <div className="container-column">
          <SubNav
            showNotif={showNotif}
          />
          <div className="container-row">
            <MainContainer />
            <CSSTransition
              in={showNotification}
              timeout={500}
              classNames="anim-container-sub"
              unmountOnExit
            >
              <SubContainer />
            </CSSTransition>
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

