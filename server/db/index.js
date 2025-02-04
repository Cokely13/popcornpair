// this is the access point for all things database related!

const db = require('./db');

const User = require('./models/User');
const Movie = require('./models/Movie');
// const Rating = require('./models/Rating');
const UserMovie = require('./models/UserMovie');
const Friend = require('./models/Friend');
const UserRecommendation = require('./models/UserRecommendation'); // Import the new model

User.belongsToMany(Movie, { through: UserMovie });
Movie.belongsToMany(User, { through: UserMovie });

// UserRecommendation associations
User.hasMany(UserRecommendation, { as: 'sentRecommendations', foreignKey: 'senderId' });
User.hasMany(UserRecommendation, { as: 'receivedRecommendations', foreignKey: 'receiverId' });
UserRecommendation.belongsTo(User, { as: 'sender', foreignKey: 'senderId' });
UserRecommendation.belongsTo(User, { as: 'receiver', foreignKey: 'receiverId' });

Movie.hasMany(UserRecommendation, { foreignKey: 'movieId' });
UserRecommendation.belongsTo(Movie, { foreignKey: 'movieId' });

// A user can have many friends
User.hasMany(Friend, { foreignKey: 'userId' });
User.hasMany(Friend, { foreignKey: 'friendId' });

// Friend includes references to the requester
Friend.belongsTo(User, { as: 'user', foreignKey: 'userId' });
Friend.belongsTo(User, { as: 'friend', foreignKey: 'friendId' });


module.exports = {
  db,
  models: {
    User,
    Movie,
    // Rating,
    UserMovie,
    UserRecommendation, // Export the new model
    Friend
  },
};
