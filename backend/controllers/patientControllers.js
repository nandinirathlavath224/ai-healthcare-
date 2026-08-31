const db = require("../config/db");

// ==========================================
// ADD PATIENT
// ==========================================

const addPatient = (req, res) => {
  const {
    name,
    age,
    gender,
    phone,
    address,
  } = req.body;

  // Validate required fields
  if (
    !name ||
    !age ||
    !gender ||
    !phone ||
    !address
  ) {
    return res.status(400).json({
      message:
        "Please provide name, age, gender, phone and address.",
    });
  }

  const sql = `
    INSERT INTO patients
    (name, age, gender, phone, address)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [
      name,
      age,
      gender,
      phone,
      address,
    ],
    (err, result) => {
      if (err) {
        console.error(
          "Add patient error:",
          err
        );

        return res.status(500).json({
          message:
            "Failed to add patient",
          error: err.message,
        });
      }

      res.status(201).json({
        message:
          "Patient added successfully",
        patientId: result.insertId,
      });
    }
  );
};

// ==========================================
// GET ALL PATIENTS
// ==========================================

const getPatients = (req, res) => {
  const sql = `
    SELECT *
    FROM patients
    ORDER BY id DESC
  `;

  db.query(
    sql,
    (err, result) => {
      if (err) {
        console.error(
          "Get patients error:",
          err
        );

        return res.status(500).json({
          message:
            "Failed to fetch patients",
          error: err.message,
        });
      }

      res.status(200).json(result);
    }
  );
};

// ==========================================
// DELETE PATIENT
// ==========================================

const deletePatient = (req, res) => {
  const { id } = req.params;

  const sql =
    "DELETE FROM patients WHERE id = ?";

  db.query(
    sql,
    [id],
    (err, result) => {
      if (err) {
        console.error(
          "Delete patient error:",
          err
        );

        return res.status(500).json({
          message:
            "Failed to delete patient",
          error: err.message,
        });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({
          message:
            "Patient not found",
        });
      }

      res.status(200).json({
        message:
          "Patient deleted successfully",
      });
    }
  );
};

// ==========================================
// EXPORT
// ==========================================

module.exports = {
  addPatient,
  getPatients,
  deletePatient,
};