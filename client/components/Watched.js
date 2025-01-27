// import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchUserMovies } from "../store/allUserMoviesStore";
// import { updateSingleUserMovie } from "../store/singleUserMovieStore";
// import { fetchMovies } from "../store/allMoviesStore";
// import { fetchUsers } from "../store/allUsersStore";
// import { createUserRecommendation } from "../store/allUserRecommendationsStore";

// const Watched = () => {
//   const dispatch = useDispatch();
//   const [selectedWatchedWithMovieId, setSelectedWatchedWithMovieId] = useState(null);
//   const [selectedActionMovieId, setSelectedActionMovieId] = useState(null);
//   const [selectedRecommendationMovieId, setSelectedRecommendationMovieId] = useState(null);
//   const [selectedUserId, setSelectedUserId] = useState(null);
//   const [message, setMessage] = useState("");
//   const [rating, setRating] = useState("");
//   const [sortCriteria, setSortCriteria] = useState("None");

//   const currentUserId = useSelector((state) => state.auth.id);
//   const userMovies = useSelector((state) => state.allUserMovies).filter(
//     (userMovie) => userMovie.userId === currentUserId && userMovie.status == 'watched'
//   );
//   const movies = useSelector((state) => state.allMovies);
//   const users = useSelector((state) => state.allUsers);

//   useEffect(() => {
//     dispatch(fetchUserMovies());
//     dispatch(fetchUsers());
//     dispatch(fetchMovies());
//   }, [dispatch]);

//   // Refresh after updates
//   const refreshMovies = () => {
//     dispatch(fetchUserMovies());
//   };

//   // Merge userMovies with movie details
//   const watchedMovies = userMovies.map((userMovie) => ({
//     ...userMovie,
//     ...movies.find((movie) => movie.id === userMovie.movieId),
//   }));

//   // Apply sorting based on the selected criteria
//   const sortedMovies = [...watchedMovies].sort((a, b) => {
//     if (sortCriteria === "Date Watched") {
//       return new Date(b.dateWatched) - new Date(a.dateWatched); // Most recent first
//     } else if (sortCriteria === "Rating") {
//       return (b.rating || 0) - (a.rating || 0); // Highest rating first
//     }
//     return 0; // Default order
//   });

//   const handleWatchedWithSubmit = async (movieId) => {
//     try {
//       await dispatch(
//         updateSingleUserMovie({
//           userId: currentUserId,
//           movieId,
//           watchedWith: selectedUserId || null,
//         })
//       );
//       setSelectedWatchedWithMovieId(null);
//       setSelectedUserId(null);
//       refreshMovies();
//     } catch (err) {
//       console.error("Error updating Watched With:", err);
//     }
//   };

//   const handleRatingSubmit = async (movieId) => {
//     if (!rating || rating < 1 || rating > 10) {
//       alert("Please provide a rating between 1 and 10.");
//       return;
//     }
//     try {
//       await dispatch(updateSingleUserMovie({ userId: currentUserId, movieId, rating }));
//       setSelectedActionMovieId(null);
//       setRating("");
//       refreshMovies();
//     } catch (err) {
//       console.error("Error submitting rating:", err);
//     }
//   };

//   const handleRecommendationSubmit = async () => {
//     try {
//       if (!selectedRecommendationMovieId || !selectedUserId) {
//         alert("Please select a user to recommend the movie to.");
//         return;
//       }

//       await dispatch(
//         createUserRecommendation({
//           senderId: currentUserId,
//           receiverId: selectedUserId,
//           movieId: selectedRecommendationMovieId,
//           message: message || "",
//         })
//       );

//       alert("Recommendation sent!");
//       setSelectedRecommendationMovieId(null);
//       setMessage("");
//     } catch (err) {
//       console.error("Error creating recommendation:", err);
//       alert("Could not create the recommendation. It may already exist.");
//     }
//   };

//   if (!userMovies.length) {
//     return (
//       <div className="watched-movies-container">
//         <h2>Your Watched Movies</h2>
//         <p>No watched movies to display!</p>
//       </div>
//     );
//   }

//   return (
//     <div className="watched-movies-container">
//       <h2>Your Watched Movies</h2>

//       {/* Sorting Dropdown */}
//       <div className="sort-dropdown">
//         <label htmlFor="sort">Sort By: </label>
//         <select
//           id="sort"
//           value={sortCriteria}
//           onChange={(e) => setSortCriteria(e.target.value)}
//         >
//           <option value="None">None</option>
//           <option value="Date Watched">Date Watched</option>
//           <option value="Rating">Rating</option>
//         </select>
//       </div>

