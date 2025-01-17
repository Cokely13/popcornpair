// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchMovies } from "../store/allMoviesStore";
// import { createRating } from "../store/allRatingsStore";

// const RateMovie = () => {
//   const dispatch = useDispatch();
//   const movies = useSelector((state) => state.allMovies);
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const { id } = useSelector((state) => state.auth);

//   useEffect(() => {
//     dispatch(fetchMovies());
//   }, [dispatch]);

//   if (!movies.length) {
//     return <div>Loading movies...</div>;
//   }

//   // Get the current movie to display
//   const movie = movies[currentIndex];

//   const handleRating = async (rating) => {
//     try {
//       // Dispatch the createRating action
//       await dispatch(createRating({
//         userId: id, // Replace with dynamic user ID if applicable
//         movieId: movie.id,
//         rating, // 'YES' or 'NO'
//       }));

//       // Move to the next movie
//       if (currentIndex < movies.length - 1) {
//         setCurrentIndex(currentIndex + 1);
//       } else {
//         alert("No more movies to rate!");
//         setCurrentIndex(0); // Reset to the first movie if desired
//       }
//     } catch (err) {
//       console.error("Error submitting rating:", err);
//     }
//   };

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
//       </div>

//       {/* YES and NO Buttons */}
//       <div className="button-container">
//         <button className="yes-button" onClick={() => handleRating("YES")}>YES</button>
//         <button className="no-button" onClick={() => handleRating("NO")}>NO</button>
//       </div>
//     </div>
//   );
// };

// export default RateMovie;

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMovies } from "../store/allMoviesStore";
import { fetchRatings, createRating } from "../store/allRatingsStore";

const RateMovie = () => {
  const dispatch = useDispatch();
  const movies = useSelector((state) => state.allMovies);
  const ratings = useSelector((state) => state.allRatings);
  const [currentIndex, setCurrentIndex] = useState(0);
  const { id } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchMovies());
    dispatch(fetchRatings(id)); // Fetch ratings for the logged-in user
  }, [dispatch, id]);

  console.log("ratings", ratings)

  // Filter out movies that the user has already rated
  const unratedMovies = movies.filter(
    (movie) => !ratings.some((rating) => rating.movieId === movie.id)
  );

  if (!unratedMovies.length) {
    return <div>No more movies to rate!</div>;
  }

  // Get the current movie to display
  const movie = unratedMovies[currentIndex];

  const handleRating = async (rating) => {
    try {
      // Dispatch the createRating action
      await dispatch(createRating({
        userId: id, // Replace with dynamic user ID if applicable
        movieId: movie.id,
        rating, // 'YES' or 'NO'
      }));

      // Move to the next movie
      if (currentIndex < unratedMovies.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        alert("No more movies to rate!");
        setCurrentIndex(0); // Reset to the first movie if desired
      }
    } catch (err) {
      console.error("Error submitting rating:", err);
    }
  };

  return (
    <div className="rate-movie-container">
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

      {/* YES and NO Buttons */}
      <div className="button-container">
        <button className="yes-button" onClick={() => handleRating("YES")}>YES</button>
        <button className="no-button" onClick={() => handleRating("NO")}>NO</button>
      </div>
    </div>
  );
};

export default RateMovie;
