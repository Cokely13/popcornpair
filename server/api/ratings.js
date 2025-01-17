const router = require('express').Router();
const { Rating } = require('../db');

// POST or PUT to rate a movie
router.post('/', async (req, res, next) => {
  try {
    const { userId, movieId, rating } = req.body;

    // Find an existing rating
    let userRating = await Rating.findOne({
      where: { userId, movieId },
    });

    if (userRating) {
      // Update existing rating
      userRating = await userRating.update({ rating });
    } else {
      // Create new rating
      userRating = await Rating.create({ userId, movieId, rating });
    }

    res.status(201).json(userRating);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
