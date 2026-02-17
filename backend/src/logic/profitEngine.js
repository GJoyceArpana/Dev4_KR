/*
 -> Profit Engine
 -> Calculates net profit for each mandi and recommends the best one
*/

function calculateBestMandi(input, mandis) {

  const results = mandis.map(mandi => {

    // ✅ Correct field names from mandiData
    const price = mandi.price_per_quintal;
    const distance = mandi.distance_km;

    const quantity = Number(input.quantity) || 0;
    const vehicleRate = Number(input.vehicleRate) || 25; // default ₹25/km
    const fuelPrice = Number(input.fuelPrice) || 95;

    // Optional fuel-based dynamic rate adjustment
    const adjustedVehicleRate = vehicleRate + (fuelPrice * 0.05);

    const revenue = price * quantity;
    const transportCost = distance * adjustedVehicleRate;

    const otherCost = mandi.handling_cost
      ? mandi.handling_cost
      : 0;

    // 🚗 Ride Share
    let rideShareSavings = 0;
    let finalTransportCost = transportCost;

    if (input.rideShare === true) {
      rideShareSavings = transportCost * 0.4;
      finalTransportCost = transportCost - rideShareSavings;
    }

    // 🥬 Perishability
    let spoilageLoss = 0;
    let perishabilityRisk = "LOW";
    const perishableCrops = ["tomato", "onion"];

    if (input.crop && perishableCrops.includes(input.crop.toLowerCase())) {
      if (distance > 200) {
        perishabilityRisk = "HIGH";
        spoilageLoss = revenue * 0.12;
      } else if (distance > 120) {
        perishabilityRisk = "MEDIUM";
        spoilageLoss = revenue * 0.05;
      }
    }

    const netProfit =
      revenue - finalTransportCost - otherCost - spoilageLoss;

    return {
      id: mandi.id,
      name: mandi.name,
      price,
      distance,
      revenue,
      transportCost: finalTransportCost,
      otherCost,
      fuelPrice,
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

  // Sort by best profit
  results.sort((a, b) => b.netProfit - a.netProfit);

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
