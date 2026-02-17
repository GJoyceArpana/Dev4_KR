const express = require("express");
const cors = require("cors");

const app = express();

// IMPORT DATA
const mandiData = require("./data/mandiData");
const costAssumptions = require("./data/costAssumptions");

// IMPORT PROFIT ENGINE
const { calculateBestMandi } = require("./logic/profitEngine");

const PORT = 5000;

app.use(cors());
app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.send("Krishi-Route Backend Running 🚜");
});

// Get mandis
app.get("/api/mandis", (req, res) => {
  res.json(mandiData);
});

// Get cost assumptions
app.get("/api/costs", (req, res) => {
  res.json(costAssumptions);
});

// 🔥 CALCULATE ROUTE (FIXED)
app.post("/api/calculate", (req, res) => {
  try {
    const input = req.body;

    // 🔥 Correct property name
    const result = calculateBestMandi(input, mandiData.markets);

    res.json(result);

  } catch (error) {
    console.error("Calculation error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
