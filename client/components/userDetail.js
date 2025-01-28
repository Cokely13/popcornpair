// import React, { useEffect, useMemo } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useParams, Link } from "react-router-dom";
// import { fetchUserMovies } from "../store/allUserMoviesStore";
// import { fetchMovies } from "../store/allMoviesStore";
// import { fetchUsers } from "../store/allUsersStore";

// const UserDetail = () => {
//   const { userId } = useParams();
//   const dispatch = useDispatch();
//   const userMovies = useSelector((state) => state.allUserMovies).filter(
//     (userMovie) =>
//       userMovie.userId === parseInt(userId) &&
//       userMovie.status === "watched" // <-- match your single-field refactor
//   );

//   const users = useSelector((state) =>
//     state.allUsers)
//   const movies = useSelector((state) => state.allMovies);
//   const user = useSelector((state) =>
//     state.allUsers.find((user) => user.id == userId)
//   );

//   useEffect(() => {
//     dispatch(fetchUserMovies());
//     dispatch(fetchMovies());
//     dispatch(fetchUsers());
//   }, [dispatch]);




//   // Calculate stats
//   const stats = useMemo(() => {
//     if (!userMovies.length) return null;

//     const watchedMovies = userMovies.map((userMovie) => ({
//       ...userMovie,
//       ...movies.find((movie) => movie.id === userMovie.movieId),
//     }));

//     const lastMovie = watchedMovies.reduce((latest, movie) => {
//       if (!latest || new Date(movie.dateWatched) > new Date(latest.dateWatched)) {
//         return movie;
//       }
//       return latest;
//     }, null);

//     const averageRating =
//       watchedMovies.reduce((sum, movie) => sum + (movie.rating || 0), 0) /
//       watchedMovies.length;

//     const highestRatedMovie = watchedMovies.reduce((highest, movie) => {
//       if (!highest || (movie.rating || 0) > (highest.rating || 0)) {
//         return movie;
//       }
//       return highest;
//     }, null);

//     return {
//       totalMoviesWatched: watchedMovies.length,
//       lastMovie,
//       averageRating: averageRating.toFixed(1),
//       highestRatedMovie,
//     };
//   }, [userMovies, movies]);

//   if (!stats) {
//     return <div>No data available for this user!</div>;
//   }

//   return (
//     user ? <div className="profile-container">
//       <h1>{user?.username || "User"}'s Details</h1>
//       <div className="profile-info">
//         <p><strong>Total Movies Watched:</strong> {stats.totalMoviesWatched}</p>
//         <p>
//           <strong>Last Movie Watched:</strong>{" "}
//          <Link to={`/movies/${stats.lastMovie?.id}`}>  {stats.lastMovie?.title || "No movies watched"}</Link> (
//           {stats.lastMovie?.dateWatched || "No date available"})
//         </p>
//         <p>
//           <strong>Average Rating:</strong>{" "}
//           {stats.averageRating || "No ratings available"}
//         </p>
//         <p>
//           <strong>Highest Rated Movie:</strong>{" "}
//          <Link to={`/movies/${stats.highestRatedMovie?.id}`}>  {stats.highestRatedMovie?.title || "No ratings available"}</Link> (
//           {stats.highestRatedMovie?.rating || "No rating"})
//         </p>
//       </div>
//     </div> : <div className="profile-container">no user</div>
//   );
// };

// export default UserDetail;

import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import { fetchUserMovies } from "../store/allUserMoviesStore";
import { fetchMovies } from "../store/allMoviesStore";
import { fetchUsers } from "../store/allUsersStore";

const UserDetail = () => {
  const { userId } = useParams();
  const dispatch = useDispatch();

  const userMovies = useSelector((state) => state.allUserMovies).filter(
    (um) => um.userId === parseInt(userId) && um.status === "watched"
  );
  const users = useSelector((state) => state.allUsers);
  const movies = useSelector((state) => state.allMovies);

  const user = users.find((u) => u.id == userId);

  useEffect(() => {
    dispatch(fetchUserMovies());
    dispatch(fetchMovies());
    dispatch(fetchUsers());
  }, [dispatch]);

  // 1) Use a memo to compute stats, but always return *some* object
  const stats = useMemo(() => {
    // Merge userMovies with their corresponding "Movie" data
    const watchedMovies = userMovies.map((um) => ({
      ...um,
      ...movies.find((m) => m.id === um.movieId),
    }));

    // If no watched movies, return "fallback" stats
    if (!watchedMovies.length) {
      return {
        totalMoviesWatched: 0,
        lastMovie: null,
        averageRating: null,
        highestRatedMovie: null,
      };
    }

    // Otherwise, compute stats normally
    const lastMovie = watchedMovies.reduce((latest, movie) => {
      if (!latest || new Date(movie.dateWatched) > new Date(latest.dateWatched)) {
        return movie;
      }
      return latest;
    }, null);

    const averageRating = watchedMovies.reduce(
      (sum, movie) => sum + (movie.rating || 0),
      0
    ) / watchedMovies.length;

    const highestRatedMovie = watchedMovies.reduce((highest, movie) => {
      if (!highest || (movie.rating || 0) > (highest.rating || 0)) {
        return movie;
      }
      return highest;
    }, null);

    return {
      totalMoviesWatched: watchedMovies.length,
      lastMovie,
      averageRating,
      highestRatedMovie,
    };
  }, [userMovies, movies]);

  // 2) If the user doesn’t exist at all, show a fallback
  if (!user) {
    return <div className="profile-container">User not found.</div>;
  }

  // 3) Display the data
  const {
    totalMoviesWatched,
    lastMovie,
    averageRating,
    highestRatedMovie,
  } = stats;

  return (
    <div className="profile-container">
      <h1>{user.username}'s Details</h1>

      <div className="profile-info">
        <p>
          <strong>Total Movies Watched:</strong>{" "}
          {totalMoviesWatched}
        </p>

        <p>
          <strong>Last Movie Watched:</strong>{" "}
          {lastMovie ? (
            <>
              <Link to={`/movies/${lastMovie.id}`}>
                {lastMovie.title || "Untitled"}
              </Link>{" "}
              ({lastMovie.dateWatched || "No date available"})
            </>
          ) : (
            "None"
          )}
        </p>

        <p>
          <strong>Average Rating:</strong>{" "}
          {averageRating !== null ? averageRating.toFixed(1) : "N/A"}
        </p>

        <p>
          <strong>Highest Rated Movie:</strong>{" "}
          {highestRatedMovie ? (
            <>
              <Link to={`/movies/${highestRatedMovie.id}`}>
                {highestRatedMovie.title || "Untitled"}
              </Link>{" "}
              ({highestRatedMovie.rating || "No rating"})
            </>
          ) : (
            "N/A"
          )}
        </p>
      </div>
    </div>
  );
};

export default UserDetail;

