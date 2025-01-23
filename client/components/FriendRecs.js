// // import React, { useEffect, useState } from "react";
// // import { useDispatch, useSelector } from "react-redux";
// // import { fetchUserRecommendations } from "../store/allUserRecommendationsStore";
// // import { Link } from "react-router-dom";

// // const FriendRecs = () => {
// //   const dispatch = useDispatch();
// //   const [viewType, setViewType] = useState("sent");

// //   const currentUserId = useSelector((state) => state.auth.id);
// //   const recommendations = useSelector((state) => state.allUserRecommendations);

// //   useEffect(() => {
// //     dispatch(fetchUserRecommendations());
// //   }, [dispatch]);

// //   const filteredRecs =
// //     viewType === "sent"
// //       ? recommendations.filter((rec) => rec.senderId === currentUserId)
// //       : recommendations.filter((rec) => rec.receiverId === currentUserId);

// //   return (
// //     <div className="friend-recs-container">
// //       <h2>Friend Recommendations</h2>

// //       <div className="recs-dropdown">
// //         <label htmlFor="recs-view">View: </label>
// //         <select
// //           id="recs-view"
// //           value={viewType}
// //           onChange={(e) => setViewType(e.target.value)}
// //         >
// //           <option value="sent">Recommendations Sent</option>
// //           <option value="received">Recommendations Received</option>
// //         </select>
// //       </div>

// //       <div className="recs-list">
// //         {filteredRecs.length ? (
// //           filteredRecs.map((rec) => (
// //             <div key={rec.id} className="rec-item">
// //               <p>
// //                 <strong>Movie:</strong>{" "}
// //                 {rec.movie ? (
// //                   <Link to={`/movies/${rec.movie.id}`}>{rec.movie.title}</Link>
// //                 ) : (
// //                   "Movie details unavailable"
// //                 )}
// //               </p>
// //               {viewType === "sent" ? null : (
// //                 <p>
// //                   <strong>From:</strong> {rec.sender?.username || "N/A"}
// //                 </p>
// //               )}
// //               {viewType === "received" ? null : (
// //                 <p>
// //                   <strong>To:</strong> {rec.receiver?.username || "N/A"}
// //                 </p>
// //               )}
// //               <p>
// //                 <strong>Message:</strong> {rec.message || "No message"}
// //               </p>
// //               <p>
// //                 <strong>Response:</strong> {rec.response || "No response yet"}
// //               </p>
// //               <p>
// //                 <strong>Accepted:</strong>{" "}
// //                 {rec.accept === null
// //                   ? "Pending"
// //                   : rec.accept === "yes"
// //                   ? "Accepted"
// //                   : "Rejected"}
// //               </p>
// //               <p>
// //                 <strong>Liked:</strong>{" "}
// //                 {rec.liked === null
// //                   ? "Not Rated"
// //                   : rec.liked === "yes"
// //                   ? "Liked"
// //                   : "Disliked"}
// //               </p>x
// //             </div>
// //           ))
// //         ) : (
// //           <p>
// //             {viewType === "sent"
// //               ? "You have not sent any recommendations."
// //               : "You have not received any recommendations."}
// //           </p>
// //         )}
// //       </div>
// //     </div>
// //   );
// // };

// // export default FriendRecs;

// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchUserRecommendations } from "../store/allUserRecommendationsStore";
// import {updateSingleUserRecommendation } from "../store/singleUserRecommendationStore"
// import { Link } from "react-router-dom";
// import { FaThumbsUp, FaThumbsDown } from "react-icons/fa";

// const FriendRecs = () => {
//   const dispatch = useDispatch();
//   const [viewType, setViewType] = useState("sent");
//   const [editingResponseId, setEditingResponseId] = useState(null);
//   const [responseText, setResponseText] = useState("");

//   const currentUserId = useSelector((state) => state.auth.id);
//   const recommendations = useSelector((state) => state.allUserRecommendations);

//   useEffect(() => {
//     dispatch(fetchUserRecommendations());
//   }, [dispatch]);

//   const filteredRecs =
//     viewType === "sent"
//       ? recommendations.filter((rec) => rec.senderId === currentUserId)
//       : recommendations.filter((rec) => rec.receiverId === currentUserId);

//   const handleResponseSubmit = async (recId) => {
//     await dispatch(updateSingleUserRecommendation({ id: recId, response: responseText }));
//     setEditingResponseId(null);
//     setResponseText("");
//   };

//   const handleAcceptRecommendation = async (recId, accept) => {

//     console.log("we here!")
//     await dispatch(updateSingleUserRecommendation({ id: recId, accept }));
//   };

