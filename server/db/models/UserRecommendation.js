const Sequelize = require('sequelize');
const db = require('../db');

const UserRecommendation = db.define('user_recommendation', {
  senderId: {
    type: Sequelize.INTEGER,
    allowNull: false, // The user who sent the recommendation
  },
  receiverId: {
    type: Sequelize.INTEGER,
    allowNull: false, // The user who received the recommendation
  },
  movieId: {
    type: Sequelize.INTEGER,
    allowNull: false, // The movie being recommended
  },
  message: {
    type: Sequelize.TEXT, // Optional message from the sender
    allowNull: true,
  },
  response: {
    type: Sequelize.TEXT, // Optional response from the receiver
    allowNull: true,
  },
  accept: {
    type: Sequelize.STRING, // "yes" or "no"
    allowNull: true,
    validate: {
      isIn: [['yes', 'no']],
    },
  },
  liked: {
    type: Sequelize.STRING, // "yes" or "no"
    allowNull: true,
    validate: {
      isIn: [['yes', 'no']],
    },
  },
  createdAt: {
    type: Sequelize.DATE,
    allowNull: false,
    defaultValue: Sequelize.NOW, // Defaults to the current date
  },
}, {
  indexes: [
    {
      unique: true,
      fields: ['senderId', 'receiverId', 'movieId'], // Ensures uniqueness of each recommendation
    },
  ],
});

module.exports = UserRecommendation;
