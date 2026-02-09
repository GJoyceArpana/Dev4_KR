/*
 -> Profit Engine
 -> Calculates net profit for each mandi and recommends the best one
*/

function calculateBestMandi(input, mandis) {
  const results = [];

  mandis.forEach(mandi => {
    const revenue = mandi.price * input.quantity;
    const transportCost = mandi.distance * input.vehicleRate;
    const netProfit = revenue - transportCost;

    results.push({
      mandi: mandi.name,
      netProfit
    });
  });

// Sorting by highest profit
  results.sort((a, b) => b.netProfit - a.netProfit);

// Assign rank and best mandi
  results.forEach((item, index) => {
    item.rank = index + 1;
    item.isBest = index === 0;
  });

  const bestMandi = results[0];

  const extraProfit =
    results.length > 1
      ? bestMandi.netProfit - results[1].netProfit
      : 0;

  return {
    results,
    bestMandi: bestMandi.mandi,
    extraProfit
  };
}

module.exports = {
  calculateBestMandi
};