//   const handleLikeRecommendation = async (recId, liked) => {
//     await dispatch(updateSingleUserRecommendation({ id: recId, liked }));
//   };

//   return (
//     <div className="friend-recs-container">
//       <h2>Friend Recommendations</h2>

//       <div className="recs-dropdown">
//         <label htmlFor="recs-view">View: </label>
//         <select
//           id="recs-view"
//           value={viewType}
//           onChange={(e) => setViewType(e.target.value)}
//         >
//           <option value="sent">Recommendations Sent</option>
//           <option value="received">Recommendations Received</option>
//         </select>
//       </div>

//       <div className="recs-list">
//         {filteredRecs.length ? (
//           filteredRecs.map((rec) => (
//             <div key={rec.id} className="rec-item">
//               <p>
//                 <strong>Movie:</strong>{" "}
//                 {rec.movie ? (
//                   <Link to={`/movies/${rec.movie.id}`}>{rec.movie.title}</Link>
//                 ) : (
//                   "Movie details unavailable"
//                 )}
//               </p>
//               {viewType === "sent" ? null : (
//                 <p>
//                   <strong>From:</strong> {rec.sender?.username || "N/A"}
//                 </p>
//               )}
//               {viewType === "received" ? null : (
//                 <p>
//                   <strong>To:</strong> {rec.receiver?.username || "N/A"}
//                 </p>
//               )}
//               <p>
//                 <strong>Message:</strong> {rec.message || "No message"}
//               </p>
//               <p>
//                 <strong>Response:</strong>{" "}
//                 {editingResponseId === rec.id ? (
//                   <>
//                     <input
//                       type="text"
//                       value={responseText}
//                       onChange={(e) => setResponseText(e.target.value)}
//                       className="response-input"
//                     />
//                     <button
//                       onClick={() => handleResponseSubmit(rec.id)}
//                       className="submit-response-button"
//                     >
//                       Submit
//                     </button>
//                     <button
//                       onClick={() => {
//                         setEditingResponseId(null);
//                         setResponseText("");
//                       }}
//                       className="cancel-response-button"
//                     >
//                       Cancel
//                     </button>
//                   </>
//                 ) : (
//                   <>
//                     {rec.response || "No response yet"}{" "}
//                     {viewType === "received" && (
//                       <button
//                         onClick={() => setEditingResponseId(rec.id)}
//                         className="respond-button"
//                       >
//                         Respond
//                       </button>
//                     )}
//                   </>
//                 )}
//               </p>
//               <p>
//                 <strong>Accepted:</strong>{" "}
//                 {rec.accept === null
//                   ? "Pending"
//                   : rec.accept === "yes"
//                   ? "Accepted"
//                   : "Rejected"}{" "}
//                 {viewType === "received" && rec.accept === null && (
//                   <>
//                     <button
//                       onClick={() => handleAcceptRecommendation(rec.id, "yes")}
//                       className="accept-button"
//                     >
//                       I'll Watch It!
//                     </button>
//                     <button
//                       onClick={() => handleAcceptRecommendation(rec.id, "no")}
//                       className="reject-button"
//                     >
//                       Pass
//                     </button>
//                   </>
//                 )}
//               </p>
//               <p>
//                 <strong>Liked:</strong>{" "}
//                 {rec.liked === null
//                   ? "Not Rated"
//                   : rec.liked === "yes"
//                   ? "Liked"
//                   : "Disliked"}{" "}
//                 {viewType === "received" && rec.accept === "yes" && (
//                   <>
//                     <button
//                       onClick={() => handleLikeRecommendation(rec.id, "yes")}
//                       className="like-button"
//                     >
//                       <FaThumbsUp />
//                     </button>
//                     <button
//                       onClick={() => handleLikeRecommendation(rec.id, "no")}
//                       className="dislike-button"
//                     >
//                       <FaThumbsDown />
//                     </button>
//                   </>
//                 )}
//               </p>
//             </div>
//           ))
//         ) : (
//           <p>
//             {viewType === "sent"
//               ? "You have not sent any recommendations."
//               : "You have not received any recommendations."}
//           </p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default FriendRecs;

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserRecommendations } from "../store/allUserRecommendationsStore";
import { updateSingleUserRecommendation } from "../store/singleUserRecommendationStore";
import { Link } from "react-router-dom";
import { FaThumbsUp, FaThumbsDown } from "react-icons/fa";

