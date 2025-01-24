const Sequelize = require('sequelize');
const db = require('../db');

const Friend = db.define('friend', {
  userId: {
    type: Sequelize.INTEGER,
    allowNull: false, // The user who received the request
  },
  friendId: {
    type: Sequelize.INTEGER,
    allowNull: false, // The user who sent the request
  },
  status: {
    type: Sequelize.ENUM("pending", "accepted", "denied"), // Predefined values
    defaultValue: "pending", // Default status is 'pending'
    allowNull: false,
  },
});

module.exports = Friend;
