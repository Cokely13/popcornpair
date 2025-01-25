# import pandas as pd
# from sklearn.linear_model import LinearRegression
# from sklearn.model_selection import train_test_split
# from sklearn.preprocessing import MinMaxScaler
# from sklearn.metrics import mean_squared_error

# # Step 1: Load the Dataset
# data = pd.read_csv("training_data.csv")

# # Step 2: Handle Missing Values (Impute avgFriendRating with Mean)
# data['avgFriendRating'] = data['avgFriendRating'].fillna(data['avgFriendRating'].mean())

# # Step 3: Normalize Numerical Features
# scaler = MinMaxScaler()
# data[['criticScore', 'runtimeMinutes', 'avgFriendRating']] = scaler.fit_transform(
#     data[['criticScore', 'runtimeMinutes', 'avgFriendRating']]
# )

# # Step 4: Encode Genres
# genres = data['genres'].str.get_dummies('|')
# data = pd.concat([data, genres], axis=1)
# data.drop('genres', axis=1, inplace=True)

# # Step 5: Prepare Data for Training
# X = data.drop(['rating', 'userId', 'movieId', 'title', 'dateWatched', 'watched'], axis=1)
# y = data['rating']

# # Split into training and test sets
# X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# # Step 6: Train a Simple Linear Regression Model
# model = LinearRegression()
# model.fit(X_train, y_train)

# # Step 7: Make Predictions
# predictions = model.predict(X_test)

# # Evaluate the Model
# mse = mean_squared_error(y_test, predictions)
# print(f"Mean Squared Error: {mse}")

# # Step 8: Predict Ratings for All Movies
# data['predictedRating'] = model.predict(X)

# # Step 9: Save the Predictions to a New CSV
# data[['movieId', 'title', 'rating', 'predictedRating']].to_csv("predicted_ratings.csv", index=False)
# print("Predicted ratings saved to 'predicted_ratings.csv'")

# import pandas as pd
# from sklearn.linear_model import LinearRegression
# from sklearn.preprocessing import MinMaxScaler

# # Function to predict ratings
# def predict_ratings_for_user(user_id):
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

#     # Prepare data for prediction
#     X = data.drop(['rating', 'userId', 'movieId', 'title', 'dateWatched', 'watched'], axis=1)

#     # Train the model on the full dataset
#     y = data['rating']
#     model = LinearRegression()
#     model.fit(X, y)

#     # Predict ratings for the current user
#     user_data = data[data['userId'] == user_id]
#     user_X = user_data.drop(['rating', 'userId', 'movieId', 'title', 'dateWatched', 'watched'], axis=1)
#     predictions = model.predict(user_X)

#     # Return predictions with movie IDs
#     results = user_data[['movieId', 'title']].copy()
#     results['predictedRating'] = predictions
#     return results.to_dict(orient='records')  # Convert to list of dictionaries
import pandas as pd
from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import MinMaxScaler

# Function to predict the rating for a specific user and movie
def predict_rating_for_movie(user_id, movie_id):
    # Load the dataset
    data = pd.read_csv("training_data.csv")

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

    # Prepare training data
    X = data.drop(['rating', 'userId', 'movieId', 'title', 'dateWatched', 'watched'], axis=1)
    y = data['rating']

    # Train the model excluding the target movie (to avoid data leakage)
    train_data = data[data['movieId'] != movie_id]
    train_X = train_data.drop(['rating', 'userId', 'movieId', 'title', 'dateWatched', 'watched'], axis=1)
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
    target_X = target_movie.drop(['rating', 'userId', 'movieId', 'title', 'dateWatched', 'watched'], axis=1)

    # Predict the rating
    predicted_rating = model.predict(target_X)[0]  # Get the first (and only) prediction

    # Return the predicted rating, rounded to 2 decimals
    return round(predicted_rating, 2)
