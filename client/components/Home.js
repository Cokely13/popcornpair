import React from "react";
import { Link } from "react-router-dom";
import "./Home.css"; // optional CSS file

const Home = () => {
  return (
    <div className="home-container">
      {/* Hero / Header Section */}
      <section className="hero-section">

      <h1 style={{ color: "#f4b400" }}>🎬 PopcornPair</h1>
        <p>Your hub for discovering, sharing, and rating movies with friends.</p>
        <Link to="/rate" className="hero-button">
          Explore Movies
        </Link>
      </section>

      {/* Features / Cards Section */}
      <section className="features-section">
        <h2>What Can You Do?</h2>
        <div className="features-grid">
          {/* 1. Search Feature */}
          <Link to="/search" className="feature-link">
          <div className="feature-card">
            <h3>Search for Movies</h3>
            <p>
              Quickly find new movies by genre, rating, or release date.
              Add them to your watchlist or mark them as watched instantly.
            </p>

              {/* Go to Search */}
          </div>
          </Link>

          {/* 2. Watchlist Feature */}
          <Link to="/watchlist" className="feature-link">
          <div className="feature-card">
            <h3>Your Watchlist</h3>
            <p>
              Keep track of movies you plan to watch. Receive predicted ratings,
              so you can decide what to watch next.
            </p>

              {/* Go to Watchlist */}
          </div>
          </Link>

          {/* 3. Watched Feature */}
          <Link to="/watched" className="feature-link">
          <div className="feature-card">
            <h3>Your Watched Movies</h3>
            <p>
              See all the movies you’ve watched, rate them, or update your reviews.
            </p>
              {/* Go to Watched */}
          </div>
          </Link>

          {/* 4. Match Feature */}
          <Link to="/list" className="feature-link">
          <div className="feature-card">
            <h3>Movie Matching</h3>
            <p>
            Find common movies in your watchlists with friends and watch together!
            </p>
              {/* Match with Friends */}

          </div>
          </Link>
          <Link to="/recommendations" className="feature-link">
         <div className="feature-card">
            <h3>Recommendations</h3>
            <p>
            Get and share movie suggestions with friends. Discover titles they haven't seen.
            </p>

              {/* Go to Recommendations */}
          </div>
          </Link>

          {/* Card 6: Our Unique Algorithm */}
          <Link to="/algorithm" className="feature-link">
          <div className="feature-card">
  <h3>Personalized Ratings</h3>
  <p>
    Our advanced algorithm combines real-time critic scores, friend ratings, and your own rating history to deliver a dynamic prediction for every movie. If you're just starting out, you'll receive a dependable rule-based estimate. Once you've rated more movies, our system switches to collaborative filtering for even more precise recommendations.
  </p>
  Learn More About Our Algorithm
</div>
           </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;


