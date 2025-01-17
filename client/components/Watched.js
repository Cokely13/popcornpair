import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserMovies } from "../store/allUserMoviesStore";
import { fetchMovies } from "../store/allMoviesStore";
import { updateSingleUserMovie } from "../store/singleUserMovieStore";

const Watched = () => {
  const dispatch = useDispatch();
  const [selectedMovieId, setSelectedMovieId] = useState(null);
  const [rating, setRating] = useState("");

  const currentUserId = useSelector((state) => state.auth.id);
  const userMovies = useSelector((state) => state.allUserMovies).filter(
    (userMovie) => userMovie.userId === currentUserId && userMovie.watched
  );
  const movies = useSelector((state) => state.allMovies);

  useEffect(() => {
    dispatch(fetchUserMovies());
    dispatch(fetchMovies());
  }, [dispatch]);

  // Merge userMovies with movie details
  const watchedMovies = userMovies.map((userMovie) => ({
    ...userMovie,
    ...movies.find((movie) => movie.id === userMovie.movieId),
  }));

  const handleRatingSubmit = async (movieId) => {
    if (!rating || rating < 1 || rating > 10) {
      alert("Please provide a rating between 1 and 10.");
      return;
    }

    try {
      await dispatch(updateSingleUserMovie({ userId: currentUserId, movieId, rating }));
      alert("Rating submitted!");
      setSelectedMovieId(null); // Close the rating input
      setRating(""); // Reset the input field
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
      <div className="watched-movies-list">
        {watchedMovies.map((movie) => (
          <div key={movie.id} className="watched-movie-item">
            <img
              src={movie.posterUrl || "https://via.placeholder.com/150"}
              alt={movie.title || "Untitled Movie"}
              className="movie-poster"
            />
            <div className="movie-info">
              <h3>{movie.title || "Untitled Movie"}</h3>
              <p><strong>Description:</strong> {movie.description || "No description available."}</p>
              <p><strong>Watched With:</strong> {movie.watchedWith || "N/A"}</p>
              <p><strong>Your Rating:</strong> {movie.rating || "Not Rated"}</p>
              {selectedMovieId === movie.id ? (
                <div className="rating-form">
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                    placeholder="Rate 1-10"
                  />
                  <button onClick={() => handleRatingSubmit(movie.id)}>Submit</button>
                  <button onClick={() => setSelectedMovieId(null)}>Cancel</button>
                </div>
              ) : (
                <button onClick={() => setSelectedMovieId(movie.id)}>Rate</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Watched;
