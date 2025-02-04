# import pandas as pd
# from flask import Flask, request, jsonify
# from flask_cors import CORS
# from ml_model import load_data, predict_rating  # from the code above

# app = Flask(__name__)
# CORS(app, resources={r"/*": {"origins": "*"}})

# # Load dataset once at startup
# dataset = load_data()
# if dataset is None:
#     print("❌ Could not load training_data.csv. Predictions may fail.")

# @app.route('/api/health', methods=['GET'])
# def health_check():
#     return jsonify({"status": "OK"}), 200

# @app.route('/api/predict-rating', methods=['POST'])
# def predict_rating_endpoint():
#     try:
#         if dataset is None:
#             return jsonify({"error": "Dataset not loaded"}), 500

#         data = request.json
#         if not data or 'userId' not in data or 'movieId' not in data:
#             return jsonify({'error': 'Expected "userId" and "movieId"'}), 400

#         user_id = data['userId']
#         movie_id = data['movieId']

#         # Call rule-based function
#         rating = predict_rating(user_id, movie_id, dataset)
#         return jsonify({"predictedRating": rating})

#     except Exception as e:
#         print(f"Error in /api/predict-rating: {str(e)}")
#         return jsonify({'error': str(e)}), 500

# if __name__ == '__main__':
#     app.run(debug=True)


# app.py
# from flask import Flask, request, jsonify
# from flask_cors import CORS
# import pandas as pd
# from db_loader import load_data_from_db

# from hybrid_predict import hybrid_predict
# # or from pure_cf import load_data if you're loading data from there
# # from pure_cf import load_data

# app = Flask(__name__)
# CORS(app, resources={r"/*": {"origins": "*"}})

# # Load dataset at startup
# # df_ratings = load_data("training_data.csv")

# @app.route("/api/predict-rating", methods=["POST"])
# def predict_rating_endpoint():
#     try:
#         data = request.json
#         user_id = data.get("userId")
#         movie_id = data.get("movieId")

#         df = load_data_from_db()

#         if not user_id or not movie_id:
#             return jsonify({"error": "Missing userId or movieId"}), 400

#         # Use the hybrid predict function
#         predicted_rating, approach = hybrid_predict(user_id, movie_id, df)

#         # Return both the rating and the approach
#         return jsonify({
#             "predictedRating": round(predicted_rating, 2),
#             "approachUsed": approach
#         }), 200

#     except Exception as e:
#         print(f"Error in /api/predict-rating: {str(e)}")
#         return jsonify({"error": str(e)}), 500

# if __name__ == "__main__":
#     app.run(debug=True)


from flask import Flask, request, jsonify
from flask_cors import CORS
from hybrid_predict import hybrid_predict

app = Flask(__name__)
CORS(app)

@app.route("/api/predict-rating", methods=["POST"])
def predict_rating_endpoint():
    try:
        data = request.json
        user_id = data.get("userId")
        movie_id = data.get("movieId")
        if not user_id or not movie_id:
            return jsonify({"error": "Missing userId or movieId"}), 400

        predicted_rating, approach = hybrid_predict(user_id, movie_id)
        print(f"[DEBUG] final predicted_rating={predicted_rating}, approach={approach}")

        return jsonify({
            "predictedRating": round(predicted_rating, 2),
            "approachUsed": approach
        }), 200

    except Exception as e:
        print(f"Error in /api/predict-rating: {str(e)}")
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
