# import pandas as pd
# import numpy as np

# def load_data():
#     """Load the training data CSV into a Pandas DataFrame."""
#     try:
#         data = pd.read_csv("training_data.csv")  # Ensure correct file path
#         return data
#     except Exception as e:
#         print(f"❌ Error loading dataset: {e}")
#         return None  # Return None if file loading fails

# def predict_rating(user_id, movie_id, data):
#     # Extract movie data
#     movie_row = data[data['movieId'] == movie_id]

#     if movie_row.empty:
#         print(f"⚠️ No data found for movie {movie_id}. Defaulting to critic score + user rating blend.")
#         return round((data['criticScore'].mean() / 10 + data['userRating'].mean()) / 2, 2)

#     # Extract critic score (scaled) and user rating
#     critic_score = movie_row['criticScore'].values[0] / 10
#     user_rating = movie_row['userRating'].values[0]

#     # Base Prediction (if no friends have watched)
#     base_prediction = round((critic_score + user_rating) / 2, 2)

#     # Get Friend Ratings
#     friend_ratings = data[(data['movieId'] == movie_id) & (data['userId'] != user_id)]['rating'].dropna()

#     if friend_ratings.empty:
#         print(f"🔹 No friend ratings for movie {movie_id}. Using base prediction.")
#         return base_prediction

#     # Adjust with Friend Ratings
#     avg_friend_rating = friend_ratings.mean()
#     adjusted_prediction = round((0.5 * avg_friend_rating) + (0.25 * base_prediction) + (0.25 * (critic_score + user_rating)), 2)

#     # Get User's Past Ratings
#     user_ratings = data[data['userId'] == user_id][['rating', 'movieId']].dropna()

#     if user_ratings.empty:
#         print(f"🔹 User {user_id} has no past ratings. Skipping bias correction.")
#         return max(1, min(10, adjusted_prediction))  # ✅ Clamp to [1, 10]

#     # Calculate User Bias
#     past_predictions = data[(data['userId'] == user_id) & (data['rating'].notna())]['rating']
#     avg_user_rating = user_ratings['rating'].mean()
#     avg_past_predictions = past_predictions.mean()

#     user_bias = avg_user_rating - avg_past_predictions
#     final_prediction = round(adjusted_prediction + user_bias, 2)

#     # ✅ Ensure final prediction is between 1 and 10
#     final_prediction = max(1, min(10, final_prediction))

#     print(f"✅ Final Prediction for User {user_id}, Movie {movie_id}: {final_prediction}")
#     return final_prediction

########################################
# ml_model.py
########################################
import pandas as pd
import numpy as np

def load_data():
    """
    Load the training_data.csv (created by data_retrieval.js).
    """
    try:
        data = pd.read_csv("training_data.csv")
        return data
    except Exception as e:
        print(f"❌ Error loading dataset: {e}")
        return None

def predict_rating(user_id, movie_id, data):
    """
    Predicts a rating for any (userId, movieId) even if no userMovie row exists.
    """

    # 1) Filter rows for this movie
    movieRows = data[data['movieId'] == movie_id]
    if movieRows.empty:
        # fallback: average of global criticScore, userRating
        globalCritic = data['criticScore'].dropna().mean() / 10
        globalUserRat = data['userRating'].dropna().mean()
        baseFallback = ( (globalCritic or 5) + (globalUserRat or 5 ) ) / 2
        print(f"⚠️ No data found for movie {movie_id} - returning fallback {baseFallback:.2f}")
        return round(baseFallback, 2)

    # 2) Critic + userRating for the movie
    # We'll just take the *first* row for the movie's criticScore, userRating
    # (they should be the same across all userRows for that movie)
    critic = movieRows.iloc[0]['criticScore'] or 0
    userRat = movieRows.iloc[0]['userRating'] or 0

    # scale critic from 0-100 to 0-10 if needed
    criticScaled = critic / 10

    # Base prediction
    basePrediction = (criticScaled + userRat) / 2

    # 3) Friend Ratings
    # among data for this movie, which rows are friends?
    # We look for friend rows with a valid rating
    # We do not rely on userMovie row for THIS userId, just the friend
    # If userFriends are known, we might need friend relationships from data too
    # For simplicity, assume if userId != currentUserId, they might be a friend
    # (or you'd need a separate dataset to find actual friend userIds).
    # We'll do a simpler approach: average all other user ratings for this movie
    otherUserRows = movieRows[movieRows['userId'] != str(user_id)]  # might be strings, watch out
    friendRatings = pd.to_numeric(otherUserRows['rating'], errors='coerce').dropna()
    if not friendRatings.empty:
        avgFriend = friendRatings.mean()
        # Weighted approach:
        # 0.5 * friend + 0.25 * basePrediction + 0.25 * (criticScaled + userRat)
        basePrediction = 0.5 * avgFriend + 0.25 * basePrediction + 0.25*(criticScaled + userRat)

    # 4) User Tendency
    # We look for all data where userId == current user, rating != null
    userRows = data[(data['userId'] == str(user_id)) & (data['rating'].notna())]
    if len(userRows) > 3:  # only if they've rated >3 movies
        # Simple approach: userAvg - globalAvg
        userAvg = userRows['rating'].mean()
        globalAvg = data['rating'].dropna().mean()
        userBias = userAvg - globalAvg
        basePrediction += userBias

    # clamp to [1..10]
    final = max(1, min(10, basePrediction))
    return round(final, 2)
