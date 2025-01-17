import Axios from "axios";

// Action Types
const SET_MOVIES = "SET_MOVIES";
const CREATE_MOVIE = "CREATE_MOVIE";
const DELETE_MOVIE = "DELETE_MOVIE";

// Action Creators
export const setMovies = (movies) => {
  return {
    type: SET_MOVIES,
    movies,
  };
};

const _createMovie = (movie) => {
  return {
    type: CREATE_MOVIE,
    movie,
  };
};

const _deleteMovie = (movie) => {
  return {
    type: DELETE_MOVIE,
    movie,
  };
};

// Thunks
export const fetchMovies = () => {
  return async (dispatch) => {
    const { data } = await Axios.get("/api/movies");
    dispatch(setMovies(data));
  };
};

export const createMovie = (movie) => {
  return async (dispatch) => {
    const { data: created } = await Axios.post("/api/movies", movie);
    dispatch(_createMovie(created));
  };
};

export const deleteMovie = (id) => {
  return async (dispatch) => {
    const { data: deleted } = await Axios.delete(`/api/movies/${id}`);
    dispatch(_deleteMovie(deleted));
  };
};

// Reducer
const initialState = [];

export default function moviesReducer(state = initialState, action) {
  switch (action.type) {
    case SET_MOVIES:
      return action.movies;
    case CREATE_MOVIE:
      return [...state, action.movie];
    case DELETE_MOVIE:
      return state.filter((movie) => movie.id !== action.movie.id);
    default:
      return state;
  }
}
