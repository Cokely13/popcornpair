import React from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import {logout} from '../store';

const Navbar = ({handleClick, isLoggedIn}) => (
  <div className="navbar-container">
    {/* <h1 className="navbar-title">PopCornPair</h1> */}
    <nav className="navbar">
      {isLoggedIn ? (
        <div className="navbar-links">
          {/* The navbar will show these links after you log in */}
          <Link to="/home" className="navbar-link">Home</Link>
          <Link to="/profile" className="navbar-link">Profile</Link>
          <Link to="/rate" className="navbar-link">Rate</Link>
          <Link to="/watched" className="navbar-link">Watched</Link>
          <Link to="/list" className="navbar-link">Friends</Link>
          <Link to="/rejected" className="navbar-link">Second Chance</Link>
          <Link to="/recommendations">Recommendations</Link>
          <Link to="/search">Search</Link>
          <a href="#" onClick={handleClick} className="navbar-link">
            Logout
          </a>
        </div>
      ) : (
        <div className="navbar-links">
          {/* The navbar will show these links before you log in */}
          <Link to="/login" className="navbar-link">Login</Link>
          <Link to="/signup" className="navbar-link">Sign Up</Link>
        </div>
      )}
    </nav>
    <hr />
  </div>
);

/**
 * CONTAINER
 */
const mapState = state => {
  return {
    isLoggedIn: !!state.auth.id
  };
};

const mapDispatch = dispatch => {
  return {
    handleClick() {
      dispatch(logout());
    }
  };
};

export default connect(mapState, mapDispatch)(Navbar);
