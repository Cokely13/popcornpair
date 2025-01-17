import Axios from "axios";

// Action Types
const SET_SINGLE_RATING = "SET_SINGLE_RATING";
const UPDATE_SINGLE_RATING = "UPDATE_SINGLE_RATING";

// Action Creators
export const _setSingleRating = (rating) => {
  return {
    type: SET_SINGLE_RATING,
    rating,
  };
};

const _updateSingleRating = (rating) => {
  return {
    type: UPDATE_SINGLE_RATING,
    rating,
  };
};

// Thunks
export const fetchSingleRating = (id) => {
  return async (dispatch) => {
    const { data } = await Axios.get(`/api/ratings/${id}`);
    dispatch(_setSingleRating(data));
  };
};

export const updateSingleRating = (rating) => {
  return async (dispatch) => {
    await Axios.put(`/api/ratings/${rating.id}`, rating);
    const { data: updated } = await Axios.get(`/api/ratings/${rating.id}`);
    dispatch(_updateSingleRating(updated));
  };
};

// Reducer
const initialState = {};

export default function singleRatingReducer(state = initialState, action) {
  switch (action.type) {
    case SET_SINGLE_RATING:
      return action.rating;
    case UPDATE_SINGLE_RATING:
      return action.rating;
    default:
      return state;
  }
}
