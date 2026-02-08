export interface Crop {
  id: string;
  name_en: string;
  name_hi: string;
  icon: string;
  unit: string;
}

export interface Market {
  id: string;
  name: string;
  lat: number;
  lng: number;
  price_per_quintal: number;
  distance_km: number;
  transport_cost: number;
  handling_cost: number;
  net_profit: number;
  profit_category: 'high' | 'medium' | 'low';
}

export interface CalculationResult {
  crop: Crop;
  quantity: number;
  markets: Market[];
}

export interface CalculateRequest {
  crop_id: string;
  quantity: number;
  farmer_lat: number;
  farmer_lng: number;
}

export type Language = 'hi' | 'en';