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
    <div style={{ textAlign: "center", margin: "20px" }}>
      {/* Movie Poster */}
      {movie.posterUrl ? (
        <img
          src={movie.posterUrl}
          alt={movie.title}
          style={{ maxWidth: "300px", borderRadius: "10px", marginBottom: "20px" }}
        />
      ) : (
        <div style={{ height: "300px", width: "200px", background: "#ddd", borderRadius: "10px", margin: "0 auto 20px" }}>
          No Image Available
        </div>
      )}

      {/* Movie Information */}
      <div style={{ marginBottom: "20px" }}>
        <h2>{movie.title || "Untitled Movie"}</h2>
        <p><strong>Description:</strong> {movie.description || "No description available."}</p>
        <p><strong>Release Date:</strong> {movie.releaseDate || "Unknown"}</p>
        <p><strong>Genres:</strong> {movie.genres?.join(", ") || "N/A"}</p>
        <p><strong>Rating:</strong> {movie.userRating || "Not Rated"}</p>
      </div>

      {/* YES and NO Buttons */}
      <div>
        <button
          style={{
            padding: "10px 20px",
            marginRight: "10px",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          YES
        </button>
        <button
          style={{
            padding: "10px 20px",
            marginLeft: "10px",
            backgroundColor: "#F44336",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          NO
        </button>
      </div>
    </div>
  );
};

export default RateMovie;
