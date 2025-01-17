import Axios from "axios";

// Action Types
const SET_USER_MOVIES = "SET_USER_MOVIES";
const CREATE_USER_MOVIE = "CREATE_USER_MOVIE";
const DELETE_USER_MOVIE = "DELETE_USER_MOVIE";

// Action Creators
export const setUserMovies = (userMovies) => {
  return {
    type: SET_USER_MOVIES,
    userMovies,
  };
};

const _createUserMovie = (userMovie) => {
  return {
    type: CREATE_USER_MOVIE,
    userMovie,
  };
};

const _deleteUserMovie = (userMovie) => {
  return {
    type: DELETE_USER_MOVIE,
    userMovie,
  };
};

// Thunks
export const fetchUserMovies = () => {
  return async (dispatch) => {
    const { data } = await Axios.get("/api/usermovies");
    dispatch(setUserMovies(data));
  };
};

export const createUserMovie = (userMovie) => {
  return async (dispatch) => {
    const { data: created } = await Axios.post("/api/usermovies", userMovie);
    dispatch(_createUserMovie(created));
  };
};

export const deleteUserMovie = (id) => {
  return async (dispatch) => {
    const { data: deleted } = await Axios.delete(`/api/usermovies/${id}`);
    dispatch(_deleteUserMovie(deleted));
  };
};

// Reducer
const initialState = [];

export default function userMoviesReducer(state = initialState, action) {
  switch (action.type) {
    case SET_USER_MOVIES:
      return action.userMovies;
    case CREATE_USER_MOVIE:
      return [...state, action.userMovie];
    case DELETE_USER_MOVIE:
      return state.filter((userMovie) => userMovie.id !== action.userMovie.id);
    default:
      return state;
  }
}
