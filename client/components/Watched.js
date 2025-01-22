import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserMovies } from "../store/allUserMoviesStore";
import { fetchMovies } from "../store/allMoviesStore";
import { updateSingleUserMovie } from "../store/singleUserMovieStore";
import { fetchUsers } from "../store/allUsersStore";

const Watched = () => {
  const dispatch = useDispatch();
  const [selectedMovieId, setSelectedMovieId] = useState(null);
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

  const watchedMovies = userMovies.map((userMovie) => ({
    ...userMovie,
    ...movies.find((movie) => movie.id === userMovie.movieId),
  }));

  const sortedMovies = [...watchedMovies].sort((a, b) => {
    if (sortCriteria === "Date Watched") {
      return new Date(b.dateWatched) - new Date(a.dateWatched);
    } else if (sortCriteria === "Rating") {
      return (b.rating || 0) - (a.rating || 0);
    }
    return 0;
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

  if (!watchedMovies.length) {
    return <div>No watched movies to display!</div>;
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
            <th>Rating</th>
            <th>Date Watched</th>
            <th>Actions</th>
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
              <td>{movie.rating || "Not Rated"}</td>
              <td>{movie.dateWatched || "No Date"}</td>
              <td>
                {selectedMovieId === movie.id ? (
                  <>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={rating}
                      onChange={(e) => setRating(e.target.value)}
                      className="rating-input"
                    />
                    <button onClick={() => handleRatingSubmit(movie.id)}>Submit</button>
                    <button onClick={() => setSelectedMovieId(null)}>Cancel</button>
                  </>
                ) : (
                  <button onClick={() => setSelectedMovieId(movie.id)}>Rate</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Watched;
