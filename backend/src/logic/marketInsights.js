function getProjectionMultipliers(crop) {
  const normalizedCrop = String(crop || '').toLowerCase();

  if (normalizedCrop === 'tomato') {
    return { day3: 1.05, day5: 1.1 };
  }

  if (normalizedCrop === 'wheat') {
    return { day3: 1.02, day5: 1.04 };
  }

  return { day3: 1.02, day5: 1.05 };
}

function calculatePriceProjection(currentPrice, crop) {
  const price = Number(currentPrice) || 0;
  const multipliers = getProjectionMultipliers(crop);

  return {
    projectedPrice3Day: Number((price * multipliers.day3).toFixed(2)),
    projectedPrice5Day: Number((price * multipliers.day5).toFixed(2))
  };
}

function evaluateDistanceRisk(distance) {
  const mandiDistance = Number(distance) || 0;

  if (mandiDistance > 150) {
    return {
      level: 'HIGH',
      message: 'High spoilage risk due to long transport'
    };
  }

  if (mandiDistance >= 80) {
    return {
      level: 'MEDIUM',
      message: 'Moderate spoilage risk due to transport distance'
    };
  }

  return {
    level: 'LOW',
    message: 'Low spoilage risk due to shorter transport'
  };
}

module.exports = {
  calculatePriceProjection,
  evaluateDistanceRisk
};
