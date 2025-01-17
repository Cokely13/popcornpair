import Axios from "axios";

// Action Types
const SET_SINGLE_MOVIE = "SET_SINGLE_MOVIE";
const UPDATE_SINGLE_MOVIE = "UPDATE_SINGLE_MOVIE";

// Action Creators
export const _setSingleMovie = (movie) => {
  return {
    type: SET_SINGLE_MOVIE,
    movie,
  };
};

const _updateSingleMovie = (movie) => {
  return {
    type: UPDATE_SINGLE_MOVIE,
    movie,
  };
};

// Thunks
export const fetchSingleMovie = (id) => {
  return async (dispatch) => {
    const { data } = await Axios.get(`/api/movies/${id}`);
    dispatch(_setSingleMovie(data));
  };
};

export const updateSingleMovie = (movie) => {
  return async (dispatch) => {
    await Axios.put(`/api/movies/${movie.id}`, movie);
    const { data: updated } = await Axios.get(`/api/movies/${movie.id}`);
    dispatch(_updateSingleMovie(updated));
  };
};

// Reducer
const initialState = {};

export default function singleMovieReducer(state = initialState, action) {
  switch (action.type) {
    case SET_SINGLE_MOVIE:
      return action.movie;
    case UPDATE_SINGLE_MOVIE:
      return action.movie;
    default:
      return state;
  }
}
