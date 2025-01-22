import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMovies } from "../store/allMoviesStore";
import { fetchRatings } from "../store/allRatingsStore";
import { updateSingleRating } from "../store/singleRatingStore";

const Rejected = () => {
  const dispatch = useDispatch();
  const movies = useSelector((state) => state.allMovies);
  const ratings = useSelector((state) => state.allRatings);
  const [currentIndex, setCurrentIndex] = useState(0);
  const { id } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchMovies());
    dispatch(fetchRatings(id)); // Fetch ratings for the logged-in user
  }, [dispatch, id]);

  // Filter movies rated "No" by the user
  const rejectedMovies = movies.filter(
    (movie) =>
      ratings.some(
        (rating) =>
          rating.movieId === movie.id &&
          rating.userId === id &&
          rating.rating === "NO"
      )
  );

  const movie = rejectedMovies[currentIndex];

  const handleNextMovie = () => {
    if (currentIndex < rejectedMovies.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(null); // Mark as finished by setting to null
    }
  };

  const handleRatingUpdate = async () => {
    if (!movie) return;

    const userRating = ratings.find(
      (rating) => rating.movieId === movie.id && rating.userId === id
    );

    if (!userRating) {
      console.error("Rating not found for the movie.");
      return;
    }

    try {
      await dispatch(
        updateSingleRating({
          id: userRating.id,
          userId: id,
          movieId: movie.id,
          rating: "YES",
        })
      );

      handleNextMovie(); // Advance to the next movie
    } catch (err) {
      console.error("Error updating rating:", err);
    }
  };

  if (!rejectedMovies.length) {
    return <div>No rejected movies to display!</div>;
  }

  return (
    <div className="rate-movie-container">
      <h1>Second Chance</h1>
      {currentIndex === null ? (
        <div className="finished-message">
          <h2>That's all for now!</h2>
          <p>Come back later to revisit your rejected movies.</p>
        </div>
      ) : movie ? (
        <>
          {/* Movie Poster */}
          {movie.posterUrl ? (
            <img src={movie.posterUrl} alt={movie.title} className="movie-poster" />
          ) : (
            <div className="no-image">No Image Available</div>
          )}

          {/* Movie Information */}
          <div className="movie-info">
            <h2>{movie.title || "Untitled Movie"}</h2>
            <p>
              <strong>Description:</strong> {movie.description || "No description available."}
            </p>
            <p>
              <strong>Release Date:</strong> {movie.releaseDate || "Unknown"}
            </p>
            <p>
              <strong>Genres:</strong> {movie.genres?.join(", ") || "N/A"}
            </p>
          </div>

          {/* Buttons */}
          <div className="button-container">
            <button className="yes-button" onClick={handleRatingUpdate}>
              YES
            </button>
            <button className="no-button" onClick={handleNextMovie}>
              Keep Rejected
            </button>
          </div>
        </>
      ) : (
        <div>Loading movie details...</div>
      )}
    </div>
  );
};

export default Rejected;
