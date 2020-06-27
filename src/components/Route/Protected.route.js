import React, { Component } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { isAuthenticated } from './../../utils/Auth';

class RouteRender extends Component {
  constructor(props) {
    super(props)
    this.state = { authorized: null }
  }

  componentDidMount() {
    isAuthenticated().then(
      authorized => this.setState({ authorized})
    )
  }

  render() {
    if(this.state.authorized === true) {
      const { component: Component, componentProps } = this.props
      return <Component {...componentProps} />
    } else if(this.state.authorized === false) {
      return (<Redirect to={{
               pathname: '/',
               state: { from: this.props.location }
             }} />)
    }
    return null;
  }
}

const ProtectedRoute = function ({ component: Component, ...rest }) {
  return (
    <Route {...rest} render={props => <RouteRender componentProps={props} component={Component} />} />
  )
}

export default ProtectedRoute;