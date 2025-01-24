const Sequelize = require("sequelize");
const db = require("../db");

const Friend = db.define("friend", {
  status: {
    type: Sequelize.ENUM("pending", "accepted", "rejected"),
    defaultValue: "pending",
  },
});

module.exports = Friend;
