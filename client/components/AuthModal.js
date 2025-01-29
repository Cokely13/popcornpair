// // src/components/AuthModal.js

// import React, { useState, useEffect } from 'react';
// import { connect } from 'react-redux';
// import { authenticate } from '../store'; // Adjust the path as needed
// import { withRouter } from 'react-router-dom';


// const AuthModal = ({ isOpen, onClose, authenticate, formType, location, history }) => {
//   const [currentFormType, setCurrentFormType] = useState(formType); // 'login' or 'signup'
//   const [formData, setFormData] = useState({
//     username: '',
//     email: '',
//     password: '',
//     confirmPassword: '',
//   });

//   // Update currentFormType when formType prop changes
//   useEffect(() => {
//     setCurrentFormType(formType);
//   }, [formType]);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     if (currentFormType === 'login') {
//       authenticate(formData.username, formData.password, null, 'login');
//     } else {
//       if (formData.password !== formData.confirmPassword) {
//         alert("Passwords do not match");
//         return;
//       }
//       authenticate(formData.username, formData.password, formData.email, 'signup');
//     }

//     // Optionally close modal after submit
//     onClose();

//     // Optionally navigate to intended route after authentication
//     // This may require passing the intended route via state
//   };

//   const toggleForm = () => {
//     const newFormType = currentFormType === 'login' ? 'signup' : 'login';
//     setCurrentFormType(newFormType);
//     setFormData({
//       username: '',
//       email: '',
//       password: '',
//       confirmPassword: '',
//     });
//     // Navigate to the new form type
//     history.push(`/${newFormType}`);
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="auth-modal-overlay" onClick={onClose}>
//       <div className="auth-modal-content" onClick={(e) => e.stopPropagation()}>
//         <button className="close-button" onClick={onClose}>
//           &times;
//         </button>
//         {currentFormType === 'login' ? (
//           <div className="auth-form-container">
//             <h2>Login</h2>
//             <form onSubmit={handleSubmit} name="login">
//               <div className="form-group">
//                 <label htmlFor="username">
//                   <small>Username</small>
//                 </label>
//                 <input
//                   name="username"
//                   type="text"
//                   value={formData.username}
//                   onChange={handleChange}
//                   required
//                 />
//               </div>
//               <div className="form-group">
//                 <label htmlFor="password">
//                   <small>Password</small>
//                 </label>
//                 <input
//                   name="password"
//                   type="password"
//                   value={formData.password}
//                   onChange={handleChange}
//                   required
//                 />
//               </div>
//               <button type="submit" className="submit-button">Login</button>
//             </form>
//             <p>
//               Don't have an account?{' '}
//               <button className="toggle-button" onClick={toggleForm}>Sign Up</button>
//             </p>
//           </div>
//         ) : (
//           <div className="auth-form-container">
//             <h2>Sign Up</h2>
//             <form onSubmit={handleSubmit} name="signup">
//               <div className="form-group">
//                 <label htmlFor="username">
//                   <small>Username</small>
//                 </label>
//                 <input
//                   name="username"
//                   type="text"
//                   value={formData.username}
//                   onChange={handleChange}
//                   required
//                 />
//               </div>
//               <div className="form-group">
//                 <label htmlFor="email">
//                   <small>Email</small>
//                 </label>
//                 <input
//                   name="email"
//                   type="email"
//                   value={formData.email}
//                   onChange={handleChange}
//                   required
//                 />
//               </div>
//               <div className="form-group">
//                 <label htmlFor="password">
//                   <small>Password</small>
//                 </label>
//                 <input
//                   name="password"
//                   type="password"
//                   value={formData.password}
//                   onChange={handleChange}
//                   required
//                 />
//               </div>
//               <div className="form-group">
//                 <label htmlFor="confirmPassword">
//                   <small>Confirm Password</small>
//                 </label>
//                 <input
//                   name="confirmPassword"
//                   type="password"
//                   value={formData.confirmPassword}
//                   onChange={handleChange}
//                   required
//                 />
//               </div>
//               <button type="submit" className="submit-button">Sign Up</button>
//             </form>
//             <p>
//               Already have an account?{' '}
//               <button className="toggle-button" onClick={toggleForm}>Login</button>
//             </p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// const mapDispatch = (dispatch) => ({
//   authenticate: (username, password, email, formType) => dispatch(authenticate(username, password, email, formType)),
// });

// export default withRouter(connect(null, mapDispatch)(AuthModal));

// src/components/AuthModal.js

import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { authenticate } from '../store'; // Adjust the path as needed
import { withRouter } from 'react-router-dom';

const AuthModal = ({ isOpen, onClose, authenticate, formType, location, history, isLoggedIn }) => {
  const [currentFormType, setCurrentFormType] = useState(formType); // 'login' or 'signup'
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  // Update currentFormType when formType prop changes
  useEffect(() => {
    setCurrentFormType(formType);
  }, [formType]);

  // Redirect to intended page after login/signup
  useEffect(() => {
    if (isLoggedIn && isOpen) {
      onClose();
      const { from } = location.state || { from: { pathname: '/home' } };
      history.push(from);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (currentFormType === 'login') {
      // Correct Order: username, password, method='login', email=null
      authenticate(formData.username, formData.password, 'login');
    } else {
      if (formData.password !== formData.confirmPassword) {
        alert("Passwords do not match");
        return;
      }
      // Correct Order: username, password, method='signup', email=formData.email
      authenticate(formData.username, formData.password, 'signup', formData.email);
    }

    // Note: The modal will close automatically upon successful authentication via useEffect
  };

  const toggleForm = () => {
    const newFormType = currentFormType === 'login' ? 'signup' : 'login';
    setCurrentFormType(newFormType);
    setFormData({
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    });
    // Navigate to the new form type
    history.push(`/${newFormType}`);
  };

  if (!isOpen) return null;

  return (
    <div className="auth-modal-overlay" onClick={onClose}>
      <div className="auth-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>
          &times;
        </button>
        {currentFormType === 'login' ? (
          <div className="auth-form-container">
            <h2>Login</h2>
            <form onSubmit={handleSubmit} name="login">
              <div className="form-group">
                <label htmlFor="username">
                  <small>Username</small>
                </label>
                <input
                  name="username"
                  type="text"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">
                  <small>Password</small>
                </label>
                <input
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
              <button type="submit" className="submit-button">Login</button>
            </form>
            <p>
              Don't have an account?{' '}
              <button className="toggle-button" onClick={toggleForm}>Sign Up</button>
            </p>
          </div>
        ) : (
          <div className="auth-form-container">
            <h2>Sign Up</h2>
            <form onSubmit={handleSubmit} name="signup">
              <div className="form-group">
                <label htmlFor="username">
                  <small>Username</small>
                </label>
                <input
                  name="username"
                  type="text"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">
                  <small>Email</small>
                </label>
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">
                  <small>Password</small>
                </label>
                <input
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="confirmPassword">
                  <small>Confirm Password</small>
                </label>
                <input
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>
              <button type="submit" className="submit-button">Sign Up</button>
            </form>
            <p>
              Already have an account?{' '}
              <button className="toggle-button" onClick={toggleForm}>Login</button>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

const mapState = (state) => ({
  isLoggedIn: !!state.auth.id,
});

const mapDispatch = (dispatch) => ({
  authenticate: (username, password, method, email) => dispatch(authenticate(username, password, method, email)),
});

export default withRouter(connect(mapState, mapDispatch)(AuthModal));
