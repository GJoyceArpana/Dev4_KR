const express = require("express");
const app = express();

// IMPORT DATA
const mandiData = require("./data/mandiData");
const costAssumptions = require("./data/costAssumptions");

const PORT = 5000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Krishi-Route Backend Running 🚜");
});


app.get("/api/mandis", (req, res) => {
  res.json(mandiData);
});


app.get("/api/costs", (req, res) => {
  res.json(costAssumptions);
});


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
