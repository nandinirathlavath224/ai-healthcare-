from flask import Flask, request, jsonify
import joblib
import os

app = Flask(__name__)

# Load trained models
rf_model = joblib.load(os.path.join("model", "random_forest.pkl"))
dt_model = joblib.load(os.path.join("model", "decision_tree.pkl"))

# Home Route
@app.route("/")
def home():
    return "AI Healthcare ML API is Running Successfully!"

# Prediction Route
@app.route("/predict", methods=["POST"])
def predict():

    data = request.get_json()

    symptoms = [[
        int(data.get("fever", 0)),
        int(data.get("cough", 0)),
        int(data.get("headache", 0)),
        int(data.get("fatigue", 0)),
        int(data.get("vomiting", 0)),
        int(data.get("chest_pain", 0)),
        int(data.get("body_pain", 0))
    ]]

    rf_prediction = rf_model.predict(symptoms)[0]
    dt_prediction = dt_model.predict(symptoms)[0]

    return jsonify({
        "random_forest_prediction": rf_prediction,
        "decision_tree_prediction": dt_prediction
    })

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)