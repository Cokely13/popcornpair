// src/components/PrivateRoute.js

import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

/**
 * PrivateRoute ensures that only authenticated users can access certain routes.
 * If not authenticated, redirects to the /login route to trigger the AuthModal.
 */
const PrivateRoute = ({ component: Component, isLoggedIn, ...rest }) => (
  <Route
    {...rest}
    render={(props) =>
      isLoggedIn ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{
            pathname: '/login',
            state: { from: props.location }, // Optionally pass the original location
          }}
        />
      )
    }
  />
);

const mapState = (state) => ({
  isLoggedIn: !!state.auth.id,
});

export default connect(mapState)(PrivateRoute);
