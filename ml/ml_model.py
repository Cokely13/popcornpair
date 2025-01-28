# import pandas as pd
# from sklearn.linear_model import LinearRegression
# from sklearn.preprocessing import MinMaxScaler

# # Function to predict the rating for a specific user and movie
# def predict_rating_for_movie(user_id, movie_id):
#     # Load the dataset
#     data = pd.read_csv("training_data.csv")

#     # Handle missing values
#     data['avgFriendRating'] = data['avgFriendRating'].fillna(data['avgFriendRating'].mean())

#     # Remove 'runtimeMinutes' as it is not relevant
#     data.drop('runtimeMinutes', axis=1, inplace=True)

#     # Normalize numerical features
#     scaler = MinMaxScaler()
#     data[['criticScore', 'avgFriendRating']] = scaler.fit_transform(
#         data[['criticScore', 'avgFriendRating']]
#     )

#     # Encode genres
#     genres = data['genres'].str.get_dummies('|')
#     data = pd.concat([data, genres], axis=1)
#     data.drop('genres', axis=1, inplace=True)

#     # Add user-specific preferences
#     # Calculate the average rating difference for the user's genres vs. their friends
#     user_avg_ratings = data[data['userId'] == user_id].groupby(genres.columns.tolist()).mean()['rating']
#     friend_avg_ratings = data[data['userId'] != user_id].groupby(genres.columns.tolist()).mean()['rating']
#     genre_preference = user_avg_ratings - friend_avg_ratings
#     genre_preference = genre_preference.reindex(genres.columns, fill_value=0)
#     for genre in genres.columns:
#         data[f'userPreference_{genre}'] = data[genre] * genre_preference.get(genre, 0)

#     # Prepare training data
#     X = data.drop(['rating', 'userId', 'movieId', 'title', 'dateWatched', 'status'], axis=1)
#     y = data['rating']

#     # Train the model excluding the target movie (to avoid data leakage)
#     train_data = data[data['movieId'] != movie_id]
#     train_X = train_data.drop(['rating', 'userId', 'movieId', 'title', 'dateWatched', 'status'], axis=1)
#     train_y = train_data['rating']

#     # Train the regression model
#     model = LinearRegression()
#     model.fit(train_X, train_y)

#     # Find the specific movie and user data for prediction
#     target_movie = data[(data['userId'] == user_id) & (data['movieId'] == movie_id)]

#     if target_movie.empty:
#         # Fallback: Return a default prediction if the user-movie pair is missing
#         return round(train_y.mean(), 2)  # Default to the mean rating

#     # Extract the features for the target movie
#     target_X = target_movie.drop(['rating', 'userId', 'movieId', 'title', 'dateWatched', 'status'], axis=1)

#     # Predict the rating
#     predicted_rating = model.predict(target_X)[0]  # Get the first (and only) prediction

#     # Return the predicted rating, rounded to 2 decimals
#     return round(predicted_rating, 2)

import pandas as pd
from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import MinMaxScaler


# Function to predict the rating for a specific user and movie
def predict_rating_for_movie(user_id, movie_id):
    # Load the dataset
    data = pd.read_csv("training_data.csv")

    # Handle missing values in 'avgFriendRating'
    data['avgFriendRating'] = data['avgFriendRating'].fillna(data['avgFriendRating'].mean())

    # Remove 'runtimeMinutes' as it is not relevant
    if 'runtimeMinutes' in data.columns:
        data.drop('runtimeMinutes', axis=1, inplace=True)

    # Ensure 'rating' is numeric
    data['rating'] = pd.to_numeric(data['rating'], errors='coerce')

    # Handle missing or invalid ratings
    data['rating'] = data['rating'].fillna(data['rating'].mean())  # Default to the mean rating

    # Normalize numerical features
    scaler = MinMaxScaler()
    data[['criticScore', 'avgFriendRating']] = scaler.fit_transform(
        data[['criticScore', 'avgFriendRating']]
    )

    # Encode genres into dummy variables
    genres = data['genres'].str.get_dummies('|')
    data = pd.concat([data, genres], axis=1)
    data.drop('genres', axis=1, inplace=True)

    # Calculate user-specific genre preferences
    try:
        user_avg_ratings = data[data['userId'] == user_id].groupby(genres.columns.tolist()).mean()['rating']
        friend_avg_ratings = data[data['userId'] != user_id].groupby(genres.columns.tolist()).mean()['rating']
        genre_preference = user_avg_ratings - friend_avg_ratings
        genre_preference = genre_preference.reindex(genres.columns, fill_value=0)
    except Exception as e:
        print(f"Error calculating genre preferences: {str(e)}")
        genre_preference = pd.Series(0, index=genres.columns)  # Default to no preference

    # Add user-specific preferences as features
    for genre in genres.columns:
        data[f'userPreference_{genre}'] = data[genre] * genre_preference.get(genre, 0)

    # Prepare training data
    feature_columns = [col for col in data.columns if col not in ['rating', 'userId', 'movieId', 'title', 'dateWatched', 'status']]
    X = data[feature_columns]
    y = data['rating']

    # Train the model excluding the target movie (to avoid data leakage)
    train_data = data[data['movieId'] != movie_id]
    train_X = train_data[feature_columns]
    train_y = train_data['rating']

    # Train the regression model
    model = LinearRegression()
    model.fit(train_X, train_y)

    # Find the specific movie and user data for prediction
    target_movie = data[(data['userId'] == user_id) & (data['movieId'] == movie_id)]

    if target_movie.empty:
        # Fallback: Return a default prediction if the user-movie pair is missing
        return round(train_y.mean(), 2)  # Default to the mean rating

    # Extract the features for the target movie
    target_X = target_movie[feature_columns]

    # Predict the rating
    predicted_rating = model.predict(target_X)[0]  # Get the first (and only) prediction

    # Return the predicted rating, rounded to 2 decimals
    return round(predicted_rating, 2)
