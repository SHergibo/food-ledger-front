import React, { useEffect, useState, useCallback } from "react";
import { DataProvider } from "./DataContext";
import { logout, refreshToken } from "./../../utils/Auth";
import Nav from "./PreppersAppUI/Nav";
import SubNav from "./PreppersAppUI/SubNav";
import MainContainer from "./PreppersAppUI/MainContainer";
import BackToTop from "./UtilitiesComponent/BackToTop";
import PropTypes from "prop-types";

function PreppersApp({ history }) {
  const [showNotificationTablet, setShowNotificationTablet] = useState(false);
  const [showNotificationFullScreen, setShowNotificationFullScreen] =
    useState(false);
  const [optionSubTitle, setOptionSubTitle] = useState("");
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const responsiveWidth = useCallback(() => {
    setWindowWidth(window.innerWidth);
  }, []);

  useEffect(() => {
    window.addEventListener("resize", responsiveWidth);
    return () => {
      window.removeEventListener("resize", responsiveWidth);
    };
  }, [responsiveWidth]);

  useEffect(() => {
    if (windowWidth >= 1320 && showNotificationTablet) {
      setShowNotificationTablet(false);
      setShowNotificationFullScreen(true);
    }
    if (windowWidth < 1320 && showNotificationFullScreen) {
      setShowNotificationTablet(true);
      setShowNotificationFullScreen(false);
    }
  }, [windowWidth, showNotificationTablet, showNotificationFullScreen]);

  useEffect(() => {
    const refreshTokenInterval = setInterval(async () => {
      await refreshToken();
    }, 870000);

    return () => {
      clearInterval(refreshTokenInterval);
    };
  }, []);

  let showNotifTablet = () => {
    setShowNotificationTablet(!showNotificationTablet);
  };

  let showNotifFullScreen = () => {
    setShowNotificationFullScreen(!showNotificationFullScreen);
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
          showNotificationTablet={showNotificationTablet}
          showNotifTablet={showNotifTablet}
        />
        <div className="container">
          <SubNav
            showNotifFullScreen={showNotifFullScreen}
            showNotificationFullScreen={showNotificationFullScreen}
            optionSubTitle={optionSubTitle}
          />
          <MainContainer setOptionSubTitle={setOptionSubTitle} />
          <BackToTop />
        </div>
      </div>
    </DataProvider>
  );
}

PreppersApp.propTypes = {
  history: PropTypes.object.isRequired,
};

export default PreppersApp;
