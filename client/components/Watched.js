import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { fetchUserMovies } from "../store/allUserMoviesStore";
import { updateSingleUserMovie } from "../store/singleUserMovieStore";
import { fetchMovies } from "../store/allMoviesStore";
import { fetchUsers } from "../store/allUsersStore";
import { fetchFriends } from "../store/allFriendsStore"; // import your friend thunk
import { createUserRecommendation } from "../store/allUserRecommendationsStore";
import './Watched.css'

// Utility: Returns a Set of userIds who are accepted friends of currentUser
function getAcceptedFriendUserIds(currentUserId, allFriends) {
  const friendSet = new Set();

  allFriends
    .filter((f) => f.status === "accepted") // only accepted
    .forEach((f) => {
      // If I'm the user, the friend is friendId
      if (f.userId === currentUserId) {
        friendSet.add(f.friendId);
      }
      // If I'm the friend, the user is userId
      else if (f.friendId === currentUserId) {
        friendSet.add(f.userId);
      }
    });

  return friendSet; // e.g. { 2, 3, 5 } are your accepted friends' userIds
}

const Watched = () => {
  const dispatch = useDispatch();

  // State for controlling rating changes, recommendations, etc.
  const [selectedWatchedWithMovieId, setSelectedWatchedWithMovieId] = useState(null);
  const [selectedActionMovieId, setSelectedActionMovieId] = useState(null);
  const [selectedRecommendationMovieId, setSelectedRecommendationMovieId] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState("");
  const [sortCriteria, setSortCriteria] = useState("None");

  const currentUserId = useSelector((state) => state.auth.id);
  const userMovies = useSelector((state) => state.allUserMovies);
  const movies = useSelector((state) => state.allMovies);
  const users = useSelector((state) => state.allUsers);
  const [showModal, setShowModal] = useState(false);
const [friendWatchersList, setFriendWatchersList] = useState([]);

  // All friend records (both directions)
  const allFriends = useSelector((state) => state.allFriends);

  useEffect(() => {
    dispatch(fetchUserMovies());
    dispatch(fetchUsers());
    dispatch(fetchMovies());
    dispatch(fetchFriends()); // Make sure to load friend relationships
  }, [dispatch]);

  // 1) Build a Set of accepted friend IDs
  const acceptedFriendIds = getAcceptedFriendUserIds(currentUserId, allFriends);

  // 2) Filter userMovies to only "watched" for the current user
  const currentUserWatched = userMovies.filter(
    (um) => um.userId === currentUserId && um.status === "watched"
  );

  // 3) Merge userMovies with movie details
  const watchedMovies = currentUserWatched.map((userMovie) => ({
    ...userMovie,
    ...movies.find((m) => m.id === userMovie.movieId),
  }));

  // 4) Sorting
  const sortedMovies = [...watchedMovies].sort((a, b) => {
    if (sortCriteria === "Date Watched") {
      return new Date(b.dateWatched) - new Date(a.dateWatched); // Most recent first
    } else if (sortCriteria === "Rating") {
      return (b.rating || 0) - (a.rating || 0); // Highest rating first
    }
    return 0;
  });

  // Refresh
  const refreshMovies = () => {
    dispatch(fetchUserMovies());
  };

  // 5) "Friends Who Watched" logic
  // Return watchers (status=watched) among your accepted friends
  const getFriendWatchersForMovie = (movieId) => {
    const watchers = userMovies.filter(
      (um) => um.movieId === movieId && um.status === "watched"
    );
    // Among watchers, keep only those in acceptedFriendIds
    const friendWatchers = watchers.filter((w) => acceptedFriendIds.has(w.userId));

    // Return array of { username, rating }
    return friendWatchers.map((fw) => {
      const friendUser = users.find((u) => u.id === fw.userId);
      return {
        username: friendUser?.username || "Unknown",
        rating: fw.rating || "Not Rated",
      };
    });
  };

  const handleFriendsWatchedClick = (movieId) => {
    // 1) get watchers
    const watchers = getFriendWatchersForMovie(movieId);

    // 2) store them in state
    setFriendWatchersList(watchers);

    // 3) open the modal
    setShowModal(true);
  };

  // 6) Count how many friends have watched
  const getFriendWatchersCount = (movieId) => {
    return getFriendWatchersForMovie(movieId).length;
  };

  // 7) "Watched With" Submit
  const handleWatchedWithSubmit = async (movieId) => {
    try {
      await dispatch(
        updateSingleUserMovie({
          userId: currentUserId,
          movieId,
          watchedWith: selectedUserId || null,
        })
      );
      setSelectedWatchedWithMovieId(null);
      setSelectedUserId(null);
      refreshMovies();
    } catch (err) {
      console.error("Error updating Watched With:", err);
    }
  };

  // 8) Rating Submit
  const handleRatingSubmit = async (movieId) => {
    if (!rating || rating < 1 || rating > 10) {
      alert("Please provide a rating between 1 and 10.");
      return;
    }
    try {
      await dispatch(updateSingleUserMovie({ userId: currentUserId, movieId, rating }));
      setSelectedActionMovieId(null);
      setRating("");
      refreshMovies();
    } catch (err) {
      console.error("Error submitting rating:", err);
    }
  };

  // 9) Recommendation Submit
  const handleRecommendationSubmit = async () => {
    try {
      if (!selectedRecommendationMovieId || !selectedUserId) {
        alert("Please select a user to recommend the movie to.");
        return;
      }

      await dispatch(
        createUserRecommendation({
          senderId: currentUserId,
          receiverId: selectedUserId,
          movieId: selectedRecommendationMovieId,
          message: message || "",
        })
      );

      alert("Recommendation sent!");
      setSelectedRecommendationMovieId(null);
      setMessage("");
    } catch (err) {
      console.error("Error creating recommendation:", err);
      alert("Could not create the recommendation. It may already exist.");
    }
  };

  // 10) If no watched movies
  if (!currentUserWatched.length) {
    return (
      <div className="watched-movies-container">
        <section className="hero-section">
        <h1>WATCHED</h1>
        </section>
        <p>No watched movies to display!</p>
      </div>
    );
  }

  return (
    <div className="watched-movies-container">
      <section className="hero-section">
      <h1>WATCHED</h1>
      </section>
      {/* Sorting Dropdown */}
      <div className="sort-dropdown">
        <label htmlFor="sort">Sort By: </label>
        <select
          id="sort"
          value={sortCriteria}
          onChange={(e) => setSortCriteria(e.target.value)}
        >
          <option value="None">None</option>
          <option value="Date Watched">Date Watched</option>
          <option value="Rating">Rating</option>
        </select>
      </div>
      {showModal && (
  <div className="modal-overlay">
    <div className="modal-content">
      <h2>Friends Who Watched</h2>
      {friendWatchersList.length ? (
        <ul>
          {friendWatchersList.map((fw, idx) => (
            <li key={idx}>
              {fw.username} (Rating: {fw.rating})
            </li>
          ))}
        </ul>
      ) : (
        <p>No friends found.</p>
      )}
      <button onClick={() => setShowModal(false)}>Close</button>
    </div>
  </div>
)}

      {/* Movies Table */}
      <table className="watched-movies-table">
  <thead>
    <tr>
      <th>Movie</th>
      <th># Friends Watched</th>
      <th>Rating</th>
      <th>Watched With</th>
      <th>Date Watched</th>
      <th>Recommend</th>
    </tr>
  </thead>
  <tbody>
    {sortedMovies.map((movie) => {
      const friendWatchersCount = getFriendWatchersCount(movie.movieId);
      return (
        <tr key={movie.movieId}>
          <td>
            <Link to={`/movies/${movie.id}`}>
              {movie.posterUrl && (
                <img
                  src={movie.posterUrl}
                  alt={movie.title}
                  className="movie-poster"
                />
              )}
              <div>{movie.title || "Untitled Movie"}</div>
            </Link>
          </td>

          <td>
            {friendWatchersCount > 0 ? (
              <button onClick={() => handleFriendsWatchedClick(movie.movieId)}>
                <h2>{friendWatchersCount}</h2>
              </button>
            ) : (
              <h2>0</h2>
            )}
          </td>

          <td>
            <div className="cell-stack">
              <h2>{movie.rating || "Not Rated"}</h2>
              {selectedActionMovieId === movie.id ? (
                <>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                    className="rating-input"
                  />
                  <button onClick={() => handleRatingSubmit(movie.id)}>
                    SUBMIT
                  </button>
                  <button onClick={() => setSelectedActionMovieId(null)}>
                    CANCEL
                  </button>
                </>
              ) : (
                <button className="change-btn" onClick={() => setSelectedActionMovieId(movie.id)}>
                  UPDATE
                </button>
              )}
            </div>
          </td>

          <td>
            <div className="cell-stack">
              {users.find((user) => user.id === movie.watchedWith)?.username || ""}

            </div>
          </td>

          <td>
            <h2>{movie.dateWatched || "No Date"}</h2>
          </td>

          <td>
            {selectedRecommendationMovieId === movie.id ? (
              <div className="recommendation-form">
                <select
                  value={selectedUserId || ""}
                  onChange={(e) =>
                    setSelectedUserId(e.target.value === "" ? null : Number(e.target.value))
                  }
                >
                  <option value="">Select a user</option>
                  {users
                    .filter((u) => acceptedFriendIds.has(u.id))
                    .filter(
                      (u) =>
                        !userMovies.some(
                          (um) =>
                            um.userId === u.id &&
                            um.movieId === movie.movieId &&
                            um.status === "watched"
                        )
                    )
                    .map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.username}
                      </option>
                    ))}
                </select>
                <input
                  type="text"
                  placeholder="Enter a message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
                <button onClick={handleRecommendationSubmit}>Submit</button>
                <button onClick={() => setSelectedRecommendationMovieId(null)}>
                  CANCEL
                </button>
              </div>
            ) : (
              <button className="recommend-btn" onClick={() => setSelectedRecommendationMovieId(movie.id)}>
                RECOMMEND
              </button>
            )}
          </td>
        </tr>
      );
    })}
  </tbody>
</table>

    </div>
  );
};

export default Watched;
