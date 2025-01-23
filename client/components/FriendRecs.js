import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserRecommendations } from "../store/allUserRecommendationsStore";
import { Link } from "react-router-dom";

const FriendRecs = () => {
  const dispatch = useDispatch();
  const [viewType, setViewType] = useState("sent");

  const currentUserId = useSelector((state) => state.auth.id);
  const recommendations = useSelector((state) => state.allUserRecommendations);

  useEffect(() => {
    dispatch(fetchUserRecommendations());
  }, [dispatch]);

  const filteredRecs =
    viewType === "sent"
      ? recommendations.filter((rec) => rec.senderId === currentUserId)
      : recommendations.filter((rec) => rec.receiverId === currentUserId);

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
        <p>
          <strong>To:</strong> {rec.receiver?.username || "N/A"}
        </p>
        <p>
          <strong>From:</strong> {rec.sender?.username || "N/A"}
        </p>
        <p>
          <strong>Message:</strong> {rec.message || "No message"}
        </p>
        <p>
          <strong>Response:</strong> {rec.response || "No response yet"}
        </p>
        <p>
          <strong>Accepted:</strong>{" "}
          {rec.accept === null
            ? "Pending"
            : rec.accept === "yes"
            ? "Accepted"
            : "Rejected"}
        </p>
        <p>
          <strong>Liked:</strong>{" "}
          {rec.liked === null
            ? "Not Rated"
            : rec.liked === "yes"
            ? "Liked"
            : "Disliked"}
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
