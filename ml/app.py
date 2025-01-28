# import pandas as pd

# from flask import Flask, request, jsonify
# from ml_model import predict_rating_for_movie  # Import the updated function
# from flask_cors import CORS

# app = Flask(__name__)

# # Enable CORS
# CORS(app)  # This allows all origins by default


# # Endpoint: Predict Rating for a Specific Movie
# @app.route('/api/predict-rating', methods=['POST'])
# def predict_rating():
#     try:
#         # Validate request payload
#         data = request.json
#         if not data or 'userId' not in data or 'movieId' not in data:
#             return jsonify({'error': 'Invalid request. Expected "userId" and "movieId".'}), 400

#         user_id = data['userId']
#         movie_id = data['movieId']

#         # Call the prediction function
#         predicted_rating = predict_rating_for_movie(user_id, movie_id)

#         # Return the predicted rating, rounded to two decimals
#         return jsonify({"predictedRating": round(predicted_rating, 2)})
#     except Exception as e:
#         print(f"Error in /api/predict-rating endpoint: {str(e)}")
#         return jsonify({'error': str(e)}), 500


# if __name__ == '__main__':
#     app.run(debug=True)

import pandas as pd
from flask import Flask, request, jsonify
from flask_cors import CORS
from ml_model import predict_rating_for_movie  # Import ML logic

# Initialize Flask app
app = Flask(__name__)

# Enable CORS
CORS(app, resources={r"/*": {"origins": "*"}})

# Health check route
@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({"status": "OK"}), 200


# Endpoint: Predict Rating for a Specific Movie
@app.route('/api/predict-rating', methods=['POST'])
def predict_rating():
    try:
        # Validate request payload
        data = request.json
        if not data or 'userId' not in data or 'movieId' not in data:
            return jsonify({'error': 'Invalid request. Expected "userId" and "movieId".'}), 400

        user_id = data['userId']
        movie_id = data['movieId']

        # Call the prediction function
        predicted_rating = predict_rating_for_movie(user_id, movie_id)

        # Return the predicted rating
        return jsonify({"predictedRating": round(predicted_rating, 2)})
    except Exception as e:
        print(f"Error in /api/predict-rating endpoint: {str(e)}")
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    # Run Flask app
    app.run(debug=True)
