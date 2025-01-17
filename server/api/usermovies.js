const router = require('express').Router();
const { models: { UserMovie } } = require('../db');

// Get all user-movie relationships
router.get('/', async (req, res, next) => {
  try {
    const userMovies = await UserMovie.findAll();
    res.json(userMovies);
  } catch (err) {
    next(err);
  }
});

// Get a single user-movie relationship by movieId
router.get('/:movieId', async (req, res, next) => {
  try {
    const userMovie = await UserMovie.findOne({ where: { movieId: req.params.movieId } });
    if (userMovie) {
      res.json(userMovie);
    } else {
      res.status(404).send('User-movie relationship not found');
    }
  } catch (err) {
    next(err);
  }
});

// Create a new user-movie relationship
// router.post('/', async (req, res, next) => {
//   try {
//     const newUserMovie = await UserMovie.create(req.body);
//     res.status(201).send(newUserMovie);
//   } catch (err) {
//     next(err);
//   }
// });

router.post('/', async (req, res, next) => {
  try {
    const { userId, movieId } = req.body;

    // Check if the relationship already exists (optional, to avoid duplicates)
    const existing = await UserMovie.findOne({ where: { userId, movieId } });
    if (existing) {
      return res.status(400).send('UserMovie already exists');
    }

    // Create a new UserMovie
    const newUserMovie = await UserMovie.create(req.body);
    res.status(201).send(newUserMovie);
  } catch (err) {
    next(err);
  }
});

// Update a user-movie relationship by movieId
router.put('/:movieId', async (req, res, next) => {
  console.log("made it",req.params )
  try {
    const userMovie = await UserMovie.findOne({ where: { movieId: req.params.movieId } });
    if (userMovie) {
      const updatedUserMovie = await userMovie.update(req.body);
      res.send(updatedUserMovie);
    } else {
      res.status(404).send('User-movie relationship not found');
    }
  } catch (err) {
    next(err);
  }
});

// Delete a user-movie relationship by movieId
router.delete('/:movieId', async (req, res, next) => {
  try {
    const userMovie = await UserMovie.findOne({ where: { movieId: req.params.movieId } });
    if (userMovie) {
      await userMovie.destroy();
      res.send(userMovie);
    } else {
      res.status(404).send('User-movie relationship not found');
    }
  } catch (err) {
    next(err);
  }
});

module.exports = router;
