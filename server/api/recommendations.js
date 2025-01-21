// const router = require('express').Router();
// const { models: { UserMovie, Movie } } = require('../db');
// const { getRecommendations } = require('../../ml/app'); // Import Python function

// // GET recommendations for a user
// router.get('/:userId', async (req, res, next) => {
//   try {
//     const { userId } = req.params;

//     // Fetch ratings data for all users
//     const userMovies = await UserMovie.findAll({
//       attributes: ['userId', 'movieId', 'rating'],
//     });

//     // Convert to a format suitable for the Python script
//     const ratingsData = userMovies.map((um) => ({
//       UserID: um.userId,
//       Movie: um.movieId,
//       Rating: um.rating,
//     }));

//     // Call the Python recommendation function
//     const recommendations = getRecommendations(userId, ratingsData);

//     // Fetch movie details for recommendations
//     const recommendedMovies = await Movie.findAll({
//       where: {
//         id: recommendations.map((rec) => rec.movieId),
//       },
//     });

//     res.json(recommendedMovies);
//   } catch (err) {
//     next(err);
//   }
// });

// module.exports = router;

const router = require('express').Router();
const { models: { UserMovie, Movie } } = require('../db');
const axios = require('axios');

router.get('/:userId', async (req, res, next) => {
  try {
    const { userId } = req.params;

    // Fetch user movie ratings from the database
    const userMovies = await UserMovie.findAll({
      attributes: ['userId', 'movieId', 'rating'],
    });

    const ratingsData = userMovies.map((um) => ({
      UserID: um.userId,
      Movie: um.movieId,
      Rating: um.rating,
    }));

    // Call the Flask API for recommendations
    const { data: recommendations } = await axios.post(`http://127.0.0.1:5000/recommendations/${userId}`, {
      ratings_data: ratingsData,
    });

    // Fetch details for the recommended movies
    const recommendedMovies = await Movie.findAll({
      where: {
        id: recommendations.map((rec) => rec.movieId),
      },
    });

    res.json(recommendedMovies);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
