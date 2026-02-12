/*
 -> Profit Engine
 -> Calculates net profit for each mandi and recommends the best one
*/

function calculateBestMandi(input, mandis) {

  const results = mandis.map(mandi => {
    const revenue = mandi.price * input.quantity;
    const transportCost = mandi.distance * input.vehicleRate;
    const otherCost = input.handlingCost || 0;

    // Ride share optimization
    let rideShareSavings = 0;
    let finalTransportCost = transportCost;

    if (input.rideShare === true) {
      rideShareSavings = transportCost * 0.4;
      finalTransportCost = transportCost - rideShareSavings;
    }

    // Perishability logic
    let spoilageLoss = 0;
    let perishabilityRisk = "LOW";
    const perishableCrops = ["tomato", "onion"];

  if (input.crop && perishableCrops.includes(input.crop.toLowerCase())) {
      if (mandi.distance > 200) {
        perishabilityRisk = "HIGH";
        spoilageLoss = revenue * 0.12;
      } else if (mandi.distance > 120) {
        perishabilityRisk = "MEDIUM";
        spoilageLoss = revenue * 0.05;
      }
    }

    const netProfit =
      revenue - finalTransportCost - otherCost - spoilageLoss;

    return {
      mandi: mandi.name,
      price: mandi.price,
      distance: mandi.distance,
      revenue,
      transportCost: finalTransportCost,
      otherCost,
      netProfit,
      perishability: {
        riskLevel: perishabilityRisk,
        spoilageLoss
      },
      rideShare: {
        enabled: input.rideShare || false,
        savings: rideShareSavings
      }
    };
  });

  // ✅ Sort AFTER map finishes
  results.sort((a, b) => b.netProfit - a.netProfit);

  // ✅ Rank assignment
  results.forEach((item, index) => {
    item.rank = index + 1;
    item.isBest = index === 0;
  });

  return {
    results,
    bestMandi: results[0],
    extraProfit:
      results.length > 1
        ? results[0].netProfit - results[1].netProfit
        : 0
  };
}

module.exports = {
  calculateBestMandi
};