const FriendRecs = () => {
  const dispatch = useDispatch();
  const [viewType, setViewType] = useState("sent");
  const [editingResponseId, setEditingResponseId] = useState(null);
  const [responseText, setResponseText] = useState("");

  const currentUserId = useSelector((state) => state.auth.id);
  const recommendations = useSelector((state) => state.allUserRecommendations);

  useEffect(() => {
    dispatch(fetchUserRecommendations());
  }, [dispatch]);

  const filteredRecs =
    viewType === "sent"
      ? recommendations.filter((rec) => rec.senderId === currentUserId)
      : recommendations.filter((rec) => rec.receiverId === currentUserId);

  const refreshRecommendations = () => {
    dispatch(fetchUserRecommendations());
  };

  const handleResponseSubmit = async (recId) => {
    await dispatch(updateSingleUserRecommendation({ id: recId, response: responseText }));
    setEditingResponseId(null);
    setResponseText("");
    refreshRecommendations(); // Refresh recommendations after update
  };

  const handleAcceptRecommendation = async (recId, accept) => {
    await dispatch(updateSingleUserRecommendation({ id: recId, accept }));
    refreshRecommendations(); // Refresh recommendations after update
  };

  const handleLikeRecommendation = async (recId, liked) => {
    await dispatch(updateSingleUserRecommendation({ id: recId, liked }));
    refreshRecommendations(); // Refresh recommendations after update
  };

  return (
    <div className="friend-recs-container">
      <h2>Friend Recommendations</h2>

      <div className="recs-dropdown">
        <label htmlFor="recs-view">View: </label>
        <select
          id="recs-view"
          value={viewType}
          onChange={(e) => setViewType(e.target.value)}
        >
          <option value="sent">Recommendations Sent</option>
          <option value="received">Recommendations Received</option>
        </select>
      </div>

      <div className="recs-list">
        {filteredRecs.length ? (
          filteredRecs.map((rec) => (
            <div key={rec.id} className="rec-item">
              <p>
                <strong>Movie:</strong>{" "}
                {rec.movie ? (
                  <Link to={`/movies/${rec.movie.id}`}>{rec.movie.title}</Link>
                ) : (
                  "Movie details unavailable"
                )}
              </p>
              {viewType === "sent" ? null : (
                <p>
                  <strong>From:</strong> {rec.sender?.username || "N/A"}
                </p>
              )}
              {viewType === "received" ? null : (
                <p>
                  <strong>To:</strong> {rec.receiver?.username || "N/A"}
                </p>
              )}
              <p>
                <strong>Message:</strong> {rec.message || "No message"}
              </p>
              <p>
                <strong>Response:</strong>{" "}
                {editingResponseId === rec.id ? (
                  <>
                    <input
                      type="text"
                      value={responseText}
                      onChange={(e) => setResponseText(e.target.value)}
                      className="response-input"
                    />
                    <button
                      onClick={() => handleResponseSubmit(rec.id)}
                      className="submit-response-button"
                    >
                      Submit
                    </button>
                    <button
                      onClick={() => {
                        setEditingResponseId(null);
                        setResponseText("");
                      }}
                      className="cancel-response-button"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    {rec.response || "No response yet"}{" "}
                    {viewType === "received" && (
                      <button
                        onClick={() => setEditingResponseId(rec.id)}
                        className="respond-button"
                      >
                        Respond
                      </button>
                    )}
                  </>
                )}
              </p>
              <p>
                <strong>Accepted:</strong>{" "}
                {rec.accept === null
                  ? "Pending"
                  : rec.accept === "yes"
                  ? "Accepted"
                  : "Rejected"}{" "}
                {viewType === "received" && rec.accept === null && (
                  <>
                    <button
                      onClick={() => handleAcceptRecommendation(rec.id, "yes")}
                      className="accept-button"
                    >
                      I'll Watch It!
                    </button>
                    <button
                      onClick={() => handleAcceptRecommendation(rec.id, "no")}
                      className="reject-button"
                    >
                      Pass
                    </button>
                  </>
                )}
              </p>
              <p>
                <strong>Liked:</strong>{" "}
                {rec.liked === null
                  ? "Not Rated"
                  : rec.liked === "yes"
                  ? "Liked"
                  : "Disliked"}{" "}
                {viewType === "received" && rec.accept === "yes" && (
                  <>
                    <button
                      onClick={() => handleLikeRecommendation(rec.id, "yes")}
                      className="like-button"
                    >
                      <FaThumbsUp />
                    </button>
                    <button
                      onClick={() => handleLikeRecommendation(rec.id, "no")}
                      className="dislike-button"
                    >
                      <FaThumbsDown />
                    </button>
                  </>
                )}
              </p>
            </div>
          ))
        ) : (
          <p>
            {viewType === "sent"
              ? "You have not sent any recommendations."
              : "You have not received any recommendations."}
          </p>
        )}
      </div>
    </div>
  );
};

export default FriendRecs;

