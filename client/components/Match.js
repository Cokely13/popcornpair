import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchMovies } from "../store/allMoviesStore";
import { createUserMovie } from "../store/allUserMoviesStore";
import { fetchUserMovies } from "../store/allUserMoviesStore";
import { fetchSingleUser } from "../store/singleUserStore";
import { updateSingleUserMovie } from "../store/singleUserMovieStore";

const Match = () => {
  const { userId } = useParams(); // Friend's ID
  const dispatch = useDispatch();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedGenre, setSelectedGenre] = useState("All");

  const currentUserId = useSelector((state) => state.auth.id);
  const movies = useSelector((state) => state.allMovies) || [];
  const userMovies = useSelector((state) => state.allUserMovies) || [];
  const friend = useSelector((state) => state.singleUser) || [];

  useEffect(() => {
    dispatch(fetchMovies());
    dispatch(fetchUserMovies());
    dispatch(fetchSingleUser(userId)); // Ensure user data is fetched
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
  const matchedMovies = sharedMovies.filter((movie) =>
    selectedGenre === "All" || movie.genres?.includes(selectedGenre)
  );

  const genres = [
    "All",
    ...new Set(movies.flatMap((movie) => movie.genres || [])),
  ];

  // Display message if there are no matches
  if (!matchedMovies.length) {
    return (
      <div className="no-matches-container">
        <h2>Matches with {friend?.username || "User"}</h2>
        {/* Genre Filter */}
        <div className="genre-filter">
          <label htmlFor="genre">Filter by Genre: </label>
          <select
            id="genre"
            value={selectedGenre}
            onChange={(e) => {
              setSelectedGenre(e.target.value);
              setCurrentIndex(0); // Reset index when filter changes
            }}
          >
            {genres.map((genre) => (
              <option key={genre} value={genre}>
                {genre}
              </option>
            ))}
          </select>
        </div>
        <div className="no-matches-message">
          Sorry, you have no matches yet!
        </div>
      </div>
    );
  }

  const movie = matchedMovies[currentIndex];

  const handleNext = () => {
    if (currentIndex < matchedMovies.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      alert("No more movies to show!");
      setCurrentIndex(0); // Reset to the first movie
    }
  };

  // const handleWatch = async () => {
  //   try {
  //     // Create UserMovie for the current user
  //     await dispatch(
  //       createUserMovie({
  //         userId: currentUserId,
  //         movieId: movie.id,
  //         watched: true,
  //         watchedWith: userId,
  //       })
  //     );

  //     // Create UserMovie for the friend
  //     await dispatch(
  //       createUserMovie({
  //         userId: parseInt(userId),
  //         movieId: movie.id,
  //         watched: true,
  //         watchedWith: currentUserId,
  //       })
  //     );

  //     alert("Movie marked as watched!");
  //   } catch (err) {
  //     console.error("Error creating UserMovie:", err);
  //   }
  // };

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
      <h2>Matches with {friend?.username || "User"}</h2>

      {/* Genre Filter */}
      <div className="genre-filter">
        <label htmlFor="genre">Filter by Genre: </label>
        <select
          id="genre"
          value={selectedGenre}
          onChange={(e) => {
            setSelectedGenre(e.target.value);
            setCurrentIndex(0); // Reset index when filter changes
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

      {/* Movie Information */}
      <div className="movie-info">
        <h2>{movie.title || "Untitled Movie"}</h2>
        <p><strong>Description:</strong> {movie.description || "No description available."}</p>
        <p><strong>Release Date:</strong> {movie.releaseDate || "Unknown"}</p>
        <p><strong>Genres:</strong> {movie.genres?.join(", ") || "N/A"}</p>
      </div>

      {/* Buttons */}
      <div className="button-container">
        <button className="watch-button" onClick={() => handleWatch(movie.id)}>
          Watch
        </button>
        <button className="next-button" onClick={handleNext}>
          Next
        </button>
      </div>
    </div>
  );
};

export default Match;
