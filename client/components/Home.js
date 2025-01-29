// import React from 'react'
// import {connect} from 'react-redux'
// import RateMovie from './RateMovie';

// /**
//  * COMPONENT
//  */
// export const Home = props => {
//   const {username} = props

//   return (
//     <div>
//       <RateMovie/>
//     </div>
//   )
// }

// /**
//  * CONTAINER
//  */
// const mapState = state => {
//   return {
//     username: state.auth.username
//   }
// }

// export default connect(mapState)(Home)

import React from "react";
import { Link } from "react-router-dom";
// import "./Home.css"; // optional CSS file

const Home = () => {
  return (
    <div className="home-container">
      {/* Hero / Header Section */}
      <section className="hero-section">
        <h1>Welcome to PopcornPair!</h1>
        <p>Your hub for discovering, sharing, and rating movies with friends.</p>
        <Link to="/search" className="hero-button">
          Find Movies
        </Link>
      </section>

      {/* Features / Cards Section */}
      <section className="features-section">
        <h2>What Can You Do?</h2>
        <div className="features-grid">
          {/* 1. Search Feature */}
          <div className="feature-card">
            <h3>Search for Movies</h3>
            <p>
              Quickly find new movies by genre, rating, or release date.
              Add them to your watchlist or mark them as watched instantly.
            </p>
            <Link to="/search" className="feature-link">
              Go to Search
            </Link>
          </div>

          {/* 2. Watchlist Feature */}
          <div className="feature-card">
            <h3>Your Watchlist</h3>
            <p>
              Keep track of movies you plan to watch. Receive predicted ratings,
              so you can decide what to watch next.
            </p>
            <Link to="/watchlist" className="feature-link">
              Go to Watchlist
            </Link>
          </div>

          {/* 3. Watched Feature */}
          <div className="feature-card">
            <h3>Your Watched Movies</h3>
            <p>
              See all the movies you’ve watched, rate them, or update your reviews.
            </p>
            <Link to="/watched" className="feature-link">
              Go to Watched
            </Link>
          </div>

          {/* 4. Match Feature */}
          <div className="feature-card">
            <h3>Movie Matching</h3>
            <p>
              Find overlapping watchlist movies with your friends, and watch together!
            </p>
            <Link to="/list" className="feature-link">
              Match with Friends
            </Link>
          </div>
         <div className="feature-card">
            <h3>Recommendations</h3>
            <p>
              Receive direct suggestions from friends or suggest movies
              to them. Find which titles they haven’t seen yet!
            </p>
            <Link to="/recommendations" className="feature-link">
              Go to Recommendations
            </Link>
          </div>

          {/* Card 6: Our Unique Algorithm */}
          <div className="feature-card">
            <h3>Personalized Ratings</h3>
            <p>
              Our smart algorithm uses critic scores, friend ratings, and
              your own rating history to estimate how much you'll enjoy
              each movie on your watchlist.
            </p>
            <Link to="/algorithm" className="feature-link">
              Learn About Our Algorithm
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
