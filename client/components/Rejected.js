// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchMovies } from "../store/allMoviesStore";
// import { fetchUserMovies } from "../store/allUserMoviesStore";
// import { fetchRatings } from "../store/allRatingsStore";
// import { updateSingleRating } from "../store/singleRatingStore";
// import { updateSingleUserMovie } from "../store/singleUserMovieStore";

// const Rejected = () => {
//   const dispatch = useDispatch();
//   const movies = useSelector((state) => state.allMovies);
//   const ratings = useSelector((state) => state.allRatings);
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const { id } = useSelector((state) => state.auth);
//   const userMovies = useSelector((state) => state.allUserMovies) || [];

//   useEffect(() => {
//     dispatch(fetchUserMovies());
//     dispatch(fetchRatings(id)); // Fetch ratings for the logged-in user
//   }, [dispatch, id]);

//   // Filter movies rated "No" by the user
//   const rejectedMovies = movies.filter(
//     (movie) =>
//       ratings.some(
//         (rating) =>
//           rating.movieId === movie.id &&
//           rating.userId === id &&
//           rating.rating === "NO"
//       )
//   );

//   const movie = rejectedMovies[currentIndex];

//   const handleNextMovie = () => {
//     if (currentIndex < rejectedMovies.length - 1) {
//       setCurrentIndex(currentIndex + 1);
//     } else {
//       setCurrentIndex(null); // Mark as finished by setting to null
//     }
//   };

//   const handleRatingUpdate = async () => {
//     if (!movie) return;

//     const userRating = ratings.find(
//       (rating) => rating.movieId === movie.id && rating.userId === id
//     );

//     if (!userRating) {
//       console.error("Rating not found for the movie.");
//       return;
//     }

//     try {
//       await dispatch(
//         updateSingleRating({
//           id: userRating.id,
//           userId: id,
//           movieId: movie.id,
//           rating: "YES",
//         })
//       );

//       handleNextMovie(); // Advance to the next movie
//     } catch (err) {
//       console.error("Error updating rating:", err);
//     }
//   };

//   // Display a message if there are no rejected movies
//   if (!rejectedMovies.length) {
//     return (
//       <div className="rate-movie-container">
//         <h1>Second Chance</h1>
//         <p>No rejected movies to display!</p>
//       </div>
//     );
//   }

//   return (
//     <div className="rate-movie-container">
//       <h1>Second Chance</h1>
//       {currentIndex === null ? (
//         <div className="finished-message">
//           <h2>That's all for now!</h2>
//           <p>Come back later to revisit your rejected movies.</p>
//         </div>
//       ) : movie ? (
//         <>
//           {/* Movie Poster */}
//           {movie.posterUrl ? (
//             <img src={movie.posterUrl} alt={movie.title} className="movie-poster" />
//           ) : (
//             <div className="no-image">No Image Available</div>
//           )}

//           {/* Movie Information */}
//           <div className="movie-info">
//             <h2>{movie.title || "Untitled Movie"}</h2>
//             <p>
//               <strong>Description:</strong> {movie.description || "No description available."}
//             </p>
//             <p>
//               <strong>Release Date:</strong> {movie.releaseDate || "Unknown"}
//             </p>
//             <p>
//               <strong>Genres:</strong> {movie.genres?.join(", ") || "N/A"}
//             </p>
//           </div>

//           {/* Buttons */}
//           <div className="button-container">
//             <button className="yes-button" onClick={handleRatingUpdate}>
//               YES
//             </button>
//             <button className="no-button" onClick={handleNextMovie}>
//               Keep Rejected
//             </button>
//           </div>
//         </>
//       ) : (
//         <div>Loading movie details...</div>
//       )}
//     </div>
//   );
// };

// export default Rejected;

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMovies } from "../store/allMoviesStore";
import { fetchUserMovies } from "../store/allUserMoviesStore";
import { updateSingleUserMovie } from "../store/singleUserMovieStore";

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
      <div className="rate-movie-container">
        <h1>Second Chance</h1>
        <p>No movies to display!</p>
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
        <h1>Second Chance</h1>
        <h2>That's all for now!</h2>
        {/* <p>Come back later to revisit your "none" movies.</p> */}
      </div>
    );
  }

  return (
    <div className="rate-movie-container">
      <h1>Second Chance</h1>

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
