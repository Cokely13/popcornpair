// import React, { useState, useEffect } from 'react';
// import { withRouter } from 'react-router-dom';
// import { fetchSingleUser, updateSingleUser } from "../store/singleUserStore";
// // import './EditUserPass.css'; // Optional: create this file for styling

// const EditUserPass = ({ history }) => {
//   const [users, setUsers] = useState([]);
//   const [selectedUserId, setSelectedUserId] = useState('');
//   const [newPassword, setNewPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [message, setMessage] = useState('');
//   const [error, setError] = useState('');

//   // Fetch users from the API when component mounts
//   useEffect(() => {
//     fetch('/api/users')
//       .then((res) => res.json())
//       .then((data) => {
//         setUsers(data);
//         if (data.length > 0) {
//           setSelectedUserId(data[0].id.toString());
//         }
//       })
//       .catch((err) => {
//         console.error('Error fetching users:', err);
//         setError('Failed to load users.');
//       });
//   }, []);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setMessage('');
//     setError('');

//     if (newPassword !== confirmPassword) {
//       setError('Passwords do not match.');
//       return;
//     }

//     try {
//       // Send a PUT request to the admin reset-password route.
//       // Adjust the URL if your API is mounted differently.
//       const response = await fetch(`/api/users/${selectedUserId}/reset-password`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ newPassword }),
//       });

//       if (!response.ok) {
//         const data = await response.json();
//         setError(data.error || 'Failed to reset password.');
//       } else {
//         const data = await response.json();
//         setMessage(data.message || 'Password reset successfully!');
//       }
//     } catch (err) {
//       console.error('Error resetting password:', err);
//       setError('Error resetting password.');
//     }
//   };

//   return (
//     <div className="edit-user-pass-container card">
//       <h1>Admin Password Reset</h1>
//       <form onSubmit={handleSubmit} className="edit-user-pass-form">
//         <div className="form-group">
//           <label htmlFor="userSelect">Select User:</label>
//           <select
//             id="userSelect"
//             value={selectedUserId}
//             onChange={(e) => setSelectedUserId(e.target.value)}
//           >
//             {users.map((user) => (
//               <option key={user.id} value={user.id}>
//                 {user.username}
//               </option>
//             ))}
//           </select>
//         </div>
//         <div className="form-group">
//           <label htmlFor="newPassword">New Password:</label>
//           <input
//             type="password"
//             id="newPassword"
//             value={newPassword}
//             onChange={(e) => setNewPassword(e.target.value)}
//             required
//           />
//         </div>
//         <div className="form-group">
//           <label htmlFor="confirmPassword">Confirm New Password:</label>
//           <input
//             type="password"
//             id="confirmPassword"
//             value={confirmPassword}
//             onChange={(e) => setConfirmPassword(e.target.value)}
//             required
//           />
//         </div>
//         {error && <div className="error-message">{error}</div>}
//         {message && <div className="success-message">{message}</div>}
//         <div className="button-group">
//           <button type="submit" className="btn btn-success">Reset Password</button>
//           <button type="button" className="btn btn-secondary" onClick={() => history.push('/admin')}>
//             Cancel
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default withRouter(EditUserPass);

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { fetchUsers } from "../store/allUsersStore";
import { fetchAllUsers, updateSingleUser } from "../store/singleUserStore"; // Adjust paths and action names as needed
// import "./EditUserPass.css"; // Create and adjust as needed for styling

const EditUserPass = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  // Get the current authenticated user; assume state.auth holds current user info
  const currentUser = useSelector((state) => state.auth);
  // Get list of all users from Redux (fetched from /api/users)
  const users = useSelector((state) => state.allUsers);

  // Local state for dropdown selection and new password inputs
  const [selectedUserId, setSelectedUserId] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Fetch all users when the component mounts
  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  // If users have loaded, select the first user by default
  useEffect(() => {
    if (users && users.length > 0 && !selectedUserId) {
      setSelectedUserId(users[0].id.toString());
    }
  }, [users, selectedUserId]);

  // Check if current user is admin; if not, display an access message
  if (!currentUser || !currentUser.isAdmin) {
    return (
      <div className="edit-user-pass-container card">
        <h1>Admin Password Reset</h1>
        <p>You don't have access!</p>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    // Prepare the update data; assuming updateSingleUser expects an object with id and password
    const updateData = {
      id: selectedUserId,
      password: newPassword,
    };

    try {
      await dispatch(updateSingleUser(updateData));
      setMessage("Password updated successfully for the selected user.");
      // Optionally, clear the inputs
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error("Error updating password:", err);
      setError("Failed to update password.");
    }
  };

  return (
    <div className="edit-user-pass-container card">
      <h1>Admin Password Reset</h1>
      <form onSubmit={handleSubmit} className="edit-user-pass-form">
        <div className="form-group">
          <label htmlFor="userSelect">Select User:</label>
          <select
            id="userSelect"
            value={selectedUserId}
            onChange={(e) => setSelectedUserId(e.target.value)}
          >
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.username} ({user.email})
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="newPassword">New Password:</label>
          <input
            type="password"
            id="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm New Password:</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        {error && <div className="error-message">{error}</div>}
        {message && <div className="success-message">{message}</div>}
        <div className="button-group">
          <button type="submit" className="btn btn-success">
            Update Password
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => history.push("/admin")}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditUserPass;
