// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchMovies } from "../store/allMoviesStore";
// import { createUserMovie } from "../store/allUserMoviesStore";
// import { fetchUserMovies } from "../store/allUserMoviesStore";
// import { fetchSingleUser } from "../store/singleUserStore";
// import { updateSingleUserMovie } from "../store/singleUserMovieStore";

// const Match = () => {
//   const { userId } = useParams(); // Friend's ID
//   const dispatch = useDispatch();
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [selectedGenre, setSelectedGenre] = useState("All");
//   const [selectedMovieId, setSelectedMovieId] = useState(null);
//   const [showRatingModal, setShowRatingModal] = useState(false);
//   const [rating, setRating] = useState("");
//   const currentUserId = useSelector((state) => state.auth.id);
//   const movies = useSelector((state) => state.allMovies) || [];
//   const userMovies = useSelector((state) => state.allUserMovies) || [];
//   const friend = useSelector((state) => state.singleUser) || [];

//   useEffect(() => {
//     dispatch(fetchMovies());
//     dispatch(fetchUserMovies());
//     dispatch(fetchSingleUser(userId)); // Ensure user data is fetched
//   }, [dispatch]);



//   const currentUserWatchlist = userMovies
//   .filter(
//     (um) =>
//       um.userId === currentUserId &&
//       um.status === "watchlist"
//   )
//   .map((um) => um.movieId);

// // 2. Get watchlist entries for the friend
// const friendWatchlist = userMovies
//   .filter(
//     (um) =>
//       um.userId === parseInt(userId) &&
//       um.status === "watchlist"
//   )
//   .map((um) => um.movieId);

//   const sharedMovieIds = currentUserWatchlist.filter((movieId) =>
//     friendWatchlist.includes(movieId)
//   );

// // 3. Intersection: Movies in *both* watchlists
// const sharedMovies = movies.filter((m) => sharedMovieIds.includes(m.id));

//   // 5. Filter by genre if needed
//   const matchedMovies = sharedMovies.filter((movie) =>
//     selectedGenre === "All" || movie.genres?.includes(selectedGenre)
//   );

//   const genres = [
//     "All",
//     ...new Set(movies.flatMap((movie) => movie.genres || [])),
//   ];

//   // Display message if there are no matches
//   if (!matchedMovies.length) {
//     return (
//       <div className="no-matches-container">
//         <h2>Matches with {friend?.username || "User"}</h2>
//         {/* Genre Filter */}
//         <div className="genre-filter">
//           <label htmlFor="genre">Filter by Genre: </label>
//           <select
//             id="genre"
//             value={selectedGenre}
//             onChange={(e) => {
//               setSelectedGenre(e.target.value);
//               setCurrentIndex(0); // Reset index when filter changes
//             }}
//           >
//             {genres.map((genre) => (
//               <option key={genre} value={genre}>
//                 {genre}
//               </option>
//             ))}
//           </select>
//         </div>
//         <div className="no-matches-message">
//           Sorry, you have no matches yet!
//         </div>
//       </div>
//     );
//   }

//   const movie = matchedMovies[currentIndex];

//   const handleNext = () => {
//     if (currentIndex < matchedMovies.length - 1) {
//       setCurrentIndex(currentIndex + 1);
//     } else {
//       alert("No more movies to show!");
//       setCurrentIndex(0); // Reset to the first movie
//     }
//   };

//   // const handleWatch = async () => {
//   //   try {
//   //     // Create UserMovie for the current user
//   //     await dispatch(
//   //       createUserMovie({
//   //         userId: currentUserId,
//   //         movieId: movie.id,
//   //         watched: true,
//   //         watchedWith: userId,
//   //       })
//   //     );

//   //     // Create UserMovie for the friend
//   //     await dispatch(
//   //       createUserMovie({
//   //         userId: parseInt(userId),
//   //         movieId: movie.id,
//   //         watched: true,
//   //         watchedWith: currentUserId,
//   //       })
//   //     );

//   //     alert("Movie marked as watched!");
//   //   } catch (err) {
//   //     console.error("Error creating UserMovie:", err);
//   //   }
//   // };

//   // const handleWatch = async (movieId) => {

//   //   try {
//   //     const userMovie = userMovies.find(
//   //       (um) => um.movieId === movieId && um.userId === currentUserId
//   //     );

//   //     await dispatch(
//   //       updateSingleUserMovie({
//   //         userId: currentUserId,
//   //         movieId: userMovie.movieId,
//   //         status: "watched",
//   //         watchedWith: userId
//   //       })
//   //     );

//   //     await dispatch(
//   //       updateSingleUserMovie({
//   //         userId: userId,
//   //         movieId: userMovie.movieId,
//   //         status: "watched",
//   //         watchedWith: currentUserId
//   //       })
//   //     );
//   //     dispatch(fetchUserMovies());
//   //   } catch (err) {
//   //     console.error("Error marking as watched:", err);
//   //   }
//   // };

