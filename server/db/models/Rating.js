const Sequelize = require('sequelize');
const db = require('../db');

const Rating = db.define('rating', {
  rating: {
    type: Sequelize.ENUM('YES', 'NO'),
    allowNull: false,
  },
});

module.exports = Rating;
