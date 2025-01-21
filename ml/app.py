import pandas as pd
import numpy as np
from flask import Flask, request, jsonify
from sklearn.metrics.pairwise import cosine_similarity

app = Flask(__name__)

# Recommendation function
def recommend_movies(target_user_id, df, similarity_df, num_recommendations=2):
    # Ratings and similarity for the target user
    target_user_ratings = df.loc[target_user_id]
    target_user_similarity = similarity_df[target_user_id]

    # Unrated movies by the target user
    unrated_movies = target_user_ratings[target_user_ratings.isna()].index

    # Predicted ratings for each unrated movie
    recommendations = {}
    for movie in unrated_movies:
        weighted_sum = 0
        similarity_sum = 0

        for other_user_id in df.index:
            if not pd.isna(df.at[other_user_id, movie]):
                weighted_sum += similarity_df.at[target_user_id, other_user_id] * df.at[other_user_id, movie]
                similarity_sum += similarity_df.at[target_user_id, other_user_id]

        predicted_rating = weighted_sum / similarity_sum if similarity_sum != 0 else 0
        recommendations[movie] = predicted_rating

    # Sort and return top recommendations
    recommended_movies = sorted(recommendations.items(), key=lambda x: x[1], reverse=True)
    return recommended_movies[:num_recommendations]

# Flask route
@app.route('/recommendations/<int:user_id>', methods=['POST'])
def recommendations(user_id):
    try:
        # Load user ratings data from the request
        ratings_data = request.json['ratings_data']  # Format: [{'UserID': x, 'Movie': y, 'Rating': z}, ...]

        # Convert to a DataFrame
        df = pd.DataFrame(ratings_data).pivot(index='UserID', columns='Movie', values='Rating')

        # Fill missing values with 0
        rating_matrix = df.fillna(0)

        # Calculate similarity matrix
        similarity_matrix = cosine_similarity(rating_matrix)
        similarity_df = pd.DataFrame(similarity_matrix, index=df.index, columns=df.index)

        # Get recommendations
        recommendations = recommend_movies(user_id, df, similarity_df)

        return jsonify(recommendations)
    except Exception as e:
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True)
