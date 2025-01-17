// const Sequelize = require('sequelize');
// const db = require('../db');

// const UserMovie = db.define('user_movie', {
//   userId: {
//     type: Sequelize.INTEGER,
//     allowNull: false,
//   },
//   watched: {
//     type: Sequelize.BOOLEAN,
//     defaultValue: false,
//   },
// });

// module.exports = UserMovie;

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
}, {
  indexes: [
    {
      unique: true,
      fields: ['userId', 'movieId'], // Ensures uniqueness for each user-movie pair
    },
  ],
});

module.exports = UserMovie;

