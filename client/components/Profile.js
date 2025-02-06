import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserMovies } from "../store/allUserMoviesStore";
import { fetchMovies } from "../store/allMoviesStore";
import { fetchUsers } from "../store/allUsersStore";
import { fetchFriends } from "../store/allFriendsStore";
import { updateSingleFriend } from "../store/singleFriendStore"
import { fetchUserRecommendations } from "../store/allUserRecommendationsStore";
import { fetchSingleUser } from "../store/singleUserStore";
import "./Profile.css";

const Profile = () => {
  const dispatch = useDispatch();
  const currentUserId = useSelector((state) => state.auth.id);
  const users = useSelector((state) => state.allUsers);
  const recommendations = useSelector((state) => state.allUserRecommendations);
  const userMoviesList = useSelector((state) => state.allUserMovies).filter(
    (um) => um.userId === currentUserId && um.status === "watchlist"
  );
  const userMovies = useSelector((state) => state.allUserMovies).filter(
    (um) => um.userId === currentUserId && um.status === "watched"
  );
  const movies = useSelector((state) => state.allMovies);
  const currentUser = useSelector((state) =>
    state.allUsers.find((user) => user.id === currentUserId)
  );
  const friends = useSelector((state) => state.allFriends);
  const user = useSelector((state) => state.singleUser);
  const [showPendingModal, setShowPendingModal] = useState(false);
  const firstWatchlistMovie = userMoviesList.length
  ? movies.find((movie) => movie.id === userMoviesList[0].movieId)
  : null;

  useEffect(() => {
    dispatch(fetchSingleUser(currentUserId));
    dispatch(fetchUserRecommendations());
    dispatch(fetchUserMovies());
    dispatch(fetchMovies());
    dispatch(fetchUsers());
    dispatch(fetchFriends());
  }, [dispatch, currentUserId]);

  const resetRequests = users.filter(user => user.passwordResetRequested);

console.log('rest', resetRequests)
  // Calculate stats
  const stats = useMemo(() => {
    if (!userMovies.length) {
      return {
        totalMoviesWatched: 0,
        lastMovie: null,
        averageRating: "N/A",
        highestRatedMovie: null,
      };
    }
    const watchedMovies = userMovies.map((um) => ({
      ...um,
      ...movies.find((movie) => movie.id === um.movieId),
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
    const lowestRatedMovie = watchedMovies.reduce((lowest, movie) => {
      if (!lowest || (movie.rating || 10) < (lowest.rating || 10)) {
        return movie;
      }
      return lowest;
    }, null);
    return {
      totalMoviesWatched: watchedMovies.length,
      lastMovie,
      averageRating: averageRating.toFixed(1),
      highestRatedMovie,
      lowestRatedMovie
    };
  }, [userMovies, movies]);

  const pendingRequests = useMemo(() => {
    return friends.filter(
      (friend) => friend.userId === currentUserId && friend.status === "pending"
    );
  }, [friends, currentUserId]);

  const pendingRequestUsers = pendingRequests.map((friend) => {
    const sender = users.find((user) => user.id === friend.friendId);
    return { friendRecord: friend, sender };
  });

  const handleAcceptFriend = async (friendRecord) => {
    try {
      await dispatch(updateSingleFriend({ ...friendRecord, status: "accepted" }));
      alert("Friend request accepted!");
      dispatch(fetchFriends());
    } catch (err) {
      console.error("Error accepting friend request:", err);
      alert("Could not accept the friend request.");
    }
  };

  // **Handle Deny Friend Request**
  const handleDenyFriend = async (friendRecord) => {
    try {
      await dispatch(updateSingleFriend({ ...friendRecord, status: "denied" }));
      alert("Friend request denied.");
      dispatch(fetchFriends());
    } catch (err) {
      console.error("Error denying friend request:", err);
      alert("Could not deny friend request.");
    }
  };

  return (
    <div className="profile-container">
      <h1 className="profile-title">{currentUser?.username || "User"}</h1>
      <div className="profile-image-container">
        {user.image ? (
          <img src={user.image} alt={user.username} className="profile-image" />
        ) : (
          <div className="no-profile-image">No Image</div>
        )}
      </div>

      <div className="stats-container">
        {/* First Row: Two Cards */}
        <div className="stats-row">
        <div className="card-item">
            <h3>Pending Friend Requests</h3>
            <p
              className="clickable-text"
              onClick={() => setShowPendingModal(true)}
              style={{ cursor: "pointer", fontWeight: "bold" }}
            >
              {pendingRequests.length}
            </p>
          </div>
          <div className="card-item">
            <h3>Pending Recommendations</h3>
            <Link to={`/recommendations`} style={{ textDecoration: "none" }}><p>{recommendations.filter(rec => rec.receiverId === currentUserId && rec.accept === null).length}</p></Link>
          </div>
        </div>

        {/* Second Row: Four Cards */}
        <div className="stats-row">
          <div className="card-item">

            <h3>Total Movies Watched</h3>
            <Link to={`/recommendations`} style={{ textDecoration: "none" }}>
            <p>{stats.totalMoviesWatched}</p>
            </Link>
          </div>
          <div className="card-item">
            <h3>Last Movie Watched</h3>
            {stats.lastMovie ? (
              <Link to={`/movies/${stats.lastMovie.id}`} style={{ textDecoration: "none"}}>
                <img
                  src={stats.lastMovie.posterUrl}
                  alt={stats.lastMovie.title}
                  className="movie-poster"
                />
                <p>{stats.lastMovie.title} ({stats.lastMovie.rating})</p>
              </Link>
            ) : (
              <p>None</p>
            )}
          </div>
          <div className="card-item">
            <h3>Average Rating</h3>
            <p>{stats.averageRating}</p>
          </div>
          <div className="card-item">
            <h3>Highest Rated Movie</h3>
            {stats.highestRatedMovie ? (
              <Link to={`/movies/${stats.highestRatedMovie.id}`} style={{ textDecoration: "none"}}>
                <img
                  src={stats.highestRatedMovie.posterUrl}
                  alt={stats.highestRatedMovie.title}
                  className="movie-poster"
                />
                <p>{stats.highestRatedMovie.title} ({stats.highestRatedMovie.rating})</p>
              </Link>
            ) : (
              <p>N/A</p>
            )}
          </div>
          <div className="card-item">
            <h3>Lowest Rated Movie</h3>
            {stats.lowestRatedMovie ? (
              <Link to={`/movies/${stats.lowestRatedMovie.id}`} style={{ textDecoration: "none"}}>
                <img
                  src={stats.lowestRatedMovie.posterUrl}
                  alt={stats.lowestRatedMovie.title}
                  className="movie-poster"
                />
                <p>{stats.lowestRatedMovie.title} ({stats.lowestRatedMovie.rating})</p>
              </Link>
            ) : (
              <p>N/A</p>
            )}
          </div>
          <div className="card-item">
            <h3>WatchList</h3>
            {firstWatchlistMovie ? (
              <Link to={`/movies/${firstWatchlistMovie.id}`} style={{ textDecoration: "none"}}>
                <img
                  src={firstWatchlistMovie.posterUrl}
                  alt={firstWatchlistMovie.title}
                  className="movie-poster"
                />
                <p>{firstWatchlistMovie.title} </p>
              </Link>
            ) : (
              <p>N/A</p>
            )}
          </div>
        </div>
              {/* Modal for Pending Friend Requests */}
      {showPendingModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Pending Friend Requests</h2>
            {pendingRequestUsers.length ? (
              <ul>
                {pendingRequestUsers.map(({ friendRecord, sender }) => (
                  <li key={friendRecord.id} className="friend-request-item">
                    <img
                      src={sender?.image || "/default-profile.png"}
                      alt={sender?.username || "User"}
                      className="friend-profile-pic"
                    />
                    <p>{sender?.username || `User #${friendRecord.friendId}`}</p>
                    <button
                      onClick={() => handleAcceptFriend(friendRecord)}
                      className="accept-button"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleDenyFriend(friendRecord)}
                      className="deny-button"
                    >
                      Deny
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No pending requests.</p>
            )}
            <button className="close-modal" onClick={() => setShowPendingModal(false)}>
              Close
            </button>
          </div>
        </div>
      )}

      </div>

      {/* Centered Edit Profile Button */}
      <Link to="/editprofile" className="edit-profile-btn">
        EDIT PROFILE
      </Link>
      {user.isAdmin && resetRequests.length ? <Link to="/edituserpass" className="change-button">
        CHANGE USER PASSWORD
      </Link> : <div></div>}
    </div>
  );

};

export default Profile;
