// const Sequelize = require('sequelize');
// const db = require('../db');

// const Movie = db.define('movie', {
//   title: {
//     type: Sequelize.STRING,
//     // allowNull: false,
//   },
//   description: {
//     type: Sequelize.TEXT,
//     allowNull: true,
//   },
//   releaseDate: {
//     type: Sequelize.DATEONLY,
//     allowNull: true,
//   },
//   posterUrl: {
//     type: Sequelize.STRING,
//     allowNull: true,
//   },
//   genres: {
//     type: Sequelize.ARRAY(Sequelize.STRING), // Example: ['Action', 'Comedy']
//     allowNull: true,
//   },
//   watchProviders: {
//     type: Sequelize.JSON, // Store streaming information as JSON
//     allowNull: true,
//   },
//   tmdbId: {
//     type: Sequelize.INTEGER,
//     unique: true,
//     // allowNull: false, // TMDB ID for cross-referencing
//   },
// });

// module.exports = Movie;

const Sequelize = require('sequelize');
const db = require('../db');

const Movie = db.define('movie', {
  title: {
    type: Sequelize.STRING,
    allowNull: false,
    defaultValue: 'Untitled',
  },
  description: {
    type: Sequelize.TEXT,
    allowNull: true,
    defaultValue: 'No description available',
  },
  releaseDate: {
    type: Sequelize.DATEONLY,
    allowNull: true,
  },
  posterUrl: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  genres: {
    type: Sequelize.ARRAY(Sequelize.STRING), // Example: ['Drama', 'Action']
    allowNull: true,
  },
  watchProviders: {
    type: Sequelize.JSON, // Store detailed streaming provider information
    allowNull: true,
  },
  tmdbId: {
    type: Sequelize.INTEGER,
    unique: true,
    allowNull: false, // TMDB ID for cross-referencing
  },
  userRating: {
    type: Sequelize.FLOAT, // User rating score (e.g., 9.2)
    allowNull: true,
  },
  criticScore: {
    type: Sequelize.INTEGER, // Critic score (e.g., 85)
    allowNull: true,
  },
  runtimeMinutes: {
    type: Sequelize.INTEGER, // Runtime in minutes (e.g., 120)
    allowNull: true,
  },
});

module.exports = Movie;
