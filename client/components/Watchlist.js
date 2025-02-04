import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserMovies } from "../store/allUserMoviesStore";
import { updateSingleUserMovie } from "../store/singleUserMovieStore";
import { fetchMovies } from "../store/allMoviesStore";
import { Link } from "react-router-dom";


const Watchlist = () => {
  const dispatch = useDispatch();
  const currentUserId = useSelector((state) => state.auth.id);
  const [selectedMovieId, setSelectedMovieId] = useState(null);

  const [showRatingModal, setShowRatingModal] = useState(false);
   const [rating, setRating] = useState("");
  // Grab all userMovie entries and filter to just this user
  const userMovies = useSelector((state) => state.allUserMovies).filter(
    (userMovie) => userMovie.userId === currentUserId
  );

  // Grab all movies (to merge movie details)
  const movies = useSelector((state) => state.allMovies);



  const [sortCriteria, setSortCriteria] = useState("None");

  useEffect(() => {
    dispatch(fetchUserMovies());
    dispatch(fetchMovies());
  }, [dispatch]);

  // 1. Filter down to only those with status === "watchlist"
  const watchlistMovies = userMovies
    .filter((um) => um.status === "watchlist")
    .map((userMovie) => {
      const movie = movies.find((m) => m.id === userMovie.movieId) || {};
      return {
        ...userMovie,
        ...movie,
        predictedRating: userMovie.predictedRating || "N/A",
      };
    });

  // 2. Sort based on sortCriteria
  const sortedMovies = [...watchlistMovies].sort((a, b) => {
    if (sortCriteria === "Title") {
      return a.title.localeCompare(b.title);
    }
    if (sortCriteria === "Predicted Rating") {
      // Convert to number (in case "N/A"), or default to 0
      const ratingA = isNaN(a.predictedRating) ? 0 : +a.predictedRating;
      const ratingB = isNaN(b.predictedRating) ? 0 : +b.predictedRating;
      return ratingB - ratingA; // descending
    }
    return 0; // Default: no sorting
  });

  // 3. Remove from watchlist (Set status to "none" or delete the record)
  const handleRemoveFromWatchlist = async (movieId) => {
    try {
      // If you only have "watchlist" or "watched" in your enum,
      // you might either delete the record or set it to "watched".
      // If your enum has "none", you can do status: "none".
      await dispatch(
        updateSingleUserMovie({
          userId: currentUserId,
          movieId,
          status: "none", // or "watched" or some other approach
        })
      );
      dispatch(fetchUserMovies());
    } catch (err) {
      console.error("Error removing from watchlist:", err);
    }
  };



  const handleMarkAsWatched = (movieId) => {
    setSelectedMovieId(movieId);
    setShowRatingModal(true); // Open the rating modal
  };

  // 8) Submit rating or skip
  const handleSubmitRating = async (skip = false) => {
    try {
      if (!selectedMovieId) return;

      const userMovie = userMovies.find(
              (um) => um.movieId === selectedMovieId && um.userId === currentUserId
            );


        await dispatch(
          updateSingleUserMovie({
            userId: userMovie.userId,
            movieId: userMovie.movieId,
            status: "watched",
            rating: skip ? null : Number(rating), // Only set rating if user selected
          })
        )
        setShowRatingModal(false);
        setRating("");
        setSelectedMovieId(null);
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





  if (!watchlistMovies.length) {
    return (
      <div className="watchlist-container">
        <section className="hero-section">
        <h1>WATCHLIST</h1>
        </section>
        <p>No movies on your watchlist! Check out some of your rejected movies.</p>
        <Link to={`/rejected`} className="friend-link">
                <button className="reject-button">SECOND CHANCE</button>
              </Link>

      </div>
    );
  }

  return (
    <div className="watchlist-container">
      <section className="hero-section">
      <h1>WATCHLIST</h1>
      </section>
      {/* Sort Dropdown */}
      <div className="sort-dropdown">
        <label htmlFor="sort">Sort By: </label>
        <select
          id="sort"
          value={sortCriteria}
          onChange={(e) => setSortCriteria(e.target.value)}
        >
          <option value="None">None</option>
          <option value="Title">Title</option>
          <option value="Predicted Rating">Predicted Rating</option>
        </select>
      </div>

      {/* Watchlist Movies */}
      <div className="watchlist-movies">
        {sortedMovies.map((movie) => (
          <div key={movie.movieId} className="watchlist-movie-item">
             <Link to={`/movies/${movie.id}`}>
            {movie.posterUrl ? (
              <img src={movie.posterUrl} alt={movie.title} className="movie-poster" />
            ) : (
              <div className="no-poster">No Image Available</div>
            )}
            <h3>{movie.title || "Untitled Movie"}</h3>
            </Link>
            <p>
              <strong>Predicted Rating:</strong> {movie.predictedRating}
            </p>
            <div className="watchlist-actions">
            <button onClick={() => handleMarkAsWatched(movie.movieId)}>
               WATCHED
              </button>
              <button onClick={() => handleRemoveFromWatchlist(movie.movieId)}>
                REMOVE
              </button>
            </div>
          </div>
        ))}
      </div>
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
      <Link to={`/rejected`} className="friend-link">
                <button className="reject-button">SECOND CHANCE</button>
              </Link>

    </div>
  );
};

export default Watchlist;
