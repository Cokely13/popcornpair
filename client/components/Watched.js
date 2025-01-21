// import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchUserMovies } from "../store/allUserMoviesStore";
// import { fetchMovies } from "../store/allMoviesStore";
// import { updateSingleUserMovie } from "../store/singleUserMovieStore";
// import {fetchUsers} from "../store/allUsersStore"

// const Watched = () => {
//   const dispatch = useDispatch();
//   const [selectedMovieId, setSelectedMovieId] = useState(null);
//   const [rating, setRating] = useState("");

//   const currentUserId = useSelector((state) => state.auth.id);
//   const userMovies = useSelector((state) => state.allUserMovies).filter(
//     (userMovie) => userMovie.userId === currentUserId && userMovie.watched
//   );
//   const movies = useSelector((state) => state.allMovies);
//   const users = useSelector((state) => state.allUsers);

//   useEffect(() => {
//     dispatch(fetchUserMovies());
//     dispatch(fetchUsers());
//     dispatch(fetchMovies());
//   }, [dispatch]);

//   // Merge userMovies with movie details
//   const watchedMovies = userMovies.map((userMovie) => ({
//     ...userMovie,
//     ...movies.find((movie) => movie.id === userMovie.movieId),
//   }));

//   const handleRatingSubmit = async (movieId) => {
//     if (!rating || rating < 1 || rating > 10) {
//       alert("Please provide a rating between 1 and 10.");
//       return;
//     }

//     try {
//       await dispatch(updateSingleUserMovie({ userId: currentUserId, movieId, rating }));
//       setSelectedMovieId(null); // Close the rating input
//       setRating(""); // Reset the input field
//       dispatch(fetchUserMovies()); // Refresh the list
//     } catch (err) {
//       console.error("Error submitting rating:", err);
//     }
//   };

//   if (!watchedMovies.length) {
//     return <div>No watched movies to display!</div>;
//   }

//   console.log("watched", watchedMovies)

//   return (
//     <div className="watched-movies-container">
//       <h2>Your Watched Movies</h2>
//       <div className="watched-movies-list">
//   {watchedMovies.map((movie, index) => (
//      <div key={`${movie.movieId}-${movie.userId}`} className="watched-movie-item">
//       <h3>
//       <Link to={`/movies/${movie.id}`}>{movie.title || "Untitled Movie"}</Link></h3>
//       <p>Watched With: {users.find((user) => user.id === movie.watchedWith)?.username || "N/A"}</p>
//       <p>Your Rating: {movie.rating || "Not Rated"}</p>
//       <p>Date Watched: {movie.dateWatched || "No Date"}</p>
//       {selectedMovieId === movie.id ? (
//         <div>
//           <input
//             type="number"
//             min="1"
//             max="10"
//             value={rating}
//             onChange={(e) => setRating(e.target.value)}
//           />
//           <button onClick={() => handleRatingSubmit(movie.id)}>Submit</button>
//           <button onClick={() => setSelectedMovieId(null)}>Cancel</button>
//         </div>
//       ) : (
//         <button onClick={() => setSelectedMovieId(movie.id)}>Rate</button>
//       )}
//     </div>
//   ))}
// </div>
// </div>
//   );
// };

// export default Watched;

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserMovies } from "../store/allUserMoviesStore";
import { fetchMovies } from "../store/allMoviesStore";
import { updateSingleUserMovie } from "../store/singleUserMovieStore";
import { fetchUsers } from "../store/allUsersStore";

const Watched = () => {
  const dispatch = useDispatch();
  const [selectedMovieId, setSelectedMovieId] = useState(null);
  const [rating, setRating] = useState("");
  const [sortCriteria, setSortCriteria] = useState("None"); // State for sorting criteria

  const currentUserId = useSelector((state) => state.auth.id);
  const userMovies = useSelector((state) => state.allUserMovies).filter(
    (userMovie) => userMovie.userId === currentUserId && userMovie.watched
  );
  const movies = useSelector((state) => state.allMovies);
  const users = useSelector((state) => state.allUsers);

  useEffect(() => {
    dispatch(fetchUserMovies());
    dispatch(fetchUsers());
    dispatch(fetchMovies());
  }, [dispatch]);

  // Merge userMovies with movie details
  const watchedMovies = userMovies.map((userMovie) => ({
    ...userMovie,
    ...movies.find((movie) => movie.id === userMovie.movieId),
  }));

  // Apply sorting based on the selected criteria
  const sortedMovies = [...watchedMovies].sort((a, b) => {
    if (sortCriteria === "Date Watched") {
      return new Date(b.dateWatched) - new Date(a.dateWatched); // Most recent first
    } else if (sortCriteria === "Rating") {
      return (b.rating || 0) - (a.rating || 0); // Highest rating first
    }
    return 0; // Default order
  });

  const handleRatingSubmit = async (movieId) => {
    if (!rating || rating < 1 || rating > 10) {
      alert("Please provide a rating between 1 and 10.");
      return;
    }

    try {
      await dispatch(updateSingleUserMovie({ userId: currentUserId, movieId, rating }));
      setSelectedMovieId(null); // Close the rating input
      setRating(""); // Reset the input field
      dispatch(fetchUserMovies()); // Refresh the list
    } catch (err) {
      console.error("Error submitting rating:", err);
    }
  };

  if (!watchedMovies.length) {
    return <div>No watched movies to display!</div>;
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

      <div className="watched-movies-list">
        {sortedMovies.map((movie, index) => (
          <div key={`${movie.movieId}-${movie.userId}`} className="watched-movie-item">
            <h3>
              <Link to={`/movies/${movie.id}`}>{movie.title || "Untitled Movie"}</Link>
            </h3>
            <p>Watched With: {users.find((user) => user.id === movie.watchedWith)?.username || "N/A"}</p>
            <p>Your Rating: {movie.rating || "Not Rated"}</p>
            <p>Date Watched: {movie.dateWatched || "No Date"}</p>
            {selectedMovieId === movie.id ? (
              <div>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
                />
                <button onClick={() => handleRatingSubmit(movie.id)}>Submit</button>
                <button onClick={() => setSelectedMovieId(null)}>Cancel</button>
              </div>
            ) : (
              <button onClick={() => setSelectedMovieId(movie.id)}>Rate</button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Watched;
