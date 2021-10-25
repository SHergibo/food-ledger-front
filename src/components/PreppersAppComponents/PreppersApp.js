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
  const [optionSubTitle, setOptionSubTitle] = useState("");

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

  let logOut = async (e) => {
    e.persist();
    if(e.key === 'Enter' || e.type === 'click' ){
      await logout();
      history.push("/");
    }
  };

  return (
    <DataProvider>
      <div className="container-prepper-app">
        <Nav
          history={history}
          logOut={logOut}
          showNotification={showNotification}
          showNotif={showNotif}
        />
        <div className="container">
          <SubNav
            showNotif={showNotif}
            optionSubTitle={optionSubTitle}
          />
          <MainContainer
            setOptionSubTitle={setOptionSubTitle}
          />
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
    </DataProvider>
  )
}

PreppersApp.propTypes = {
  history: PropTypes.object.isRequired,
}

export default PreppersApp;

