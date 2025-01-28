import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchMovies } from "../store/allMoviesStore";
import { createUserMovie } from "../store/allUserMoviesStore";
import { fetchUserMovies } from "../store/allUserMoviesStore";
import { fetchSingleUser } from "../store/singleUserStore";

const Random = () => {
  const { userId } = useParams(); // Friend's ID
  const dispatch = useDispatch();
  const [randomMovie, setRandomMovie] = useState(null);

  const currentUserId = useSelector((state) => state.auth.id);
  const movies = useSelector((state) => state.allMovies) || [];
  const userMovies = useSelector((state) => state.allUserMovies) || [];
  const friend = useSelector((state) => state.singleUser) || [];

  useEffect(() => {
    dispatch(fetchMovies());
    dispatch(fetchUserMovies());
    dispatch(fetchSingleUser(userId));
  }, [dispatch]);

  const currentUserWatchlist = userMovies
  .filter(
    (um) =>
      um.userId === currentUserId &&
      um.status === "watchlist"
  )
  .map((um) => um.movieId);

// 2. Get watchlist entries for the friend
const friendWatchlist = userMovies
  .filter(
    (um) =>
      um.userId === parseInt(userId) &&
      um.status === "watchlist"
  )
  .map((um) => um.movieId);

  const sharedMovieIds = currentUserWatchlist.filter((movieId) =>
    friendWatchlist.includes(movieId)
  );

// 3. Intersection: Movies in *both* watchlists
const sharedMovies = movies.filter((m) => sharedMovieIds.includes(m.id));

  // 5. Filter by genre if needed
  // const matchedMovies = sharedMovies.filter((movie) =>
  //   selectedGenre === "All" || movie.genres?.includes(selectedGenre)
  // );

  // Find common movies rated "YES" by both users
  // const sharedMovies = ratings
  //   .filter((rating) => rating.userId === currentUserId && rating.rating === "YES") // Movies rated "YES" by current user
  //   .map((rating) => rating.movieId)
  //   .filter((movieId) =>
  //     ratings.some(
  //       (friendRating) =>
  //         friendRating.userId === parseInt(userId) &&
  //         friendRating.movieId === movieId &&
  //         friendRating.rating === "YES"
  //     )
  //   )
  //   .filter(
  //     (movieId) =>
  //       !userMovies.some(
  //         (userMovie) => userMovie.movieId === movieId && userMovie.watched
  //       )
  //   );

  // const matchedMovies = movies.filter((movie) => sharedMovies.includes(movie.id));

  useEffect(() => {
    if (sharedMovies.length) {
      const randomIndex = Math.floor(Math.random() * sharedMovies.length);
      setRandomMovie(sharedMovies[randomIndex]);
    } else {
      setRandomMovie(null); // No matched movies
    }
  }, [sharedMovies]);

  const handleWatch = async (movieId) => {

    try {
      const userMovie = userMovies.find(
        (um) => um.movieId === movieId && um.userId === currentUserId
      );

      await dispatch(
        updateSingleUserMovie({
          userId: currentUserId,
          movieId: userMovie.movieId,
          status: "watched",
          watchedWith: userId
        })
      );

      await dispatch(
        updateSingleUserMovie({
          userId: userId,
          movieId: userMovie.movieId,
          status: "watched",
          watchedWith: currentUserId
        })
      );
      dispatch(fetchUserMovies());
    } catch (err) {
      console.error("Error marking as watched:", err);
    }
  };

  return (
    <div className="rate-movie-container">
      <h2>Random Match with {friend?.username || "User"}</h2>

      {randomMovie ? (
        <>
          {/* Movie Poster */}
          {randomMovie.posterUrl ? (
            <img
              src={randomMovie.posterUrl}
              alt={randomMovie.title}
              className="movie-poster"
            />
          ) : (
            <div className="no-image">No Image Available</div>
          )}

          {/* Movie Information */}
          <div className="movie-info">
            <h2>{randomMovie.title || "Untitled Movie"}</h2>
            <p>
              <strong>Description:</strong>{" "}
              {randomMovie.description || "No description available."}
            </p>
            <p>
              <strong>Release Date:</strong>{" "}
              {randomMovie.releaseDate || "Unknown"}
            </p>
            <p>
              <strong>Genres:</strong>{" "}
              {randomMovie.genres?.join(", ") || "N/A"}
            </p>
          </div>

          {/* Watch Button */}
          <div className="button-container">
          <button className="watch-button" onClick={() => handleWatch(movie.id)}>
              Watch
            </button>
          </div>
        </>
      ) : (
        <div>Sorry, there are no movies to show.</div>
      )}
    </div>
  );
};

export default Random;
