import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMovies } from "../store/allMoviesStore";
import { fetchUserMovies } from "../store/allUserMoviesStore";
import { updateSingleUserMovie } from "../store/singleUserMovieStore";
import { Link } from "react-router-dom";

const Rejected = () => {
  const dispatch = useDispatch();
  const [currentIndex, setCurrentIndex] = useState(0);

  // Logged-in user
  const { id: currentUserId } = useSelector((state) => state.auth);

  // All movies from the store
  const movies = useSelector((state) => state.allMovies) || [];

  // All userMovies from the store
  const userMovies = useSelector((state) => state.allUserMovies) || [];

  useEffect(() => {
    // Ensure we have both userMovies and movies in Redux state
    dispatch(fetchUserMovies());
    dispatch(fetchMovies());
  }, [dispatch]);

  // 1) Filter userMovies for current user with status="none"
  //    (Your old "rejected" logic is replaced by "none" status.)
  const noneUserMovies = userMovies.filter(
    (um) => um.userId === currentUserId && um.status === "none"
  );

  // 2) For each of those userMovie records, find the associated movie details
  //    This gives us an array of objects combining userMovie + movie data
  const noneMovies = noneUserMovies.map((um) => {
    const movieDetails = movies.find((m) => m.id === um.movieId) || {};
    return {
      ...um,
      ...movieDetails,
    };
  });

  // If no "none" movies, show a message
  if (!noneMovies.length) {
    return (
      <div>
      <div  >
         <section className="hero-section rate-movie-container">
         <h1>SECOND CHANCE</h1>

         </section>
         </div>
         <div className="rate-movie-container">
          <h2>No more movies to rate! Add more!</h2>
          <Link to={`/addmovie`} className="friend-link">
                <button className="reject-button">ADD</button>
              </Link>
        </div>
        </div>
    );
  }

  // 3) Grab the current movie based on currentIndex
  const movie = noneMovies[currentIndex];

  // 4) Move to next
  const handleNextMovie = () => {
    if (currentIndex < noneMovies.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(null); // Mark as finished by setting to null
    }
  };

  // 5) Handle "YES" => update userMovie status to "watchlist"
  const handleYes = async () => {
    try {
      // Dispatch updateSingleUserMovie with status="watchlist"
      await dispatch(
        updateSingleUserMovie({
          userId: currentUserId,
          movieId: movie.movieId, // from userMovie record
          status: "watchlist",
        })
      );

      // Then move on
      handleNextMovie();
    } catch (err) {
      console.error("Error updating userMovie:", err);
    }
  };

  // If we've displayed them all
  if (currentIndex === null) {
    return (
      <div className="rate-movie-container">
        <section className="hero-section">
        <h1>SECOND CHANCE</h1>
        </section>
        <h2>That's all for now!</h2>
        {/* <p>Come back later to revisit your "none" movies.</p> */}
      </div>
    );
  }

  return (
    <div className="rate-movie-container">
      <section className="hero-section">
      <h1>SECOND CHANCE</h1>
      </section>
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
          <strong>Description:</strong>{" "}
          {movie.description || "No description available."}
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
        <button className="yes-button" onClick={handleYes}>
          YES (move to watchlist)
        </button>
        <button className="no-button" onClick={handleNextMovie}>
          Keep Rejected
        </button>
      </div>
    </div>
  );
};

export default Rejected;
