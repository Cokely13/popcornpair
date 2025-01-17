import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers } from "../store/allUsersStore";
import { Link } from "react-router-dom";

const FriendsList = () => {
  const dispatch = useDispatch();
  const users = useSelector((state) => state.allUsers);
  const currentUserId = useSelector((state) => state.auth.id);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  return (
    <div className="friends-list-container">
      <h2>Friends List</h2>
      <ul className="friends-list">
        {users
          .filter((user) => user.id !== currentUserId) // Exclude the current user
          .map((user) => (
            <li key={user.id} className="friend-item">
              <Link to={`/match/${user.id}`} className="friend-link">
                {user.username}
              </Link>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default FriendsList;
