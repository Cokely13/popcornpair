import React from "react";
// import "./Algorithm.css"; // Optional CSS file for styling

const Algorithm = () => {
  return (
    <div className="algorithm-container">
      <section className="algorithm-header">
        <h1>Our Prediction System</h1>
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
          <li>
            <strong>Consistenly Improving:</strong> The more movies that you and your friends rate, the more accurate the predictions will be.
          </li>
        </ul>

        <p>Ready to see it in action?</p>
        <a href="/rate" className="algorithm-button">EXPLORE MOVIES</a>
      </section>
    </div>
  );
};

export default Algorithm;

