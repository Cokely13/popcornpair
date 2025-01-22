// import React, { useEffect, useState } from "react";
// import { useSelector } from "react-redux";
// import axios from "axios";
// import { Link } from "react-router-dom";

// const Recommendations = () => {
//   const [recommendations, setRecommendations] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const currentUserId = useSelector((state) => state.auth.id);

//   useEffect(() => {
//     const fetchRecommendations = async () => {
//       try {
//         const { data } = await axios.get(`/api/recommendations/${currentUserId}`);
//         setRecommendations(data);
//         setLoading(false);
//       } catch (err) {
//         console.error("Error fetching recommendations:", err);
//         setError("Unable to fetch recommendations. Please try again later.");
//         setLoading(false);
//       }
//     };

//     fetchRecommendations();
//   }, [currentUserId]);

//   if (loading) {
//     return <div>Loading recommendations...</div>;
//   }

//   if (error) {
//     return <div>{error}</div>;
//   }

//   if (!recommendations.length) {
//     return (
//       <div className="recommendations-container">
//         <h2>Recommended Movies for You</h2>
//         <p>No recommendations available. Start rating movies to get personalized recommendations!</p>
//       </div>
//     );
//   }

//   return (
//     <div className="recommendations-container">
//       <h2>Recommended Movies for You</h2>
//       <div className="recommendations-list">
//         {recommendations.map((movie) => (
//           <div key={movie.id} className="recommendation-item">
//             {movie.posterUrl ? (
//               <img
//                 src={movie.posterUrl}
//                 alt={movie.title}
//                 className="recommendation-poster"
//               />
//             ) : (
//               <div className="no-poster">No Image Available</div>
//             )}
//             <div className="recommendation-info">
//               <Link to={`/movies/${movie.id}`}>
//                 <h3>{movie.title || "Untitled Movie"}</h3>
//               </Link>
//               <p>
//                 <strong>Genres:</strong> {movie.genres?.join(", ") || "N/A"}
//               </p>
//               <p>
//                 <strong>Predicted Rating:</strong>{" "}
//                 {movie.predictedRating?.toFixed(1) || "N/A"}
//               </p>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Recommendations;

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { Link } from "react-router-dom";

const Recommendations = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [message, setMessage] = useState(""); // To store the message from the backend
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const currentUserId = useSelector((state) => state.auth.id);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const { data } = await axios.get(`/api/recommendations/${currentUserId}`);
        if (data.message) {
          // Backend returned a message (e.g., "No recommendations yet")
          setMessage(data.message);
        } else {
          // Backend returned recommendations
          setRecommendations(data);
        }
        setLoading(false);
      } catch (err) {
        console.error("Error fetching recommendations:", err);
        setError("Unable to fetch recommendations. Please try again later.");
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [currentUserId]);

  if (loading) {
    return <div>Loading recommendations...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (message) {
    return (
      <div className="recommendations-container">
        <h2>Recommended Movies for You</h2>
        <p>{message}</p>
      </div>
    );
  }

  if (!recommendations.length) {
    return (
      <div className="recommendations-container">
        <h2>Recommended Movies for You</h2>
        <p>No recommendations available. Start rating movies to get personalized recommendations!</p>
      </div>
    );
  }

  return (
    <div className="recommendations-container">
      <h2>Recommended Movies for You</h2>
      <div className="recommendations-list">
        {recommendations.map((movie) => (
          <div key={movie.id} className="recommendation-item">
            {movie.posterUrl ? (
              <img
                src={movie.posterUrl}
                alt={movie.title}
                className="recommendation-poster"
              />
            ) : (
              <div className="no-poster">No Image Available</div>
            )}
            <div className="recommendation-info">
              <Link to={`/movies/${movie.id}`}>
                <h3>{movie.title || "Untitled Movie"}</h3>
              </Link>
              <p>
                <strong>Genres:</strong> {movie.genres?.join(", ") || "N/A"}
              </p>
              <p>
                <strong>Predicted Rating:</strong>{" "}
                {movie.predictedRating?.toFixed(1) || "N/A"}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Recommendations;
