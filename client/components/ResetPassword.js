// import React, { useState } from 'react';
// import { withRouter } from 'react-router-dom';
// // import './ResetPassword.css'; // Optional CSS for styling

// const ResetPassword = ({ history }) => {
//   const [email, setEmail] = useState('');
//   const [message, setMessage] = useState('');
//   const [error, setError] = useState('');

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setMessage('');
//     setError('');
//     try {
//       // Call your backend endpoint for password reset here.
//       // Replace '/api/reset-password' with your actual endpoint.
//       const response = await fetch('/api/users/reset-password', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ email }),
//       });
//       if (!response.ok) {
//         const resData = await response.json();
//         setError(resData.error || 'Error resetting password');
//       } else {
//         const resData = await response.json();
//         setMessage('If an account exists with that email, a reset link has been sent.');
//       }
//     } catch (err) {
//       setError('Error connecting to the server.');
//     }
//   };

//   return (
//     <div className="reset-password-container">
//       <h2>Reset Password</h2>
//       <p>Please enter your email address. If an account exists, we'll send you a link to reset your password.</p>
//       <form onSubmit={handleSubmit}>
//         <div className="form-group">
//           <label htmlFor="email">Email Address:</label>
//           <input
//             type="email"
//             name="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//           />
//         </div>
//         <button type="submit" className="submit-button">Send Email</button>
//       </form>
//       {message && <div className="success-message">{message}</div>}
//       {error && <div className="error-message">{error}</div>}
//       <div className="back-to-login">
//         <button onClick={() => history.push('/login')}>Back to Login</button>
//       </div>
//     </div>
//   );
// };

// export default withRouter(ResetPassword);

import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

const ResetPassword = () => {
  const history = useHistory();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      // Instead of sending an email to the user, this endpoint notifies an admin.
      const response = await fetch('/api/users/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (!response.ok) {
        const resData = await response.json();
        setError(resData.error || 'Error processing reset request');
      } else {
        const resData = await response.json();
        setMessage(resData.message);
      }
    } catch (err) {
      setError('Error connecting to the server.');
    }
  };

  return (
    <div className="reset-password-container">
      <h2>Reset Password</h2>
      <p>
        Please enter your email address. If an account exists with that email,
        your password reset request will be sent to an admin for review.
      </p>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email Address:</label>
          <input
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="submit-button">Send Reset Request</button>
      </form>
      {message && <div className="success-message">{message}</div>}
      {error && <div className="error-message">{error}</div>}
      <div className="back-to-login">
        <button onClick={() => history.push('/login')}>Back to Login</button>
      </div>
    </div>
  );
};

export default ResetPassword;
