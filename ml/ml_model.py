# import pandas as pd
# from sklearn.linear_model import LinearRegression
# from sklearn.preprocessing import MinMaxScaler


# # Function to predict the rating for a specific user and movie
# def predict_rating_for_movie(user_id, movie_id):
#     # Load the dataset
#     data = pd.read_csv("training_data.csv")

#     # Handle missing values in 'avgFriendRating'
#     data['avgFriendRating'] = data['avgFriendRating'].fillna(data['avgFriendRating'].mean())

#     # Remove 'runtimeMinutes' as it is not relevant
#     if 'runtimeMinutes' in data.columns:
#         data.drop('runtimeMinutes', axis=1, inplace=True)

#     # Ensure 'rating' is numeric
#     data['rating'] = pd.to_numeric(data['rating'], errors='coerce')
#     data['rating'] = data['rating'].fillna(data['rating'].mean())  # Default to mean rating

#     # Normalize numerical features
#     scaler = MinMaxScaler()
#     data[['criticScore', 'avgFriendRating']] = scaler.fit_transform(
#         data[['criticScore', 'avgFriendRating']]
#     )

#     # Encode genres into dummy variables
#     genres = data['genres'].str.get_dummies('|')
#     data = pd.concat([data, genres], axis=1)
#     data.drop('genres', axis=1, inplace=True)

#     # --- NEW: Calculate user genre preferences ---
#     try:
#         user_ratings = data[data['userId'] == user_id]
#         if not user_ratings.empty:
#             user_avg_ratings = user_ratings.groupby(genres.columns.tolist()).mean()['rating']
#             all_other_users = data[data['userId'] != user_id]
#             friend_avg_ratings = all_other_users.groupby(genres.columns.tolist()).mean()['rating']
#             genre_preference = user_avg_ratings - friend_avg_ratings
#             genre_preference = genre_preference.reindex(genres.columns, fill_value=0)
#         else:
#             genre_preference = pd.Series(0, index=genres.columns)  # Default to no preference
#     except Exception as e:
#         print(f"Error calculating genre preferences: {str(e)}")
#         genre_preference = pd.Series(0, index=genres.columns)

#     # Add user-specific preferences as features
#     for genre in genres.columns:
#         data[f'userPreference_{genre}'] = data[genre] * genre_preference.get(genre, 0)

#     # --- NEW: Strengthen Friend Ratings Influence ---
#     friend_ratings = data[(data['movieId'] == movie_id) & (data['userId'] != user_id)]
#     if not friend_ratings.empty:
#         num_friends = len(friend_ratings)
#         weighted_friend_rating = (friend_ratings['rating'] * num_friends).sum() / num_friends
#     else:
#         weighted_friend_rating = data['rating'].mean()  # Default fallback

#     # Prepare training data
#     feature_columns = [col for col in data.columns if col not in ['rating', 'userId', 'movieId', 'title', 'dateWatched', 'status']]
#     X = data[feature_columns]
#     y = data['rating']

#     # Train the model excluding the target movie (to avoid data leakage)
#     train_data = data[data['movieId'] != movie_id]
#     train_X = train_data[feature_columns]
#     train_y = train_data['rating']

#     # Train the regression model
#     model = LinearRegression()
#     model.fit(train_X, train_y)

#     # Find the specific movie and user data for prediction
#     target_movie = data[(data['userId'] == user_id) & (data['movieId'] == movie_id)]
#     if target_movie.empty:
#         return round(train_y.mean(), 2)  # Default to mean rating if no data found

#     # Extract the features for the target movie
#     target_X = target_movie[feature_columns]

#     # Predict the rating
#     predicted_rating = model.predict(target_X)[0]

#     # --- NEW: Implement Prediction Caps/Floors ---
#     friend_high_ratings = friend_ratings[friend_ratings['rating'] >= 9]
#     if len(friend_high_ratings) / max(1, num_friends) >= 0.75:  # 75% of friends rated 9 or 10
#         predicted_rating = max(predicted_rating, 8)  # Ensure it's at least an 8

#     # Final safeguard to keep predictions between 1 and 10
#     predicted_rating = max(1, min(round(predicted_rating, 2), 10))

#     return predicted_rating

# import pandas as pd
# from sklearn.linear_model import LinearRegression
# from sklearn.preprocessing import MinMaxScaler


# # Function to calculate user tendency
# def calculate_user_tendency(data, user_id):
#     user_data = data[data['userId'] == user_id]
#     if user_data.empty:
#         # Default tendency if the user has no data
#         return 0

#     # Calculate user's average rating vs. avgFriendRating and userRating
#     user_diff_friend = (user_data['rating'] - user_data['avgFriendRating']).mean()
#     user_diff_userRating = (user_data['rating'] - user_data['userRating']).mean()

#     # Average the tendencies
#     user_tendency = (user_diff_friend + user_diff_userRating) / 2
#     return user_tendency


# # Function to predict the rating for a specific user and movie
# def predict_rating_for_movie(user_id, movie_id):
#     # Load the dataset
#     data = pd.read_csv("training_data.csv")