//       {/* Movies Table */}
//       <table className="watched-movies-table">
//         <thead>
//           <tr>
//             <th>Movie</th>
//             <th>Watched With</th>
//             <th>Update Watched With</th>
//             <th>Recommend</th>
//             <th>Rating</th>
//             <th>Actions</th>
//             <th>Date Watched</th>
//           </tr>
//         </thead>
//         <tbody>
//           {sortedMovies.map((movie) => (
//             <tr key={movie.movieId}>
//               <td>
//                 <Link to={`/movies/${movie.id}`}>
//                   {movie.posterUrl && (
//                     <img
//                       src={movie.posterUrl}
//                       alt={movie.title}
//                       className="movie-poster"
//                     />
//                   )}
//                   <div>{movie.title || "Untitled Movie"}</div>
//                 </Link>
//               </td>
//               <td>
//                 {users.find((user) => user.id === movie.watchedWith)?.username || ""}
//               </td>
//               <td>
//                 {selectedWatchedWithMovieId === movie.id ? (
//                   <>
//                     <select
//                       value={selectedUserId || ""}
//                       onChange={(e) =>
//                         setSelectedUserId(e.target.value === "" ? null : Number(e.target.value))
//                       }
//                     >
//                       <option value="">No One</option>
//                       {users
//                         .filter((user) => user.id !== currentUserId)
//                         .map((user) => (
//                           <option key={user.id} value={user.id}>
//                             {user.username}
//                           </option>
//                         ))}
//                     </select>
//                     <button onClick={() => handleWatchedWithSubmit(movie.id)}>Submit</button>
//                   </>
//                 ) : (
//                   <button onClick={() => setSelectedWatchedWithMovieId(movie.id)}>Update</button>
//                 )}
//               </td>
//               <td>
//   {selectedRecommendationMovieId === movie.id ? (
//     <div className="recommendation-form">
//       <select
//         value={selectedUserId || ""}
//         onChange={(e) =>
//           setSelectedUserId(e.target.value === "" ? null : Number(e.target.value))
//         }
//       >
//         <option value="">Select a user</option>
//         {users
//           .filter((user) => user.id !== currentUserId)
//           .map((user) => (
//             <option key={user.id} value={user.id}>
//               {user.username}
//             </option>
//           ))}
//       </select>

//       <input
//         type="text"
//         placeholder="Enter a message..."
//         value={message}
//         onChange={(e) => setMessage(e.target.value)}
//       />

//       <button onClick={handleRecommendationSubmit}>
//         Submit
//       </button>
//       <button onClick={() => setSelectedRecommendationMovieId(null)}>
//         Cancel
//       </button>
//     </div>
//   ) : (
//     // If we're NOT editing a recommendation, just show the button
//     <button onClick={() => setSelectedRecommendationMovieId(movie.id)}>
//       Recommend
//     </button>
//   )}
// </td>
//               <td>{movie.rating || "Not Rated"}</td>
//               <td>
//                 {selectedActionMovieId === movie.id ? (
//                   <>
//                     <input
//                       type="number"
//                       min="1"
//                       max="10"
//                       value={rating}
//                       onChange={(e) => setRating(e.target.value)}
//                       className="rating-input"
//                     />
//                     <button onClick={() => handleRatingSubmit(movie.id)}>Submit</button>
//                     <button onClick={() => setSelectedActionMovieId(null)}>Cancel</button>
//                   </>
//                 ) : (
//                   <button onClick={() => setSelectedActionMovieId(movie.id)}>Change</button>
//                 )}
//               </td>
//               <td>{movie.dateWatched || "No Date"}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default Watched;

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { fetchUserMovies } from "../store/allUserMoviesStore";
import { updateSingleUserMovie } from "../store/singleUserMovieStore";
import { fetchMovies } from "../store/allMoviesStore";
import { fetchUsers } from "../store/allUsersStore";
import { fetchFriends } from "../store/allFriendsStore"; // import your friend thunk
import { createUserRecommendation } from "../store/allUserRecommendationsStore";

// Utility: Returns a Set of userIds who are accepted friends of currentUser
function getAcceptedFriendUserIds(currentUserId, allFriends) {
  const friendSet = new Set();

  allFriends
    .filter((f) => f.status === "accepted") // only accepted
    .forEach((f) => {
      // If I'm the user, the friend is friendId
      if (f.userId === currentUserId) {
        friendSet.add(f.friendId);
      }
      // If I'm the friend, the user is userId
      else if (f.friendId === currentUserId) {
        friendSet.add(f.userId);
      }
    });

  return friendSet; // e.g. { 2, 3, 5 } are your accepted friends' userIds
}

