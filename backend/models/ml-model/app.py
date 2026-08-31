from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.ensemble import RandomForestClassifier

app = Flask(__name__)
CORS(app)

# Load dataset
data = pd.read_csv("disease prediction.csv")

# Features and target
X = data.drop("disease", axis=1)
y = data["disease"]

# All symptom columns
symptom_columns = [
    "fever",
    "headache",
    "fatigue",
    "frequent_urination",
    "weight_loss",
    "chest_pain",
    "dizziness",
    "chills",
    "vomiting",
    "abdominal_pain",
    "joint_pain",
    "rash",
    "cough",
    "breathing_problem"
]

# Convert categorical symptom values to numbers
preprocessor = ColumnTransformer(
    transformers=[
        (
            "symptoms",
            OneHotEncoder(handle_unknown="ignore"),
            symptom_columns
        )
    ]
)

# Random Forest model
model = Pipeline(
    steps=[
        ("preprocessor", preprocessor),
        (
            "classifier",
            RandomForestClassifier(
                n_estimators=100,
                random_state=42
            )
        )
    ]
)

# Split dataset
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42
)

# Train model
model.fit(X_train, y_train)

print("Disease prediction model trained successfully")


@app.route("/")
def home():
    return jsonify({
        "message": "AI Disease Prediction API is running"
    })


@app.route("/predict", methods=["POST"])
def predict():
    try:
        request_data = request.get_json()

        input_data = pd.DataFrame([{
            "fever": request_data["fever"],
            "headache": request_data["headache"],
            "fatigue": request_data["fatigue"],
            "frequent_urination": request_data["frequent_urination"],
            "weight_loss": request_data["weight_loss"],
            "chest_pain": request_data["chest_pain"],
            "dizziness": request_data["dizziness"],
            "chills": request_data["chills"],
            "vomiting": request_data["vomiting"],
            "abdominal_pain": request_data["abdominal_pain"],
            "joint_pain": request_data["joint_pain"],
            "rash": request_data["rash"],
            "cough": request_data["cough"],
            "breathing_problem": request_data["breathing_problem"]
        }])

        prediction = model.predict(input_data)[0]

        return jsonify({
            "prediction": prediction
        })

    except Exception as e:
        return jsonify({
            "error": str(e)
        }), 400


if __name__ == "__main__":
    app.run(
        host="127.0.0.1",
        port=5001,
        debug=True
    )