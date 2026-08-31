const db = require("../config/db");

// Register Admin
const registerAdmin = (req, res) => {
  const { name, email, password } = req.body;

  const sql =
    "INSERT INTO admins (name, email, password) VALUES (?, ?, ?)";

  db.query(sql, [name, email, password], (err, result) => {
    if (err) {
      return res.status(500).json({
        message: "Admin Registration Failed",
        error: err,
      });
    }

    res.status(201).json({
      message: "Admin Registered Successfully",
    });
  });
};

// Login Admin
const loginAdmin = (req, res) => {
  const { email, password } = req.body;

  const sql =
    "SELECT * FROM admins WHERE email=? AND password=?";

  db.query(sql, [email, password], (err, result) => {
    if (err) {
      return res.status(500).json({
        message: "Admin Login Failed",
        error: err,
      });
    }

    if (result.length === 0) {
      return res.status(401).json({
        message: "Invalid Email or Password",
      });
    }

    res.status(200).json({
      message: "Admin Login Successful",
      admin: result[0],
    });
  });
};

// Dashboard Data
const getDashboard = (req, res) => {

  db.query("SELECT COUNT(*) AS patients FROM patients", (err1, patientResult) => {

    if (err1) return res.status(500).json(err1);

    db.query("SELECT COUNT(*) AS doctors FROM doctors", (err2, doctorResult) => {

      if (err2) return res.status(500).json(err2);

      db.query("SELECT COUNT(*) AS admins FROM admins", (err3, adminResult) => {

        if (err3) return res.status(500).json(err3);

        res.json({
          totalPatients: patientResult[0].patients,
          totalDoctors: doctorResult[0].doctors,
          totalAdmins: adminResult[0].admins,
        });

      });

    });

  });

};

module.exports = {
  registerAdmin,
  loginAdmin,
  getDashboard,
};