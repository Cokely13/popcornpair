// import React, { useEffect, useState, useMemo } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { Link } from "react-router-dom";

// // Thunks
// import { fetchUsers } from "../store/allUsersStore";
// import { fetchFriends, addFriend } from "../store/allFriendsStore";
// import { updateSingleFriend } from "../store/singleFriendStore";

// // This component shows the current user's "Accepted" friends
// // and includes a toggleable "Search Users" panel for adding new friends.
// const FriendsList = () => {
//   const dispatch = useDispatch();

//   // Redux store data
//   const currentUserId = useSelector((state) => state.auth.id);
//   const users = useSelector((state) => state.allUsers);
//   const friends = useSelector((state) => state.allFriends);

//   // Local UI states
//   const [showUserSearch, setShowUserSearch] = useState(false);
//   const [searchTerm, setSearchTerm] = useState("");

//   useEffect(() => {
//     dispatch(fetchUsers());
//     dispatch(fetchFriends());
//   }, [dispatch]);

//   // 1) Filter accepted friends
//   const acceptedFriends = useMemo(() => {
//     return users.filter((user) =>
//       friends.some(
//         (friend) =>
//           friend.status === "accepted" &&
//           ((friend.userId === currentUserId && friend.friendId === user.id) ||
//             (friend.friendId === currentUserId && friend.userId === user.id))
//       )
//     );
//   }, [users, friends, currentUserId]);

//   // 2) Filter potential new friends:
//   //    - Not the current user
//   //    - Not already "accepted" friend
//   const nonAcceptedUsers = useMemo(() => {
//     return users.filter((user) => {
//       if (user.id === currentUserId) return false; // exclude self

//       // Does a friend record exist with status=accepted?
//       const existingFriendRecord = friends.find(
//         (f) =>
//           ((f.userId === currentUserId && f.friendId === user.id) ||
//             (f.friendId === currentUserId && f.userId === user.id)) &&
//           f.status === "accepted"
//       );
//       // If we found an "accepted" record, skip this user
//       if (existingFriendRecord) return false;

//       return true;
//     });
//   }, [users, friends, currentUserId]);

//   // 3) Search + filter the non-accepted users
//   const searchedUsers = useMemo(() => {
//     const lowerTerm = searchTerm.toLowerCase();
//     return nonAcceptedUsers.filter((u) =>
//       u.username.toLowerCase().includes(lowerTerm)
//     );
//   }, [nonAcceptedUsers, searchTerm]);

//   // 4) Reuse "Add Friend" logic from your blueprint
//   const handleAddFriend = async (userId) => {
//     try {
//       await dispatch(
//         addFriend({
//           userId,
//           requesterId: currentUserId,
//           friendId: currentUserId,
//           confirmed: false,
//         })
//       );
//       alert("Friend request sent!");
//       dispatch(fetchFriends());
//     } catch (err) {
//       console.error("Error adding friend:", err);
//       alert("Could not send friend request.");
//     }
//   };

//   // 5) Helper: Get friend status (partial reuse from your blueprint)
//   const getFriendStatus = (userId) => {
//     const friend = friends.find(
//       (f) =>
//         (f.userId === currentUserId && f.friendId === userId) ||
//         (f.userId === userId && f.friendId === currentUserId)
//     );

//     if (!friend) return "Add Friend";
//     if (friend.status === "accepted") return "Friend";
//     if (friend.status === "pending" && friend.userId === currentUserId) {
//       // current user -> userId => means we've sent request to them
//       return "Pending";
//     }
//     // If there's another subtle scenario, you can handle it
//     // For now let's do a fallback:
//     return friend.status; // e.g. "denied"
//   };

//   return (
//     <div className="friends-list-container">
//       <h2>Friends List</h2>

//       {/* Accepted Friends */}
//       <ul className="friends-list">
//         {acceptedFriends.length ? (
//           acceptedFriends.map((user) => (
//             <li key={user.id} className="friend-item">
//               <Link to={`/users/${user.id}`} className="friend-link">
//                 {user.username}
//               </Link>
//               <Link to={`/match/${user.id}`} className="friend-link">
//                 <button className="friend-button">Matches</button>
//               </Link>
//               <Link to={`/random/${user.id}`} className="friend-link">
//                 <button className="random-button">Random Match</button>
//               </Link>
//             </li>
//           ))
//         ) : (
//           <p>You currently have no friends.</p>
//         )}
//       </ul>

