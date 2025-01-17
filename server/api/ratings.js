const router = require('express').Router();
const { models: { Rating, Movie } } = require('../db');

// Get all ratings
router.get('/', async (req, res, next) => {
  try {
    const ratings = await Rating.findAll();
    res.json(ratings);
  } catch (err) {
    next(err);
  }
});

router.get('/:userId', async (req, res, next) => {
  try {
    const userRatings = await Rating.findAll({
      where: { userId: req.params.userId },
      include: [Movie], // Include associated movies if needed
    });
    res.json(userRatings);
  } catch (err) {
    next(err);
  }
});


// Create a new rating
router.post('/', async (req, res, next) => {
  try {
    const newRating = await Rating.create(req.body);
    res.status(201).send(newRating);
  } catch (err) {
    next(err);
  }
});

// Update a rating by ID
router.put('/:id', async (req, res, next) => {
  try {
    const rating = await Rating.findByPk(req.params.id);
    const updatedRating = await rating.update(req.body);
    res.send(updatedRating);
  } catch (err) {
    next(err);
  }
});

// Delete a rating by ID
router.delete('/:id', async (req, res, next) => {
  try {
    const rating = await Rating.findByPk(req.params.id);
    await rating.destroy();
    res.send(rating);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
