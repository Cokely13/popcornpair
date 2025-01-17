const Sequelize = require('sequelize');
const db = require('../db');

const Rating = db.define('rating', {
  rating: {
    type: Sequelize.ENUM('YES', 'NO'),
    allowNull: false,
  },
}, {
  indexes: [
    {
      unique: true,
      fields: ['userId', 'movieId'], // Ensures uniqueness for each user-movie pair
    },
  ],
});

module.exports = Rating;
