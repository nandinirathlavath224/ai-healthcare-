const db = require("../config/db");

// Book Appointment
const bookAppointment = (req, res) => {
  const {
    patient_name,
    doctor_name,
    appointment_date,
    appointment_time
  } = req.body;

  const sql =
    "INSERT INTO appointments (patient_name, doctor_name, appointment_date, appointment_time) VALUES (?, ?, ?, ?)";

  db.query(
    sql,
    [patient_name, doctor_name, appointment_date, appointment_time],
    (err) => {
      if (err) {
        return res.status(500).json({
          message: "Appointment Booking Failed",
          error: err,
        });
      }

      res.status(201).json({
        message: "Appointment Booked Successfully",
      });
    }
  );
};

// Get All Appointments
const getAppointments = (req, res) => {
  db.query(
    "SELECT * FROM appointments ORDER BY appointment_date, appointment_time",
    (err, result) => {
      if (err) return res.status(500).json(err);

      res.status(200).json(result);
    }
  );
};

// Update Appointment Status
const updateStatus = (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  db.query(
    "UPDATE appointments SET status=? WHERE id=?",
    [status, id],
    (err) => {
      if (err) return res.status(500).json(err);

      res.json({
        message: "Appointment Status Updated Successfully",
      });
    }
  );
};

module.exports = {
  bookAppointment,
  getAppointments,
  updateStatus,
};