import React from 'react';
import { connect } from 'react-redux';
import { authenticate } from '../store';

const Login = ({ handleSubmit, error }) => {
  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit} name="login">
        <div>
          <label htmlFor="username">
            <small>Username</small>
          </label>
          <input name="username" type="text" />
        </div>
        <div>
          <label htmlFor="password">
            <small>Password</small>
          </label>
          <input name="password" type="password" />
        </div>
        <div>
          <button type="submit">Login</button>
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
    const password = evt.target.password.value;
    dispatch(authenticate(username, password, 'login'));
  },
});

export default connect(mapState, mapDispatch)(Login);
