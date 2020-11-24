import React from 'react';
import './styles/Styles.scss';
import { Route, Switch } from 'react-router-dom';
import IsLoggedRoute from './components/Route/IsLogged.route';
import ProtectedRoute from './components/Route/Protected.route';
import SignInUp from './components/SignInSignUpComponent/SignInUp';
import PreppersApp from './components/PreppersAppComponents/PreppersApp';
import Page404 from './components/Page404';
import { library } from '@fortawesome/fontawesome-svg-core';
import { 
  faHome, 
  faList, 
  faHistory, 
  faSignOutAlt, 
  faUser, 
  faChartPie, 
  faBars, 
  faBell, 
  faArrowLeft, 
  faCheck, 
  faExclamation, 
  faPlus, 
  faTimes, 
  faPen, 
  faFilter, 
  faEdit, 
  faTrash, 
  faAngleDoubleLeft, 
  faAngleLeft, 
  faAngleRight, 
  faAngleDoubleRight, 
  faUndo, 
  faCog,
  faChevronLeft ,
  faClipboardList,
  faShoppingCart,
  faEnvelope,
  faDownload
} from '@fortawesome/free-solid-svg-icons';

library.add(
  faHome, 
  faList, 
  faHistory, 
  faSignOutAlt, 
  faUser, 
  faChartPie, 
  faBars, 
  faBell, 
  faArrowLeft, 
  faCheck, 
  faExclamation, 
  faPlus, 
  faTimes, 
  faPen, 
  faFilter, 
  faEdit, 
  faTrash, 
  faAngleDoubleLeft, 
  faAngleLeft, 
  faAngleRight, 
  faAngleDoubleRight, 
  faUndo, 
  faCog,
  faChevronLeft,
  faClipboardList,
  faShoppingCart,
  faEnvelope,
  faDownload
);

function App() {
  return (
    <div className="app">
      <Switch>
        <IsLoggedRoute exact path="/" component={SignInUp} />
        <ProtectedRoute exact path="/app" component={PreppersApp} />
        <ProtectedRoute exact path="/app/liste-produit" component={PreppersApp} />
        <ProtectedRoute exact path="/app/edition-produit/:id" component={PreppersApp} />
        <ProtectedRoute exact path="/app/ajout-produit" component={PreppersApp} />
        <ProtectedRoute exact path="/app/liste-historique" component={PreppersApp} />
        <ProtectedRoute exact path="/app/edition-historique/:id" component={PreppersApp} />
        <ProtectedRoute exact path="/app/ajout-historique" component={PreppersApp} />
        <ProtectedRoute exact path="/app/profil" component={PreppersApp} />
        <ProtectedRoute exact path="/app/statistiques" component={PreppersApp} />
        <ProtectedRoute exact path="/app/registre-produit" component={PreppersApp} />
        <ProtectedRoute exact path="/app/liste-de-course" component={PreppersApp} />
        <Route path="*" component={Page404} />
      </Switch>
    </div>
  );
}

export default App;
