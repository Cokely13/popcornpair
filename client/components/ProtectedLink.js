// src/components/ProtectedLink.js

import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

/**
 * ProtectedLink navigates to the target path if logged in.
 * If not, navigates to /login to trigger the AuthModal.
 */
const ProtectedLink = ({ to, children, isLoggedIn, ...rest }) => {
  const target = isLoggedIn ? to : '/login';
  return (
    <Link to={target}>
      {children}
    </Link>
  );
};

const mapState = (state) => ({
  isLoggedIn: !!state.auth.id,
});

export default connect(mapState)(ProtectedLink);
