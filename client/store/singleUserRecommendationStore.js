import Axios from "axios";

// Action Types
const SET_SINGLE_USER_RECOMMENDATION = "SET_SINGLE_USER_RECOMMENDATION";
const UPDATE_SINGLE_USER_RECOMMENDATION = "UPDATE_SINGLE_USER_RECOMMENDATION";

// Action Creators
export const _setSingleUserRecommendation = (userRecommendation) => {
  return {
    type: SET_SINGLE_USER_RECOMMENDATION,
    userRecommendation,
  };
};

const _updateSingleUserRecommendation = (userRecommendation) => {
  return {
    type: UPDATE_SINGLE_USER_RECOMMENDATION,
    userRecommendation,
  };
};

// Thunks
export const fetchSingleUserRecommendation = (recommendationId) => {
  return async (dispatch) => {
    const { data } = await Axios.get(`/api/userrecommendations/${recommendationId}`);
    dispatch(_setSingleUserRecommendation(data));
  };
};

export const updateSingleUserRecommendation = (recommendationId, updates) => {
  return async (dispatch) => {
    await Axios.put(`/api/userrecommendations/${recommendationId}`, updates);
    const { data: updated } = await Axios.get(`/api/userrecommendations/${recommendationId}`);
    dispatch(_updateSingleUserRecommendation(updated));
  };
};

// Reducer
const initialState = {};

export default function singleUserRecommendationReducer(state = initialState, action) {
  switch (action.type) {
    case SET_SINGLE_USER_RECOMMENDATION:
      return action.userRecommendation;
    case UPDATE_SINGLE_USER_RECOMMENDATION:
      return action.userRecommendation;
    default:
      return state;
  }
}
