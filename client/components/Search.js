import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchMovies } from "../store/allMoviesStore";
import { fetchUserMovies, createUserMovie } from "../store/allUserMoviesStore";
import { updateSingleUserMovie } from "../store/singleUserMovieStore";

const Search = () => {
  const dispatch = useDispatch();

  const movies = useSelector((state) => state.allMovies);
  const userMovies = useSelector((state) => state.allUserMovies);
  const currentUserId = useSelector((state) => state.auth.id);

  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("title");
  const [genreFilter, setGenreFilter] = useState("All");

  // 1. Fetch movies and userMovies on component mount
  useEffect(() => {
    dispatch(fetchMovies());
    dispatch(fetchUserMovies());
  }, [dispatch]);

  // 2. Filter out movies that the user has already marked as "watched"
  const unwatchedMovies = movies.filter(
    (movie) =>
      !userMovies.some(
        (userMovie) =>
          userMovie.movieId === movie.id &&
          userMovie.status === "watched" && // Check status
          userMovie.userId === currentUserId
      )
  );

  // 3. Filter movies by search query and genre
  const filteredMovies = unwatchedMovies
    .filter((movie) =>
      movie.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter((movie) =>
      genreFilter === "All" || movie.genres?.includes(genreFilter)
    );

  // 4. Sort movies based on sortOption
  const sortedMovies = [...filteredMovies].sort((a, b) => {
    if (sortOption === "title") return a.title.localeCompare(b.title);
    if (sortOption === "releaseDate")
      return new Date(a.releaseDate) - new Date(b.releaseDate);
    if (sortOption === "rating") return b.averageRating - a.averageRating;
    return 0;
  });

  // 5. Check if a movie is already in the user's watchlist
  const isInWatchlist = (movieId) =>
    userMovies.some(
      (userMovie) =>
        userMovie.movieId === movieId &&
        userMovie.status === "watchlist" && // Check status
        userMovie.userId === currentUserId
    );

  // 6. Mark a movie as watched
  const handleMarkAsWatched = async (movieId) => {
    try {
      const userMovie = userMovies.find(
        (um) => um.movieId === movieId && um.userId === currentUserId
      );

      if (
        userMovie &&
        (userMovie.status === "watchlist" || userMovie.status === "none")
      ) {
        // If the movie is currently "watchlist", update status to "watched"
        await dispatch(
          updateSingleUserMovie({
            userId: userMovie.userId,
            movieId: userMovie.movieId,
            status: "watched",
          })
        );
        dispatch(fetchUserMovies());
      } else {
        // Otherwise, create a new entry with status: "watched"
        await dispatch(
          createUserMovie({
            userId: currentUserId,
            movieId,
            status: "watched",
          })
        );
      }

      alert("Movie marked as watched!");
    } catch (err) {
      console.error("Error marking movie as watched:", err);
    }
  };

  // 7. Add a movie to the watchlist
  const handleAddToWatchlist = async (movieId) => {
    try {
      // Optionally fetch a predicted rating
      const response = await fetch("http://127.0.0.1:5000/api/predict-rating", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: currentUserId, movieId }),
      });
      const data = await response.json();

      const predictedRating =
        response.ok && data.predictedRating !== undefined
          ? data.predictedRating
          : 0.0;

      // Add or create the userMovie record with "watchlist" status
      const userMovie = userMovies.find(
        (um) => um.movieId === movieId && um.userId === currentUserId
      );

      if (userMovie && userMovie.status === "none") {
        // If the movie is currently "watchlist", update status to "watched"
        await dispatch(
          updateSingleUserMovie({
            userId: userMovie.userId,
            movieId: userMovie.movieId,
            status: "watchlist",
          })
        );
        dispatch(fetchUserMovies());
      } else {
      await dispatch(
        createUserMovie({
          userId: currentUserId,
          movieId,
          status: "watchlist",
          predictedRating,
        })
      );}

      alert(`Movie added to watchlist! Predicted Rating: ${predictedRating}`);
    } catch (err) {
      console.error(
        "Error adding movie to watchlist or fetching predicted rating:",
        err
      );
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="search-container">
      <h1>Search for Movies</h1>

      {/* Search Controls */}
      <div className="search-controls">
        <input
          type="text"
          placeholder="Search for a movie..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="sort-dropdown"
        >
          <option value="title">Sort by Title</option>
          <option value="releaseDate">Sort by Release Date</option>
          <option value="rating">Sort by Rating</option>
        </select>
        <select
          value={genreFilter}
          onChange={(e) => setGenreFilter(e.target.value)}
          className="genre-dropdown"
        >
          <option value="All">All Genres</option>
          {[...new Set(movies.flatMap((movie) => movie.genres || []))].map(
            (genre) => (
              <option key={genre} value={genre}>
                {genre}
              </option>
            )
          )}
        </select>
      </div>

      {/* Movies List */}
      <div
        className={`movies-list ${
          sortedMovies.length === 1 ? "single-result" : ""
        }`}
      >
        {sortedMovies.map((movie) => (
          <div
            key={movie.id}
            className={`movie-item ${
              isInWatchlist(movie.id) ? "watchlist-movie" : ""
            }`}
          >
            {movie.posterUrl ? (
              <img
                src={movie.posterUrl}
                alt={movie.title}
                className="movie-poster"
              />
            ) : (
              <div className="no-poster">No Image Available</div>
            )}

            <Link to={`/movies/${movie.id}`}>
              <h3>{movie.title || "Untitled Movie"}</h3>
            </Link>

            <p>
              <strong>Genres:</strong> {movie.genres?.join(", ") || "N/A"}
            </p>

            <div className="movie-actions">
              <button
                className="mark-watched-button"
                onClick={() => handleMarkAsWatched(movie.id)}
              >
                Mark as Watched
              </button>

              {!isInWatchlist(movie.id) && (
                <button
                  className="add-watchlist-button"
                  onClick={() => handleAddToWatchlist(movie.id)}
                >
                  Add to Watchlist
                </button>
              )}

              {isInWatchlist(movie.id) && (
                <div className="watchlist-tag">On Watchlist</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Search;
