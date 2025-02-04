
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMovies } from "../store/allMoviesStore";
import { fetchUserMovies, createUserMovie } from "../store/allUserMoviesStore";
import { fetchFriends } from "../store/allFriendsStore";
import { fetchUsers } from "../store/allUsersStore";
import { FaThumbsUp, FaThumbsDown } from "react-icons/fa";
import { Link } from "react-router-dom";

// Utility: Get accepted friends
function getAcceptedFriendUserIds(currentUserId, allFriends) {
  const friendSet = new Set();

  allFriends
    .filter((f) => f.status === "accepted")
    .forEach((f) => {
      if (f.userId === currentUserId) {
        friendSet.add(f.friendId);
      } else if (f.friendId === currentUserId) {
        friendSet.add(f.userId);
      }
    });

  return friendSet;
}

const RateMovie = () => {
  const dispatch = useDispatch();
  const movies = useSelector((state) => state.allMovies);
  const userMovies = useSelector((state) => state.allUserMovies);
  const currentUserId = useSelector((state) => state.auth.id);
  const allFriends = useSelector((state) => state.allFriends);
  const users = useSelector((state) => state.allUsers);

  const [shuffledMovies, setShuffledMovies] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    dispatch(fetchMovies());
    dispatch(fetchUserMovies());
    dispatch(fetchFriends());
    dispatch(fetchUsers());
  }, [dispatch, currentUserId]);

  useEffect(() => {
    const acceptedFriendIds = getAcceptedFriendUserIds(currentUserId, allFriends);

    // Filter out movies the user has already rated
    const unratedMovies = movies.filter((movie) => {
      return !userMovies.some(
        (userMovie) =>
          userMovie.userId === currentUserId && userMovie.movieId === movie.id
      );
    });

    // Shuffle the movies
    const shuffled = unratedMovies.sort(() => Math.random() - 0.5);
    setShuffledMovies(shuffled);
  }, [movies, userMovies, currentUserId, allFriends]);

  useEffect(() => {
    if (currentIndex >= shuffledMovies.length) {
      setCurrentIndex(0);
    }
  }, [shuffledMovies, currentIndex]);

  const movie = shuffledMovies[currentIndex];

  const handleAddToWatchlist = async (movieId) => {
    try {
      const response = await fetch("http://127.0.0.1:5000/api/predict-rating", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: currentUserId, movieId }),
      });
      const data = await response.json();

      const predictedRating =
        response.ok && data.predictedRating !== undefined
          ? data.predictedRating
          : 0.0;

      await dispatch(
        createUserMovie({
          userId: currentUserId,
          movieId,
          status: "watchlist",
          predictedRating,
        })
      );

      alert(`Movie added to watchlist! Predicted Rating: ${predictedRating}`);
    } catch (err) {
      console.error("Error adding movie to watchlist:", err);
      alert("Something went wrong. Please try again.");
    }
  };

  const handleNextMovie = () => {
    if (currentIndex < shuffledMovies.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  // Get # Friends Watched and their Avg Rating
  const getFriendWatchStats = (movieId) => {
    const acceptedFriendIds = getAcceptedFriendUserIds(currentUserId, allFriends);

    const friendWatchers = userMovies.filter(
      (um) =>
        um.movieId === movieId &&
        um.status === "watched" &&
        acceptedFriendIds.has(um.userId)
    );

    const numFriendsWatched = friendWatchers.length;
    const avgRating =
      numFriendsWatched > 0
        ? (
            friendWatchers.reduce((sum, fw) => sum + (fw.rating || 0), 0) /
            numFriendsWatched
          ).toFixed(1)
        : null;

    return { numFriendsWatched, avgRating };
  };

  return (
    <div className="rate-container">
      <section className="hero-section">
      <h1>ADD TO WATCHLIST</h1>
      </section>
      {shuffledMovies.length === 0 ? (
        <div className="no-movies-message">
          <h2>No more movies to rate! Add more!</h2>
          <Link to={`/addmovie`} className="friend-link">
                <button className="reject-button">ADD</button>
              </Link>
        </div>
      ) : movie ? (
        <>
        <div className ="rate-movie-container">
          {movie.posterUrl ? (
            <img src={movie.posterUrl} alt={movie.title} className="movie-poster" />
          ) : (
            <div className="no-image">No Image Available</div>
          )}

          <div className="movie-info">
            <h2>{movie.title || "Untitled Movie"}</h2>

            {/* # Friends Watched & Avg Rating Section */}
            <p>
              <strong># Friends Watched:</strong>{" "}
              {getFriendWatchStats(movie.id).numFriendsWatched}{" "}
              {getFriendWatchStats(movie.id).numFriendsWatched > 0 &&
                getFriendWatchStats(movie.id).avgRating !== null && (
                  <span>(Avg Rating: {getFriendWatchStats(movie.id).avgRating})</span>
                )}
            </p>

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

          <div className="button-container">
            <button
              className="yes-button"
              onClick={() => handleAddToWatchlist(movie.id)}
              title="Thumbs Up"
            >
              <FaThumbsUp />
            </button>
            <button
              className="no-button"
              onClick={handleNextMovie}
              title="Thumbs Down"
            >
              <FaThumbsDown />
            </button>
          </div>
          </div>
        </>
      ) : (
        <div>Loading movie details...</div>
      )}
    </div>
  );
};

export default RateMovie;