//       {/* Button to Toggle Search Panel */}
//       <button onClick={() => setShowUserSearch(!showUserSearch)}>
//         {showUserSearch ? "Hide User Search" : "Search for Users"}
//       </button>

//       {/* User Search Panel (only visible if showUserSearch === true) */}
//       {showUserSearch && (
//         <div className="user-search-panel">
//           <h3>Find New Friends</h3>
//           <input
//             type="text"
//             placeholder="Search users..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="user-search-input"
//           />
//           <ul className="search-users-list">
//             {searchedUsers.length ? (
//               searchedUsers.map((user) => {
//                 const status = getFriendStatus(user.id);

//                 // If user is "Friend", skip? Or show them?
//                 // up to you. We'll show them but highlight the status
//                 return (
//                   <li key={user.id} className="search-user-item">
//                     <span className="search-user-name">{user.username}</span>
//                     {status === "Add Friend" && (
//                       <button
//                         onClick={() => handleAddFriend(user.id)}
//                         className="add-friend-button"
//                       >
//                         Add Friend
//                       </button>
//                     )}
//                     {status === "Pending" && (
//                       <span className="pending-status">Pending</span>
//                     )}
//                     {status === "Friend" && (
//                       <span className="friend-status">Already Friends</span>
//                     )}
//                     {status === "denied" && (
//                       <span className="not-friend-status">Denied</span>
//                     )}
//                     {/* If you want to handle 'Accept?' logic, or 'denied' => re-add, etc., you can expand. */}
//                   </li>
//                 );
//               })
//             ) : (
//               <p>No users found matching "{searchTerm}".</p>
//             )}
//           </ul>
//         </div>
//       )}
//     </div>
//   );
// };

// export default FriendsList;
// import React, { useEffect, useState, useMemo } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { Link } from "react-router-dom";

// // Thunks
// import { fetchUsers } from "../store/allUsersStore";
// import { fetchFriends, addFriend, removeFriend } from "../store/allFriendsStore";
// import { updateSingleFriend } from "../store/singleFriendStore";

// const FriendsList = () => {
//   const dispatch = useDispatch();

//   // Redux store data
//   const currentUserId = useSelector((state) => state.auth.id);
//   const users = useSelector((state) => state.allUsers);
//   const friends = useSelector((state) => state.allFriends);

//   // Local UI states
//   const [showUserSearch, setShowUserSearch] = useState(false);
//   const [searchTerm, setSearchTerm] = useState("");

//   useEffect(() => {
//     dispatch(fetchUsers());
//     dispatch(fetchFriends());
//   }, [dispatch]);

//   // 1) Filter accepted friends
//   const acceptedFriends = useMemo(() => {
//     return users.filter((user) =>
//       friends.some(
//         (friend) =>
//           friend.status === "accepted" &&
//           // If "userId" or "friendId" matches currentUser + user.id
//           ((friend.userId === currentUserId && friend.friendId === user.id) ||
//             (friend.friendId === currentUserId && friend.userId === user.id))
//       )
//     );
//   }, [users, friends, currentUserId]);

//   // 2) Potential new friends (not accepted, not currentUser)
//   const nonAcceptedUsers = useMemo(() => {
//     return users.filter((user) => {
//       if (user.id === currentUserId) return false; // exclude self
//       // If any friend record with status=accepted linking them
//       const existing = friends.find(
//         (f) =>
//           ((f.userId === currentUserId && f.friendId === user.id) ||
//             (f.friendId === currentUserId && f.userId === user.id)) &&
//           f.status === "accepted"
//       );
//       return !existing;
//     });
//   }, [users, friends, currentUserId]);

//   // 3) Filter those by the searchTerm
//   const searchedUsers = useMemo(() => {
//     const lowerTerm = searchTerm.toLowerCase();
//     return nonAcceptedUsers.filter((u) =>
//       u.username.toLowerCase().includes(lowerTerm)
//     );
//   }, [nonAcceptedUsers, searchTerm]);

