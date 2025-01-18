import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchRatings } from "../store/allRatingsStore";
import { fetchMovies } from "../store/allMoviesStore";
import { createUserMovie } from "../store/allUserMoviesStore";
import { fetchUserMovies } from "../store/allUserMoviesStore";
import { fetchSingleUser } from "../store/singleUserStore";

const Random = () => {
  const { userId } = useParams(); // Friend's ID
  const dispatch = useDispatch();
  const [randomMovie, setRandomMovie] = useState(null);

  const currentUserId = useSelector((state) => state.auth.id);
  const ratings = useSelector((state) => state.allRatings) || [];
  const movies = useSelector((state) => state.allMovies) || [];
  const userMovies = useSelector((state) => state.allUserMovies) || [];
  const friend = useSelector((state) => state.singleUser) || [];

  useEffect(() => {
    dispatch(fetchRatings());
    dispatch(fetchMovies());
    dispatch(fetchUserMovies());
    dispatch(fetchSingleUser(userId));
  }, [dispatch]);

  // Find common movies rated "YES" by both users
  const sharedMovies = ratings
    .filter((rating) => rating.userId === currentUserId && rating.rating === "YES") // Movies rated "YES" by current user
    .map((rating) => rating.movieId)
    .filter((movieId) =>
      ratings.some(
        (friendRating) =>
          friendRating.userId === parseInt(userId) &&
          friendRating.movieId === movieId &&
          friendRating.rating === "YES"
      )
    )
    .filter(
      (movieId) =>
        !userMovies.some(
          (userMovie) => userMovie.movieId === movieId && userMovie.watched
        )
    );

  const matchedMovies = movies.filter((movie) => sharedMovies.includes(movie.id));

  useEffect(() => {
    if (matchedMovies.length) {
      const randomIndex = Math.floor(Math.random() * matchedMovies.length);
      setRandomMovie(matchedMovies[randomIndex]);
    } else {
      setRandomMovie(null); // No matched movies
    }
  }, [matchedMovies]);

  const handleWatch = async () => {
    if (!randomMovie) return;

    try {
      // Create UserMovie for the current user
      await dispatch(
        createUserMovie({
          userId: currentUserId,
          movieId: randomMovie.id,
          watched: true,
          watchedWith: userId,
        })
      );

      // Create UserMovie for the friend
      await dispatch(
        createUserMovie({
          userId: parseInt(userId),
          movieId: randomMovie.id,
          watched: true,
          watchedWith: currentUserId,
        })
      );

      alert("Movie marked as watched!");
    } catch (err) {
      console.error("Error creating UserMovie:", err);
    }
  };

  return (
    <div className="rate-movie-container">
      <h2>Random Match with {friend?.username || "User"}</h2>

      {randomMovie ? (
        <>
          {/* Movie Poster */}
          {randomMovie.posterUrl ? (
            <img
              src={randomMovie.posterUrl}
              alt={randomMovie.title}
              className="movie-poster"
            />
          ) : (
            <div className="no-image">No Image Available</div>
          )}

          {/* Movie Information */}
          <div className="movie-info">
            <h2>{randomMovie.title || "Untitled Movie"}</h2>
            <p>
              <strong>Description:</strong>{" "}
              {randomMovie.description || "No description available."}
            </p>
            <p>
              <strong>Release Date:</strong>{" "}
              {randomMovie.releaseDate || "Unknown"}
            </p>
            <p>
              <strong>Genres:</strong>{" "}
              {randomMovie.genres?.join(", ") || "N/A"}
            </p>
          </div>

          {/* Watch Button */}
          <div className="button-container">
            <button className="watch-button" onClick={handleWatch}>
              Watch
            </button>
          </div>
        </>
      ) : (
        <div>Sorry, there are no movies to show.</div>
      )}
    </div>
  );
};

export default Random;
