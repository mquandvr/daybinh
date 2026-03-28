export interface FuelPrice {
  name: string;
  price: number; // zone 1 price or PVOIL price
  zone2_price?: number; // only for Petrolimex
  unit: string;
  change?: number; // zone 1 change
  change2?: number; // zone 2 change
  provider: "Petrolimex" | "PVOIL";
  petrolimexId?: string;
}

export interface FuelData {
  petrolimex: FuelPrice[];
  pvoil: FuelPrice[];
}

export interface VehicleData {
  id: number;
  name: string;
  capacity: number;
  type: "motorcycle" | "car";
}
