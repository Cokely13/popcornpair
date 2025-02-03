import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

// Thunks
import { fetchUsers } from "../store/allUsersStore";
import { fetchFriends, addFriend, removeFriend } from "../store/allFriendsStore";
import { updateSingleFriend } from "../store/singleFriendStore";

const FriendsList = () => {
  const dispatch = useDispatch();

  // Redux store data
  const currentUserId = useSelector((state) => state.auth.id);
  const users = useSelector((state) => state.allUsers);
  const friends = useSelector((state) => state.allFriends);
  const [showRequests, setShowRequests] = useState(false);
  // Local UI states
  const [showUserSearch, setShowUserSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    dispatch(fetchUsers());
    dispatch(fetchFriends());
  }, [dispatch]);

  // 1) All "accepted" friends of the current user
  const acceptedFriends = useMemo(() => {
    return users.filter((user) =>
      friends.some(
        (friend) =>
          friend.status === "accepted" &&
          ((friend.userId === currentUserId && friend.friendId === user.id) ||
            (friend.friendId === currentUserId && friend.userId === user.id))
      )
    );
  }, [users, friends, currentUserId]);

  // 2) Exclude "accepted" from potential new friends
  //    Also exclude the current user themself
  //    Also exclude users who have "denied" *me* (i.e., friendRecord with status='denied' where userId=the other user & friendId=me)
  const nonAcceptedUsers = useMemo(() => {
    return users.filter((user) => {
      if (user.id === currentUserId) return false; // exclude self

      // 2a) if there's an "accepted" friend record with me & them, skip
      const acceptedRecord = friends.find(
        (f) =>
          ((f.userId === currentUserId && f.friendId === user.id) ||
            (f.friendId === currentUserId && f.userId === user.id)) &&
          f.status === "accepted"
      );
      if (acceptedRecord) return false;

      // 2b) if there's a "denied" record where the other user = f.userId & me = f.friendId
      //     that means *they* denied me => I should not see them in new friends
      const deniedRecord = friends.find(
        (f) =>
          f.status === "denied" &&
          f.userId === user.id && // user is the one who did the denying
          f.friendId === currentUserId // I'm the one denied
      );
      if (deniedRecord) return false;

      return true;
    });
  }, [users, friends, currentUserId]);

  // 3) Filter those by the searchTerm
  const searchedUsers = useMemo(() => {
    const lowerTerm = searchTerm.toLowerCase();
    return nonAcceptedUsers.filter((u) =>
      u.username.toLowerCase().includes(lowerTerm)
    );
  }, [nonAcceptedUsers, searchTerm]);

  // 4) "Add Friend" logic
  const handleAddFriend = async (otherUserId) => {
    try {
      // userId=otherUserId => they are the "receiver"
      // friendId=currentUserId => I'm the "sender"
      await dispatch(
        addFriend({
          userId: otherUserId,
          friendId: currentUserId,
          confirmed: false, // or status: "pending" in your DB logic
        })
      );
      alert("Friend request sent!");
      dispatch(fetchFriends());
    } catch (err) {
      console.error("Error adding friend:", err);
      alert("Could not send friend request.");
    }
  };

  // 5) Helper: find a friend record linking currentUser & otherUser
  const getFriendRecord = (userIdA, userIdB) => {
    return friends.find(
      (f) =>
        (f.userId === userIdA && f.friendId === userIdB) ||
        (f.userId === userIdB && f.friendId === userIdA)
    );
  };

  // 6) Accept friend request
  const handleAcceptFriend = async (friendRecord) => {
    try {
      await dispatch(
        updateSingleFriend({
          ...friendRecord,
          status: "accepted",
        })
      );
      alert("Friend request accepted!");
      dispatch(fetchFriends());
    } catch (err) {
      console.error("Error accepting friend request:", err);
      alert("Could not accept the friend request.");
    }
  };

  // 7) Deny friend request
  const handleDenyFriend = async (friendRecord) => {
    try {
      await dispatch(
        updateSingleFriend({
          ...friendRecord,
          status: "denied",
        })
      );
      alert("Friend request denied.");
      dispatch(fetchFriends());
    } catch (err) {
      console.error("Error denying friend request:", err);
      alert("Could not deny friend request.");
    }
  };

  // 8) "Incoming" requests => friend.userId === currentUserId & status="pending"
  const incomingRequests = useMemo(() => {
    return friends.filter(
      (f) => f.userId === currentUserId && f.status === "pending"
    );
  }, [friends, currentUserId]);

  // 9) For each incoming request, find the user who sent it => friendId
  const incomingRequestUsers = incomingRequests.map((f) => {
    const sender = users.find((u) => u.id === f.friendId);
    return {
      friendRecord: f,
      sender,
    };
  });

  // 10) Unblock => removeFriend => just revert back to no record
  const handleUnblock = async (friendId) => {
    try {
      await dispatch(removeFriend(friendId));
      alert("User unblocked.");
      dispatch(fetchFriends());
    } catch (err) {
      console.error("Error unblocking user:", err);
      alert("Could not unblock user.");
    }
  };

  return (
    <div className="friends-list-container">
      <section className="hero-section">
      <h1>FRIENDS</h1>
      </section>
      {/* Accepted Friends */}
      <ul className="friends-list">
        {acceptedFriends.length ? (
          acceptedFriends.map((user) => (
            <ul key={user.id} className="friend-item">
              <img
                      src={user?.image || "/default-profile.png"}
                      alt={user.username}
                      className="friend-profile-pic"
                    />
              <Link to={`/users/${user.id}`} className="friend-link">
                  {user.username}
              </Link>
              <Link to={`/match/${user.id}`} className="friend-link">
                <button className="friend-button">SHARED WATCHLIST</button>
              </Link>
              <Link to={`/random/${user.id}`} className="friend-link">
                <button className="random-button">RANDOM MATCH</button>
              </Link>
            </ul>
          ))
        ) : (
          <p></p>
        )}
      </ul>

      <div className="friend-requests-box">
        {!showRequests ?
        incomingRequestUsers.length > 0 ?<button className="toggle-requests-btn" onClick={() => setShowRequests(!showRequests)}>
           FRIEND REQUESTS
        </button> :"" : ""}
        {showRequests && incomingRequestUsers.length > 0 && (
          <div className="requests-list">
            {/* {incomingRequestUsers.map(({ friendRecord, sender }) => (
              <div key={friendRecord.id} className="request-item">
                <img src={sender?.image || "/default-profile.png"} alt={sender?.username} className="friend-profile-pic" />
                <p>{sender ? sender.username : `User #${friendRecord.friendId}`}</p>
                <div className="request-buttons">
                  <button className="accept-button" onClick={() => handleAcceptFriend(friendRecord)}>Accept</button>
                  <button className="deny-button" onClick={() => handleDenyFriend(friendRecord)}>Deny</button>
                </div>
              </div>
            ))} */}
            {incomingRequestUsers.map(({ friendRecord, sender }) => (
              <ul className="search-user-item"  key={friendRecord.id}>
                 <img
                      src={sender?.image || "/default-profile.png"}
                      alt={sender?.username}
                      className="friend-profile-pic"
                    />
                {sender ? sender.username : `User #${friendRecord.friendId}`}
                <button
                  onClick={() => handleAcceptFriend(friendRecord)}
                  className="accept-button"
                >
                  Accept
                </button>
                <button
                  onClick={() => handleDenyFriend(friendRecord)}
                  className="deny-button"
                >
                  Deny
                </button>
              </ul>
            ))}
             </div>
        )}
        </div>


      {/* If there's at least one new request for me */}
      {/* {incomingRequestUsers.length > 0 && (
        <div className="new-requests-section">
          <section className="hero-section">
          <h3>Friend Requests</h3>
          </section>
          <ul>
            {incomingRequestUsers.map(({ friendRecord, sender }) => (
              <ul className="search-user-item"  key={friendRecord.id}>
                 <img
                      src={sender?.image || "/default-profile.png"}
                      alt={sender?.username}
                      className="friend-profile-pic"
                    />
                {sender ? sender.username : `User #${friendRecord.friendId}`}
                <button
                  onClick={() => handleAcceptFriend(friendRecord)}
                  className="accept-button"
                >
                  Accept
                </button>
                <button
                  onClick={() => handleDenyFriend(friendRecord)}
                  className="deny-button"
                >
                  Deny
                </button>
              </ul>
            ))}
          </ul>
        </div>
      )} */}

<button
  onClick={() => setShowUserSearch(!showUserSearch)}
  style={{
    backgroundColor: showUserSearch ? "#606060" : "#b0b0b0", // Dark grey when open, light grey when closed
    color: "white",
    padding: "10px 15px",
    border: "none",
    borderRadius: "5px",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  }}
>
  {showUserSearch ? "HIDE" : "USER SEARCH"}
</button>


      {showUserSearch && (
        <div className="user-search-panel">
          <h3>Find Friends</h3>
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="user-search-input"
          />
          <ul className="search-users-list">
            {searchedUsers.length ? (
              searchedUsers.map((user) => {
                const friendRecord = getFriendRecord(currentUserId, user.id);
                const status = friendRecord?.status;

                // Distinguish behaviors
                if (!friendRecord) {
                  // No relationship => can add friend
                  return (
                    <li key={user.id} className="search-user-item">
                       <img
                      src={user?.image || "/default-profile.png"}
                      alt={user.username}
                      className="friend-profile-pic"
                    />
                      {user.username}{" "}
                      <button
                        onClick={() => handleAddFriend(user.id)}
                        className="add-friend-button"
                      >
                        ADD FRIEND
                      </button>
                    </li>
                  );
                } else if (status === "accepted") {
                  return (
                    <li key={user.id} className="search-user-item">
                       <img
                      src={user?.image || "/default-profile.png"}
                      alt={user.username}
                      className="friend-profile-pic"
                    />
                      {user.username} <span>Already Friends</span>
                    </li>
                  );
                } else if (status === "pending") {
                  // Check if I'm the "receiver" or "sender"
                  if (friendRecord.userId === currentUserId) {
                    // They want to friend me
                    return (
                      <li key={friendRecord.id} className="search-user-item">
                         <img
                      src={user?.image || "/default-profile.png"}
                      alt={user.username}
                      className="friend-profile-pic"
                    />
                        {user.username} <span>Wants to friend you!</span>
                      </li>
                    );
                  } else {
                    // I'm the sender
                    return (
                      <li key={friendRecord.id} className="search-user-item">
                         <img
                      src={user?.image || "/default-profile.png"}
                      alt={user.username}
                      className="friend-profile-pic"
                    />
                        {user.username}{" "}
                        <span className="pending-status">Pending</span>
                      </li>
                    );
                  }
                } else if (status === "denied") {
                  // If *I* (currentUser) am the one who set status='denied' => friendRecord.userId===currentUserId
                  // show "Unblock" button. Otherwise exclude them from the list (already done above).
                  if (friendRecord.userId === currentUserId) {
                    // I denied them => show "Unblock"
                    return (
                      <li key={friendRecord.id} className="search-user-item">
                         <img
                      src={user?.image || "/default-profile.png"}
                      alt={user.username}
                      className="friend-profile-pic"
                    />
                        {user.username}{" "}
                        <span className="not-friend-status">
                          Denied{" "}
                          <button
                            onClick={() => handleUnblock(friendRecord.id)}
                            className="unblock-button"
                          >
                            Unblock
                          </button>
                        </span>
                      </li>
                    );
                  } else {
                    // They denied me => we wouldn't see them anyway
                    // because we filtered them out in nonAcceptedUsers
                    return null;
                  }
                } else {
                  // Fallback for other statuses
                  return (
                    <ul key={friendRecord.id} className="search-user-item">
                       <img
                      src={user?.image || "/default-profile.png"}
                      alt={user.username}
                      className="friend-profile-pic"
                    />
                      {user.username} <span>{status}</span>
                    </ul>
                  );
                }
              })
            ) : (
              <p>No users found matching "{searchTerm}".</p>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FriendsList;

