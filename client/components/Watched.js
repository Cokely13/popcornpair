import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserMovies } from "../store/allUserMoviesStore";
import { updateSingleUserMovie } from "../store/singleUserMovieStore";
import { fetchMovies } from "../store/allMoviesStore";
import { fetchUsers } from "../store/allUsersStore";

const Watched = () => {
  const dispatch = useDispatch();
  const [selectedMovieId, setSelectedMovieId] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [rating, setRating] = useState("");
  const [sortCriteria, setSortCriteria] = useState("None");

  const currentUserId = useSelector((state) => state.auth.id);
  const userMovies = useSelector((state) => state.allUserMovies).filter(
    (userMovie) => userMovie.userId === currentUserId && userMovie.watched
  );
  const movies = useSelector((state) => state.allMovies);
  const users = useSelector((state) => state.allUsers);

  useEffect(() => {
    dispatch(fetchUserMovies());
    dispatch(fetchUsers());
    dispatch(fetchMovies());
  }, [dispatch]);

  // Merge userMovies with movie details
  const watchedMovies = userMovies.map((userMovie) => ({
    ...userMovie,
    ...movies.find((movie) => movie.id === userMovie.movieId),
  }));

  // Apply sorting based on the selected criteria
  const sortedMovies = [...watchedMovies].sort((a, b) => {
    if (sortCriteria === "Date Watched") {
      return new Date(b.dateWatched) - new Date(a.dateWatched); // Most recent first
    } else if (sortCriteria === "Rating") {
      return (b.rating || 0) - (a.rating || 0); // Highest rating first
    }
    return 0; // Default order
  });

  const handleRatingSubmit = async (movieId) => {
    if (!rating || rating < 1 || rating > 10) {
      alert("Please provide a rating between 1 and 10.");
      return;
    }

    try {
      await dispatch(updateSingleUserMovie({ userId: currentUserId, movieId, rating }));
      setSelectedMovieId(null);
      setRating("");
      dispatch(fetchUserMovies());
    } catch (err) {
      console.error("Error submitting rating:", err);
    }
  };

  const handleWatchedWithSubmit = async (movieId) => {
    if (!selectedUserId) {
      alert("Please select a user.");
      return;
    }

    try {
      await dispatch(
        updateSingleUserMovie({ userId: currentUserId, movieId, watchedWith: selectedUserId })
      );
      setSelectedMovieId(null);
      setSelectedUserId(null);
      dispatch(fetchUserMovies());
    } catch (err) {
      console.error("Error updating Watched With:", err);
    }
  };

  if (!userMovies.length) {
    return (
      <div className="watched-movies-container">
        <h2>Your Watched Movies</h2>
        <p>No watched movies to display!</p>
      </div>
    );
  }

  return (
    <div className="watched-movies-container">
      <h2>Your Watched Movies</h2>

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

      {/* Movies Table */}
      <table className="watched-movies-table">
        <thead>
          <tr>
            <th>Movie</th>
            <th>Watched With</th>
            <th>Update Watched With</th>
            <th>Rating</th>
            <th>Date Watched</th>
          </tr>
        </thead>
        <tbody>
          {sortedMovies.map((movie) => (
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
                {users.find((user) => user.id === movie.watchedWith)?.username || "N/A"}
              </td>
              <td>
                {selectedMovieId === movie.id ? (
                  <>
                    <select
                      value={selectedUserId || ""}
                      onChange={(e) => setSelectedUserId(Number(e.target.value))}
                    >
                      <option value="">Select User</option>
                      {users
                        .filter((user) => user.id !== currentUserId)
                        .map((user) => (
                          <option key={user.id} value={user.id}>
                            {user.username}
                          </option>
                        ))}
                    </select>
                    <button onClick={() => handleWatchedWithSubmit(movie.id)}>
                      Submit
                    </button>
                  </>
                ) : (
                  <button onClick={() => setSelectedMovieId(movie.id)}>Update</button>
                )}
              </td>
              <td>{movie.rating || "Not Rated"}</td>
              <td>{movie.dateWatched || "No Date"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Watched;
