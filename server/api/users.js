const router = require('express').Router();
const {
  models: { User, Movie, Rating },
} = require('../db');

module.exports = router;

router.get('/', async (req, res, next) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'username'],
      include: [Movie, Rating],
    });
    res.json(users);
  } catch (err) {
    next(err);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);
    const updatedUser = await user.update(req.body);
    res.json(updatedUser);
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const newUser = await User.create(req.body);
    res.status(201).json(newUser);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id, {
      include: [Movie, Rating],
      attributes: ['id', 'username'],
    });
    res.json(user);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);
    await user.destroy();
    res.send(user);
  } catch (error) {
    next(error);
  }
});
