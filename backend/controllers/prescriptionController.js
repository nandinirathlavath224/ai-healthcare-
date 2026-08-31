const db = require("../config/db");

// Add Prescription
const addPrescription = (req, res) => {
  const {
    patient_id,
    doctor_name,
    disease,
    medicine,
    notes,
  } = req.body;

  const sql =
    "INSERT INTO prescriptions (patient_id, doctor_name, disease, medicine, notes) VALUES (?, ?, ?, ?, ?)";

  db.query(
    sql,
    [patient_id, doctor_name, disease, medicine, notes],
    (err, result) => {
      if (err) {
        return res.status(500).json({
          message: "Prescription Failed",
          error: err,
        });
      }

      res.status(201).json({
        message: "Prescription Added Successfully",
      });
    }
  );
};

// Get All Prescriptions
const getPrescriptions = (req, res) => {
  db.query(
    "SELECT * FROM prescriptions ORDER BY created_at DESC",
    (err, result) => {
      if (err) {
        return res.status(500).json(err);
      }

      res.status(200).json(result);
    }
  );
};

module.exports = {
  addPrescription,
  getPrescriptions,
};