//   // 4) "Add Friend" logic
//   const handleAddFriend = async (otherUserId) => {
//     try {
//       // If "userId" is the receiver, that means we want them to be userId
//       // and "friendId" is the sender (the currentUser).
//       await dispatch(
//         addFriend({
//           userId: otherUserId,     // receiver
//           friendId: currentUserId, // sender
//           confirmed: false,
//         })
//       );
//       alert("Friend request sent!");
//       dispatch(fetchFriends());
//     } catch (err) {
//       console.error("Error adding friend:", err);
//       alert("Could not send friend request.");
//     }
//   };

//   // 5) Helper: find a friend record linking currentUser & otherUser
//   const getFriendRecord = (userIdA, userIdB) => {
//     return friends.find(
//       (f) =>
//         (f.userId === userIdA && f.friendId === userIdB) ||
//         (f.userId === userIdB && f.friendId === userIdA)
//     );
//   };

//   // 6) Accept friend request
//   const handleAcceptFriend = async (friendRecord) => {
//     try {
//       await dispatch(
//         updateSingleFriend({
//           ...friendRecord,
//           status: "accepted",
//         })
//       );
//       alert("Friend request accepted!");
//       dispatch(fetchFriends());
//     } catch (err) {
//       console.error("Error accepting friend request:", err);
//       alert("Could not accept the friend request.");
//     }
//   };

//   // 7) Deny friend request
//   const handleDenyFriend = async (friendRecord) => {
//     try {
//       await dispatch(
//         updateSingleFriend({
//           ...friendRecord,
//           status: "denied",
//         })
//       );
//       alert("Friend request denied.");
//       dispatch(fetchFriends());
//     } catch (err) {
//       console.error("Error denying friend request:", err);
//       alert("Could not deny friend request.");
//     }
//   };

//   // 8) "Incoming" requests: means friend.userId === currentUserId (the request is for me) && status="pending"
//   const incomingRequests = useMemo(() => {
//     return friends.filter(
//       (f) => f.userId === currentUserId && f.status === "pending"
//     );
//   }, [friends, currentUserId]);

//   // 9) For each incoming request, find the user who sent it => friendId
//   const incomingRequestUsers = incomingRequests.map((f) => {
//     const sender = users.find((u) => u.id === f.friendId);
//     return {
//       friendRecord: f,
//       sender, // user who requested me
//     };
//   });

//   return (
//     <div className="friends-list-container">
//       <h2>Friends List</h2>

//       {/* Accepted Friends */}
//       <ul className="friends-list">
//         {acceptedFriends.length ? (
//           acceptedFriends.map((user) => (
//             <li key={user.id} className="friend-item">
//               <Link to={`/users/${user.id}`} className="friend-link">
//                 {user.username}
//               </Link>
//               <Link to={`/match/${user.id}`} className="friend-link">
//                 <button className="friend-button">Matches</button>
//               </Link>
//               <Link to={`/random/${user.id}`} className="friend-link">
//                 <button className="random-button">Random Match</button>
//               </Link>
//             </li>
//           ))
//         ) : (
//           <p>You currently have no friends.</p>
//         )}
//       </ul>

//       {/* 10) If there's at least one new request for me */}
//       {incomingRequestUsers.length > 0 && (
//         <div className="new-requests-section">
//           <h3>New Friend Request</h3>
//           <ul>
//             {incomingRequestUsers.map(({ friendRecord, sender }) => (
//               <li key={friendRecord.id}>
//                 {sender ? sender.username : `User #${friendRecord.friendId}`}
//                 <button
//                   onClick={() => handleAcceptFriend(friendRecord)}
//                   className="accept-button"
//                 >
//                   Accept
//                 </button>
//                 <button
//                   onClick={() => handleDenyFriend(friendRecord)}
//                   className="deny-button"
//                 >
//                   Deny
//                 </button>
//               </li>
//             ))}
//           </ul>
//         </div>
//       )}

//       {/* Toggle Search Panel */}
//       <button onClick={() => setShowUserSearch(!showUserSearch)}>
//         {showUserSearch ? "Hide User Search" : "Search for Users"}
//       </button>

