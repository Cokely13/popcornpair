import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { fetchSingleUser, updateSingleUser } from "../store/singleUserStore";
import "./EditProfile.css";

const EditProfile = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const currentUserId = useSelector((state) => state.auth.id);
  const user = useSelector((state) => state.singleUser);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [editingPassword, setEditingPassword] = useState(false);

  useEffect(() => {
    dispatch(fetchSingleUser(currentUserId));
  }, [dispatch, currentUserId]);

  useEffect(() => {
    if (user) {
      setUsername(user.username || "");
      setEmail(user.email || "");
    }
  }, [user]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // If user is editing password, check for match.
    if (editingPassword && password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    const updateData = {
      id: user.id,
      username,
      email,
      ...(editingPassword && password ? { password } : {}),
    };

    if (selectedFile) {
      const formData = new FormData();
      formData.append("image", selectedFile);
      try {
        const res = await fetch(`/api/users/${user.id}`, {
          method: "PUT",
          body: formData,
        });
        if (res.ok) {
          const data = await res.json();
          updateData.image = data.imageUrl;
        }
      } catch (err) {
        console.error("Error uploading image", err);
        alert("Image upload failed.");
      }
    }

    await dispatch(updateSingleUser(updateData));
    alert("Profile updated successfully!");
    history.push("/profile");
  };

  const handleCancel = () => {
    history.push("/profile");
  };

  return (
    <div className="edit-profile-container card">
      <h1>Edit Profile</h1>
      <form onSubmit={handleSubmit} className="edit-profile-form">
        <label>
          Username:
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </label>
        <label>
          Email:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>

        {!editingPassword ? (
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setEditingPassword(true)}
          >
            Change Password
          </button>
        ) : (
          <>
            <label>
              New Password:
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>
            <label>
              Confirm Password:
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </label>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                setEditingPassword(false);
                setPassword("");
                setConfirmPassword("");
              }}
            >
              Cancel Password Change
            </button>
          </>
        )}

        <label>
          Profile Picture:
          <input type="file" onChange={handleFileChange} />
        </label>
        {previewUrl && (
          <img src={previewUrl} alt="Preview" className="photo-preview" />
        )}
        <div className="button-group">
          <button type="submit" className="btn btn-success">
            Save Changes
          </button>
          <button type="button" className="btn btn-secondary" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfile;

