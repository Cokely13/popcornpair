
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
  watched: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
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
