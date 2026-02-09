const costAssumptions = {
  transport: {
    basis: "Average diesel prices and local transport rates",
    note: "Costs increase with distance and vehicle size"
  },
  handling: {
    calculation: "Per quintal",
    includes: [
      "loading",
      "unloading",
      "weighing charges",
      "mandi entry fees"
    ]
  },
  netProfit: {
    strategy: "Precomputed for MVP reliability",
    future: "Can be calculated dynamically with live APIs"
  }
};

module.exports = costAssumptions;
