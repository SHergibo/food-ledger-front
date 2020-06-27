import React from 'react';
import './styles/Styles.scss';
import { Route, Switch } from 'react-router-dom';
import IsLoggedRoute from './components/Route/IsLogged.route';
import ProtectedRoute from './components/Route/Protected.route';
import SignInUp from './components/SignInUp';
import PreppersApp from './components/PreppersApp';
import Page404 from './components/Page404';

function App() {
  return (
    <div className="App">
      <Switch>
        <IsLoggedRoute exact path="/" component={SignInUp} />
        <ProtectedRoute exact path="/app" component={PreppersApp} />
        <Route path="*" component={Page404} />

      </Switch>
    </div>
  );
}

export default App;
