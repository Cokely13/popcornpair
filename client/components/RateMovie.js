import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMovies } from "../store/allMoviesStore";

const RateMovie = () => {
  const dispatch = useDispatch();
  const movies = useSelector((state) => state.allMovies);

  useEffect(() => {
    dispatch(fetchMovies());
  }, [dispatch]);

  if (!movies.length) {
    return <div>Loading movies...</div>;
  }

  // Select the first movie for simplicity (can be updated to cycle through movies later)
  const movie = movies[0];

  return (
    <div className="rate-movie-container">
      {/* Movie Poster */}
      {movie.posterUrl ? (
        <img
          src={movie.posterUrl}
          alt={movie.title}
          className="movie-poster"
        />
      ) : (
        <div className="no-image">No Image Available</div>
      )}

      {/* Movie Information */}
      <div className="movie-info">
        <h2>{movie.title || "Untitled Movie"}</h2>
        <p><strong>Description:</strong> {movie.description || "No description available."}</p>
        <p><strong>Release Date:</strong> {movie.releaseDate || "Unknown"}</p>
        <p><strong>Genres:</strong> {movie.genres?.join(", ") || "N/A"}</p>
        <p><strong>Rating:</strong> {movie.userRating || "Not Rated"}</p>
      </div>

      {/* YES and NO Buttons */}
      <div className="button-container">
        <button className="yes-button">YES</button>
        <button className="no-button">NO</button>
      </div>
    </div>
  );
};

export default RateMovie;
