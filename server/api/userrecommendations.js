const router = require('express').Router();
const { models: { UserRecommendation } } = require('../db');

// Get all user-recommendations
router.get('/', async (req, res, next) => {
  try {
    const recommendations = await UserRecommendation.findAll();
    res.json(recommendations);
  } catch (err) {
    next(err);
  }
});

// Get recommendations sent by a specific user
router.get('/sent/:userId', async (req, res, next) => {
  try {
    const recommendations = await UserRecommendation.findAll({ where: { senderId: req.params.userId } });
    res.json(recommendations);
  } catch (err) {
    next(err);
  }
});

// Get recommendations received by a specific user
router.get('/received/:userId', async (req, res, next) => {
  try {
    const recommendations = await UserRecommendation.findAll({ where: { receiverId: req.params.userId } });
    res.json(recommendations);
  } catch (err) {
    next(err);
  }
});

// Create a new user-recommendation
router.post('/', async (req, res, next) => {
  try {
    const { senderId, receiverId, movieId } = req.body;

    // Check if a similar recommendation already exists (optional, for uniqueness)
    const existing = await UserRecommendation.findOne({ where: { senderId, receiverId, movieId } });
    if (existing) {
      return res.status(400).send('Recommendation already exists');
    }

    // Create a new recommendation
    const newRecommendation = await UserRecommendation.create(req.body);
    res.status(201).json(newRecommendation);
  } catch (err) {
    next(err);
  }
});

// Update a recommendation (e.g., add response, accept, or liked)
router.put('/:id', async (req, res, next) => {
  try {
    const recommendation = await UserRecommendation.findByPk(req.params.id);
    if (recommendation) {
      const updatedRecommendation = await recommendation.update(req.body);
      res.json(updatedRecommendation);
    } else {
      res.status(404).send('Recommendation not found');
    }
  } catch (err) {
    next(err);
  }
});

// Delete a recommendation
router.delete('/:id', async (req, res, next) => {
  try {
    const recommendation = await UserRecommendation.findByPk(req.params.id);
    if (recommendation) {
      await recommendation.destroy();
      res.json(recommendation);
    } else {
      res.status(404).send('Recommendation not found');
    }
  } catch (err) {
    next(err);
  }
});

module.exports = router;
