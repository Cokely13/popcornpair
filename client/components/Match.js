import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchRatings } from "../store/allRatingsStore";
import { fetchMovies } from "../store/allMoviesStore";
import { createUserMovie } from "../store/allUserMoviesStore";

const Match = () => {
  const { userId } = useParams(); // Friend's ID
  const dispatch = useDispatch();
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentUserId = useSelector((state) => state.auth.id);
  const ratings = useSelector((state) => state.allRatings) || [];
  const movies = useSelector((state) => state.allMovies) || [];
  const users = useSelector((state) => state.users) || [];
  const friend = users.find((user) => user.id === parseInt(userId));

  useEffect(() => {
    dispatch(fetchRatings());
    dispatch(fetchMovies()); // Ensure movies are fetched
  }, [dispatch]);

  // Find common movies rated "YES" by both users
  const commonMovies = ratings
    .filter((rating) => rating.rating === "YES")
    .reduce((acc, rating) => {
      if (rating.userId === currentUserId) {
        acc.currentUserMovies.push(rating.movieId);
      } else if (rating.userId === parseInt(userId)) {
        acc.friendMovies.push(rating.movieId);
      }
      return acc;
    }, { currentUserMovies: [], friendMovies: [] });

  const sharedMovies = commonMovies.currentUserMovies.filter((movieId) =>
    commonMovies.friendMovies.includes(movieId)
  );

  const matchedMovies = movies.filter((movie) => sharedMovies.includes(movie.id));

  if (!matchedMovies.length) {
    return <div>No matching movies found!</div>;
  }

  const movie = matchedMovies[currentIndex];

  const handleNext = () => {
    if (currentIndex < matchedMovies.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      alert("No more movies to show!");
      setCurrentIndex(0); // Reset to the first movie
    }
  };

  // const handleWatch = async () => {
  //   try {
  //     await dispatch(updateSingleUserMovie({ userId: currentUserId, movieId: movie.id, watched: true }));
  //     await dispatch(updateSingleUserMovie({ userId: parseInt(userId), movieId: movie.id, watched: true }));
  //     alert("Movie marked as watched for both users!");
  //   } catch (err) {
  //     console.error("Error updating movie to watched:", err);
  //   }
  // };


const handleWatch = async () => {
  try {
    // Create UserMovie for the current user
    await dispatch(
      createUserMovie({ userId: currentUserId, movieId: movie.id, watched: true })
    );

    // Create UserMovie for the friend
    await dispatch(
      createUserMovie({ userId: parseInt(userId), movieId: movie.id, watched: true })
    );

    alert("Movie marked as watched for both users!");
  } catch (err) {
    console.error("Error creating UserMovie:", err);
  }
};

  return (
    <div className="rate-movie-container">
      <h2>Matches with {friend?.username || "User"}</h2>
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

      {/* Buttons */}
      <div className="button-container">
        <button className="watch-button" onClick={handleWatch}>Watch</button>
        <button className="next-button" onClick={handleNext}>Next</button>
      </div>
    </div>

  );
};

export default Match;
