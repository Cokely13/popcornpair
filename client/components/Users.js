import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers } from "../store/allUsersStore";
import { fetchFriends, addFriend } from "../store/allFriendsStore";
import {updateSingleFriend} from '../store/singleFriendStore'

const Users = () => {
  const dispatch = useDispatch();

  const currentUserId = useSelector((state) => state.auth.id);
  const users = useSelector((state) => state.allUsers);
  const friends = useSelector((state) => state.allFriends);

  useEffect(() => {
    dispatch(fetchUsers());
    dispatch(fetchFriends());
  }, [dispatch]);

  const getFriendStatus = (userId) => {
    const friend = friends.find(
      (friend) =>
        (friend.userId === currentUserId && friend.friendId === userId) ||
        (friend.userId === userId && friend.friendId === currentUserId)
    );


    if (!friend) {
      return "Add Friend"; // No relationship exists
    }
    if (friend.status == 'accepted'){
      return "Friend"
    }

    if (friend.status !== 'accepted' && friend.friendId === currentUserId  ) {
      return "Pending"; // Friend request sent but not confirmed
    }
    if (friend.status == "pending" && userId === userId) {
      return "Accept?"; // Friend request received by current user
    }
    if (friend.status == "denied" && userId === userId) {
      return "Deny"; // Friend request received by current user
    }

  };

  const handleAddFriend = async (userId) => {
    try {
      await dispatch(
        addFriend({ userId: userId, requesterId: currentUserId, friendId: currentUserId, confirmed: false })
      );
      alert("Friend request sent!");
    } catch (err) {
      console.error("Error adding friend:", err);
      alert("Could not send friend request.");
    }
  };

  const handleAcceptFriend = async (userId) => {
    try {
      const friendDetail = friends.find(
        (friend) => friend.userId === currentUserId && friend.friendId === userId
      );
      if (friendDetail) {
        await dispatch(updateSingleFriend({ ...friendDetail, status: "accepted" }));
        alert("Friend request accepted!");
        dispatch(fetchFriends())
      }
    } catch (err) {
      console.error("Error accepting friend request:", err);
      alert("Could not accept the friend request.");
    }
  };

  const handleDenyFriend = async (userId) => {
    try {
      const friendDetail = friends.find(
        (friend) => friend.userId === currentUserId && friend.friendId === userId
      );
      await dispatch(updateSingleFriend({ ...friendDetail, status: "denied" }));
      alert("Friend request denied.");
      dispatch(fetchFriends())
    } catch (err) {
      console.error("Error denying friend request:", err);
      alert("Could not deny friend request.");
    }
  };

  return (
    <div className="users-container">
      <h2 className="users-title">All Users</h2>
      <ul className="users-list">
        {users
          .filter((user) => user.id !== currentUserId) // Exclude current user
          .map((user) => (
            <li key={user.id} className="user-item">
              <span className="username">{user.username}</span>
              {getFriendStatus(user.id) === "Add Friend" && (
                <button
                  onClick={() => handleAddFriend(user.id)}
                  className="add-friend-button"
                >
                  Add Friend
                </button>
              )}
              {getFriendStatus(user.id) === "Accept?" && (
                <>
                  <button
                    onClick={() => handleAcceptFriend(user.id)}
                    className="accept-button"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleDenyFriend(user.id)}
                    className="deny-button"
                  >
                    Deny
                  </button>
                </>
              )}
              {getFriendStatus(user.id) === "Pending" && (
                <span className="pending-status">Pending</span>
              )}
              {getFriendStatus(user.id) === "Friend" && (
                <span className="friend-status">Friend</span>
              )}
              {getFriendStatus(user.id) === "Deny" && (
                <span className="not-friend-status">NOT A FRIEND</span>
              )}
            </li>
          ))}
      </ul>
    </div>
  );

};

export default Users;
