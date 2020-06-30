import React from 'react';
import { logout } from './../utils/Auth';

function PreppersApp({ history }) {
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