const Watched = () => {
  const dispatch = useDispatch();

  // State for controlling rating changes, recommendations, etc.
  const [selectedWatchedWithMovieId, setSelectedWatchedWithMovieId] = useState(null);
  const [selectedActionMovieId, setSelectedActionMovieId] = useState(null);
  const [selectedRecommendationMovieId, setSelectedRecommendationMovieId] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState("");
  const [sortCriteria, setSortCriteria] = useState("None");

  const currentUserId = useSelector((state) => state.auth.id);
  const userMovies = useSelector((state) => state.allUserMovies);
  const movies = useSelector((state) => state.allMovies);
  const users = useSelector((state) => state.allUsers);

  // All friend records (both directions)
  const allFriends = useSelector((state) => state.allFriends);

  useEffect(() => {
    dispatch(fetchUserMovies());
    dispatch(fetchUsers());
    dispatch(fetchMovies());
    dispatch(fetchFriends()); // Make sure to load friend relationships
  }, [dispatch]);

  // 1) Build a Set of accepted friend IDs
  const acceptedFriendIds = getAcceptedFriendUserIds(currentUserId, allFriends);

  // 2) Filter userMovies to only "watched" for the current user
  const currentUserWatched = userMovies.filter(
    (um) => um.userId === currentUserId && um.status === "watched"
  );

  // 3) Merge userMovies with movie details
  const watchedMovies = currentUserWatched.map((userMovie) => ({
    ...userMovie,
    ...movies.find((m) => m.id === userMovie.movieId),
  }));

  // 4) Sorting
  const sortedMovies = [...watchedMovies].sort((a, b) => {
    if (sortCriteria === "Date Watched") {
      return new Date(b.dateWatched) - new Date(a.dateWatched); // Most recent first
    } else if (sortCriteria === "Rating") {
      return (b.rating || 0) - (a.rating || 0); // Highest rating first
    }
    return 0;
  });

  // Refresh
  const refreshMovies = () => {
    dispatch(fetchUserMovies());
  };

  // 5) "Friends Who Watched" logic
  // Return watchers (status=watched) among your accepted friends
  const getFriendWatchersForMovie = (movieId) => {
    const watchers = userMovies.filter(
      (um) => um.movieId === movieId && um.status === "watched"
    );
    // Among watchers, keep only those in acceptedFriendIds
    const friendWatchers = watchers.filter((w) => acceptedFriendIds.has(w.userId));

    // Return array of { username, rating }
    return friendWatchers.map((fw) => {
      const friendUser = users.find((u) => u.id === fw.userId);
      return {
        username: friendUser?.username || "Unknown",
        rating: fw.rating || "Not Rated",
      };
    });
  };

  // 6) Count how many friends have watched
  const getFriendWatchersCount = (movieId) => {
    return getFriendWatchersForMovie(movieId).length;
  };

  // 7) "Watched With" Submit
  const handleWatchedWithSubmit = async (movieId) => {
    try {
      await dispatch(
        updateSingleUserMovie({
          userId: currentUserId,
          movieId,
          watchedWith: selectedUserId || null,
        })
      );
      setSelectedWatchedWithMovieId(null);
      setSelectedUserId(null);
      refreshMovies();
    } catch (err) {
      console.error("Error updating Watched With:", err);
    }
  };

  // 8) Rating Submit
  const handleRatingSubmit = async (movieId) => {
    if (!rating || rating < 1 || rating > 10) {
      alert("Please provide a rating between 1 and 10.");
      return;
    }
    try {
      await dispatch(updateSingleUserMovie({ userId: currentUserId, movieId, rating }));
      setSelectedActionMovieId(null);
      setRating("");
      refreshMovies();
    } catch (err) {
      console.error("Error submitting rating:", err);
    }
  };

  // 9) Recommendation Submit
  const handleRecommendationSubmit = async () => {
    try {
      if (!selectedRecommendationMovieId || !selectedUserId) {
        alert("Please select a user to recommend the movie to.");
        return;
      }

      await dispatch(
        createUserRecommendation({
          senderId: currentUserId,
          receiverId: selectedUserId,
          movieId: selectedRecommendationMovieId,
          message: message || "",
        })
      );

      alert("Recommendation sent!");
      setSelectedRecommendationMovieId(null);
      setMessage("");
    } catch (err) {
      console.error("Error creating recommendation:", err);
      alert("Could not create the recommendation. It may already exist.");
    }
  };

  // 10) If no watched movies
  if (!currentUserWatched.length) {
    return (
      <div className="watched-movies-container">
        <h2>Your Watched Movies</h2>
        <p>No watched movies to display!</p>
      </div>
    );
  }

  return (
    <div className="watched-movies-container">
      <h2>Your Watched Movies</h2>

      {/* Sorting Dropdown */}
      <div className="sort-dropdown">
        <label htmlFor="sort">Sort By: </label>
        <select
          id="sort"
          value={sortCriteria}
          onChange={(e) => setSortCriteria(e.target.value)}
        >
          <option value="None">None</option>
          <option value="Date Watched">Date Watched</option>
          <option value="Rating">Rating</option>
        </select>
      </div>

      {/* Movies Table */}
      <table className="watched-movies-table">
        <thead>
          <tr>
            <th>Movie</th>
            <th>Watched With</th>
            <th>Update Watched With</th>
            <th># Friends Watched</th>
            <th>Recommend</th>
            <th>Rating</th>
            <th>Actions</th>
            <th>Date Watched</th>
          </tr>
        </thead>
        <tbody>
          {sortedMovies.map((movie) => {
            const friendWatchersCount = getFriendWatchersCount(movie.movieId);

            return (
              <tr key={movie.movieId}>
                <td>
                  <Link to={`/movies/${movie.id}`}>
                    {movie.posterUrl && (
                      <img
                        src={movie.posterUrl}
                        alt={movie.title}
                        className="movie-poster"
                      />
                    )}
                    <div>{movie.title || "Untitled Movie"}</div>
                  </Link>
                </td>

                <td>
                  {users.find((user) => user.id === movie.watchedWith)?.username || ""}
                </td>

                <td>
                  {selectedWatchedWithMovieId === movie.id ? (
                    <>
                      <select
                        value={selectedUserId || ""}
                        onChange={(e) =>
                          setSelectedUserId(e.target.value === "" ? null : Number(e.target.value))
                        }
                      >
                        <option value="">No One</option>
                        {/* Maybe you only want to show accepted friends here too? */}
                        {users
                          .filter((u) => acceptedFriendIds.has(u.id))
                          .map((u) => (
                            <option key={u.id} value={u.id}>
                              {u.username}
                            </option>
                          ))}
                      </select>
                      <button onClick={() => handleWatchedWithSubmit(movie.id)}>Submit</button>
                    </>
                  ) : (
                    <button onClick={() => setSelectedWatchedWithMovieId(movie.id)}>
                      Update
                    </button>
                  )}
                </td>

                {/* # Friends Watched (dummy clickable or a modal if you like) */}
                <td>{friendWatchersCount}</td>

                <td>
                  {selectedRecommendationMovieId === movie.id ? (
                    <div className="recommendation-form">
                      <select
                        value={selectedUserId || ""}
                        onChange={(e) =>
                          setSelectedUserId(e.target.value === "" ? null : Number(e.target.value))
                        }
                      >
                        <option value="">Select a user</option>
                        {users
                          // Only show ACCEPTED friends
                          .filter((u) => acceptedFriendIds.has(u.id))
                          // Exclude watchers
                          .filter(
                            (u) =>
                              !userMovies.some(
                                (um) =>
                                  um.userId === u.id &&
                                  um.movieId === movie.movieId &&
                                  um.status === "watched"
                              )
                          )
                          .map((u) => (
                            <option key={u.id} value={u.id}>
                              {u.username}
                            </option>
                          ))}
                      </select>

                      <input
                        type="text"
                        placeholder="Enter a message..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                      />

                      <button onClick={handleRecommendationSubmit}>Submit</button>
                      <button onClick={() => setSelectedRecommendationMovieId(null)}>Cancel</button>
                    </div>
                  ) : (
                    <button onClick={() => setSelectedRecommendationMovieId(movie.id)}>
                      Recommend
                    </button>
                  )}
                </td>

                <td>{movie.rating || "Not Rated"}</td>
                <td>
                  {selectedActionMovieId === movie.id ? (
                    <>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={rating}
                        onChange={(e) => setRating(e.target.value)}
                        className="rating-input"
                      />
                      <button onClick={() => handleRatingSubmit(movie.id)}>Submit</button>
                      <button onClick={() => setSelectedActionMovieId(null)}>Cancel</button>
                    </>
                  ) : (
                    <button onClick={() => setSelectedActionMovieId(movie.id)}>Change</button>
                  )}
                </td>
                <td>{movie.dateWatched || "No Date"}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Watched;
