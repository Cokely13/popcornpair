# import pandas as pd
# from sklearn.linear_model import LinearRegression
# from sklearn.preprocessing import MinMaxScaler

# # Function to predict the rating for a specific user and movie
# def predict_rating_for_movie(user_id, movie_id):
#     # Load the dataset
#     data = pd.read_csv("training_data.csv")

#     # Handle missing values
#     data['avgFriendRating'] = data['avgFriendRating'].fillna(data['avgFriendRating'].mean())

#     # Normalize numerical features
#     scaler = MinMaxScaler()
#     data[['criticScore', 'runtimeMinutes', 'avgFriendRating']] = scaler.fit_transform(
#         data[['criticScore', 'runtimeMinutes', 'avgFriendRating']]
#     )

#     # Encode genres
#     genres = data['genres'].str.get_dummies('|')
#     data = pd.concat([data, genres], axis=1)
#     data.drop('genres', axis=1, inplace=True)

#     # Prepare training data
#     X = data.drop(['rating', 'userId', 'movieId', 'title', 'dateWatched', 'watched'], axis=1)
#     y = data['rating']

#     # Train the model excluding the target movie (to avoid data leakage)
#     train_data = data[data['movieId'] != movie_id]
#     train_X = train_data.drop(['rating', 'userId', 'movieId', 'title', 'dateWatched', 'watched'], axis=1)
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
#     target_X = target_movie.drop(['rating', 'userId', 'movieId', 'title', 'dateWatched', 'watched'], axis=1)

#     # Predict the rating
#     predicted_rating = model.predict(target_X)[0]  # Get the first (and only) prediction

#     # Return the predicted rating, rounded to 2 decimals
#     return round(predicted_rating, 2)

import pandas as pd
from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import MinMaxScaler
from joblib import dump, load  # For saving and loading models

# =======================
# Data Preprocessing
# =======================
def preprocess_data(data):
    """
    Preprocess the data: Handle missing values, normalize features, encode genres.
    """
    # Handle missing values
    data['avgFriendRating'] = data['avgFriendRating'].fillna(data['avgFriendRating'].mean())

    # Normalize numerical features
    scaler = MinMaxScaler()
    data[['criticScore', 'runtimeMinutes', 'avgFriendRating']] = scaler.fit_transform(
        data[['criticScore', 'runtimeMinutes', 'avgFriendRating']]
    )

    # Encode genres
    genres = data['genres'].str.get_dummies('|')
    data = pd.concat([data, genres], axis=1)
    data.drop('genres', axis=1, inplace=True)

    return data

# =======================
# Model Training
# =======================
def train_model(data, save_path="ml_model.joblib"):
    """
    Train a Linear Regression model on the provided dataset and save it.
    """
    # Prepare training data
    X = data.drop(['rating', 'userId', 'movieId', 'title', 'dateWatched', 'watched'], axis=1)
    y = data['rating']

    # Train the model
    model = LinearRegression()
    model.fit(X, y)

    # Save the trained model
    dump(model, save_path)
    print(f"Model trained and saved to {save_path}")

# =======================
# Model Prediction
# =======================
def predict_rating_for_movie(user_id, movie_id, data_path="training_data.csv", model_path="ml_model.joblib"):
    """
    Predict the rating for a specific user and movie using a pre-trained model.
    """
    # Load the dataset
    data = pd.read_csv(data_path)

    # Preprocess the data
    data = preprocess_data(data)

    # Train the model if it doesn't exist
    try:
        model = load(model_path)
    except FileNotFoundError:
        print("Model not found. Training a new model...")
        train_model(data, save_path=model_path)
        model = load(model_path)

    # Find the specific movie and user data for prediction
    target_movie = data[(data['userId'] == user_id) & (data['movieId'] == movie_id)]

    if target_movie.empty:
        # Fallback: Return a default prediction if the user-movie pair is missing
        return round(data['rating'].mean(), 2)  # Default to the mean rating

    # Extract the features for the target movie
    target_X = target_movie.drop(['rating', 'userId', 'movieId', 'title', 'dateWatched', 'watched'], axis=1)

    # Predict the rating
    predicted_rating = model.predict(target_X)[0]  # Get the first (and only) prediction

    # Return the predicted rating, rounded to 2 decimals
    return round(predicted_rating, 2)

# =======================
# Example Usage (For Testing)
# =======================
if __name__ == "__main__":
    # Load the data
    data = pd.read_csv("training_data.csv")

    # Preprocess and train the model
    processed_data = preprocess_data(data)
    train_model(processed_data)

    # Predict a rating for a specific user and movie
    user_id = 1
    movie_id = 2
    predicted_rating = predict_rating_for_movie(user_id, movie_id)
    print(f"Predicted Rating for User {user_id}, Movie {movie_id}: {predicted_rating}")
