import React, { useEffect } from 'react';
import { logout, refreshToken } from './../utils/Auth';

function PreppersApp({ history }) {

  useEffect(() => {
    setInterval(() => {
      refreshToken();
    }, 900000);
  }, []);

  let logOut = async () => {
    await logout();
    history.push("/");
  };
  return (
    <div>
      BRAVO
      <button onClick={logOut}>Logout</button>
    </div>
  )
}

export default PreppersApp

