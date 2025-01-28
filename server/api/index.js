const router = require('express').Router()
module.exports = router

router.use('/users', require('./users'))
router.use('/movies', require('./movies'))
router.use('/friends', require('./friends'))
router.use('/usermovies', require('./usermovies'))
// router.use('/ratings', require('./ratings'))
router.use('/recommendations', require('./recommendations'));
router.use('/userrecommendations', require('./userrecommendations'));

router.use((req, res, next) => {
  const error = new Error('Not Found')
  error.status = 404
  next(error)
})
