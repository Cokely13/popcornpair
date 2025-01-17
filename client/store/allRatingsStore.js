import Axios from "axios";

// Action Types
const SET_RATINGS = "SET_RATINGS";
const CREATE_RATING = "CREATE_RATING";
const DELETE_RATING = "DELETE_RATING";

// Action Creators
export const setRatings = (ratings) => {
  return {
    type: SET_RATINGS,
    ratings,
  };
};

const _createRating = (rating) => {
  return {
    type: CREATE_RATING,
    rating,
  };
};

const _deleteRating = (rating) => {
  return {
    type: DELETE_RATING,
    rating,
  };
};

// Thunks
export const fetchRatings = (userId) => {
  return async (dispatch) => {
    const { data } = await Axios.get('/api/ratings');
    dispatch(setRatings(data));
  };
};

export const createRating = (rating) => {
  return async (dispatch) => {
    const { data: created } = await Axios.post("/api/ratings", rating);
    dispatch(_createRating(created));
  };
};

export const deleteRating = (id) => {
  return async (dispatch) => {
    const { data: deleted } = await Axios.delete(`/api/ratings/${id}`);
    dispatch(_deleteRating(deleted));
  };
};

// Reducer
const initialState = [];

export default function ratingsReducer(state = initialState, action) {
  switch (action.type) {
    case SET_RATINGS:
      return action.ratings;
    case CREATE_RATING:
      return [...state, action.rating];
    case DELETE_RATING:
      return state.filter((rating) => rating.id !== action.rating.id);
    default:
      return state;
  }
}
