import React, { useState, useEffect } from "react";
// import { Route, Redirect } from 'react-router-dom';
import { Navigate, Outlet } from "react-router-dom";
import { isAuthenticated } from "./../../utils/Auth";

const IsLoggedRoute = () => {
  const [logged, setLogged] = useState();

  useEffect(() => {
    const checkAuth = async () => {
      isAuthenticated().then((res) => {
        setLogged(res);
      });
    };
    checkAuth();
  }, []);

  if (logged === undefined) return null;

  return logged ? <Navigate replace to="/app/liste-produit" /> : <Outlet />;
};

export default IsLoggedRoute;

// class RouteRender extends Component {
//   constructor(props) {
//     super(props)
//     this.state = { authorized: null }
//   }

//   componentDidMount() {
//     isAuthenticated().then(
//       authorized => this.setState({ authorized})
//     )
//   }

//   render() {
//     if(this.state.authorized === true) {
//       return (<Redirect to={{
//         pathname: '/app/liste-produit',
//         state: { from: this.props.location }
//       }} />)
//     } else if(this.state.authorized === false) {
//       const { component: Component, componentProps } = this.props
//       return <Component {...componentProps} />
//     }
//     return null;
//   }
// }

// const ProtectedRoute = function ({ component: Component, ...rest }) {
//   return (
//     <Route {...rest} render={props => <RouteRender componentProps={props} component={Component} />} />
//   )
// }

// export default ProtectedRoute;
