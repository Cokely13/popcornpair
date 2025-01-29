import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchMovies } from "../store/allMoviesStore";
import { createUserMovie } from "../store/allUserMoviesStore";
import { fetchUserMovies } from "../store/allUserMoviesStore";
import { fetchSingleUser } from "../store/singleUserStore";
import { updateSingleUserMovie } from "../store/singleUserMovieStore";

const Random = () => {
  const { userId } = useParams(); // Friend's ID
  const dispatch = useDispatch();
  const [randomMovie, setRandomMovie] = useState(null);

  const currentUserId = useSelector((state) => state.auth.id);
  const movies = useSelector((state) => state.allMovies) || [];
  const userMovies = useSelector((state) => state.allUserMovies) || [];
  const friend = useSelector((state) => state.singleUser) || [];
  const [selectedMovieId, setSelectedMovieId] = useState(null);
    const [showRatingModal, setShowRatingModal] = useState(false);
  const [rating, setRating] = useState("");

  useEffect(() => {
    dispatch(fetchMovies());
    dispatch(fetchUserMovies());
    dispatch(fetchSingleUser(userId));
  }, [dispatch]);

  const currentUserWatchlist = userMovies
  .filter(
    (um) =>
      um.userId === currentUserId &&
      um.status === "watchlist"
  )
  .map((um) => um.movieId);

// 2. Get watchlist entries for the friend
const friendWatchlist = userMovies
  .filter(
    (um) =>
      um.userId === parseInt(userId) &&
      um.status === "watchlist"
  )
  .map((um) => um.movieId);

  const sharedMovieIds = currentUserWatchlist.filter((movieId) =>
    friendWatchlist.includes(movieId)
  );

// 3. Intersection: Movies in *both* watchlists
const sharedMovies = movies.filter((m) => sharedMovieIds.includes(m.id));


  useEffect(() => {
    if (sharedMovies.length) {
      const randomIndex = Math.floor(Math.random() * sharedMovies.length);
      setRandomMovie(sharedMovies[randomIndex]);
    } else {
      setRandomMovie(null); // No matched movies
    }
  }, [sharedMovies]);

  // const handleWatch = async (movieId) => {

  //   try {
  //     const userMovie = userMovies.find(
  //       (um) => um.movieId === movieId && um.userId === currentUserId
  //     );

  //     await dispatch(
  //       updateSingleUserMovie({
  //         userId: currentUserId,
  //         movieId: userMovie.movieId,
  //         status: "watched",
  //         watchedWith: userId
  //       })
  //     );

  //     await dispatch(
  //       updateSingleUserMovie({
  //         userId: userId,
  //         movieId: userMovie.movieId,
  //         status: "watched",
  //         watchedWith: currentUserId
  //       })
  //     );
  //     dispatch(fetchUserMovies());
  //   } catch (err) {
  //     console.error("Error marking as watched:", err);
  //   }
  // };

  const handleMarkAsWatched = (movieId) => {
    setSelectedMovieId(movieId);
    setShowRatingModal(true); // Open the rating modal
  };

  // 8) Submit rating or skip
  const handleSubmitRating = async (skip = false) => {
    try {
      if (!selectedMovieId) return;

      // Check if there's already a userMovie record
      const userMovie = userMovies.find(
        (um) => um.movieId === selectedMovieId && um.userId === currentUserId
      );


        await dispatch(
          updateSingleUserMovie({
            userId: currentUserId,
            movieId: userMovie.movieId,
            status: "watched",
            rating: skip ? null : Number(rating), // Only set rating if user selected
            watchedWith: userId
          })
        );

        await dispatch(
                updateSingleUserMovie({
                  userId: userId,
                  movieId: userMovie.movieId,
                  status: "watched",
                  watchedWith: currentUserId
                })
              );



      // Cleanup
      setShowRatingModal(false);
      setRating("");
      setSelectedMovieId(null);

      // Refresh user movies
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


  return (
    <div className="rate-movie-container">
      <h2>Random Match with {friend?.username || "User"}</h2>

      {randomMovie ? (
        <>
          {/* Movie Poster */}
          {randomMovie.posterUrl ? (
            <img
              src={randomMovie.posterUrl}
              alt={randomMovie.title}
              className="movie-poster"
            />
          ) : (
            <div className="no-image">No Image Available</div>
          )}

          {/* Movie Information */}
          <div className="movie-info">
            <h2>{randomMovie.title || "Untitled Movie"}</h2>
            <p>
              <strong>Description:</strong>{" "}
              {randomMovie.description || "No description available."}
            </p>
            <p>
              <strong>Release Date:</strong>{" "}
              {randomMovie.releaseDate || "Unknown"}
            </p>
            <p>
              <strong>Genres:</strong>{" "}
              {randomMovie.genres?.join(", ") || "N/A"}
            </p>
          </div>

          {/* Watch Button */}
          <div className="button-container">
          <button className="watch-button" onClick={() => handleMarkAsWatched(randomMovie.id)}>
              Watch
            </button>
          </div>
        </>
      ) : (
        <div>Sorry, there are no movies to show.</div>
      )}
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
            disabled={!rating} // Must pick rating to submit
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

export default Random;
