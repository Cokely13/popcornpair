// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchRatings } from "../store/allRatingsStore";

// const Match = () => {
//   const { userId } = useParams(); // ID of the friend
//   const dispatch = useDispatch();
//   const [currentIndex, setCurrentIndex] = useState(0);

//   const currentUserId = useSelector((state) => state.auth.id);
//   const ratings = useSelector((state) => state.allRatings) || [];

//   console.log("ratings", ratings)

//   useEffect(() => {
//     dispatch(fetchRatings());
//   }, [dispatch, currentUserId, userId]);

//   // Find common movies rated "Yes" by both users
//   const commonMovies = ratings
//     .filter((rating) => rating.userId === currentUserId && rating.rating === "YES")
//     .map((rating) => rating.movieId)
//     .filter((movieId) =>
//       ratings.some(
//         (rating) => rating.userId === parseInt(userId) && rating.movieId === movieId && rating.rating === "YES"
//       )
//     );

//   // Fetch movie details for the common movies
//   const movies = useSelector((state) => state.allMovies).filter((movie) => commonMovies.includes(movie.id));

//   if (!movies.length) {
//     return <div>No matching movies found!</div>;
//   }

//   // Get the current movie to display
//   const movie = movies[currentIndex];

//   const handleNext = () => {
//     if (currentIndex < movies.length - 1) {
//       setCurrentIndex(currentIndex + 1);
//     } else {
//       alert("No more movies to show!");
//       setCurrentIndex(0); // Reset to the first movie if desired
//     }
//   };

//   return (
//     <div className="match-movie-container">
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

//       {/* Buttons */}
//       <div className="button-container">
//         <button className="watch-button">Watch</button>
//         <button className="next-button" onClick={handleNext}>Next</button>
//       </div>
//     </div>
//   );
// };

// export default Match;

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchRatings } from "../store/allRatingsStore";

const Match = () => {
  const { userId } = useParams(); // ID of the friend
  const dispatch = useDispatch();
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentUserId = useSelector((state) => state.auth.id);
  const ratings = useSelector((state) => state.allRatings) || [];

  console.log("ratings", ratings);

  useEffect(() => {
    dispatch(fetchRatings());
  }, [dispatch]);

  // Find common movies rated "Yes" by both users
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

  const sharedMovies = commonMovies.currentUserMovies.filter(movieId => commonMovies.friendMovies.includes(movieId));

  // Fetch movie details for the shared movies
  const movies = useSelector((state) => state.allMovies).filter((movie) => sharedMovies.includes(movie.id));

  if (!movies.length) {
    return <div>No matching movies found!</div>;
  }

  // Get the current movie to display
  const movie = movies[currentIndex];

  const handleNext = () => {
    if (currentIndex < movies.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      alert("No more movies to show!");
      setCurrentIndex(0); // Reset to the first movie if desired
    }
  };

  return (
    <div className="match-movie-container">
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
        <button className="watch-button">Watch</button>
        <button className="next-button" onClick={handleNext}>Next</button>
      </div>
    </div>
  );
};

export default Match;
