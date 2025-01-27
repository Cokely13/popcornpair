import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserRecommendations } from "../store/allUserRecommendationsStore";
import { updateSingleUserRecommendation } from "../store/singleUserRecommendationStore";
import { fetchUserMovies, createUserMovie } from "../store/allUserMoviesStore";
import { updateSingleUserMovie } from "../store/singleUserMovieStore";
import { Link } from "react-router-dom";
import { FaThumbsUp, FaThumbsDown } from "react-icons/fa";

const FriendRecs = () => {
  const dispatch = useDispatch();
  const [viewType, setViewType] = useState("sent");
  const [editingResponseId, setEditingResponseId] = useState(null);
  const [responseText, setResponseText] = useState("");

  const currentUserId = useSelector((state) => state.auth.id);
  const recommendations = useSelector((state) => state.allUserRecommendations);
  const userMovies = useSelector((state) => state.allUserMovies);



  useEffect(() => {
    dispatch(fetchUserRecommendations());
    dispatch(fetchUserMovies());
  }, [dispatch]);

  const refreshRecommendations = () => {
    dispatch(fetchUserRecommendations());
    dispatch(fetchUserMovies());
  };

  const handleResponseSubmit = async (recId) => {
    await dispatch(updateSingleUserRecommendation({ id: recId, response: responseText }));
    setEditingResponseId(null);
    setResponseText("");
    refreshRecommendations();
  };

  const handleAddToWatchlist = async (movieId) => {
    try {
      // Optionally fetch a predicted rating
      const response = await fetch("http://127.0.0.1:5000/api/predict-rating", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: currentUserId, movieId }),
      });
      const data = await response.json();

      const predictedRating =
        response.ok && data.predictedRating !== undefined
          ? data.predictedRating
          : 0.0;

      // Add or create the userMovie record with "watchlist" status
      const userMovie = userMovies.find(
        (um) => um.movieId === movieId && um.userId === currentUserId
      );

      if (userMovie && userMovie.status === "none") {
        // If the movie is currently "watchlist", update status to "watched"
        await dispatch(
          updateSingleUserMovie({
            userId: userMovie.userId,
            movieId: userMovie.movieId,
            status: "watchlist",
          })
        );
        dispatch(fetchUserMovies());
      } else {
      await dispatch(
        createUserMovie({
          userId: currentUserId,
          movieId,
          status: "watchlist",
          predictedRating,
        })
      );}

      alert(`Movie added to watchlist! Predicted Rating: ${predictedRating}`);
    } catch (err) {
      console.error(
        "Error adding movie to watchlist or fetching predicted rating:",
        err
      );
      alert("Something went wrong. Please try again.");
    }
  };

  const handleAcceptRecommendation = async (rec, accept) => {
    console.log("yes", rec)
    await dispatch(updateSingleUserRecommendation({ id: rec.id, accept }));
    if(accept == 'yes'){
      console.log("!!!!!")
      handleAddToWatchlist(rec.movie.id,)
    }
    refreshRecommendations();
  };

  const handleLikeRecommendation = async (recId, liked) => {
    await dispatch(updateSingleUserRecommendation({ id: recId, liked }));
    refreshRecommendations();
  };

  const handleWatched = async (rec) => {
    try {
      const userMovie = userMovies.find(
        (um) => um.movieId === rec.movieId && um.userId === currentUserId
      );

      if (userMovie && userMovie.status === "watchlist" ||userMovie && userMovie.status === "none") {
        // If the movie is currently "watchlist", update status to "watched"
        await dispatch(
          updateSingleUserMovie({
            userId: userMovie.userId,
            movieId: userMovie.movieId,
            status: "watched",
          })
        );
        dispatch(fetchUserMovies());
      } else {
        // Otherwise, create a new entry with status: "watched"
        await dispatch(
          createUserMovie({
            userId: currentUserId,
            movieId: rec.movieId,
            status: "watched",
          })
        );
      }

      alert("Movie marked as watched!");
    } catch (err) {
      console.error("Error marking movie as watched:", err);
    }
  };

  // Check if a recommendation has been marked as watched
  const isMovieWatched = (movieId) => {
    return userMovies.some(
      (userMovie) =>
        userMovie.movieId === movieId &&
        userMovie.userId === currentUserId && // Ensure it's for the current user
        userMovie.status === "watched"
    );
  };

  // Filter recommendations based on view type
  const filteredRecs = recommendations.filter((rec) => {
    if (viewType === "sent") return rec.senderId === currentUserId;
    if (viewType === "received") return rec.receiverId === currentUserId && !isMovieWatched(rec.movie.id);
    if (viewType === "watched") return rec.receiverId === currentUserId && isMovieWatched(rec.movie.id);
    return false;
  });

  return (
    <div className="friend-recs-container">
      <h2>Friend Recommendations</h2>

      {/* Filter Dropdown */}
      <div className="recs-dropdown">
        <label htmlFor="recs-view">View: </label>
        <select
          id="recs-view"
          value={viewType}
          onChange={(e) => setViewType(e.target.value)}
        >
          <option value="sent">Recommendations Sent</option>
          <option value="received">Recommendations Received</option>
          <option value="watched">Recommendations Watched</option>
        </select>
      </div>

      {/* Recommendations List */}
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
              {viewType === "received"  || viewType === "watched" ? null : (
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
                    {viewType === "received" || viewType === "watched" && (
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
              {rec.accept === "yes"  ? (
               viewType === "received" && !isMovieWatched(rec.movie.id) && (
                <p>
                  {/* <strong>Watch:</strong>{" "} */}
                  <button
                    onClick={() => handleWatched(rec)}
                    className="watched-button"
                  >
                    Watch
                  </button>
                </p>
              )
              ) : rec.accept === null && viewType === "received" ? (
                <p>
                  <strong>Accepted:</strong>{" "}
                  <>
                    <button
                      onClick={() => handleAcceptRecommendation(rec, "yes")}
                      className="accept-button"
                    >
                      I'll Watch It!
                    </button>
                    <button
                      onClick={() => handleAcceptRecommendation(rec, "no")}
                      className="reject-button"
                    >
                      Pass
                    </button>
                  </>
                </p>
              ) : (
                <p>
                  <strong>Accepted:</strong> {rec.accept === "no" ? "Rejected" : "Pending"}
                </p>
              )}
              {viewType === "watched" && (
                <p>
               <strong>Liked:</strong>{" "}
                {rec.liked === null
                  ? "Not Rated"
                  : rec.liked === "yes"
                  ? "Liked"
                  : "Disliked"}{" "}
                {viewType === "received" && rec.accept === "yes" || viewType === "watched" && (
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
              </p>)}
            </div>
          ))
        ) : (
          <p>
            {viewType === "sent"
              ? "You have not sent any recommendations."
              : viewType === "received"
              ? "You have not received any recommendations."
              : "You have not watched any recommended movies."}
          </p>
        )}
      </div>
    </div>
  );
};

export default FriendRecs;
