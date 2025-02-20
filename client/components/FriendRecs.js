

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserRecommendations } from "../store/allUserRecommendationsStore";
import { updateSingleUserRecommendation } from "../store/singleUserRecommendationStore";
import { fetchUserMovies, createUserMovie } from "../store/allUserMoviesStore";
import { fetchMovies } from "../store/allMoviesStore";
import { updateSingleUserMovie } from "../store/singleUserMovieStore";
import { fetchUsers } from "../store/allUsersStore";
import { Link } from "react-router-dom";
import { FaThumbsUp, FaThumbsDown } from "react-icons/fa";

const FriendRecs = () => {
  const dispatch = useDispatch();
  const users = useSelector((state) => state.allUsers);
  const [viewType, setViewType] = useState("received");
  const [editingResponseId, setEditingResponseId] = useState(null);
  const [responseText, setResponseText] = useState("");

  const currentUserId = useSelector((state) => state.auth.id);
  const recommendations = useSelector((state) => state.allUserRecommendations);
  const userMovies = useSelector((state) => state.allUserMovies);
  const [selectedMovieId, setSelectedMovieId] = useState(null);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [rating, setRating] = useState("");

  useEffect(() => {
    dispatch(fetchUserRecommendations());
    dispatch(fetchUserMovies());
    dispatch(fetchUsers());
    dispatch(fetchMovies());
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
      const response = await fetch("/flask-predict-rating", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: currentUserId, movieId }),
      });
      const data = await response.json();

      const predictedRating =
        response.ok && data.predictedRating !== undefined
          ? data.predictedRating
          : 0.0;

      const approachUsed = response.ok && data.approachUsed
        ? data.approachUsed
        : "unknown";

      // Check if a userMovie already exists for this movie and current user.
      const userMovie = userMovies.find(
        (um) => um.movieId === movieId && um.userId === currentUserId
      );

      if (userMovie && userMovie.status === "none") {
        await dispatch(
          updateSingleUserMovie({
            userId: userMovie.userId,
            movieId: userMovie.movieId,
            status: "watchlist",
          })
        );
        dispatch(fetchUserMovies());
      } else if (!userMovie) {
        await dispatch(
          createUserMovie({
            userId: currentUserId,
            movieId,
            status: "watchlist",
            predictedRating,
          })
        );
      }
      alert(`Movie added to watchlist! Predicted Rating: ${predictedRating} (Using: ${approachUsed})`);
    } catch (err) {
      console.error("Error adding movie to watchlist or fetching predicted rating:", err);
      alert("Something went wrong. Please try again.");
    }
  };

  const handleAcceptRecommendation = async (rec, accept) => {
    await dispatch(updateSingleUserRecommendation({ id: rec.id, accept }));
    if (accept === "yes") {
      handleAddToWatchlist(rec.movie.id);
    }
    refreshRecommendations();
  };

  const handleLikeRecommendation = async (recId, liked) => {
    await dispatch(updateSingleUserRecommendation({ id: recId, liked }));
    refreshRecommendations();
  };

  const handleMarkAsWatched = (movie) => {
    setSelectedMovieId(movie.movieId);
    setShowRatingModal(true); // Open the rating modal
  };

  const handleSubmitRating = async (skip = false) => {
    try {
      if (!selectedMovieId) return;

      const userMovie = userMovies.find(
        (um) => um.movieId === selectedMovieId && um.userId === currentUserId
      );

      if (userMovie && (userMovie.status === "watchlist" || userMovie.status === "none")) {
        await dispatch(
          updateSingleUserMovie({
            userId: userMovie.userId,
            movieId: userMovie.movieId,
            status: "watched",
            rating: skip ? null : Number(rating),
          })
        );
      } else {
        await dispatch(
          createUserMovie({
            userId: currentUserId,
            movieId: selectedMovieId,
            status: "watched",
            rating: skip ? null : Number(rating),
          })
        );
      }

      setShowRatingModal(false);
      setRating("");
      setSelectedMovieId(null);
      dispatch(fetchUserMovies());

      if (!skip && rating) {
        alert(`Movie marked as watched with a rating of ${rating}!`);
      } else {
        alert("Movie marked as watched!");
      }
    } catch (err) {
      console.error("Error submitting rating:", err);
    }
  };

  // Check if a recommendation movie is already on the current user's watchlist
  const isOnWatchlist = (movieId) =>
    userMovies.some(
      (userMovie) =>
        userMovie.movieId === movieId &&
        userMovie.userId === currentUserId &&
        userMovie.status === "watchlist"
    );

  // Check if a recommendation has been marked as watched
  const isMovieWatched = (movieId) =>
    userMovies.some(
      (userMovie) =>
        userMovie.movieId === movieId &&
        userMovie.userId === currentUserId &&
        userMovie.status === "watched"
    );

  const rejectedRecs = recommendations.filter((rec) => rec.accept === "no");
  const otherRecs = recommendations.filter((rec) => rec.accept !== "no");

  const filteredRecs = otherRecs.filter((rec) => {
    if (viewType === "received")
      return (
        rec.receiverId === currentUserId &&
        rec.movie && // Ensure rec.movie is defined
        !isMovieWatched(rec.movie.id)
      );
    if (viewType === "sent") return rec.senderId === currentUserId;
    if (viewType === "watched")
      return (
        rec.receiverId === currentUserId &&
        rec.movie && // Ensure rec.movie is defined
        isMovieWatched(rec.movie.id)
      );
    return false;
  });

  return (
    <div className="friend-recs-container">
      <section className="hero-section">
        <h1>RECOMMENDATIONS</h1>
      </section>
      {/* Filter Dropdown */}
      <div className="recs-dropdown">
        <label htmlFor="recs-view">View: </label>
        <select
          id="recs-view"
          value={viewType}
          onChange={(e) => setViewType(e.target.value)}
        >
          <option value="received">Recommendations Received</option>
          <option value="sent">Recommendations Sent</option>
          <option value="watched">Recommendations Watched</option>
        </select>
      </div>

      {/* Recommendations List */}
      <div className="recs-list">
        {filteredRecs.length ? (
          filteredRecs.map((rec) => {
            // Determine if this recommended movie is already on the watchlist
            const onWatchlist =
              rec.movie &&
              isOnWatchlist(rec.movie.id);

            return (
              <div
              key={rec.id}
              className={`watchlist-movie-item ${
                rec.movie && isOnWatchlist(rec.movie.id) ? "watchlist-movie" : ""
              }`}
            >
                {rec.movie.posterUrl && (
                  <img
                    src={rec.movie.posterUrl}
                    alt={rec.movie.title}
                    className="movie-poster"
                  />
                )}
                <p>
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
                {viewType === "received" || viewType === "watched" ? null : (
                  <p>
                    <strong>To:</strong> {rec.receiver?.username || "N/A"}
                  </p>
                )}
                {rec.message ? (
                  <p>
                    <strong>Message:</strong> {rec.message || "No message"}
                  </p>
                ) : (
                  <div></div>
                )}
                {/* <p>
                  <strong>Response:</strong>{" "}
                  {rec.response || ""}
                  {viewType === "received" ? (
                    editingResponseId === rec.id ? (
                      <>
                        <input
                          type="text"
                          value={responseText}
                          onChange={(e) => setResponseText(e.target.value)}
                          className="response-input"
                        />
                        <button
                          onClick={() => handleResponseSubmit(rec.id)}
                          className="change-btn"
                        >
                          SUBMIT
                        </button>
                        <button
                          onClick={() => {
                            setEditingResponseId(null);
                            setResponseText("");
                          }}
                          className="cancel-button"
                        >
                          CANCEL
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => setEditingResponseId(rec.id)}
                        className="respond-button"
                      >
                        RESPOND
                      </button>
                    )
                  ) : (
                    <div></div>
                  )}
                </p> */}
                {rec.accept === "yes" ? (
                  viewType === "received" && !isMovieWatched(rec.movie.id) && (
                    <p>
                      <button
                        onClick={() => handleMarkAsWatched(rec)}
                        className="watched-button"
                      >
                        WATCHED
                      </button>
                    </p>
                  )
                ) : rec.accept === null && viewType === "received" ? (
                  <p>
                    {/*
                      If the movie is already on the current user's watchlist,
                      display "On Watchlist". Otherwise, show the WATCHLIST button.
                    */}
                    {onWatchlist ? (
                        <>
                      {!isMovieWatched(rec.movie.id) && (
                        <button
                          onClick={() => handleMarkAsWatched(rec)}
                          className="watched-button"
                          style={{ marginLeft: "10px" }}
                        >
                          WATCHED
                        </button>
                      )}
                    </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleAcceptRecommendation(rec, "yes")}
                          className="accept-button"
                        >
                          WATCHLIST
                        </button>
                        <button
                          onClick={() => handleAcceptRecommendation(rec, "no")}
                          className="reject-button"
                        >
                          PASS
                        </button>
                      </>
                    )}
                  </p>
                ) : (
                  <p>
                    <strong>Accepted:</strong>{" "}
                    {rec.accept === "no" ? "Rejected" : "Pending"}
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
                    {(viewType === "received" && rec.accept === "yes") ||
                    (viewType === "watched" && (
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
                    ))}
                  </p>
                )}
              </div>
            );
          })
        ) : (
          <p>
            {viewType === "received"
              ? "You have not received any recommendations."
              : viewType === "sent"
              ? "You have not sent any recommendations."
              : "You have not watched any recommended movies."}
          </p>
        )}
      </div>
      {showRatingModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Rate the Movie</h2>
            <p>Would you like to give this movie a rating now?</p>
            <select
              value={rating}
              onChange={(e) => setRating(e.target.value)}
            >
              <option value="">Select a rating</option>
              {[...Array(10)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>
            <div className="modal-buttons">
              <button
                onClick={() => handleSubmitRating(false)}
                disabled={!rating}
              >
                Submit Rating
              </button>
              <button onClick={() => handleSubmitRating(true)}>Skip</button>
              <button
                onClick={() => {
                  setShowRatingModal(false);
                  setSelectedMovieId(null);
                  setRating("");
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FriendRecs;
