const express = require("express");

const router = express.Router();

const {
  savePrediction,
  getPredictionHistory,
} = require("../controllers/predictionController");

router.post("/", savePrediction);

router.get("/", getPredictionHistory);

module.exports = router;