
const Sequelize = require('sequelize');
const db = require('../db');

const UserMovie = db.define('user_movie', {
  userId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  movieId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  // watched: {
  //   type: Sequelize.BOOLEAN,
  //   defaultValue: false,
  // },
  // watchlist: {
  //   type: Sequelize.BOOLEAN,
  //   defaultValue: false,
  // },
  status: {
    type: Sequelize.ENUM('watchlist', 'watched', 'none'),
    allowNull: false,
    defaultValue: 'watchlist', // or 'watched', depending on what makes sense
  },
  rating: {
    type: Sequelize.INTEGER,
    allowNull: true,
    validate: {
      min: 1,
      max: 10, // Ensures the rating is between 1 and 10
    },
  },
  watchedWith: {
    type: Sequelize.INTEGER, // Stores the userId of the person they watched the movie with
    allowNull: true,
  },
  predictedRating: {
    type: Sequelize.FLOAT,
    allowNull: false,
    defaultValue: 0.0 // Always have a fallback value
},
  dateWatched: {
    type: Sequelize.DATEONLY, // Stores only the date (YYYY-MM-DD)
    allowNull: true,
    defaultValue: Sequelize.NOW, // Defaults to the current date
  },
}, {
  indexes: [
    {
      unique: true,
      fields: ['userId', 'movieId'], // Ensures uniqueness for each user-movie pair
    },
  ],
});

module.exports = UserMovie;
