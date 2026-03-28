import { FuelPrice, VehicleData } from "../types";
import { API_ENDPOINTS, MESSAGES, UI_TEXT } from "../constants";
import { validateArray, parseFuelCapacity } from "../lib/utils";
import dummyFuels from "../../data-dummy/dummy_fuels.json";
import dummyMotorcycles from "../../data-dummy/dummy_motorcycles.json";
import dummyCars from "../../data-dummy/dummy_cars.json";

const processFuelData = (data: any): FuelPrice[] => {
  if (!validateArray(data)) return [];
  
  const arr1 = validateArray(data[0]) ? data[0] : [];
  const arr3 = validateArray(data[2]) ? data[2] : [];
  const displayData = arr1.length > 0 ? arr1 : arr3;
  
  if (displayData.length === 0) return [];

  return displayData.map((item: any) => {
    const name = item.title || item.name || MESSAGES.UNKNOWN_FUEL;
    const price = Number(item.zone1_price || item.price) || 0;
    const petrolimexId = item.petrolimex_id;
    
    let change = 0;
    if (arr1.length > 0 && arr3.length > 0 && petrolimexId) {
      const compareItem = arr3.find((p: any) => p.petrolimex_id === petrolimexId);
      if (compareItem) {
        const oldPrice = Number(compareItem.zone1_price || compareItem.price) || 0;
        change = price - oldPrice;
      }
    }
    
    return { name, price, unit: UI_TEXT.UNIT_VND_PER_LITRE, change };
  }).filter((p: FuelPrice) => p.price > 0);
};

export const fetchFuelPrices = async (date: string): Promise<{ prices: FuelPrice[]; isDummy: boolean }> => {
  try {
    const response = await fetch(API_ENDPOINTS.FUEL_DIRECT(date));
    if (!response.ok) throw new Error("Direct API failed");
    
    const fuelData = await response.json();
    const prices = processFuelData(fuelData);
    
    if (prices.length === 0) throw new Error(MESSAGES.NO_FUEL_DATA);

    return { prices, isDummy: false };
  } catch (err) {
    console.error("Fuel fetch error, using dummy data:", err);
    const prices = processFuelData(dummyFuels);
    return { prices, isDummy: true };
  }
};

export const fetchVehicles = async (type: "motorcycle" | "car"): Promise<VehicleData[]> => {
  try {
    if (type === "motorcycle") {
      const response = await fetch(API_ENDPOINTS.MOTORCYCLE_API);
      if (!response.ok) throw new Error("Motorcycle API failed");
      
      const data = await response.json();
      if (!validateArray(data)) throw new Error(MESSAGES.INVALID_DATA_FORMAT);

      return data.map((item: any, index: number) => {
        const name = item.name || MESSAGES.UNKNOWN_BIKE;
        const capacity = parseFuelCapacity(item.fuel_tank || item.capacity);
        return { id: index, name, capacity, type: "motorcycle" };
      });
    } else {
      // For cars, we currently use dummy data as there's no live API yet
      // but we wrap it in a promise to maintain the same interface
      return dummyCars as VehicleData[];
    }
  } catch (err) {
    console.error(`${type} fetch error, using dummy data:`, err);
    return type === "motorcycle" ? (dummyMotorcycles as VehicleData[]) : (dummyCars as VehicleData[]);
  }
};
