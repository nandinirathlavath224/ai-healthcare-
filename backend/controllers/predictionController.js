const db = require("../config/db");

// =====================================================
// SAVE PREDICTION
// =====================================================

const savePrediction = (req, res) => {
  const {
    patientName,
    predictedDisease,
    disease,
    modelUsed,
    predictionDate,
    createdAt,
  } = req.body;

  // Use predictedDisease first, otherwise disease
  const finalDisease =
    predictedDisease || disease || "Unknown";

  // Default model name
  const finalModel =
    modelUsed || "Random Forest";

  // Use supplied date or current date/time
  const finalPredictionDate =
    predictionDate || new Date();

  const sql = `
    INSERT INTO prediction_history
    (
      patient_name,
      predicted_disease,
      model_used,
      prediction_date,
      created_at
    )
    VALUES (?, ?, ?, ?, ?)
  `;

  const finalCreatedAt =
    createdAt || new Date();

  db.query(
    sql,
    [
      patientName || "Unknown Patient",
      finalDisease,
      finalModel,
      finalPredictionDate,
      finalCreatedAt,
    ],
    (err, result) => {
      if (err) {
        console.error(
          "Save prediction error:",
          err
        );

        return res.status(500).json({
          message: "Failed to save prediction",
          error: err.message,
        });
      }

      res.status(201).json({
        message:
          "Prediction saved successfully",
        id: result.insertId,
      });
    }
  );
};


// =====================================================
// GET PREDICTION HISTORY
// =====================================================

const getPredictionHistory = (req, res) => {
  const sql = `
    SELECT
      id,
      patient_name AS patientName,
      predicted_disease AS predictedDisease,
      model_used AS modelUsed,
      prediction_date AS predictionDate,
      created_at AS createdAt
    FROM prediction_history
    ORDER BY created_at DESC
  `;

  db.query(sql, (err, result) => {
    if (err) {
      console.error(
        "Get prediction history error:",
        err
      );

      return res.status(500).json({
        message:
          "Failed to fetch prediction history",
        error: err.message,
      });
    }

    res.status(200).json(result);
  });
};


// =====================================================
// DELETE PREDICTION
// =====================================================

const deletePrediction = (req, res) => {
  const { id } = req.params;

  const sql = `
    DELETE FROM prediction_history
    WHERE id = ?
  `;

  db.query(
    sql,
    [id],
    (err, result) => {
      if (err) {
        console.error(
          "Delete prediction error:",
          err
        );

        return res.status(500).json({
          message:
            "Failed to delete prediction",
          error: err.message,
        });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({
          message:
            "Prediction not found",
        });
      }

      res.status(200).json({
        message:
          "Prediction deleted successfully",
      });
    }
  );
};


// =====================================================
// EXPORT
// =====================================================

module.exports = {
  savePrediction,
  getPredictionHistory,
  deletePrediction,
};