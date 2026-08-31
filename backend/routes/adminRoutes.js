const express = require("express");

const router = express.Router();

const {
  registerAdmin,
  loginAdmin,
  getDashboard,
} = require("../controllers/adminController");

router.post("/", registerAdmin);

router.post("/login", loginAdmin);

router.get("/dashboard", getDashboard);

module.exports = router;