const { calculateBestMandi } = require("./profitEngine");

const input = {
  crop: "Tomato",
  quantity: 5,
  vehicleRate: 20,
  handlingCost: 500,
  rideShare: true
};


const mandis = [
  { name: "Mandi A", price: 3000, distance: 10 },
  { name: "Mandi B", price: 3200, distance: 50 },
  { name: "Mandi C", price: 2800, distance: 5 }
];

const result = calculateBestMandi(input, mandis);

console.log(JSON.stringify(result, null, 2));
