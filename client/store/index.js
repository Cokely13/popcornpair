import {createStore, combineReducers, applyMiddleware} from 'redux'
import {createLogger} from 'redux-logger'
import thunkMiddleware from 'redux-thunk'
import {composeWithDevTools} from 'redux-devtools-extension'
import auth from './auth'
import moviesReducer from './allMoviesStore'
import singleMovieReducer from './singleMovieStore'
import ratingsReducer from './allRatingsStore'
import singleRatingReducer from './singleRatingStore'
import usersReducer from './allUsersStore'
import singleUserReducer from './singleUserStore'
import singleUserMovieReducer from './singleUserMovieStore'
import userMoviesReducer from './allUserMoviesStore'
import userRecommendationsReducer from './allUserRecommendationsStore'
import singleUserRecommendationReducer from './singleUserRecommendationStore'

const reducer = combineReducers({ auth,
  allMovies: moviesReducer,
  singleMovie: singleMovieReducer,
  allRatings: ratingsReducer,
  singleRating: singleRatingReducer,
  allUsers: usersReducer,
  singleUser: singleUserReducer,
  singleUserMovieReducer,
  allUserMovies: userMoviesReducer,
  allUserRecommendations: userRecommendationsReducer,
  singleUserRecommendation: singleUserRecommendationReducer
 })
const middleware = composeWithDevTools(
  applyMiddleware(thunkMiddleware, createLogger({collapsed: true}))
)
const store = createStore(reducer, middleware)

export default store
export * from './auth'
