const express = require("express");

const router = express.Router();

const {
  getRecommendation,
} = require("../controllers/recommendationController");

router.post("/", getRecommendation);

module.exports = router;