// import React, { useState, useEffect } from 'react';
// import { connect } from 'react-redux';
// import { authenticate } from '../store'; // Adjust the path as needed
// import { withRouter } from 'react-router-dom';

// const AuthModal = ({ isOpen, onClose, authenticate, formType, location, history, isLoggedIn, error }) => {
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

//   // Redirect to intended page after login/signup
//   useEffect(() => {
//     if (isLoggedIn && isOpen) {
//       onClose();
//       const { from } = location.state || { from: { pathname: '/home' } };
//       history.push(from);
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [isLoggedIn]);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     if (currentFormType === 'login') {
//       // Correct Order: username, password, method='login', email=null
//       authenticate(formData.username, formData.password, 'login');
//     } else {
//       if (formData.password !== formData.confirmPassword) {
//         alert("Passwords do not match");
//         return;
//       }
//       // Correct Order: username, password, method='signup', email=formData.email
//       authenticate(formData.username, formData.password, 'signup', formData.email);
//     }

//     // Note: The modal will close automatically upon successful authentication via useEffect
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
//               {error && error.response && <div> <div className="error-message">{error.response.data}</div><div>Forgot Password?</div></div>}
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
//               {error && error.response && <div className="error-message">{error.response.data}</div>}
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

// const mapState = (state) => ({
//   isLoggedIn: !!state.auth.id,
//   error: state.auth.error,
// });

// const mapDispatch = (dispatch) => ({
//   authenticate: (username, password, method, email) => dispatch(authenticate(username, password, method, email)),
// });

// export default withRouter(connect(mapState, mapDispatch)(AuthModal));


import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import { authenticate } from "../store"; // Adjust the path as needed
import AuthModal from "./AuthModal"; // Optional: if you use a separate modal component for styling
import ProtectedLink from "./ProtectedLink";
import { fetchUserRecommendations } from "../store/allUserRecommendationsStore";
import { fetchFriends } from "../store/allFriendsStore";
import "./Navbar.css";

const AuthModalComponent = ({
  isOpen,
  onClose,
  authenticate,
  formType,
  location,
  history,
  isLoggedIn,
  error,
}) => {
  // currentFormType can be "login", "signup", or "forgot"
  const [currentFormType, setCurrentFormType] = useState(formType);
  // Local error state so that we can clear it as soon as the user interacts with inputs
  const [localError, setLocalError] = useState(error ? error.response?.data || error : "");
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Update form type and clear errors when formType prop or error changes
  useEffect(() => {
    setCurrentFormType(formType);
    setLocalError(error ? error.response?.data || error : "");
    setFormData({
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
  }, [formType, error]);

  // Open the appropriate modal based on the URL
  useEffect(() => {
    if (location.pathname === '/login') {
      setCurrentFormType("login");
    } else if (location.pathname === '/signup') {
      setCurrentFormType("signup");
    } else if (location.pathname === '/forgot-password') {
      setCurrentFormType("forgot");
    }
  }, [location.pathname]);

  // Redirect on successful authentication
  useEffect(() => {
    if (isLoggedIn && isOpen) {
      onClose();
      const { from } = location.state || { from: { pathname: "/home" } };
      history.push(from);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn]);

  // Clear error as soon as the user interacts with any input
  const handleChange = (e) => {
    if (localError) setLocalError("");
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    authenticate(formData.username, formData.password, "login");
  };

  const handleSignupSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    authenticate(formData.username, formData.password, "signup", formData.email);
  };

  const handleForgotSubmit = (e) => {
    e.preventDefault();
    // Replace this with your backend password reset logic (e.g., API call)
    console.log("Password reset requested for:", formData.email);
    alert("If an account exists with that email, a reset link has been sent.");
    // Optionally, switch back to the login form after the reset request
    setCurrentFormType("login");
    history.push("/login");
  };

  // Toggle between login and signup forms; also clear errors
  const toggleForm = () => {
    const newFormType = currentFormType === "login" ? "signup" : "login";
    setCurrentFormType(newFormType);
    setLocalError("");
    setFormData({
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
    history.push(`/${newFormType}`);
  };

  // When the user clicks "Forgot Password?", switch to the forgot-password view
  const showForgotPassword = () => {
    setCurrentFormType("forgot");
    setLocalError("");
    setFormData({ email: "" });
    history.push("/forgot-password");
  };

  if (!isOpen) return null;

  return (
    <div className="auth-modal-overlay" onClick={onClose}>
      <div className="auth-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>&times;</button>
        {currentFormType === "login" ? (
          <div className="auth-form-container">
            <h2>Login</h2>
            <form onSubmit={handleLoginSubmit} name="login">
              <div className="form-group">
                <label htmlFor="username"><small>Username</small></label>
                <input
                  name="username"
                  type="text"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="password"><small>Password</small></label>
                <input
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
              <button type="submit" className="submit-button">Login</button>
              {localError && (
                <div className="error-message">
                  {localError}
                  {/* Show the Forgot Password link only if there is an error */}
                  <div className="forgot-password">
  <Link to="/reset-password">Forgot Password?</Link>
</div>
                  </div>

              )}
            </form>
            <p>
              Don't have an account?{" "}
              <button className="toggle-button" onClick={toggleForm}>Sign Up</button>
            </p>
          </div>
        ) : currentFormType === "signup" ? (
          <div className="auth-form-container">
            <h2>Sign Up</h2>
            <form onSubmit={handleSignupSubmit} name="signup">
              <div className="form-group">
                <label htmlFor="username"><small>Username</small></label>
                <input
                  name="username"
                  type="text"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="email"><small>Email</small></label>
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="password"><small>Password</small></label>
                <input
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="confirmPassword"><small>Confirm Password</small></label>
                <input
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>
              <button type="submit" className="submit-button">Sign Up</button>
              {localError && <div className="error-message">{localError}</div>}
            </form>
            <p>
              Already have an account?{" "}
              <button className="toggle-button" onClick={toggleForm}>Login</button>
            </p>
          </div>
        ) : currentFormType === "forgot" ? (
          <div className="auth-form-container">
            <h2>Reset Password</h2>
            <form onSubmit={handleForgotSubmit} name="forgot">
              <div className="form-group">
                <label htmlFor="email"><small>Email</small></label>
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <button type="submit" className="submit-button">Reset Password</button>
            </form>
            <p>
              Remembered your password?{" "}
              <button
                className="toggle-button"
                onClick={() => {
                  setCurrentFormType("login");
                  history.push("/login");
                }}
              >
                Back to Login
              </button>
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
};

const mapState = (state) => ({
  isLoggedIn: !!state.auth.id,
  error: state.auth.error,
});

const mapDispatch = (dispatch) => ({
  authenticate: (username, password, method, email) =>
    dispatch(authenticate(username, password, method, email)),
});

export default withRouter(connect(mapState, mapDispatch)(AuthModalComponent));


