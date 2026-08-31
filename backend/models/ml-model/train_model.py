import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.tree import DecisionTreeClassifier
import joblib
import os

# Load dataset
df = pd.read_csv("dataset.csv")

# Features and Target
X = df.drop("disease", axis=1)
y = df["disease"]

# Split dataset
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# Train Random Forest
rf_model = RandomForestClassifier(n_estimators=100, random_state=42)
rf_model.fit(X_train, y_train)

# Train Decision Tree
dt_model = DecisionTreeClassifier(random_state=42)
dt_model.fit(X_train, y_train)

# Accuracy
rf_accuracy = rf_model.score(X_test, y_test)
dt_accuracy = dt_model.score(X_test, y_test)

print("Random Forest Accuracy:", round(rf_accuracy * 100, 2), "%")
print("Decision Tree Accuracy:", round(dt_accuracy * 100, 2), "%")

# Create model folder if it doesn't exist
os.makedirs("model", exist_ok=True)

# Save models
joblib.dump(rf_model, "model/random_forest.pkl")
joblib.dump(dt_model, "model/decision_tree.pkl")

print("Models saved successfully!")