//   const handleMarkAsWatched = (movieId) => {
//     setSelectedMovieId(movieId);
//     setShowRatingModal(true); // Open the rating modal
//   };

//   // 8) Submit rating or skip
//   const handleSubmitRating = async (skip = false) => {
//     try {
//       if (!selectedMovieId) return;

//       // Check if there's already a userMovie record
//       const userMovie = userMovies.find(
//         (um) => um.movieId === selectedMovieId && um.userId === currentUserId
//       );


//         await dispatch(
//           updateSingleUserMovie({
//             userId: currentUserId,
//             movieId: userMovie.movieId,
//             status: "watched",
//             rating: skip ? null : Number(rating), // Only set rating if user selected
//             watchedWith: userId
//           })
//         );

//         await dispatch(
//                 updateSingleUserMovie({
//                   userId: userId,
//                   movieId: userMovie.movieId,
//                   status: "watched",
//                   watchedWith: currentUserId
//                 })
//               );



//       // Cleanup
//       setShowRatingModal(false);
//       setRating("");
//       setSelectedMovieId(null);

//       // Refresh user movies
//       dispatch(fetchUserMovies());

//       if (!skip && rating) {
//         alert(`Movie marked as watched with a rating of ${rating}!`);
//       } else {
//         alert("Movie marked as watched!");
//       }
//     } catch (err) {
//       console.error("Error submitting rating:", err);
//     }
//   };

//   return (
//     <div className="rate-movie-container">
//       <h2>Matches with {friend?.username || "User"}</h2>

//       {/* Genre Filter */}
//       <div className="genre-filter">
//         <label htmlFor="genre">Filter by Genre: </label>
//         <select
//           id="genre"
//           value={selectedGenre}
//           onChange={(e) => {
//             setSelectedGenre(e.target.value);
//             setCurrentIndex(0); // Reset index when filter changes
//           }}
//         >
//           {genres.map((genre) => (
//             <option key={genre} value={genre}>
//               {genre}
//             </option>
//           ))}
//         </select>
//       </div>

//       {/* Movie Poster */}
//       {movie.posterUrl ? (
//         <img src={movie.posterUrl} alt={movie.title} className="movie-poster" />
//       ) : (
//         <div className="no-image">No Image Available</div>
//       )}

//       {/* Movie Information */}
//       <div className="movie-info">
//         <h2>{movie.title || "Untitled Movie"}</h2>
//         <p><strong>Description:</strong> {movie.description || "No description available."}</p>
//         <p><strong>Release Date:</strong> {movie.releaseDate || "Unknown"}</p>
//         <p><strong>Genres:</strong> {movie.genres?.join(", ") || "N/A"}</p>
//       </div>

//       {/* Buttons */}
//       <div className="button-container">
//         <button className="watch-button" onClick={() => handleMarkAsWatched(movie.id)}>
//           Watch
//         </button>
//         <button className="next-button" onClick={handleNext}>
//           Next
//         </button>
//       </div>
//       {showRatingModal && (
//     <div className="modal-overlay">
//       <div className="modal-content">
//         <h2>Rate the Movie</h2>
//         <p>Would you like to give this movie a rating now?</p>
//         <select
//           value={rating}
//           onChange={(e) => setRating(e.target.value)}
//         >
//           <option value="">Select a rating</option>
//           {[...Array(10)].map((_, i) => (
//             <option key={i + 1} value={i + 1}>
//               {i + 1}
//             </option>
//           ))}
//         </select>
//         <div className="modal-buttons">
//           <button
//             onClick={() => handleSubmitRating(false)}
//             disabled={!rating} // Must pick rating to submit
//           >
//             Submit Rating
//           </button>
//           <button onClick={() => handleSubmitRating(true)}>Skip</button>
//           <button
//             onClick={() => {
//               setShowRatingModal(false);
//               setSelectedMovieId(null);
//               setRating("");
//             }}
//           >
//             Cancel
//           </button>
//         </div>
//       </div>
//     </div>
//   )}
//     </div>
//   );
// };

// export default Match;

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchMovies } from "../store/allMoviesStore";
import { fetchUserMovies, createUserMovie } from "../store/allUserMoviesStore";
import { fetchSingleUser } from "../store/singleUserStore";
import { updateSingleUserMovie } from "../store/singleUserMovieStore";

