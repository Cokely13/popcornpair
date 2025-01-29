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

# import pandas as pd
# from flask import Flask, request, jsonify
# from flask_cors import CORS
# from ml_model import predict_rating  # Import ML logic

# # Initialize Flask app
# app = Flask(__name__)

# # Enable CORS
# CORS(app, resources={r"/*": {"origins": "*"}})

# dataset = load_data()
# if dataset is None:
#     print("❌ Dataset failed to load. Check training_data.csv.")

# # Health check route
# @app.route('/api/health', methods=['GET'])
# def health_check():
#     return jsonify({"status": "OK"}), 200


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
#         predicted_rating = predict_rating(user_id, movie_id, dataset)

#         # Return the predicted rating
#         return jsonify({"predictedRating": round(predicted_rating, 2)})
#     except Exception as e:
#         print(f"Error in /api/predict-rating endpoint: {str(e)}")
#         return jsonify({'error': str(e)}), 500


# if __name__ == '__main__':
#     # Run Flask app
#     app.run(debug=True)

# import pandas as pd
# from flask import Flask, request, jsonify
# from flask_cors import CORS
# from ml_model import predict_rating, load_data  # ✅ Import load_data()

# # Initialize Flask app
# app = Flask(__name__)

# # Enable CORS
# CORS(app, resources={r"/*": {"origins": "*"}})

# # ✅ Load dataset on startup
# dataset = load_data()
# if dataset is None:
#     print("❌ Dataset failed to load. Check training_data.csv.")

# # Health check route
# @app.route('/api/health', methods=['GET'])
# def health_check():
#     return jsonify({"status": "OK"}), 200


# # Endpoint: Predict Rating for a Specific Movie
# @app.route('/api/predict-rating', methods=['POST'])
# def predict_rating_endpoint():  # ❌ Rename to avoid conflict with imported function
#     try:
#         # Validate request payload
#         data = request.json
#         if not data or 'userId' not in data or 'movieId' not in data:
#             return jsonify({'error': 'Invalid request. Expected "userId" and "movieId".'}), 400

#         user_id = data['userId']
#         movie_id = data['movieId']

#         # Call the prediction function
#         predicted_rating = predict_rating(user_id, movie_id, dataset)

#         # Return the predicted rating
#         return jsonify({"predictedRating": round(predicted_rating, 2)})
#     except Exception as e:
#         print(f"Error in /api/predict-rating endpoint: {str(e)}")
#         return jsonify({'error': str(e)}), 500


# if __name__ == '__main__':
#     # Run Flask app
#     app.run(debug=True)

import pandas as pd
from flask import Flask, request, jsonify
from flask_cors import CORS
from ml_model import load_data, predict_rating  # from the code above

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# Load dataset once at startup
dataset = load_data()
if dataset is None:
    print("❌ Could not load training_data.csv. Predictions may fail.")

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({"status": "OK"}), 200

@app.route('/api/predict-rating', methods=['POST'])
def predict_rating_endpoint():
    try:
        if dataset is None:
            return jsonify({"error": "Dataset not loaded"}), 500

        data = request.json
        if not data or 'userId' not in data or 'movieId' not in data:
            return jsonify({'error': 'Expected "userId" and "movieId"'}), 400

        user_id = data['userId']
        movie_id = data['movieId']

        # Call rule-based function
        rating = predict_rating(user_id, movie_id, dataset)
        return jsonify({"predictedRating": rating})

    except Exception as e:
        print(f"Error in /api/predict-rating: {str(e)}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
