//this is the access point for all things database related!

const db = require('./db')

const User = require('./models/User')
const Movie = require('./models/Movie')
const Rating = require('./models/Rating');

// Associations
User.hasMany(Rating);
Rating.belongsTo(User);

Movie.hasMany(Rating);
Rating.belongsTo(Movie);
//associations could go here!

module.exports = {
  db,
  models: {
    User,
    Movie,
    Rating
  },
}
