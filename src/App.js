import React from "react";
import "./styles/Styles.scss";
import { Route, Routes } from "react-router-dom";
import IsLoggedRoute from "./components/Route/IsLogged.route";
import ProtectedRoute from "./components/Route/Protected.route";
import HasHousehold from "./components/Route/HasHousehold.route";
import SignInUp from "./components/SignInSignUpComponent/SignInUp";
import PreppersApp from "./components/PreppersAppComponents/PreppersApp";
import ProductList from "./components/PreppersAppComponents/SubComponent/ProductList";
import EditProduct from "./components/PreppersAppComponents/ProductHistoricComponents/EditProduct";
import AddProduct from "./components/PreppersAppComponents/ProductHistoricComponents/AddProduct";
import HistoricList from "./components/PreppersAppComponents/SubComponent/HistoricList";
import Option from "./components/PreppersAppComponents/SubComponent/Option";
import Statistics from "./components/PreppersAppComponents/SubComponent/Statistics";
import ProductLog from "./components/PreppersAppComponents/SubComponent/ProductLog";
import ShoppingList from "./components/PreppersAppComponents/SubComponent/ShoppingList";
import SubContainer from "./components/PreppersAppComponents/PreppersAppUI/SubContainer";
import EditBrand from "./components/PreppersAppComponents/SubComponent/OptionComponents/EditBrand";
import Page404 from "./components/Page404";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faHome,
  faList,
  faHistory,
  faSignOutAlt,
  faSignInAlt,
  faUser,
  faUserPlus,
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
  faDownload,
  faExchangeAlt,
  faDoorOpen,
  faRandom,
  faSearch,
  faChevronUp,
} from "@fortawesome/free-solid-svg-icons";

library.add(
  faHome,
  faList,
  faHistory,
  faSignOutAlt,
  faSignInAlt,
  faUser,
  faUserPlus,
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
  faDownload,
  faExchangeAlt,
  faDoorOpen,
  faRandom,
  faSearch,
  faChevronUp
);

function App() {
  return (
    <div className="app">
      <Routes>
        <Route element={<IsLoggedRoute />}>
          <Route path="/" element={<SignInUp />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route path="app" element={<PreppersApp />}>
            <Route element={<HasHousehold />}>
              <Route path="liste-produit" element={<ProductList />} />
            </Route>
            <Route element={<HasHousehold />}>
              <Route path="edition-produit/:id" element={<EditProduct />} />
            </Route>
            <Route element={<HasHousehold />}>
              <Route path="ajout-produit" element={<AddProduct />} />
            </Route>
            <Route element={<HasHousehold />}>
              <Route path="liste-historique" element={<HistoricList />} />
            </Route>
            <Route element={<HasHousehold />}>
              <Route path="edition-historique/:id" element={<EditProduct />} />
            </Route>
            <Route element={<HasHousehold />}>
              <Route path="ajout-historique" element={<AddProduct />} />
            </Route>
            <Route element={<HasHousehold />}>
              <Route path="edition-marque/:id" element={<EditBrand />} />
            </Route>
            <Route element={<HasHousehold />}>
              <Route path="statistiques" element={<Statistics />} />
            </Route>
            <Route element={<HasHousehold />}>
              <Route path="registre-produit" element={<ProductLog />} />
            </Route>
            <Route element={<HasHousehold />}>
              <Route path="liste-de-course" element={<ShoppingList />} />
            </Route>
            <Route path="options" element={<Option />} />
            <Route path="notification" element={<SubContainer />} />
          </Route>
        </Route>

        <Route path="*" element={<Page404 />} />
      </Routes>
    </div>
  );
}

export default App;