//       {showUserSearch && (
//         <div className="user-search-panel">
//           <h3>Find New Friends</h3>
//           <input
//             type="text"
//             placeholder="Search users..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="user-search-input"
//           />
//           <ul className="search-users-list">
//             {searchedUsers.length ? (
//               searchedUsers.map((user) => {
//                 const friendRecord = getFriendRecord(currentUserId, user.id);
//                 const status = friendRecord?.status;

//                 // Distinguish behaviors
//                 if (!friendRecord) {
//                   return (
//                     <li key={user.id} className="search-user-item">
//                       {user.username}{" "}
//                       <button
//                         onClick={() => handleAddFriend(user.id)}
//                         className="add-friend-button"
//                       >
//                         Add Friend
//                       </button>
//                     </li>
//                   );
//                 } else if (status === "accepted") {
//                   return (
//                     <li key={user.id} className="search-user-item">
//                       {user.username} <span>Already Friends</span>
//                     </li>
//                   );
//                 } else if (status === "pending") {
//                   // Check if I'm the sender or receiver
//                   if (friendRecord.userId === currentUserId) {
//                     // Means they want to friend me
//                     return (
//                       <li key={user.id} className="search-user-item">
//                         {user.username} <span>Wants to friend you!</span>
//                       </li>
//                     );
//                   } else {
//                     // friendRecord.userId === currentUserId => I've requested them
//                     return (
//                       <li key={user.id} className="search-user-item">
//                         {user.username} <span className="pending-status">Pending</span>
//                       </li>
//                     );
//                   }
//                 } else if (status === "denied") {
//                   return (
//                     <li key={user.id} className="search-user-item">
//                       {user.username} <span className="not-friend-status">Denied</span>
//                     </li>
//                   );
//                 } else {
//                   return (
//                     <li key={user.id} className="search-user-item">
//                       {user.username} <span>{status}</span>
//                     </li>
//                   );
//                 }
//               })
//             ) : (
//               <p>No users found matching "{searchTerm}".</p>
//             )}
//           </ul>
//         </div>
//       )}
//     </div>
//   );
// };

// export default FriendsList;

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
      <h2>Friends List</h2>

      {/* Accepted Friends */}
      <ul className="friends-list">
        {acceptedFriends.length ? (
          acceptedFriends.map((user) => (
            <li key={user.id} className="friend-item">
              <Link to={`/users/${user.id}`} className="friend-link">
                {user.username}
              </Link>
              <Link to={`/match/${user.id}`} className="friend-link">
                <button className="friend-button">Matches</button>
              </Link>
              <Link to={`/random/${user.id}`} className="friend-link">
                <button className="random-button">Random Match</button>
              </Link>
            </li>
          ))
        ) : (
          <p>You currently have no friends.</p>
        )}
      </ul>

      {/* If there's at least one new request for me */}
      {incomingRequestUsers.length > 0 && (
        <div className="new-requests-section">
          <h3>New Friend Request</h3>
          <ul>
            {incomingRequestUsers.map(({ friendRecord, sender }) => (
              <li key={friendRecord.id}>
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
              </li>
            ))}
          </ul>
        </div>
      )}

      <button onClick={() => setShowUserSearch(!showUserSearch)}>
        {showUserSearch ? "Hide User Search" : "Search for Users"}
      </button>

      {showUserSearch && (
        <div className="user-search-panel">
          <h3>Find New Friends</h3>
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
                      {user.username}{" "}
                      <button
                        onClick={() => handleAddFriend(user.id)}
                        className="add-friend-button"
                      >
                        Add Friend
                      </button>
                    </li>
                  );
                } else if (status === "accepted") {
                  return (
                    <li key={user.id} className="search-user-item">
                      {user.username} <span>Already Friends</span>
                    </li>
                  );
                } else if (status === "pending") {
                  // Check if I'm the "receiver" or "sender"
                  if (friendRecord.userId === currentUserId) {
                    // They want to friend me
                    return (
                      <li key={friendRecord.id} className="search-user-item">
                        {user.username} <span>Wants to friend you!</span>
                      </li>
                    );
                  } else {
                    // I'm the sender
                    return (
                      <li key={friendRecord.id} className="search-user-item">
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
                    <li key={friendRecord.id} className="search-user-item">
                      {user.username} <span>{status}</span>
                    </li>
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
