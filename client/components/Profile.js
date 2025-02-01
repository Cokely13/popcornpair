import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserMovies } from "../store/allUserMoviesStore";
import { fetchMovies } from "../store/allMoviesStore";
import { fetchUsers } from "../store/allUsersStore";
import { fetchFriends } from "../store/allFriendsStore";
import { updateSingleFriend } from "../store/singleFriendStore";
import { fetchSingleUser, updateSingleUser } from "../store/singleUserStore";
import { fetchUserRecommendations } from "../store/allUserRecommendationsStore";
import './Profile.css'

const Profile = () => {
  const dispatch = useDispatch();
  const currentUserId = useSelector((state) => state.auth.id);
  const recommendations = useSelector((state) => state.allUserRecommendations);
  const userMovies = useSelector((state) => state.allUserMovies).filter(
    (um) => um.userId === currentUserId && um.status === "watched"
  );
  const movies = useSelector((state) => state.allMovies);
  const currentUser = useSelector((state) =>
    state.allUsers.find((user) => user.id === currentUserId)
  );
  // All friends from the store
  const friends = useSelector((state) => state.allFriends);
  const users = useSelector((state) => state.allUsers);
  const user = useSelector((state) => state.singleUser);
  const myrecs = recommendations.filter((rec) => rec.receiverId == currentUserId && rec.accept == null )

  // NEW: State to control the Pending Requests modal
  const [showPendingModal, setShowPendingModal] = useState(false);
    // Editable fields
  const [editing, setEditing] = useState(false);
  const [newUsername, setNewUsername] = useState(user.username || "");
  const [newEmail, setNewEmail] = useState(user.email || "");

  // Profile image state
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [newPhoto, setNewPhoto] = useState(false);

  useEffect(() => {
    dispatch(fetchSingleUser(currentUserId));
    dispatch(fetchUserRecommendations());
    dispatch(fetchUserMovies());
    dispatch(fetchMovies());
    dispatch(fetchUsers());
    dispatch(fetchFriends());
  }, [dispatch]);

  // 1) Calculate how many pending friend requests the currentUser has
  //    (i.e., friend records where userId === currentUserId and status === "pending")
  const pendingRequests = useMemo(() => {
    return friends.filter(
      (friend) => friend.userId === currentUserId && friend.status === "pending"
    );
  }, [friends, currentUserId]);

  const pendingRequestsCount = pendingRequests.length;

  // 2) Watch stats
  const stats = useMemo(() => {
    if (!userMovies.length) {
      return {
        totalMoviesWatched: 0,
        lastMovie: null,
        averageRating: "N/A",
        highestRatedMovie: null,
      };
    }

    const watchedMovies = userMovies.map((userMovie) => ({
      ...userMovie,
      ...movies.find((movie) => movie.id === userMovie.movieId),
    }));

    const lastMovie = watchedMovies.reduce((latest, movie) => {
      if (!latest || new Date(movie.dateWatched) > new Date(latest.dateWatched)) {
        return movie;
      }
      return latest;
    }, null);

    const averageRating =
      watchedMovies.reduce((sum, movie) => sum + (movie.rating || 0), 0) /
      watchedMovies.length;

    const highestRatedMovie = watchedMovies.reduce((highest, movie) => {
      if (!highest || (movie.rating || 0) > (highest.rating || 0)) {
        return movie;
      }
      return highest;
    }, null);

    return {
      totalMoviesWatched: watchedMovies.length,
      lastMovie,
      averageRating: averageRating.toFixed(1),
      highestRatedMovie,
    };
  }, [userMovies, movies]);

    // 1) Handle Profile Image Selection
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  // 2) Handle Profile Image Upload
  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select a file to upload");
      return;
    }

    const formData = new FormData();
    formData.append("image", selectedFile);

    try {
      const uploadResponse = await fetch(`/api/users/${user.id}`, {
        method: "PUT",
        body: formData,
      });

      if (uploadResponse.ok) {
        const responseData = await uploadResponse.json();
        dispatch(updateSingleUser({ id: user.id, image: responseData.imageUrl }));
        alert("Photo uploaded and profile updated successfully");
        setNewPhoto(false);
      } else {
        alert("Upload failed");
      }
    } catch (error) {
      console.error("Error uploading file:", error.response ? error.response.data : error);
      alert("Upload failed");
    }
  };

  // 3) Handle Profile Updates (Username, Email)
  const handleSaveChanges = async () => {
    await dispatch(
      updateSingleUser({
        id: user.id,
        username: newUsername,
        email: newEmail,
      })
    );
    alert("Profile updated successfully!");
    setEditing(false);
  };

  // 4) Handle Password Change
  const handlePassword = () => {
    history.push("/password");
  };

  // 3) Handle Accept/Deny logic
  const handleAcceptFriend = async (friendRecord) => {
    try {
      await dispatch(
        updateSingleFriend({
          ...friendRecord,
          status: "accepted",
        })
      );
      alert("Friend request accepted!");
      dispatch(fetchFriends()); // refresh
    } catch (err) {
      console.error("Error accepting friend request:", err);
      alert("Could not accept the friend request.");
    }
  };

  const handleDenyFriend = async (friendRecord) => {
    try {
      await dispatch(
        updateSingleFriend({
          ...friendRecord,
          status: "denied",
        })
      );
      alert("Friend request denied.");
      dispatch(fetchFriends()); // refresh
    } catch (err) {
      console.error("Error denying friend request:", err);
      alert("Could not deny friend request.");
    }
  };

  console.log("user", user.image)

  return (
    <div className="profile-container">
      <section className="hero-section">
      <h1>PROFILE</h1>
      </section>
     <div className="profile-image-container">

          {user.image ? (
          <img src={user.image} alt="Profile" className="profile-image" />
        ) : (
          <div className="no-profile-image">No Image</div>
        )}
      </div>
      <h1>{currentUser?.username || "User"}</h1>

      <div className="profile-info">
        <p>
          <strong>Email:</strong> {currentUser?.email || "N/A"}
        </p>

        {/* 4) Show pending requests count as a clickable button if > 0 */}
        <p>
          <strong>Pending Friend Requests:</strong>{" "}
          {pendingRequestsCount > 0 ? (
            <button onClick={() => setShowPendingModal(true)}>
              {pendingRequestsCount}
            </button>
          ) : (
            "0"
          )}
        </p>
        <p>
          <strong>Pending Recs:</strong>{" "}
          {myrecs.length > 0 ? (
         <Link to={`/recommendations`}>  {myrecs.length} </Link>
          ) : (
            "0"
          )}
        </p>

        <p>
          <strong>Total Movies Watched:</strong> {stats.totalMoviesWatched}
        </p>

        <p>
          <strong>Last Movie Watched:</strong>{" "}
          {stats.lastMovie?.id ? (
            <Link to={`/movies/${stats.lastMovie.id}`}>
              {stats.lastMovie.title} ({stats.lastMovie.rating})
            </Link>
          ) : (
            "No movies watched"
          )}{" "}
          ({stats.lastMovie?.dateWatched || "No date available"})
        </p>

        <p>
          <strong>Average Rating:</strong> {stats.averageRating}
        </p>

        <p>
          <strong>Highest Rated Movie:</strong>{" "}
          {stats.highestRatedMovie?.id ? (
            <Link to={`/movies/${stats.highestRatedMovie.id}`}>
              {stats.highestRatedMovie.title} ({stats.highestRatedMovie.rating})
            </Link>
          ) : (
            "No ratings available"
          )}
        </p>
              {/* Buttons for Edit & Save */}
       {editing ? (
        <button className="btn btn-success" onClick={handleSaveChanges}>Save Changes</button>
      ) : (
        <button className="btn btn-secondary" onClick={() => setEditing(true)}>Edit Profile</button>
      )}

      {/* Change Password */}
      <button className="btn btn-primary" onClick={handlePassword}>Change Password</button>

      {/* Upload Profile Picture */}
      {newPhoto ? (
        <div className="photo-upload-section">
          <input type="file" onChange={handleFileChange} />
          <button className="btn btn-success" onClick={handleUpload}>Upload Photo</button>
          {previewUrl && <img src={previewUrl} alt="Preview" className="photo-preview" />}
        </div>
      ) : (
        <button className="btn btn-secondary" onClick={() => setNewPhoto(true)}>Change Photo</button>
      )}
      </div>

      {/* 5) The Modal for pending requests */}
      {showPendingModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Pending Friend Requests</h2>
            {pendingRequests.length ? (
              <ul>
                {pendingRequests.map((request) => {
                  // request.friendId is the user who initiated the request?
                  // or the user is the target? Depending on your structure, you might need to see who the *other* user is.
                  const friendUser = users.find((u) => u.id === request.friendId);
                  return (
                    <ul key={request.id}>
                       <img
                      src={friendUser.image || "/default-profile.png"}
                      alt={friendUser.username}
                      className="friend-profile-pic"
                    />
                      {friendUser?.username || `User #${request.friendId}`}
                      <button
                        onClick={() => handleAcceptFriend(request)}
                        className="accept-button"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleDenyFriend(request)}
                        className="deny-button"
                      >
                        Deny
                      </button>
                    </ul>
                  );
                })}
              </ul>
            ) : (
              <p>No pending requests.</p>
            )}
            <button onClick={() => setShowPendingModal(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;

