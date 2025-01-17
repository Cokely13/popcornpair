const router = require('express').Router();
const { models: { Movie } } = require('../db');

// Get all movies
router.get('/', async (req, res, next) => {
  try {
    const movies = await Movie.findAll();
    res.json(movies);
  } catch (err) {
    next(err);
  }
});

// Get a single movie by ID
router.get('/:id', async (req, res, next) => {
  try {
    const movie = await Movie.findByPk(req.params.id);
    res.json(movie);
  } catch (err) {
    next(err);
  }
});

// Create a new movie
router.post('/', async (req, res, next) => {
  try {
    const newMovie = await Movie.create(req.body);
    res.status(201).send(newMovie);
  } catch (err) {
    next(err);
  }
});

// Update a movie by ID
router.put('/:id', async (req, res, next) => {
  try {
    const movie = await Movie.findByPk(req.params.id);
    const updatedMovie = await movie.update(req.body);
    res.send(updatedMovie);
  } catch (err) {
    next(err);
  }
});

// Delete a movie by ID
router.delete('/:id', async (req, res, next) => {
  try {
    const movie = await Movie.findByPk(req.params.id);
    await movie.destroy();
    res.send(movie);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
