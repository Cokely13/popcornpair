// import React, { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useParams } from "react-router-dom";
// import { fetchMovies } from "../store/allMoviesStore";

// const MovieDetail = () => {
//   const { movieId } = useParams();
//   const dispatch = useDispatch();

//   const movie = useSelector((state) =>
//     state.allMovies.find((movie) => movie.id === parseInt(movieId))
//   );

//   useEffect(() => {
//     dispatch(fetchMovies());
//   }, [dispatch]);

//   if (!movie) {
//     return <div>Loading movie details...</div>;
//   }

//   return (
//     <div className="rate-movie-container">
//       {/* Movie Poster */}
//       {movie.posterUrl ? (
//         <img
//           src={movie.posterUrl}
//           alt={movie.title}
//           className="movie-poster"
//         />
//       ) : (
//         <div className="no-image">No Image Available</div>
//       )}

//       {/* Movie Information */}
//       <div className="movie-info">
//         <h2>{movie.title || "Untitled Movie"}</h2>
//         <p><strong>Description:</strong> {movie.description || "No description available."}</p>
//         <p><strong>Release Date:</strong> {movie.releaseDate || "Unknown"}</p>
//         <p><strong>Genres:</strong> {movie.genres?.join(", ") || "N/A"}</p>
//         <p><strong>Rating:</strong> {movie.userRating || "Not Rated"}</p>
//         <p><strong>Runtime:</strong> {movie.runtimeMinutes ? `${movie.runtimeMinutes} minutes` : "N/A"}</p>
//       </div>
//     </div>
//   );
// };

// export default MovieDetail;

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import { fetchMovies } from "../store/allMoviesStore";
import { fetchUserMovies } from "../store/allUserMoviesStore";
import { fetchFriends } from "../store/allFriendsStore";
import { fetchUsers } from "../store/allUsersStore";

// Utility: Get accepted friend user IDs
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

const MovieDetail = () => {
  const { movieId } = useParams();
  const dispatch = useDispatch();

  // Select data from Redux
  const movie = useSelector((state) =>
    state.allMovies.find((m) => m.id === parseInt(movieId))
  );
  const userMovies = useSelector((state) => state.allUserMovies);
  const allFriends = useSelector((state) => state.allFriends);
  const users = useSelector((state) => state.allUsers);
  const currentUserId = useSelector((state) => state.auth.id);

  // Local state for the friend modal
  const [showModal, setShowModal] = useState(false);
  const [friendWatchersList, setFriendWatchersList] = useState([]);

  useEffect(() => {
    dispatch(fetchMovies());
    dispatch(fetchUserMovies());
    dispatch(fetchFriends());
    dispatch(fetchUsers());
  }, [dispatch]);

  if (!movie) {
    return <div>Loading movie details...</div>;
  }

  // Compute accepted friend IDs
  const acceptedFriendIds = getAcceptedFriendUserIds(currentUserId, allFriends);

  // Compute friend watch stats for this movie
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

  const { numFriendsWatched, avgRating } = getFriendWatchStats(movie.id);

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

  // When the "friends watched" button is clicked
  const handleFriendsWatchedClick = () => {
    const watchers = getFriendWatchersForMovie(movie.id);
    setFriendWatchersList(watchers);
    setShowModal(true);
  };

  return (
    <div className="rate-movie-container">
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
          <strong>Genres:</strong>{" "}
          {movie.genres?.join(", ") || "N/A"}
        </p>
        <p>
          <strong>Rating:</strong> {movie.userRating || "Not Rated"}
        </p>
        <p>
          <strong>Runtime:</strong>{" "}
          {movie.runtimeMinutes ? `${movie.runtimeMinutes} minutes` : "N/A"}
        </p>
        <p>
          <strong># Friends Watched:</strong>{" "}
          <button onClick={handleFriendsWatchedClick}>
            {numFriendsWatched}
          </button>
          {numFriendsWatched > 0 && avgRating !== null && (
            <span> (Avg Rating: {avgRating})</span>
          )}
        </p>
      </div>

      {/* Friends Modal */}
      {showModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowModal(false)} // Clicking outside closes the modal
        >
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
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
                    <Link to={`/users/${fw.id}`}>{fw.username}</Link> Rating:{" "}
                    {fw.rating}
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

export default MovieDetail;
