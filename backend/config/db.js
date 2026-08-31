const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Root@2026",
  database: "healthcare_db",
});

db.connect((err) => {
  if (err) {
    console.log("Database Connection Failed:", err);
    return;
  }
  console.log("MySQL Connected Successfully");
});

module.exports = db;