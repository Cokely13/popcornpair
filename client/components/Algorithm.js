// import React from "react";
// // import "./Algorithm.css"; // Optional CSS file for styling

// const Algorithm = () => {
//   return (
//     <div className="algorithm-container">
//       <section className="algorithm-header">
//         <h1>Our Brilliant Prediction System</h1>
//         <p>
//           Harnessing critic insights, friend ratings, and your own movie
//           history to deliver personalized predictions.
//         </p>
//       </section>

//       <section className="algorithm-section">
//         <h2>How It Works</h2>
//         <div className="algorithm-steps">
//           <div className="step-card">
//             <h3>1. Base Score</h3>
//             <p>
//               We start by blending <strong>critic scores</strong> (scaled to
//               match user ratings) and <strong>official user ratings</strong> (like
//               IMDb or TMDb) to form an initial prediction.
//             </p>
//           </div>

//           <div className="step-card">
//             <h3>2. Friend Influence</h3>
//             <p>
//               We scan ratings from your <strong>accepted friends</strong> who have
//               watched the movie. Their experiences help us fine-tune your
//               expected enjoyment level.
//             </p>
//           </div>

//           <div className="step-card">
//             <h3>3. Personalized Bias</h3>
//             <p>
//               If you've rated enough movies, we learn your <em>unique style</em>—some
//               users rate high, others rate tough. This bias is applied to the
//               prediction, ensuring it matches your personal taste.
//             </p>
//           </div>

//           <div className="step-card">
//             <h3>4. Final Magic Touch</h3>
//             <p>
//               We combine these factors, clamp the result to a tidy <strong>1–10</strong>{" "}
//               scale, and present you with a final <strong>predicted rating</strong>{" "}
//               for every movie on your watchlist.
//             </p>
//           </div>
//         </div>
//       </section>

//       <section className="algorithm-cta">
//         <h2>What Makes It Special?</h2>
//         <ul>
//           <li>
//             <strong>Dynamic Updates:</strong> As you and your friends rate more
//             movies, predictions adapt in real-time.
//           </li>
//           <li>
//             <strong>Whole-Friend Approach:</strong> Ratings from your entire friend
//             circle help shape your personal recommendations.
//           </li>
//           <li>
//             <strong>Future-Proof:</strong> We'll soon add advanced ML to refine
//             predictions even further as your dataset grows.
//           </li>
//         </ul>

//         <p>Ready to see it in action?</p>
//         <a href="/rate" className="algorithm-button">EXPLORE MOVIES</a>
//       </section>
//     </div>
//   );
// };

// export default Algorithm;

import React from "react";
// import "./Algorithm.css"; // Optional CSS file for styling

const Algorithm = () => {
  return (
    <div className="algorithm-container">
      <section className="algorithm-header">
        <h1>Our Intelligent Prediction System</h1>
        <p>
          Our hybrid algorithm uses real-time data from our movie database to deliver personalized predictions by combining traditional rule-based insights with collaborative filtering.
        </p>
      </section>

      <section className="algorithm-section">
        <h2>How It Works</h2>
        <div className="algorithm-steps">
          <div className="step-card">
            <h3>1. Base Calculation</h3>
            <p>
              We begin by blending <strong>scaled critic scores</strong> and <strong>official user ratings</strong> (from sources like TMDb) to form a solid base prediction.
            </p>
          </div>

          <div className="step-card">
            <h3>2. Friend Influence</h3>
            <p>
              Our algorithm then incorporates ratings from your <strong>accepted friends</strong> to adjust the base prediction, ensuring that shared tastes are factored in.
            </p>
          </div>

          <div className="step-card">
            <h3>3. Personalized Bias</h3>
            <p>
              If you've rated a sufficient number of movies (10 or more), we learn your unique rating style and adjust the prediction with your personal bias. For newer users, a robust rule‑based estimate is used until more data is available.
            </p>
          </div>

          <div className="step-card">
            <h3>4. Real-Time Adaptation</h3>
            <p>
              Every time you interact with our platform, the system pulls the latest data from our database. This ensures that predictions adapt instantly to your rating history and friend activity.
            </p>
          </div>
        </div>
      </section>

      <section className="algorithm-cta">
        <h2>What Makes It Special?</h2>
        <ul>
          <li>
            <strong>Dynamic Updates:</strong> Our system queries up-to-date database records to adjust predictions in real-time.
          </li>
          <li>
            <strong>Hybrid Approach:</strong> New users receive a reliable rule-based estimation, while established users benefit from advanced collaborative filtering.
          </li>
          <li>
            <strong>Friend Influence:</strong> Recommendations are tailored using ratings from your trusted friend circle.
          </li>
        </ul>

        <p>Ready to see it in action?</p>
        <a href="/rate" className="algorithm-button">EXPLORE MOVIES</a>
      </section>
    </div>
  );
};

export default Algorithm;

