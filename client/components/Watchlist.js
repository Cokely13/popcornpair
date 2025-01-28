import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserMovies } from "../store/allUserMoviesStore";
import { updateSingleUserMovie } from "../store/singleUserMovieStore";
import { fetchMovies } from "../store/allMoviesStore";

const Watchlist = () => {
  const dispatch = useDispatch();
  const currentUserId = useSelector((state) => state.auth.id);

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

  // 4. Mark as watched (Set status to "watched")
  const handleMarkAsWatched = async (movieId) => {

    try {

      const userMovie = userMovies.find(
        (um) => um.movieId === movieId && um.userId === currentUserId
      );
      await dispatch(
        updateSingleUserMovie({
          userId: currentUserId,
          movieId: userMovie.movieId,
          status: "watched",
        })
      );
      dispatch(fetchUserMovies());
    } catch (err) {
      console.error("Error marking as watched:", err);
    }
  };

  if (!watchlistMovies.length) {
    return (
      <div className="watchlist-container">
        <h2>Your Watchlist</h2>
        <p>No movies on the watchlist!</p>
      </div>
    );
  }

  return (
    <div className="watchlist-container">
      <h2>Your Watchlist</h2>

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
            {movie.posterUrl ? (
              <img src={movie.posterUrl} alt={movie.title} className="movie-poster" />
            ) : (
              <div className="no-poster">No Image Available</div>
            )}
            <h3>{movie.title || "Untitled Movie"}</h3>
            <p>
              <strong>Predicted Rating:</strong> {movie.predictedRating}
            </p>
            <div className="watchlist-actions">
              <button onClick={() => handleRemoveFromWatchlist(movie.movieId)}>
                Remove
              </button>
              <button onClick={() => handleMarkAsWatched(movie.movieId)}>
                Mark as Watched
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Watchlist;
