import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserMovies, updateSingleUserMovie } from "../store/allUserMoviesStore";
import { fetchMovies } from "../store/allMoviesStore";

const Watchlist = () => {
  const dispatch = useDispatch();
  const currentUserId = useSelector((state) => state.auth.id);
  const userMovies = useSelector((state) => state.allUserMovies).filter(
    (userMovie) => userMovie.userId === currentUserId && userMovie.watchlist
  );
  const movies = useSelector((state) => state.allMovies);

  const [sortCriteria, setSortCriteria] = useState("None");

  useEffect(() => {
    dispatch(fetchUserMovies());
    dispatch(fetchMovies());
  }, [dispatch]);

  const watchlistMovies = userMovies.map((userMovie) => ({
    ...userMovie,
    ...movies.find((movie) => movie.id === userMovie.movieId),
  }));

  const sortedMovies = [...watchlistMovies].sort((a, b) => {
    if (sortCriteria === "Title") {
      return a.title.localeCompare(b.title);
    }
    return 0; // Default order
  });

  const handleRemoveFromWatchlist = async (movieId) => {
    try {
      await dispatch(
        updateSingleUserMovie({ userId: currentUserId, movieId, watchlist: false })
      );
    } catch (err) {
      console.error("Error removing from watchlist:", err);
    }
  };

  const handleMarkAsWatched = async (movieId) => {
    try {
      await dispatch(
        updateSingleUserMovie({ userId: currentUserId, movieId, watched: true, watchlist: false })
      );
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
        </select>
      </div>

      {/* Watchlist Movies */}
      <div className="watchlist-movies">
        {sortedMovies.map((movie) => (
          <div key={movie.movieId} className="watchlist-movie-item">
            <img src={movie.posterUrl} alt={movie.title} className="movie-poster" />
            <h3>{movie.title || "Untitled Movie"}</h3>
            <div className="watchlist-actions">
              <button onClick={() => handleRemoveFromWatchlist(movie.id)}>Remove</button>
              <button onClick={() => handleMarkAsWatched(movie.id)}>Mark as Watched</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Watchlist;
