const express = require("express");
const router = express.Router();

const {
  addPatient,
  getPatients,
  deletePatient,
} = require("../controllers/patientControllers");

// Add Patient
router.post("/add", addPatient);

// Get All Patients
router.get("/", getPatients);

// Delete Patient
router.delete("/:id", deletePatient);

module.exports = router;