import { Crop, Vehicle, Market, CalculationResult } from '../types/api';

export const CROPS_MOCK: Crop[] = [
  { id: 'wheat', name_en: 'Wheat', name_hi: 'गेहूं', icon: '🌾', unit: 'quintal' },
  { id: 'rice', name_en: 'Rice', name_hi: 'चावल', icon: '🍚', unit: 'quintal' },
  { id: 'cotton', name_en: 'Cotton', name_hi: 'कपास', icon: '🌱', unit: 'quintal' },
  { id: 'sugarcane', name_en: 'Sugarcane', name_hi: 'गन्ना', icon: '🎋', unit: 'quintal' },
  { id: 'tomato', name_en: 'Tomato', name_hi: 'टमाटर', icon: '🍅', unit: 'quintal' },
  { id: 'potato', name_en: 'Potato', name_hi: 'आलू', icon: '🥔', unit: 'quintal' },
];

export const VEHICLES_MOCK: Vehicle[] = [
  { id: 'tractor', name_en: 'Tractor', name_hi: 'ट्रैक्टर', cost_per_km: 15, icon: '🚜' },
  { id: 'mini_truck', name_en: 'Mini Truck', name_hi: 'मिनी ट्रक', cost_per_km: 20, icon: '🚚' },
  { id: 'truck', name_en: 'Truck', name_hi: 'ट्रक', cost_per_km: 25, icon: '🚛' },
];

export const MARKETS_MOCK: Market[] = [
  {
    id: 'ghazipur',
    name: 'Ghazipur Mandi',
    lat: 28.6517,
    lng: 77.3152,
    price_per_quintal: 2550,
    distance_km: 11.18,
    transport_cost: 2236,
    handling_cost: 1593.75,
    net_profit: 59920,
    profit_category: 'high',
  },
  {
    id: 'keshopur',
    name: 'Keshopur Mandi',
    lat: 28.6844,
    lng: 77.135,
    price_per_quintal: 2450,
    distance_km: 10.66,
    transport_cost: 2132,
    handling_cost: 1531.25,
    net_profit: 57587,
    profit_category: 'high',
  },
  {
    id: 'azadpur',
    name: 'Azadpur Mandi',
    lat: 28.7041,
    lng: 77.1025,
    price_per_quintal: 2400,
    distance_km: 14.44,
    transport_cost: 2888,
    handling_cost: 1500,
    net_profit: 55612,
    profit_category: 'medium',
  },
  {
    id: 'najafgarh',
    name: 'Najafgarh Mandi',
    lat: 28.6092,
    lng: 76.9798,
    price_per_quintal: 2350,
    distance_km: 18.23,
    transport_cost: 3646,
    handling_cost: 1468.75,
    net_profit: 53635,
    profit_category: 'medium',
  },
  {
    id: 'narela',
    name: 'Narela Mandi',
    lat: 28.8528,
    lng: 77.0931,
    price_per_quintal: 2300,
    distance_km: 21.05,
    transport_cost: 4210,
    handling_cost: 1437.5,
    net_profit: 51852,
    profit_category: 'low',
  },
];

export const CALCULATION_RESULT_MOCK: CalculationResult = {
  crop: CROPS_MOCK[0],
  quantity: 25,
  markets: MARKETS_MOCK,
};

export const DEFAULT_LOCATION = {
  lat: 28.6139,
  lng: 77.209,
};