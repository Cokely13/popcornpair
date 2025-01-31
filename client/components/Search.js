import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchMovies } from "../store/allMoviesStore";
import { fetchUserMovies, createUserMovie } from "../store/allUserMoviesStore";
import { updateSingleUserMovie } from "../store/singleUserMovieStore";
import { fetchFriends } from "../store/allFriendsStore";
import { fetchUsers } from "../store/allUsersStore";

// Utility: Get accepted friends
function getAcceptedFriendUserIds(currentUserId, allFriends) {
  const friendSet = new Set();

  allFriends
    .filter((f) => f.status === "accepted")
    .forEach((f) => {
      if (f.userId === currentUserId) {
        friendSet.add(f.friendId);
      } else if (f.friendId === currentUserId) {
        friendSet.add(f.userId);
      }
    });

  return friendSet;
}

const Search = () => {
  const dispatch = useDispatch();

  const movies = useSelector((state) => state.allMovies);
  const userMovies = useSelector((state) => state.allUserMovies);
  const currentUserId = useSelector((state) => state.auth.id);
  const allFriends = useSelector((state) => state.allFriends);
  const users = useSelector((state) => state.allUsers);
  const [selectedMovieId, setSelectedMovieId] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("title");
    const [showRatingModal, setShowRatingModal] = useState(false);
  const [rating, setRating] = useState("");

  useEffect(() => {
    dispatch(fetchMovies());
    dispatch(fetchUserMovies());
    dispatch(fetchFriends());
    dispatch(fetchUsers());
  }, [dispatch]);

  const acceptedFriendIds = getAcceptedFriendUserIds(currentUserId, allFriends);

  const unwatchedMovies = movies.filter(
    (movie) =>
      !userMovies.some(
        (userMovie) =>
          userMovie.movieId === movie.id &&
          userMovie.status === "watched" &&
          userMovie.userId === currentUserId
      )
  );

  const filteredMovies = unwatchedMovies.filter((movie) =>
    movie.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedMovies = [...filteredMovies].sort((a, b) => {
    if (sortOption === "title") return a.title.localeCompare(b.title);
    if (sortOption === "releaseDate")
      return new Date(a.releaseDate) - new Date(b.releaseDate);
    if (sortOption === "rating") return b.avgRating - a.avgRating;
    return 0;
  });

  const isInWatchlist = (movieId) =>
    userMovies.some(
      (userMovie) =>
        userMovie.movieId === movieId &&
        userMovie.status === "watchlist" &&
        userMovie.userId === currentUserId
    );


  // 7) "Mark as Watched" logic → Show rating modal
  const handleMarkAsWatched = (movieId) => {
    setSelectedMovieId(movieId);
    setShowRatingModal(true); // Open the rating modal
  };

  // 8) Submit rating or skip
  const handleSubmitRating = async (skip = false) => {
    try {
      if (!selectedMovieId) return;

      // Check if there's already a userMovie record
      const userMovie = userMovies.find(
        (um) => um.movieId === selectedMovieId && um.userId === currentUserId
      );

      if (userMovie && (userMovie.status === "watchlist" || userMovie.status === "none")) {
        // If the movie is on watchlist or none, update to "watched" + rating
        await dispatch(
          updateSingleUserMovie({
            userId: userMovie.userId,
            movieId: userMovie.movieId,
            status: "watched",
            rating: skip ? null : Number(rating), // Only set rating if user selected
          })
        );
      } else {
        // Otherwise, create a new userMovie entry
        await dispatch(
          createUserMovie({
            userId: currentUserId,
            movieId: selectedMovieId,
            status: "watched",
            rating: skip ? null : Number(rating),
          })
        );
      }

      // Cleanup
      setShowRatingModal(false);
      setRating("");
      setSelectedMovieId(null);

      // Refresh user movies
      dispatch(fetchUserMovies());

      if (!skip && rating) {
        alert(`Movie marked as watched with a rating of ${rating}!`);
      } else {
        alert("Movie marked as watched!");
      }
    } catch (err) {
      console.error("Error submitting rating:", err);
    }
  };

  const handleAddToWatchlist = async (movieId) => {
    try {
      const response = await fetch("http://127.0.0.1:5000/api/predict-rating", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: currentUserId, movieId }),
      });
      const data = await response.json();

      const predictedRating =
        response.ok && data.predictedRating !== undefined
          ? data.predictedRating
          : 0.0;

      const userMovie = userMovies.find(
        (um) => um.movieId === movieId && um.userId === currentUserId
      );

      if (userMovie && userMovie.status === "none") {
        await dispatch(
          updateSingleUserMovie({
            userId: userMovie.userId,
            movieId: userMovie.movieId,
            status: "watchlist",
          })
        );
        dispatch(fetchUserMovies());
      } else {
        await dispatch(
          createUserMovie({
            userId: currentUserId,
            movieId,
            status: "watchlist",
            predictedRating,
          })
        );
      }

      alert(`Movie added to watchlist! Predicted Rating: ${predictedRating}`);
    } catch (err) {
      console.error(
        "Error adding movie to watchlist or fetching predicted rating:",
        err
      );
      alert("Something went wrong. Please try again.");
    }
  };

  // Get # Friends Watched and their Avg Rating
  const getFriendWatchStats = (movieId) => {
    const friendWatchers = userMovies.filter(
      (um) =>
        um.movieId === movieId &&
        um.status === "watched" &&
        acceptedFriendIds.has(um.userId)
    );

    const numFriendsWatched = friendWatchers.length;
    const avgRating =
      numFriendsWatched > 0
        ? (
            friendWatchers.reduce((sum, fw) => sum + (fw.rating || 0), 0) /
            numFriendsWatched
          ).toFixed(1)
        : null;

    return { numFriendsWatched, avgRating };
  };

  return (
    <div className="search-container">
       <section className="hero-section">
      <h1>Search for Movies</h1>
      </section>
      <div className="search-controls">
        <input
          type="text"
          placeholder="Search for a movie..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="sort-dropdown"
        >
          <option value="title">Sort by Title</option>
          <option value="releaseDate">Sort by Release Date</option>
          <option value="rating">Sort by Rating</option>
        </select>
      </div>

      <div
        className={`movies-list ${
          sortedMovies.length === 1 ? "single-result" : ""
        }`}
      >
        {sortedMovies.map((movie) => {
          const { numFriendsWatched, avgRating } = getFriendWatchStats(
            movie.id
          );

          return (
            <div
              key={movie.id}
              className={`movie-item ${
                isInWatchlist(movie.id) ? "watchlist-movie" : ""
              }`}
            >
              {movie.posterUrl ? (
                <img
                  src={movie.posterUrl}
                  alt={movie.title}
                  className="movie-poster"
                />
              ) : (
                <div className="no-poster">No Image Available</div>
              )}

              <Link to={`/movies/${movie.id}`}>
                <h3>{movie.title || "Untitled Movie"}</h3>
              </Link>
              <p>
                <strong>User Rating:</strong> {movie.userRating}{" "}
              </p>
              <p>
                <strong># Friends Watched:</strong> {numFriendsWatched}{" "}
                {numFriendsWatched > 0 && avgRating !== null && (
                  <span>(Avg Rating: {avgRating})</span>
                )}
              </p>

              <div className="movie-actions">
                {!isInWatchlist(movie.id) && (
                  <button
                    className="add-watchlist-button"
                    onClick={() => handleAddToWatchlist(movie.id)}
                  >
                    Add to Watchlist
                  </button>
                )}
                <button
                  className="mark-watched-button"
                  onClick={() => handleMarkAsWatched(movie.id)}
                >
                  Watched
                </button>
              </div>
            </div>
          );
        })}
      </div>
      {/* Rating Modal */}
     {showRatingModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Rate the Movie</h2>
            <p>Would you like to give this movie a rating now?</p>
            <select
              value={rating}
              onChange={(e) => setRating(e.target.value)}
            >
              <option value="">Select a rating</option>
              {[...Array(10)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>
            <div className="modal-buttons">
              <button
                onClick={() => handleSubmitRating(false)}
                disabled={!rating} // Must pick rating to submit
              >
                Submit Rating
              </button>
              <button onClick={() => handleSubmitRating(true)}>Skip</button>
              <button
                onClick={() => {
                  setShowRatingModal(false);
                  setSelectedMovieId(null);
                  setRating("");
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;

