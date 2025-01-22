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
    (userMovie) => userMovie.userId === parseInt(userId) && userMovie.watched
  );
  const movies = useSelector((state) => state.allMovies);
  const user = useSelector((state) =>
    state.allUsers.find((user) => user.id === parseInt(userId))
  );

  useEffect(() => {
    dispatch(fetchUserMovies());
    dispatch(fetchMovies());
    dispatch(fetchUsers());
  }, [dispatch]);

  // Calculate stats
  const stats = useMemo(() => {
    if (!userMovies.length) return null;

    const watchedMovies = userMovies.map((userMovie) => ({
      ...userMovie,
      ...movies.find((movie) => movie.id === userMovie.movieId),
    }));

    const lastMovie = watchedMovies.reduce((latest, movie) => {
      if (!latest || new Date(movie.dateWatched) > new Date(latest.dateWatched)) {
        return movie;
      }
      return latest;
    }, null);

    const averageRating =
      watchedMovies.reduce((sum, movie) => sum + (movie.rating || 0), 0) /
      watchedMovies.length;

    const highestRatedMovie = watchedMovies.reduce((highest, movie) => {
      if (!highest || (movie.rating || 0) > (highest.rating || 0)) {
        return movie;
      }
      return highest;
    }, null);

    return {
      totalMoviesWatched: watchedMovies.length,
      lastMovie,
      averageRating: averageRating.toFixed(1),
      highestRatedMovie,
    };
  }, [userMovies, movies]);

  if (!stats) {
    return <div>No data available for this user!</div>;
  }

  return (
    <div className="profile-container">
      <h1>{user?.username || "User"}'s Details</h1>
      <div className="profile-info">
        <p><strong>Total Movies Watched:</strong> {stats.totalMoviesWatched}</p>
        <p>
          <strong>Last Movie Watched:</strong>{" "}
         <Link to={`/movies/${stats.lastMovie?.id}`}>  {stats.lastMovie?.title || "No movies watched"}</Link> (
          {stats.lastMovie?.dateWatched || "No date available"})
        </p>
        <p>
          <strong>Average Rating:</strong>{" "}
          {stats.averageRating || "No ratings available"}
        </p>
        <p>
          <strong>Highest Rated Movie:</strong>{" "}
         <Link to={`/movies/${stats.highestRatedMovie?.id}`}>  {stats.highestRatedMovie?.title || "No ratings available"}</Link> (
          {stats.highestRatedMovie?.rating || "No rating"})
        </p>
      </div>
    </div>
  );
};

export default UserDetail;
