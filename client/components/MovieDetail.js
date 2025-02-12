import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchMovies } from "../store/allMoviesStore";

const MovieDetail = () => {
  const { movieId } = useParams();
  const dispatch = useDispatch();

  const movie = useSelector((state) =>
    state.allMovies.find((movie) => movie.id === parseInt(movieId))
  );

  useEffect(() => {
    dispatch(fetchMovies());
  }, [dispatch]);

  if (!movie) {
    return <div>Loading movie details...</div>;
  }

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
        <p><strong>Runtime:</strong> {movie.runtimeMinutes ? `${movie.runtimeMinutes} minutes` : "N/A"}</p>
      </div>
    </div>
  );
};

export default MovieDetail;
