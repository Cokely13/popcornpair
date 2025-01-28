import Axios from "axios";

// Action Types
const SET_FRIENDS = "SET_FRIENDS";
const ADD_FRIEND = "ADD_FRIEND";
const REMOVE_FRIEND = "REMOVE_FRIEND";

// Action Creators
export const setFriends = (friends) => {
  return {
    type: SET_FRIENDS,
    friends,
  };
};

const _addFriend = (friend) => {
  return {
    type: ADD_FRIEND,
    friend,
  };
};

const _removeFriend = (friend) => {
  return {
    type: REMOVE_FRIEND,
    friend,
  };
};

// Thunks
export const fetchFriends = () => {
  return async (dispatch) => {
    const { data } = await Axios.get("/api/friends");
    dispatch(setFriends(data));
  };
};

export const addFriend = (friend) => {
  return async (dispatch) => {
    const { data: created } = await Axios.post("/api/friends", friend);
    dispatch(_addFriend(created));
  };
};

export const removeFriend = (id) => {
  return async (dispatch) => {
    const { data: deleted } = await Axios.delete(`/api/friends/${id}`);
    dispatch(_removeFriend(deleted));
  };
};

// Reducer
const initialState = [];

export default function friendsReducer(state = initialState, action) {
  switch (action.type) {
    case SET_FRIENDS:
      return action.friends;
    case ADD_FRIEND:
      return [...state, action.friend];
    case REMOVE_FRIEND:
      return state.filter((friend) => friend.id !== action.friend.id);
    default:
      return state;
  }
}
