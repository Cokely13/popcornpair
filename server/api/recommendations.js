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

    const ratingsData = userMovies
      .filter((um) => um.rating !== null) // Exclude null ratings
      .map((um) => ({
        UserID: um.userId,
        Movie: um.movieId,
        Rating: um.rating,
      }));

    // Call the Flask API for recommendations
    const { data: recommendations } = await axios.post(`http://127.0.0.1:5000/recommendations/${userId}`, {
      ratings_data: ratingsData,
    });

    // Check if recommendations is an array
    if (!Array.isArray(recommendations)) {
      console.error("Recommendations is not an array:", recommendations);
      return res.status(500).json({ error: "Invalid response from recommendation engine." });
    }

    // Fetch details for the recommended movies
    const recommendedMovies = await Movie.findAll({
      where: {
        id: recommendations.map((rec) => rec[0]), // Use movie IDs from recommendations
      },
    });

    res.json(recommendedMovies);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
