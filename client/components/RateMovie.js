// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchMovies } from "../store/allMoviesStore";
// import { fetchRatings, createRating } from "../store/allRatingsStore";
// import { fetchUserMovies } from "../store/allUserMoviesStore";
// import { FaThumbsUp, FaThumbsDown } from "react-icons/fa";

// const RateMovie = () => {
//   const dispatch = useDispatch();
//   const movies = useSelector((state) => state.allMovies);
//   const ratings = useSelector((state) => state.allRatings);
//   const userMovies = useSelector((state) => state.allUserMovies);
//   const [shuffledMovies, setShuffledMovies] = useState([]);
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const { id } = useSelector((state) => state.auth);

//   useEffect(() => {
//     dispatch(fetchMovies());
//     dispatch(fetchRatings(id)); // Fetch ratings for the logged-in user
//     dispatch(fetchUserMovies());
//   }, [dispatch, id]);

//   useEffect(() => {
//     // Filter and shuffle the movies
//     const unratedMovies = movies.filter((movie) => {
//       const isRated = ratings.some(
//         (rating) =>
//           rating.movieId === movie.id && rating.userId === id
//       );

//       const isInUserMovies = userMovies.some(
//         (userMovie) =>
//           userMovie.userId === id &&
//           userMovie.movieId === movie.id &&
//           (userMovie.watched || userMovie.watchlist)
//       );

//       return !isRated && !isInUserMovies;
//     });

//     // Shuffle the movies
//     const shuffled = unratedMovies.sort(() => Math.random() - 0.5);
//     setShuffledMovies(shuffled);
//   }, [movies, ratings, userMovies, id]);

//   useEffect(() => {
//     if (currentIndex >= shuffledMovies.length) {
//       setCurrentIndex(0); // Reset to 0 if currentIndex goes out of bounds
//     }
//   }, [shuffledMovies, currentIndex]);

//   if (!shuffledMovies.length) {
//     return <div>No more movies to rate!</div>;
//   }

//   const movie = shuffledMovies[currentIndex];

//   const handleRating = async (rating) => {
//     if (!movie) {
//       console.error("No movie available for rating.");
//       return;
//     }

//     try {
//       await dispatch(
//         createRating({
//           userId: id,
//           movieId: movie.id,
//           rating,
//         })
//       );

//       handleNextMovie();
//     } catch (err) {
//       console.error("Error submitting rating:", err);
//     }
//   };

//   const handleNextMovie = () => {
//     if (currentIndex < shuffledMovies.length - 1) {
//       setCurrentIndex(currentIndex + 1);
//     } else {
//       alert("No more movies to rate!");
//       setCurrentIndex(0);
//     }
//   };

//   return (
//     <div className="rate-movie-container">
//       <h1>Rate</h1>
//       {movie ? (
//         <>
//           {movie.posterUrl ? (
//             <img src={movie.posterUrl} alt={movie.title} className="movie-poster" />
//           ) : (
//             <div className="no-image">No Image Available</div>
//           )}

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

//           <div className="button-container">
//             <button
//               className="yes-button"
//               onClick={() => handleRating("YES")}
//               title="Thumbs Up"
//             >
//               <FaThumbsUp />
//             </button>
//             <button
//               className="maybe-button"
//               onClick={handleNextMovie}
//               title="Maybe Later"
//             >
//               Maybe Later
//             </button>
//             <button
//               className="no-button"
//               onClick={() => handleRating("NO")}
//               title="Thumbs Down"
//             >
//               <FaThumbsDown />
//             </button>
//           </div>
//         </>
//       ) : (
//         <div>Loading movie details...</div>
//       )}
//     </div>
//   );
// };

// export default RateMovie;

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMovies } from "../store/allMoviesStore";
import { fetchRatings, createRating } from "../store/allRatingsStore";
import { fetchUserMovies } from "../store/allUserMoviesStore";
import { FaThumbsUp, FaThumbsDown } from "react-icons/fa";

const RateMovie = () => {
  const dispatch = useDispatch();
  const movies = useSelector((state) => state.allMovies);
  const ratings = useSelector((state) => state.allRatings);
  const userMovies = useSelector((state) => state.allUserMovies);
  const [shuffledMovies, setShuffledMovies] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const { id } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchMovies());
    dispatch(fetchRatings(id)); // Fetch ratings for the logged-in user
    dispatch(fetchUserMovies());
  }, [dispatch, id]);

  useEffect(() => {
    // Filter and shuffle the movies
    const unratedMovies = movies.filter((movie) => {
      const isRated = ratings.some(
        (rating) =>
          rating.movieId === movie.id && rating.userId === id
      );

      const isInUserMovies = userMovies.some(
        (userMovie) =>
          userMovie.userId === id &&
          userMovie.movieId === movie.id &&
          (userMovie.watched || userMovie.watchlist)
      );

      return !isRated && !isInUserMovies;
    });

    // Shuffle the movies
    const shuffled = unratedMovies.sort(() => Math.random() - 0.5);
    setShuffledMovies(shuffled);
  }, [movies, ratings, userMovies, id]);

  useEffect(() => {
    if (currentIndex >= shuffledMovies.length) {
      setCurrentIndex(0); // Reset to 0 if currentIndex goes out of bounds
    }
  }, [shuffledMovies, currentIndex]);

  const movie = shuffledMovies[currentIndex];

  const handleRating = async (rating) => {
    if (!movie) {
      console.error("No movie available for rating.");
      return;
    }

    try {
      await dispatch(
        createRating({
          userId: id,
          movieId: movie.id,
          rating,
        })
      );

      handleNextMovie();
    } catch (err) {
      console.error("Error submitting rating:", err);
    }
  };

  const handleNextMovie = () => {
    if (currentIndex < shuffledMovies.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  return (
    <div className="rate-movie-container">
      <h1>Rate</h1>
      {shuffledMovies.length === 0 ? (
        <div className="no-movies-message">
          <h2>No more movies to rate!</h2>
        </div>
      ) : movie ? (
        <>
          {movie.posterUrl ? (
            <img src={movie.posterUrl} alt={movie.title} className="movie-poster" />
          ) : (
            <div className="no-image">No Image Available</div>
          )}

          <div className="movie-info">
            <h2>{movie.title || "Untitled Movie"}</h2>
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
              onClick={() => handleRating("YES")}
              title="Thumbs Up"
            >
              <FaThumbsUp />
            </button>
            <button
              className="maybe-button"
              onClick={handleNextMovie}
              title="Maybe Later"
            >
              Maybe Later
            </button>
            <button
              className="no-button"
              onClick={() => handleRating("NO")}
              title="Thumbs Down"
            >
              <FaThumbsDown />
            </button>
          </div>
        </>
      ) : (
        <div>Loading movie details...</div>
      )}
    </div>
  );
};

export default RateMovie;
