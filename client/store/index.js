import {createStore, combineReducers, applyMiddleware} from 'redux'
import {createLogger} from 'redux-logger'
import thunkMiddleware from 'redux-thunk'
import {composeWithDevTools} from 'redux-devtools-extension'
import auth from './auth'
import moviesReducer from './allMoviesStore'
import singleMovieReducer from './singleMovieStore'
import ratingsReducer from './allRatingsStore'
import singleRatingReducer from './singleRatingStore'

const reducer = combineReducers({ auth,
  allMovies: moviesReducer,
  singleMovie: singleMovieReducer,
  allRatings: ratingsReducer,
  singleRating: singleRatingReducer
 })
const middleware = composeWithDevTools(
  applyMiddleware(thunkMiddleware, createLogger({collapsed: true}))
)
const store = createStore(reducer, middleware)

export default store
export * from './auth'
