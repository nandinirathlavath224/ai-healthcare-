const db = require("../config/db");

// Register Doctor
const registerDoctor = (req, res) => {
  const { name, email, password, specialization, phone } = req.body;

  const sql =
    "INSERT INTO doctors (name, email, password, specialization, phone) VALUES (?, ?, ?, ?, ?)";

  db.query(
    sql,
    [name, email, password, specialization, phone],
    (err, result) => {
      if (err) {
        return res.status(500).json({
          message: "Doctor Registration Failed",
          error: err,
        });
      }

      res.status(201).json({
        message: "Doctor Registered Successfully",
      });
    }
  );
};

// Doctor Login
const loginDoctor = (req, res) => {
  const { email, password } = req.body;

  const sql =
    "SELECT * FROM doctors WHERE email = ? AND password = ?";

  db.query(sql, [email, password], (err, result) => {
    if (err) {
      return res.status(500).json({
        message: "Doctor Login Failed",
        error: err,
      });
    }

    if (result.length === 0) {
      return res.status(401).json({
        message: "Invalid Email or Password",
      });
    }

    res.status(200).json({
      message: "Doctor Login Successful",
      doctor: result[0],
    });
  });
};

// Get All Doctors
const getDoctors = (req, res) => {
  db.query("SELECT * FROM doctors", (err, result) => {
    if (err) {
      return res.status(500).json(err);
    }

    res.status(200).json(result);
  });
};

module.exports = {
  registerDoctor,
  loginDoctor,
  getDoctors,
};