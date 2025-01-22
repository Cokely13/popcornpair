import Axios from "axios";

// Action Types
const SET_SINGLE_USER_MOVIE = "SET_SINGLE_USER_MOVIE";
const UPDATE_SINGLE_USER_MOVIE = "UPDATE_SINGLE_USER_MOVIE";

// Action Creators
export const _setSingleUserMovie = (userMovie) => {
  return {
    type: SET_SINGLE_USER_MOVIE,
    userMovie,
  };
};

const _updateSingleUserMovie = (userMovie) => {
  return {
    type: UPDATE_SINGLE_USER_MOVIE,
    userMovie,
  };
};

// Thunks
export const fetchSingleUserMovie = (movieId) => {
  return async (dispatch) => {
    const { data } = await Axios.get(`/api/usermovies/${movieId}`);
    dispatch(_setSingleUserMovie(data));
  };
};

export const updateSingleUserMovie = (userMovie) => {

  return async (dispatch) => {
    await Axios.put(`/api/usermovies/${userMovie.movieId}`, userMovie);
    const { data: updated } = await Axios.get(`/api/usermovies/${userMovie.movieId}`);
    dispatch(_updateSingleUserMovie(updated));
  };
};

// Reducer
const initialState = {};

export default function singleUserMovieReducer(state = initialState, action) {
  switch (action.type) {
    case SET_SINGLE_USER_MOVIE:
      return action.userMovie;
    case UPDATE_SINGLE_USER_MOVIE:
      return action.userMovie;
    default:
      return state;
  }
}
