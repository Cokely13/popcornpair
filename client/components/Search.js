import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMovies } from "../store/allMoviesStore";
import { fetchUserMovies } from "../store/allUserMoviesStore";
import { updateSingleUserMovie } from "../store/singleUserMovieStore";

const Search = () => {
  const dispatch = useDispatch();

  const movies = useSelector((state) => state.allMovies);
  const userMovies = useSelector((state) => state.allUserMovies);
  const currentUserId = useSelector((state) => state.auth.id);

  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("title"); // Default sorting by title
  const [genreFilter, setGenreFilter] = useState("All"); // Default to all genres

  // Fetch movies and userMovies on component mount
  useEffect(() => {
    dispatch(fetchMovies());
    dispatch(fetchUserMovies());
  }, [dispatch]);

  // Get movies the user hasn't watched
  const unwatchedMovies = movies.filter(
    (movie) => !userMovies.some((userMovie) => userMovie.movieId === movie.id && userMovie.watched)
  );

  // Filter movies by search query and genre
  const filteredMovies = unwatchedMovies
    .filter((movie) =>
      movie.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter((movie) =>
      genreFilter === "All" || movie.genres?.includes(genreFilter)
    );

  // Sort movies based on sortOption
  const sortedMovies = [...filteredMovies].sort((a, b) => {
    if (sortOption === "title") return a.title.localeCompare(b.title);
    if (sortOption === "releaseDate") return new Date(a.releaseDate) - new Date(b.releaseDate);
    if (sortOption === "rating") return b.averageRating - a.averageRating; // Assuming averageRating exists
    return 0;
  });

  // Mark a movie as watched
  const handleMarkAsWatched = async (movieId) => {
    try {
      await dispatch(
        updateSingleUserMovie({ userId: currentUserId, movieId, watched: true })
      );
      alert("Movie marked as watched!");
    } catch (err) {
      console.error("Error marking movie as watched:", err);
    }
  };

  return (
    <div className="search-container">
      <h1>Search for Movies</h1>

      {/* Search Input */}
      <input
        type="text"
        placeholder="Search for a movie..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="search-input"
      />

      {/* Sort Dropdown */}
      <select
        value={sortOption}
        onChange={(e) => setSortOption(e.target.value)}
        className="sort-dropdown"
      >
        <option value="title">Sort by Title</option>
        <option value="releaseDate">Sort by Release Date</option>
        <option value="rating">Sort by Rating</option>
      </select>

      {/* Genre Filter Dropdown */}
      <select
        value={genreFilter}
        onChange={(e) => setGenreFilter(e.target.value)}
        className="genre-dropdown"
      >
        <option value="All">All Genres</option>
        {/* Dynamically generate genre options */}
        {[...new Set(movies.flatMap((movie) => movie.genres || []))].map(
          (genre) => (
            <option key={genre} value={genre}>
              {genre}
            </option>
          )
        )}
      </select>

      {/* Movies List */}
      <div className="movies-list">
        {sortedMovies.map((movie) => (
          <div key={movie.id} className="movie-item">
            <h2>{movie.title}</h2>
            <p><strong>Release Date:</strong> {movie.releaseDate || "N/A"}</p>
            <p><strong>Genres:</strong> {movie.genres?.join(", ") || "N/A"}</p>
            <button
              onClick={() => handleMarkAsWatched(movie.id)}
              className="mark-watched-button"
            >
              Mark as Watched
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Search;
