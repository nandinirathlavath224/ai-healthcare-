const db = require("../config/db");

// Register User
const registerUser = (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      message: "Please fill all fields",
    });
  }

  const sql =
    "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";

  db.query(sql, [name, email, password], (err, result) => {
    if (err) {
      return res.status(500).json({
        message: "Registration failed",
        error: err,
      });
    }

    res.status(201).json({
      message: "User registered successfully",
    });
  });
};

// Login User
const loginUser = (req, res) => {
  const { email, password } = req.body;

  const sql =
    "SELECT * FROM users WHERE email = ? AND password = ?";

  db.query(sql, [email, password], (err, result) => {
    if (err) {
      return res.status(500).json({
        message: "Login failed",
        error: err,
      });
    }

    if (result.length === 0) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    res.status(200).json({
      message: "Login successful",
      user: result[0],
    });
  });
};
// Admin Login
const adminLogin = (req, res) => {
  const { email, password } = req.body;

  if (email === "admin@gmail.com" && password === "admin123") {
    return res.status(200).json({
      message: "Admin login successful",
      admin: {
        email: "admin@gmail.com",
        role: "admin"
      }
    });
  }

  return res.status(401).json({
    message: "Invalid admin email or password"
  });
};

module.exports = {
  registerUser,
  loginUser,
  adminLogin
};

