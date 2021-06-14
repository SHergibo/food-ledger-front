import React, { useEffect } from 'react';
import { useHistory, Route } from 'react-router-dom';
import { useUserData } from '../PreppersAppComponents/DataContext';
import NoHousehold from './../PreppersAppComponents/UtilitiesComponent/NoHousehold';

const HasHousehold = ({ component: Component, ...rest }) => {
  const { userData } = useUserData();
  const history = useHistory();

  useEffect(() => {
    if(userData?.householdId === null){
      history.push('/app/liste-produit');
    }
  }, [userData, history]);

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
