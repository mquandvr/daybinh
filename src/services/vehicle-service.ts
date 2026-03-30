import { VehicleData } from "@/types";
import { API_ENDPOINTS, MESSAGES } from "@/constants/index";
import { validateArray, parseFuelCapacity } from "@/lib";
import dummyMotorcycles from "@/../data-dummy/dummy-motorcycles.json";
import dummyCars from "@/../data-dummy/dummy-cars.json";

interface RawVehicleItem {
  readonly name?: string;
  readonly fuel_tank?: string | number;
  readonly capacity?: string | number;
}

export const fetchVehicles = async (type: "motorcycle" | "car"): Promise<VehicleData[]> => {
  try {
    if (type === "motorcycle") {
      const response = await fetch(API_ENDPOINTS.MOTORCYCLE_API);
      if (!response.ok) throw new Error("Motorcycle API failed");
      
      const data = await response.json() as RawVehicleItem[];
      if (!validateArray(data)) throw new Error(MESSAGES.INVALID_DATA_FORMAT);

      return data.map((vehicle, index) => {
        const name = vehicle.name || MESSAGES.UNKNOWN_BIKE;
        const capacity = parseFuelCapacity(vehicle.fuel_tank || vehicle.capacity);
        return { id: index, name, capacity, type: "motorcycle" };
      });
    } else {
      // For cars, we currently use dummy data as there's no live API yet
      return dummyCars as unknown as VehicleData[];
    }
  } catch (err) {
    console.error(`${type} fetch error, using dummy data:`, err);
    return type === "motorcycle" ? (dummyMotorcycles as unknown as VehicleData[]) : (dummyCars as unknown as VehicleData[]);
  }
};
