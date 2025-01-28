import React, { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserMovies } from "../store/allUserMoviesStore";
import { fetchMovies } from "../store/allMoviesStore";
import { fetchUsers } from "../store/allUsersStore";

const Profile = () => {
  const dispatch = useDispatch();
  const currentUserId = useSelector((state) => state.auth.id);
  const userMovies = useSelector((state) => state.allUserMovies).filter(
    (userMovie) => userMovie.userId === currentUserId && userMovie.status == "watched"
  );
  const movies = useSelector((state) => state.allMovies);
  const currentUser = useSelector((state) =>
    state.allUsers.find((user) => user.id === currentUserId)
  );

  useEffect(() => {
    dispatch(fetchUserMovies());
    dispatch(fetchMovies());
    dispatch(fetchUsers());
  }, [dispatch]);

  // Calculate stats
  const stats = useMemo(() => {
    if (!userMovies.length) {
      return {
        totalMoviesWatched: 0,
        lastMovie: null,
        averageRating: "N/A",
        highestRatedMovie: null,
      };
    }

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

  return (
    <div className="profile-container">
      <h1>{currentUser?.username || "User"}</h1>
      <div className="profile-info">
        <p><strong>Email:</strong> {currentUser?.email || "N/A"}</p>
        <p><strong>Total Movies Watched:</strong> {stats.totalMoviesWatched}</p>
        <p>
  <strong>Last Movie Watched:</strong>{" "}
  {stats.lastMovie?.id ? (
    <Link to={`/movies/${stats.lastMovie.id}`}>
      {stats.lastMovie.title} ({stats.lastMovie.rating})
    </Link>
  ) : (
    "No movies watched"
  )}{" "}
  ({stats.lastMovie?.dateWatched || "No date available"})
</p>
        <p>
          <strong>Average Rating:</strong>{" "}
          {stats.averageRating}
        </p>
        <p>
  <strong>Highest Rated Movie:</strong>{" "}
  {stats.highestRatedMovie?.id ? (
    <Link to={`/movies/${stats.highestRatedMovie.id}`}>
      {stats.highestRatedMovie.title} ({stats.highestRatedMovie.rating})
    </Link>
  ) : (
    "No ratings available"
  )}
</p>
      </div>
    </div>
  );
};

export default Profile;
