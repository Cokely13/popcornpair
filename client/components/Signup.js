import React from 'react';
import { connect } from 'react-redux';
import { authenticate } from '../store';

const Signup = ({ handleSubmit, error }) => {
  return (
    <div>
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit} name="signup">
        <div>
          <label htmlFor="username">
            <small>Username</small>
          </label>
          <input name="username" type="text" />
        </div>
        <div>
          <label htmlFor="email">
            <small>Email</small>
          </label>
          <input name="email" type="email" />
        </div>
        <div>
          <label htmlFor="password">
            <small>Password</small>
          </label>
          <input name="password" type="password" />
        </div>
        <div>
          <label htmlFor="confirmPassword">
            <small>Confirm Password</small>
          </label>
          <input name="confirmPassword" type="password" />
        </div>
        <div>
          <button type="submit">Sign Up</button>
        </div>
        {error && error.response && <div>{error.response.data}</div>}
      </form>
    </div>
  );
};

const mapState = (state) => ({
  error: state.auth.error,
});

const mapDispatch = (dispatch) => ({
  handleSubmit: (evt) => {
    evt.preventDefault();
    const username = evt.target.username.value;
    const email = evt.target.email.value;
    const password = evt.target.password.value;
    const confirmPassword = evt.target.confirmPassword.value;

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    dispatch(authenticate(username, password, 'signup'));
  },
});

export default connect(mapState, mapDispatch)(Signup);
