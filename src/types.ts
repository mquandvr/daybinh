export interface FuelPrice {
  name: string;
  price: number;
  unit: string;
  change?: number;
}

export interface BikeData {
  id: number;
  name: string;
  capacity: number;
}

export type VehicleTab = "motorcycle" | "car";
