import React, { useState } from 'react';
import { withRouter } from 'react-router-dom';

const SetNewPassword = ({ location, history }) => {
  // Extract the reset token from the URL query parameter (e.g., ?token=XYZ)
  const query = new URLSearchParams(location.search);
  const token = query.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      // Call your backend endpoint to confirm the password reset.
      // Replace '/api/reset-password/confirm' with your actual endpoint.
      const response = await fetch('/api/reset-password/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });

      if (!response.ok) {
        const resData = await response.json();
        setError(resData.error || 'Error resetting password.');
      } else {
        const resData = await response.json();
        setMessage('Your password has been reset successfully!');
        // Optionally redirect to login after a brief delay:
        setTimeout(() => {
          history.push('/login');
        }, 3000);
      }
    } catch (err) {
      setError('Error connecting to the server.');
    }
  };

  return (
    <div className="set-new-password-container">
      <h2>Set New Password</h2>
      <p>Please enter your new password.</p>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="password">New Password:</label>
          <input
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm New Password:</label>
          <input
            type="password"
            name="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="submit-button">Reset Password</button>
      </form>
      {message && <div className="success-message">{message}</div>}
      {error && <div className="error-message">{error}</div>}
      <div className="back-to-login">
        <button onClick={() => history.push('/login')}>Back to Login</button>
      </div>
    </div>
  );
};

export default withRouter(SetNewPassword);
