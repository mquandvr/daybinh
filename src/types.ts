export interface FuelPrice {
  name: string;
  price: number;
  unit: string;
  change?: number;
}

export interface VehicleData {
  id: number;
  name: string;
  capacity: number;
  type: "motorcycle" | "car";
}
