import React from 'react';
import { Route } from 'react-router-dom';
import { useUserData } from '../PreppersAppComponents/DataContext';
import NoHousehold from './../PreppersAppComponents/UtilitiesComponent/NoHousehold';

const HasHousehold = ({ component: Component, ...rest }) => {
  const { userData } = useUserData();

  return (
    <>
    {userData && userData.householdId ? 
      <Route
        {...rest}
        render={props => <Component {...props} />}
      /> : 
      <Route {...rest} component={NoHousehold} />
    }
    </>
  );
}

export default HasHousehold;
