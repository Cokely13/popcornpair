import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaThumbsUp, FaThumbsDown } from "react-icons/fa";
import { Link } from "react-router-dom";
import { fetchMovies } from "../store/allMoviesStore";
import { fetchUserMovies, createUserMovie } from "../store/allUserMoviesStore";
import { fetchFriends } from "../store/allFriendsStore";
import { fetchUsers } from "../store/allUsersStore";

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
  const [showModal, setShowModal] = useState(false);
  const [friendWatchersList, setFriendWatchersList] = useState([]);

  useEffect(() => {
    dispatch(fetchMovies());
    dispatch(fetchUserMovies());
    dispatch(fetchFriends());
    dispatch(fetchUsers());
  }, [dispatch, currentUserId]);

  useEffect(() => {
    // Filter out movies the user has already rated
    const unratedMovies = movies.filter((movie) => {
      return !userMovies.some(
        (userMovie) =>
          userMovie.userId === currentUserId && userMovie.movieId === movie.id
      );
    });

    // Shuffle the unrated movies
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
      const response = await fetch("/flask-predict-rating", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: currentUserId, movieId }),
      });
      const data = await response.json();

      const predictedRating =
        response.ok && data.predictedRating !== undefined
          ? data.predictedRating
          : 0.0;
      const approachUsed =
        response.ok && data.approachUsed ? data.approachUsed : "unknown";

      await dispatch(
        createUserMovie({
          userId: currentUserId,
          movieId,
          status: "watchlist",
          predictedRating,
        })
      );

      alert(
        `Movie added to watchlist! Predicted Rating: ${predictedRating} (Using: ${approachUsed})`
      );
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

  // Get # Friends Watched and their Avg Rating for a given movie
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

  // Get detailed friend watchers info for the modal
  const getFriendWatchersForMovie = (movieId) => {
    const acceptedFriendIds = getAcceptedFriendUserIds(currentUserId, allFriends);
    const friendWatchers = userMovies.filter(
      (um) =>
        um.movieId === movieId &&
        um.status === "watched" &&
        acceptedFriendIds.has(um.userId)
    );
    return friendWatchers.map((fw) => {
      const friendUser = users.find((u) => u.id === fw.userId);
      return {
        id: friendUser?.id || "Unknown",
        username: friendUser?.username || "Unknown",
        rating: fw.rating || "Not Rated",
        image: friendUser?.image || "/default-profile.png",
      };
    });
  };

  // Handler to open the friend watchers modal
  const handleFriendsWatchedClick = (movieId) => {
    const watchers = getFriendWatchersForMovie(movieId);
    setFriendWatchersList(watchers);
    setShowModal(true);
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
          <div className="rate-movie-container">
            {movie.posterUrl ? (
              <img
                src={movie.posterUrl}
                alt={movie.title}
                className="movie-poster"
              />
            ) : (
              <div className="no-image">No Image Available</div>
            )}

            <div className="movie-info">
              <h2>{movie.title || "Untitled Movie"}</h2>

              {/* Friends Watched & Avg Rating Section */}
              <p>
                <strong># Friends Watched:</strong>{" "}
                {getFriendWatchStats(movie.id).numFriendsWatched}{" "}
                {getFriendWatchStats(movie.id).numFriendsWatched > 0 &&
                  getFriendWatchStats(movie.id).avgRating !== null && (
                    <span>
                      (Avg Rating: {getFriendWatchStats(movie.id).avgRating})
                    </span>
                  )}
                {/*
                  Optionally, add a button or clickable area to open the modal:
                */}
                {getFriendWatchStats(movie.id).numFriendsWatched > 0 && (
                  <button
                    onClick={() => handleFriendsWatchedClick(movie.id)}
                    style={{
                      marginLeft: "10px",
                      padding: "4px 8px",
                      fontSize: "0.9rem",
                      cursor: "pointer",
                    }}
                  >
                    View Friends
                  </button>
                )}
              </p>

              <p>
                <strong>Description:</strong>{" "}
                {movie.description || "No description available."}
              </p>
              <p>
                <strong>Release Date:</strong> {movie.releaseDate || "Unknown"}
              </p>
              <p>
                <strong>Genres:</strong>{" "}
                {movie.genres?.join(", ") || "N/A"}
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

      {/* Friend Watchers Modal */}
      {showModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowModal(false)}
        >
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <h2>FRIENDS RATINGS</h2>
            {friendWatchersList.length ? (
              <ul>
                {friendWatchersList.map((fw, idx) => (
                  <li className="search-user-item" key={idx}>
                    <img
                      src={fw.image}
                      alt={fw.username}
                      className="friend-profile-pic"
                    />
                    <Link to={`/users/${fw.id}`}>{fw.username}</Link>{" "}
                    Rating: {fw.rating}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No friends found.</p>
            )}
            <button onClick={() => setShowModal(false)}>CLOSE</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RateMovie;
