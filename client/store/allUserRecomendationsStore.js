import Axios from "axios";

// Action Types
const SET_USER_RECOMMENDATIONS = "SET_USER_RECOMMENDATIONS";
const CREATE_USER_RECOMMENDATION = "CREATE_USER_RECOMMENDATION";
const UPDATE_USER_RECOMMENDATION = "UPDATE_USER_RECOMMENDATION";
const DELETE_USER_RECOMMENDATION = "DELETE_USER_RECOMMENDATION";

// Action Creators
export const setUserRecommendations = (userRecommendations) => {
  return {
    type: SET_USER_RECOMMENDATIONS,
    userRecommendations,
  };
};

const _createUserRecommendation = (userRecommendation) => {
  return {
    type: CREATE_USER_RECOMMENDATION,
    userRecommendation,
  };
};

const _updateUserRecommendation = (userRecommendation) => {
  return {
    type: UPDATE_USER_RECOMMENDATION,
    userRecommendation,
  };
};

const _deleteUserRecommendation = (userRecommendation) => {
  return {
    type: DELETE_USER_RECOMMENDATION,
    userRecommendation,
  };
};

// Thunks
export const fetchUserRecommendations = () => {
  return async (dispatch) => {
    const { data } = await Axios.get("/api/userrecommendations");
    dispatch(setUserRecommendations(data));
  };
};

export const createUserRecommendation = (userRecommendation) => {
  return async (dispatch) => {
    const { data: created } = await Axios.post("/api/userrecommendations", userRecommendation);
    dispatch(_createUserRecommendation(created));
  };
};

export const updateUserRecommendation = (id, updates) => {
  return async (dispatch) => {
    const { data: updated } = await Axios.put(`/api/userrecommendations/${id}`, updates);
    dispatch(_updateUserRecommendation(updated));
  };
};

export const deleteUserRecommendation = (id) => {
  return async (dispatch) => {
    const { data: deleted } = await Axios.delete(`/api/userrecommendations/${id}`);
    dispatch(_deleteUserRecommendation(deleted));
  };
};

// Reducer
const initialState = [];

export default function userRecommendationsReducer(state = initialState, action) {
  switch (action.type) {
    case SET_USER_RECOMMENDATIONS:
      return action.userRecommendations;
    case CREATE_USER_RECOMMENDATION:
      return [...state, action.userRecommendation];
    case UPDATE_USER_RECOMMENDATION:
      return state.map((recommendation) =>
        recommendation.id === action.userRecommendation.id
          ? action.userRecommendation
          : recommendation
      );
    case DELETE_USER_RECOMMENDATION:
      return state.filter(
        (recommendation) => recommendation.id !== action.userRecommendation.id
      );
    default:
      return state;
  }
}
