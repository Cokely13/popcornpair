import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSingleUser, updateSingleUser } from "../store/singleUserStore";
import "./EditProfile.css"; // Create styling for edit profile

const EditProfile = () => {
  const dispatch = useDispatch();
  const currentUserId = useSelector((state) => state.auth.id);
  const user = useSelector((state) => state.singleUser);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

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
    // Build the update object
    const updateData = {
      id: user.id,
      username,
      email,
      ...(password && { password }), // Only include password if provided
    };

    // If a file is selected, create FormData and handle image upload on server
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
        <label>
          New Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <label>
          Profile Picture:
          <input type="file" onChange={handleFileChange} />
        </label>
        {previewUrl && (
          <img src={previewUrl} alt="Preview" className="photo-preview" />
        )}
        <button type="submit" className="btn btn-success">Save Changes</button>
      </form>
    </div>
  );
};

export default EditProfile;
