const express = require("express");
const cors = require("cors");
require("dotenv").config();

const db = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const patientRoutes = require("./routes/patientRoutes");
const doctorRoutes = require("./routes/doctorRoutes");
const adminRoutes = require("./routes/adminRoutes");
const prescriptionRoutes = require("./routes/prescriptionRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const predictionRoutes = require("./routes/predictionRoutes");
const recommendationRoutes = require("./routes/recommendationRoutes");

const app = express();

console.log("Patient Routes Loaded");
console.log("Doctor Routes Loaded");

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/admin",adminRoutes);
app.use("/api/prescriptions",prescriptionRoutes);
app.use("/api/appointments",appointmentRoutes);
app.use("/api/predictions",predictionRoutes);
app.use("/api/recommendation",recommendationRoutes);

// Home Route
app.get("/", (req, res) => {
  res.send("AI Healthcare Backend is Running...");
});

// Database Connection
db.connect((err) => {
  if (err) {
    console.error(err);
    return;
  }

  console.log("MySQL Connected Successfully");

  app.listen(5000, () => {
    console.log("Server running on port 5000");
  });
});