#     # Handle missing values
#     data['avgFriendRating'] = data['avgFriendRating'].fillna(data['avgFriendRating'].mean())
#     data['userRating'] = data['userRating'].fillna(data['userRating'].mean())

#     # Drop irrelevant features (e.g., genres, runtimeMinutes)
#     data = data[['userId', 'movieId', 'rating', 'criticScore', 'userRating', 'avgFriendRating']]

#     # Scale `criticScore` to match `userRating` scale (1-10)
#     scaler = MinMaxScaler(feature_range=(1, 10))
#     data['criticScore'] = scaler.fit_transform(data[['criticScore']])

#     # Calculate user tendency
#     user_tendency = calculate_user_tendency(data, user_id)

#     # Prepare training data
#     X = data.drop(['rating', 'userId', 'movieId'], axis=1)
#     y = data['rating']

#     # Train the model excluding the target movie (to avoid data leakage)
#     train_data = data[data['movieId'] != movie_id]
#     train_X = train_data.drop(['rating', 'userId', 'movieId'], axis=1)
#     train_y = train_data['rating']

#     # Train the regression model
#     model = LinearRegression()
#     model.fit(train_X, train_y)

#     # Find the specific movie and user data for prediction
#     target_movie = data[(data['userId'] == user_id) & (data['movieId'] == movie_id)]

#     if target_movie.empty:
#         # If no data for this user-movie pair, use average rating with adjustment
#         predicted_rating = train_y.mean() + user_tendency
#         return round(min(max(predicted_rating, 1), 10), 2)  # Cap between 1 and 10

#     # Extract the features for the target movie
#     target_X = target_movie.drop(['rating', 'userId', 'movieId'], axis=1)

#     # Predict the rating
#     predicted_rating = model.predict(target_X)[0]

#     # Adjust prediction with user tendency
#     predicted_rating += user_tendency

#     # Ensure the rating is between 1 and 10
#     predicted_rating = min(max(predicted_rating, 1), 10)

#     # Return the predicted rating, rounded to 2 decimals
#     return round(predicted_rating, 2)


import pandas as pd
from sklearn.ensemble import GradientBoostingRegressor  # Handles non-linear relationships
from sklearn.preprocessing import MinMaxScaler
import numpy as np

# Function to predict the rating for a specific user and movie
def predict_rating_for_movie(user_id, movie_id):
    # Load the dataset
    data = pd.read_csv("training_data.csv")

    # Handle missing values for avgFriendRating
    data['avgFriendRating'].fillna(data['rating'].mean(), inplace=True)  # Fallback to dataset mean if missing

    # Scale criticScore from 0-100 to match the 1–10 scale
    data['criticScore'] = data['criticScore'] / 10.0

    # Check if the user has rated any movies
    user_ratings = data[data['userId'] == user_id]

    if not user_ratings.empty:
        # Calculate user-specific tendencies
        user_avg_rating = user_ratings['rating'].mean()
        avg_friend_rating_all = data['avgFriendRating'].mean()
        user_rating_tendency = user_avg_rating - avg_friend_rating_all
    else:
        user_rating_tendency = None  # No adjustment for users with no ratings

    # Prepare training data (excluding target movie)
    train_data = data[data['movieId'] != movie_id]
    X_train = train_data[['criticScore', 'userRating', 'avgFriendRating']]
    y_train = train_data['rating']

    # Train a Gradient Boosting model
    model = GradientBoostingRegressor(n_estimators=100, max_depth=3, random_state=42)
    model.fit(X_train, y_train)

    # Get the specific movie's data for prediction
    target_movie = data[data['movieId'] == movie_id]

    if target_movie.empty:
        print(f"Warning: No data found for user {user_id} and movie {movie_id}. Defaulting to mean rating.")
        return round(y_train.mean(), 2)  # Default to average rating

    X_test = target_movie[['criticScore', 'userRating', 'avgFriendRating']].copy()

    # Adjust for user tendency (ONLY if user has prior ratings)
    if user_rating_tendency is not None:
        X_test['userRating'] += user_rating_tendency

    # Predict the rating
    predicted_rating = model.predict(X_test)[0]

    # 🚨 **Fix: Ensure Friend-Based Floor Works Properly**
    # Get all users who rated the movie
    friend_ratings = data[(data['movieId'] == movie_id) & (data['userId'] != user_id)]['rating']

    if not friend_ratings.empty:
        # Count how many of the friends rated the movie 9+
        high_rating_friends = (friend_ratings >= 9).sum()
        num_friends = len(friend_ratings)

        # If 75%+ of friends gave the movie a 9 or 10, enforce a floor of 8
        if num_friends > 0 and (high_rating_friends / num_friends) >= 0.75:
            print(f"🔥 Boosting rating floor for movie {movie_id} - {round((high_rating_friends / num_friends) * 100, 2)}% of friends rated 9+")
            predicted_rating = max(predicted_rating, 8)

    # Return rounded predicted rating
    return round(predicted_rating, 2)