const Match = () => {
  const { userId } = useParams(); // Friend's ID
  const dispatch = useDispatch();

  // Local state
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [selectedMovieId, setSelectedMovieId] = useState(null);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [rating, setRating] = useState("");

  const currentUserId = useSelector((state) => state.auth.id);
  const movies = useSelector((state) => state.allMovies) || [];
  const userMovies = useSelector((state) => state.allUserMovies) || [];
  const friend = useSelector((state) => state.singleUser) || {};

  useEffect(() => {
    dispatch(fetchMovies());
    dispatch(fetchUserMovies());
    dispatch(fetchSingleUser(userId));
  }, [dispatch, userId]);

  // 1. Current user's watchlist
  const currentUserWatchlist = userMovies
    .filter(
      (um) =>
        um.userId === currentUserId &&
        um.status === "watchlist" // or "none"? Adjust if needed
    )
    .map((um) => um.movieId);

  // 2. Friend's watchlist
  const friendWatchlist = userMovies
    .filter(
      (um) =>
        um.userId === parseInt(userId) &&
        um.status === "watchlist"
    )
    .map((um) => um.movieId);

  // 3. Intersection: movies in both watchlists
  const sharedMovieIds = currentUserWatchlist.filter((movieId) =>
    friendWatchlist.includes(movieId)
  );

  // 4. Get the actual movie objects
  const sharedMovies = movies.filter((m) => sharedMovieIds.includes(m.id));

  // 5. Filter by genre if needed
  const matchedMovies = sharedMovies.filter((movie) =>
    selectedGenre === "All" || movie.genres?.includes(selectedGenre)
  );

  // 6. Build a list of all possible genres for the dropdown
  const genres = ["All", ...new Set(movies.flatMap((movie) => movie.genres || []))];

  // If matchedMovies is empty, show a message
  if (!matchedMovies.length) {
    return (
      <div className="no-matches-container">
        <h2>Matches with {friend.username || "User"}</h2>
        {/* Genre Filter */}
        <div className="genre-filter">
          <label htmlFor="genre">Filter by Genre: </label>
          <select
            id="genre"
            value={selectedGenre}
            onChange={(e) => {
              setSelectedGenre(e.target.value);
              setCurrentIndex(0);
            }}
          >
            {genres.map((genre) => (
              <option key={genre} value={genre}>
                {genre}
              </option>
            ))}
          </select>
        </div>
        <div className="no-matches-message">Sorry, you have no matches yet!</div>
      </div>
    );
  }

  // Ensure currentIndex is valid
  const safeIndex = Math.min(currentIndex, matchedMovies.length - 1);
  const movie = matchedMovies[safeIndex];

  // Next button
  const handleNext = () => {
    if (safeIndex < matchedMovies.length - 1) {
      setCurrentIndex(safeIndex + 1);
    } else {
      alert("No more movies to show!");
      setCurrentIndex(0);
    }
  };

  // Mark as watched → show rating modal
  const handleMarkAsWatched = (movieId) => {
    setSelectedMovieId(movieId);
    setShowRatingModal(true);
  };

  // Submit rating or skip
  const handleSubmitRating = async (skip = false) => {
    try {
      if (!selectedMovieId) return;

      const userMovie = userMovies.find(
        (um) => um.movieId === selectedMovieId && um.userId === currentUserId
      );

      // 1) Mark the current user as watched
      await dispatch(
        updateSingleUserMovie({
          userId: currentUserId,
          movieId: userMovie.movieId,
          status: "watched",
          rating: skip ? null : Number(rating),
          watchedWith: userId, // They watched with your friend
        })
      );

      // 2) Mark the friend as watched
      await dispatch(
        updateSingleUserMovie({
          userId: parseInt(userId),
          movieId: userMovie.movieId,
          status: "watched",
          watchedWith: currentUserId,
        })
      );

      // Cleanup
      setShowRatingModal(false);
      setRating("");
      setSelectedMovieId(null);

      // Refresh userMovies
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

  return (
    <div className="rate-movie-container">
      <h2>Matches with {friend.username || "User"}</h2>

      {/* Genre Filter */}
      <div className="genre-filter">
        <label htmlFor="genre">Filter by Genre: </label>
        <select
          id="genre"
          value={selectedGenre}
          onChange={(e) => {
            setSelectedGenre(e.target.value);
            setCurrentIndex(0);
          }}
        >
          {genres.map((genre) => (
            <option key={genre} value={genre}>
              {genre}
            </option>
          ))}
        </select>
      </div>

      {/* Movie Poster */}
      {movie.posterUrl ? (
        <img src={movie.posterUrl} alt={movie.title} className="movie-poster" />
      ) : (
        <div className="no-image">No Image Available</div>
      )}

      {/* Movie Info */}
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
        <button className="watch-button" onClick={() => handleMarkAsWatched(movie.id)}>
          Watch
        </button>
        <button className="next-button" onClick={handleNext}>
          Next
        </button>
      </div>

      {/* Rating Modal */}
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
                disabled={!rating}
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
    </div>
  );
};

export default Match;
