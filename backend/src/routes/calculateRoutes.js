const express = require("express");
const { calculateBestMandi } = require("../engine/profitEngine");
const mandiData = require("../data/mandiData");

const router = express.Router();

router.post("/calculate", (req, res) => {
  try {
    const input = req.body;
    const result = calculateBestMandi(input, mandiData.mandis);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Calculation failed" });
  }
});

module.exports = router;
