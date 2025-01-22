import pandas as pd
import numpy as np
from flask import Flask, request, jsonify
from sklearn.metrics.pairwise import cosine_similarity

app = Flask(__name__)

# Recommendation function
def recommend_movies(target_user_id, df, similarity_df, num_recommendations=2):
    # Check if the target_user_id exists in the DataFrame
    if target_user_id not in df.index:
        print(f"User {target_user_id} not found in dataset.")
        return []  # Return an empty list if user not found

    # Ratings and similarity for the target user
    target_user_ratings = df.loc[target_user_id]
    target_user_similarity = similarity_df[target_user_id]

    # Unrated movies by the target user
    unrated_movies = target_user_ratings[target_user_ratings == 0].index
    if len(unrated_movies) == 0:
        print(f"No unrated movies found for user {target_user_id}.")
        return []  # Return an empty list if no unrated movies

    # Predicted ratings for each unrated movie
    recommendations = {}
    for movie in unrated_movies:
        weighted_sum = 0
        similarity_sum = 0

        for other_user_id in df.index:
            if df.at[other_user_id, movie] > 0:  # Check for rated movies
                weighted_sum += similarity_df.at[target_user_id, other_user_id] * df.at[other_user_id, movie]
                similarity_sum += similarity_df.at[target_user_id, other_user_id]

        predicted_rating = weighted_sum / similarity_sum if similarity_sum != 0 else 0
        recommendations[movie] = predicted_rating

    # Sort and return top recommendations
    recommended_movies = sorted(recommendations.items(), key=lambda x: x[1], reverse=True)
    return recommended_movies[:num_recommendations]


# @app.route('/recommendations/<int:user_id>', methods=['POST'])
# def recommendations(user_id):
#     try:
#         # Load user ratings data from the request
#         ratings_data = request.json['ratings_data']

#         # Convert to a DataFrame
#         df = pd.DataFrame(ratings_data).pivot(index='UserID', columns='Movie', values='Rating')
#         print("Pivoted DataFrame:\n", df)

#         # Fill missing values with 0
#         df = df.fillna(0)
#         print("Filled DataFrame:\n", df)

#         # Calculate similarity matrix
#         similarity_matrix = cosine_similarity(df)
#         similarity_df = pd.DataFrame(similarity_matrix, index=df.index, columns=df.index)
#         print("Similarity Matrix:\n", similarity_df)

#         # Get recommendations
#         recommendations = recommend_movies(user_id, df, similarity_df)

#         # If no recommendations are found, return an appropriate response
#         if not recommendations:
#             return jsonify({"message": "No recommendations available."}), 200

#         return jsonify(recommendations)
#     except Exception as e:
#         print("Error:", str(e))
#         return jsonify({'error': str(e)}), 400

@app.route('/recommendations/<int:user_id>', methods=['POST'])
def recommendations(user_id):
    try:
        # Load user ratings data from the request
        ratings_data = request.json['ratings_data']

        # Convert to a DataFrame
        df = pd.DataFrame(ratings_data).pivot(index='UserID', columns='Movie', values='Rating')
        print("Pivoted DataFrame:\n", df)

        # Fill missing values with 0
        df = df.fillna(0)
        print("Filled DataFrame:\n", df)

        # Calculate similarity matrix
        similarity_matrix = cosine_similarity(df)
        similarity_df = pd.DataFrame(similarity_matrix, index=df.index, columns=df.index)
        print("Similarity Matrix:\n", similarity_df)

        # Get recommendations
        recommendations = recommend_movies(user_id, df, similarity_df)

        # Return an empty list if no recommendations
        if not recommendations:
            return jsonify([])  # Ensure it is an empty list

        return jsonify(recommendations)
    except Exception as e:
        print("Error:", str(e))
        return jsonify({'error': str(e)}), 400


if __name__ == '__main__':
    app.run(debug=True)
