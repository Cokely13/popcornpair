import Axios from "axios";

// Action Types
const SET_SINGLE_FRIEND = "SET_SINGLE_FRIEND";
const UPDATE_SINGLE_FRIEND = "UPDATE_SINGLE_FRIEND";

// Action Creators
export const _setSingleFriend = (friend) => {
  return {
    type: SET_SINGLE_FRIEND,
    friend,
  };
};

const _updateSingleFriend = (friend) => {
  return {
    type: UPDATE_SINGLE_FRIEND,
    friend,
  };
};

// Thunks
export const fetchSingleFriend = (id) => {
  return async (dispatch) => {
    const { data } = await Axios.get(`/api/friends/${id}`);
    dispatch(_setSingleFriend(data));
  };
};

export const updateSingleFriend = (friend) => {
  return async (dispatch) => {
    await Axios.put(`/api/friends/${friend.id}`, friend);
    const { data: updated } = await Axios.get(`/api/friends/${friend.id}`);
    dispatch(_updateSingleFriend(updated));
  };
};

// Reducer
const initialState = {};

export default function singleFriendReducer(state = initialState, action) {
  switch (action.type) {
    case SET_SINGLE_FRIEND:
      return action.friend;
    case UPDATE_SINGLE_FRIEND:
      return action.friend;
    default:
      return state;
  }
}
