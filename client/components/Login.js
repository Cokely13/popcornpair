// import React from 'react';
// import { connect } from 'react-redux';
// import { authenticate } from '../store';

// const Login = ({ handleSubmit, error }) => {
//   return (
//     <div>
//       <h2>Login</h2>
//       <form onSubmit={handleSubmit} name="login">
//         <div>
//           <label htmlFor="username">
//             <small>Username</small>
//           </label>
//           <input name="username" type="text" />
//         </div>
//         <div>
//           <label htmlFor="password">
//             <small>Password</small>
//           </label>
//           <input name="password" type="password" />
//         </div>
//         <div>
//           <button type="submit">Login</button>
//         </div>
//         {error && error.response && <div>{error.response.data}</div>}
//       </form>
//     </div>
//   );
// };

// const mapState = (state) => ({
//   error: state.auth.error,
// });

// const mapDispatch = (dispatch) => ({
//   handleSubmit: (evt) => {
//     evt.preventDefault();
//     const username = evt.target.username.value;
//     const password = evt.target.password.value;
//     dispatch(authenticate(username, password, 'login'));
//   },
// });

// export default connect(mapState, mapDispatch)(Login);

// src/components/Login.js

import React from 'react';
import { connect } from 'react-redux';
import { authenticate } from '../store';
import { Redirect } from 'react-router-dom';

const Login = ({ handleSubmit, error, isLoggedIn, location }) => {
  const { from } = location.state || { from: { pathname: '/search' } }; // Default redirect path

  if (isLoggedIn) {
    return <Redirect to={from} />;
  }

  return (
    <div className="auth-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit} name="login">
        <div className="form-group">
          <label htmlFor="username">
            <small>Username</small>
          </label>
          <input name="username" type="text" required />
        </div>
        <div className="form-group">
          <label htmlFor="password">
            <small>Password</small>
          </label>
          <input name="password" type="password" required />
        </div>
        <div className="form-group">
          <button type="submit" className="btn btn-primary">Login</button>
        </div>
        {error && error.response && <div className="error">{error.response.data}</div>}
      </form>
    </div>
  );
};

const mapState = (state) => ({
  error: state.auth.error,
  isLoggedIn: !!state.auth.id,
});

const mapDispatch = (dispatch) => ({
  handleSubmit: (evt) => {
    evt.preventDefault();
    const username = evt.target.username.value.trim();
    const password = evt.target.password.value.trim();
    dispatch(authenticate(username, password, 'login'));
  },
});

export default connect(mapState, mapDispatch)(Login);
