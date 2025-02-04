import React, { useState } from "react";
import axios from "axios";
import config from "../config";

const AddMovie = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false); // Tracks if a search was performed

  const api = config.WATCHMODE_API_KEY

  const handleSearch = async () => {
    if (!searchTerm) {
      alert("Please enter a movie title to search.");
      return;
    }

    setLoading(true);
    setSearchPerformed(true); // Mark search as performed
    try {
      console.log("Searching Watchmode API for:", searchTerm);
      const { data } = await axios.get(`https://api.watchmode.com/v1/search/`, {
        params: {
          apiKey: api,
          search_field: "name", // Specify we're searching by name
          search_value: searchTerm, // Pass the movie title here
          search_type: "1", // 1 for movies
        },
      });
      console.log("API response:", data); // Log full API response
      setSearchResults(data.title_results || []); // Use `title_results` key
    } catch (error) {
      console.error("Error fetching movies:", error.response || error);
      alert("An error occurred while searching for movies.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddMovie = async (movie) => {
    try {
      const detailsResponse = await axios.get(
        `https://api.watchmode.com/v1/title/${movie.id}/details/`,
        { params: { apiKey: api} }
      );
      const details = detailsResponse.data;

      await axios.post("/api/movies", {
        title: details.title || "Untitled",
        description: details.plot_overview || "No description available",
        releaseDate: details.release_date || null,
        posterUrl: details.poster || null,
        genres: details.genre_names || [],
        watchProviders: details.sources || [],
        tmdbId: details.tmdb_id || null,
        userRating: details.user_rating || null,
        criticScore: details.critic_score || null,
        runtimeMinutes: details.runtime_minutes || null,
      });

      alert(`${details.title} has been added to the database!`);
    } catch (error) {
      console.error("Error adding movie:", error);
      alert("An error occurred while adding the movie.");
    }
  };

  return (
    <div className="add-movie-container">
      <section className="hero-section">
      <h1>ADD</h1>
      </section>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search for a movie..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="search-button " onClick={handleSearch} disabled={loading}>
          {loading ? "Searching..." : "SEARCH"}
        </button>
      </div>

      <div className="search-results">
        {searchPerformed ? (
          searchResults.length ? (
            searchResults.map((movie) => (
              <div key={movie.id} className="movie-item">
                <div className="movie-info">
                  <h3>{movie.name}</h3>
                  <p>Release Year: {movie.year || "Unknown"}</p>
                  <button className="addto-button" onClick={() => handleAddMovie(movie)}>
                    ADD TO DATABASE
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>No results found. Try searching for another movie.</p>
          )
        ) : (
          <p>Search for a movie to add!</p>
        )}
      </div>
    </div>
  );
};

export default AddMovie;
