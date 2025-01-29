const [selectedMovieId, setSelectedMovieId] = useState(null);

    const [showRatingModal, setShowRatingModal] = useState(false);
  const [rating, setRating] = useState("");




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

      if (userMovie && (userMovie.status === "watchlist" || userMovie.status === "none")) {
        // If the movie is on watchlist or none, update to "watched" + rating
        await dispatch(
          updateSingleUserMovie({
            userId: userMovie.userId,
            movieId: userMovie.movieId,
            status: "watched",
            rating: skip ? null : Number(rating), // Only set rating if user selected
          })
        );
      } else {
        // Otherwise, create a new userMovie entry
        await dispatch(
          createUserMovie({
            userId: currentUserId,
            movieId: selectedMovieId,
            status: "watched",
            rating: skip ? null : Number(rating),
          })
        );
      }

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
