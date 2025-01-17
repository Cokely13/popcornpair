import axios from "axios";

// Action Types
const SET_SINGLE_USER = "SET_SINGLE_USER";
const UPDATE_SINGLE_USER = "UPDATE_SINGLE_USER";

// Action creators
export const _setSingleUser = (userdata) => {
  return {
    type: SET_SINGLE_USER,
    userdata,
  };
};

const _updateSingleUser = (userdata) => {
  return {
    type: UPDATE_SINGLE_USER,
    userdata,
  };
};

// Thunks
export const fetchSingleUser = (id) => {
  return async (dispatch) => {
    try {
      const { data } = await axios.get(`/api/users/${id}`);
      dispatch(_setSingleUser(data));
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };
};

export const updateSingleUser = (user) => {
  return async (dispatch) => {
    try {
      await axios.put(`/api/users/${user.id}`, user);
      const { data: userData } = await axios.get(`/api/users/${user.id}`);
      dispatch(_updateSingleUser(userData));
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };
};

// Reducer
const initialState = {}; // Initialize state as an object

const singleUserReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_SINGLE_USER:
      return action.userdata;
    case UPDATE_SINGLE_USER:
      return action.userdata;
    default:
      return state;
  }
};

export default singleUserReducer;
