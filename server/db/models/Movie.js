const Sequelize = require('sequelize');
const db = require('../db');

const Movie = db.define('movie', {
  title: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  description: {
    type: Sequelize.TEXT,
    allowNull: true,
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
    type: Sequelize.ARRAY(Sequelize.STRING), // Example: ['Action', 'Comedy']
    allowNull: true,
  },
  watchProviders: {
    type: Sequelize.JSON, // Store streaming information as JSON
    allowNull: true,
  },
  tmdbId: {
    type: Sequelize.INTEGER,
    unique: true,
    allowNull: false, // TMDB ID for cross-referencing
  },
});

module.exports = Movie;
