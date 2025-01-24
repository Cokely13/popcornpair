// this is the access point for all things database related!

const db = require('./db');

const User = require('./models/User');
const Movie = require('./models/Movie');
const Rating = require('./models/Rating');
const UserMovie = require('./models/UserMovie');
const Friend = require("./Friend");
const UserRecommendation = require('./models/UserRecommendation'); // Import the new model
const Friend = require('./models/Friend');

// Associations
// Rating associations
User.hasMany(Rating);
Rating.belongsTo(User);

Movie.hasMany(Rating);
Rating.belongsTo(Movie);

// UserMovie associations
User.belongsToMany(Movie, { through: UserMovie });
Movie.belongsToMany(User, { through: UserMovie });

// UserRecommendation associations
User.hasMany(UserRecommendation, { as: 'sentRecommendations', foreignKey: 'senderId' });
User.hasMany(UserRecommendation, { as: 'receivedRecommendations', foreignKey: 'receiverId' });
UserRecommendation.belongsTo(User, { as: 'sender', foreignKey: 'senderId' });
UserRecommendation.belongsTo(User, { as: 'receiver', foreignKey: 'receiverId' });

Movie.hasMany(UserRecommendation, { foreignKey: 'movieId' });
UserRecommendation.belongsTo(Movie, { foreignKey: 'movieId' });

User.belongsToMany(User, { as: "Friends", through: Friend, foreignKey: "userId", otherKey: "friendId" });

module.exports = {
  db,
  models: {
    User,
    Movie,
    Rating,
    UserMovie,
    UserRecommendation, // Export the new model
    Friend
  },
};
