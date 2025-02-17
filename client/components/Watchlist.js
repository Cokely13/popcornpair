import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserMovies } from "../store/allUserMoviesStore";
import { updateSingleUserMovie } from "../store/singleUserMovieStore";
import { fetchMovies } from "../store/allMoviesStore";
import { fetchFriends } from "../store/allFriendsStore";
import { fetchUsers } from "../store/allUsersStore";
import { Link } from "react-router-dom";


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


const Watchlist = () => {
  const dispatch = useDispatch();
  const currentUserId = useSelector((state) => state.auth.id);
  const [selectedMovieId, setSelectedMovieId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
   const [rating, setRating] = useState("");
   const [friendWatchersList, setFriendWatchersList] = useState([]);
  // Grab all userMovie entries and filter to just this user
  // const userMovies = useSelector((state) => state.allUserMovies).filter(
  //   (userMovie) => userMovie.userId === currentUserId
  // );
  const userMovies = useSelector((state) => state.allUserMovies);

  // Grab all movies (to merge movie details)
  const movies = useSelector((state) => state.allMovies);
  const allFriends = useSelector((state) => state.allFriends);
  const users = useSelector((state) => state.allUsers);
  const [sortCriteria, setSortCriteria] = useState("None");

  useEffect(() => {
    dispatch(fetchUserMovies());
    dispatch(fetchMovies());
    dispatch(fetchFriends())
    dispatch(fetchUsers())
  }, [dispatch]);

  const acceptedFriendIds = getAcceptedFriendUserIds(currentUserId, allFriends);

  const getFriendWatchStats = (movieId) => {
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

  // Open modal for a specific movie
  const handleFriendsWatchedClick = (movieId) => {
    const watchers = getFriendWatchersForMovie(movieId);
    setFriendWatchersList(watchers);
    setShowModal(true);
  };

  // 1. Filter down to only those with status === "watchlist"
  const watchlistMovies = userMovies
  .filter((um) => um.status === "watchlist" && um.userId === currentUserId)
    .map((userMovie) => {
      const movie = movies.find((m) => m.id === userMovie.movieId) || {};
      return {
        ...userMovie,
        ...movie,
        predictedRating: userMovie.predictedRating || "N/A",
      };
    });

  // 2. Sort based on sortCriteria
  const sortedMovies = [...watchlistMovies].sort((a, b) => {
    if (sortCriteria === "Title") {
      return a.title.localeCompare(b.title);
    }
    if (sortCriteria === "Predicted Rating") {
      // Convert to number (in case "N/A"), or default to 0
      const ratingA = isNaN(a.predictedRating) ? 0 : +a.predictedRating;
      const ratingB = isNaN(b.predictedRating) ? 0 : +b.predictedRating;
      return ratingB - ratingA; // descending
    }
    return 0; // Default: no sorting
  });

  // 3. Remove from watchlist (Set status to "none" or delete the record)
  const handleRemoveFromWatchlist = async (movieId) => {
    try {
      // If you only have "watchlist" or "watched" in your enum,
      // you might either delete the record or set it to "watched".
      // If your enum has "none", you can do status: "none".
      await dispatch(
        updateSingleUserMovie({
          userId: currentUserId,
          movieId,
          status: "none", // or "watched" or some other approach
        })
      );
      dispatch(fetchUserMovies());
    } catch (err) {
      console.error("Error removing from watchlist:", err);
    }
  };



  const handleMarkAsWatched = (movieId) => {
    setSelectedMovieId(movieId);
    setShowRatingModal(true); // Open the rating modal
  };

  // 8) Submit rating or skip
  const handleSubmitRating = async (skip = false) => {
    try {
      if (!selectedMovieId) return;

      const userMovie = userMovies.find(
              (um) => um.movieId === selectedMovieId && um.userId === currentUserId
            );


        await dispatch(
          updateSingleUserMovie({
            userId: userMovie.userId,
            movieId: userMovie.movieId,
            status: "watched",
            rating: skip ? null : Number(rating), // Only set rating if user selected
          })
        )
        setShowRatingModal(false);
        setRating("");
        setSelectedMovieId(null);
          dispatch(fetchUserMovies());
          if (!skip && rating) {
            alert(`Movie marked as watched with a rating of ${rating}!`);
          } else {
            alert("Movie marked as watched!");
          }
        } catch (err) {
          console.error("Error submitting rating:", err);
        }
      };





  if (!watchlistMovies.length) {
    return (
      <div className="watchlist-container">
        <section className="hero-section">
        <h1>WATCHLIST</h1>
        </section>
        <p>No movies on your watchlist! Check out some of your rejected movies.</p>
        <Link to={`/rejected`} className="friend-link">
                <button className="reject-button">SECOND CHANCE</button>
              </Link>

      </div>
    );
  }

  return (
    <div className="watchlist-container">
      <section className="hero-section">
      <h1>WATCHLIST</h1>
      </section>
      {/* Sort Dropdown */}
      <div className="sort-dropdown">
        <label htmlFor="sort">Sort By: </label>
        <select
          id="sort"
          value={sortCriteria}
          onChange={(e) => setSortCriteria(e.target.value)}
        >
          <option value="None">None</option>
          <option value="Title">Title</option>
          <option value="Predicted Rating">Predicted Rating</option>
        </select>
      </div>

      {/* Watchlist Movies */}
      <div className="watchlist-movies">
      {sortedMovies.map((movie) => {
  const { numFriendsWatched, avgRating } = getFriendWatchStats(movie.movieId); // ✅ CALL THE FUNCTION HERE

  return (
    <div key={movie.movieId} className="watchlist-movie-item">
      <Link to={`/movies/${movie.id}`}>
        {movie.posterUrl ? (
          <img src={movie.posterUrl} alt={movie.title} className="movie-poster" />
        ) : (
          <div className="no-poster">No Image Available</div>
        )}
        <h3>{movie.title || "Untitled Movie"}</h3>
      </Link>
      <p>
        <strong>Predicted Rating:</strong> {movie.predictedRating}
      </p>
      <p>
        <strong># Friends Watched:</strong> {numFriendsWatched}{" "}
        {numFriendsWatched > 0 && avgRating !== null && (
          <span>(Avg Rating: {avgRating})</span>
        )}
        {numFriendsWatched > 0 && (
          <button
            onClick={() => handleFriendsWatchedClick(movie.movieId)}
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
      <div className="watchlist-actions">
        <button onClick={() => handleMarkAsWatched(movie.movieId)}>WATCHED</button>
        <button onClick={() => handleRemoveFromWatchlist(movie.movieId)}>REMOVE</button>
      </div>
    </div>
  );
})}
</div>
      {showRatingModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Rate the Movie</h2>
            <p>Would you like to give this movie a rating now?</p>
            <select
              value={rating}
              onChange={(e) => setRating(e.target.value)}
            >
              <option value="">Select a rating</option>
              {[...Array(10)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>
            <div className="modal-buttons">
              <button
                onClick={() => handleSubmitRating(false)}
                disabled={!rating} // Must pick rating to submit
              >
                Submit Rating
              </button>
              <button onClick={() => handleSubmitRating(true)}>Skip</button>
              <button
                onClick={() => {
                  setShowRatingModal(false);
                  setSelectedMovieId(null);
                  setRating("");
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
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
      <Link to={`/rejected`} className="friend-link">
                <button className="reject-button">SECOND CHANCE</button>
              </Link>

    </div>
  );
};

export default Watchlist;
