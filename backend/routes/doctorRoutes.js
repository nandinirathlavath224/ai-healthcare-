const express = require("express");

const router = express.Router();

const {
  registerDoctor,
  loginDoctor,
  getDoctors,
} = require("../controllers/doctorController");

router.post("/", registerDoctor);

router.post("/login", loginDoctor);

router.get("/", getDoctors);

module.exports = router;