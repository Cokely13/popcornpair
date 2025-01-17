const Sequelize = require('sequelize');
const db = require('../db');

const UserMovie = db.define('user_movie', {
  userId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  watched: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },
});

module.exports = UserMovie;
