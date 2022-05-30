import React, { memo } from "react";
import { Outlet } from "react-router-dom";
import PropTypes from "prop-types";

function MainContainer({ setOptionSubTitle }) {
  return (
    <>
      <Outlet context={setOptionSubTitle} />
    </>
  );
}

MainContainer.propTypes = {
  setOptionSubTitle: PropTypes.func.isRequired,
};

export default memo(MainContainer);
