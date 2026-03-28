import { FuelPrice, VehicleData, FuelData } from "../types";
import { API_ENDPOINTS, MESSAGES, UI_TEXT } from "../constants";
import { validateArray, parseFuelCapacity } from "../lib/utils";
import dummyFuels from "../../data-dummy/dummy_fuels.json";
import dummyMotorcycles from "../../data-dummy/dummy_motorcycles.json";
import dummyCars from "../../data-dummy/dummy_cars.json";

const processFuelData = (data: any): FuelData => {
  if (!validateArray(data)) return { petrolimex: [], pvoil: [] };
  
  const arr1 = validateArray(data[0]) ? data[0] : []; // Petrolimex current
  const arr2 = validateArray(data[1]) ? data[1] : []; // PVOIL current
  const arr3 = validateArray(data[2]) ? data[2] : []; // Petrolimex previous
  const arr4 = validateArray(data[3]) ? data[3] : []; // PVOIL previous

  const processProvider = (current: any[], previous: any[], provider: "Petrolimex" | "PVOIL"): FuelPrice[] => {
    const displayData = current.length > 0 ? current : previous;
    if (displayData.length === 0) return [];

    return displayData.map((item: any) => {
      const name = item.title || item.name || MESSAGES.UNKNOWN_FUEL;
      const price = Number(item.zone1_price || item.price) || 0;
      const zone2_price = item.zone2_price ? Number(item.zone2_price) : undefined;
      const petrolimexId = item.petrolimex_id || item.id?.toString(); // Fallback ID for PVOIL
      
      let change = 0;
      let change2 = 0;
      
      if (current.length > 0 && previous.length > 0 && petrolimexId) {
        const compareItem = previous.find((p: any) => (p.petrolimex_id || p.id?.toString()) === petrolimexId);
        if (compareItem) {
          const oldPrice = Number(compareItem.zone1_price || compareItem.price) || 0;
          change = price - oldPrice;
          
          if (zone2_price && compareItem.zone2_price) {
            change2 = zone2_price - Number(compareItem.zone2_price);
          }
        }
      }
      
      return { 
        name, 
        price, 
        zone2_price, 
        unit: UI_TEXT.UNIT_VND_PER_LITRE, 
        change, 
        change2, 
        provider, 
        petrolimexId 
      };
    }).filter((p: FuelPrice) => p.price > 0);
  };

  return {
    petrolimex: processProvider(arr1, arr3, "Petrolimex"),
    pvoil: processProvider(arr2, arr4, "PVOIL")
  };
};

export const fetchFuelPrices = async (date: string): Promise<{ data: FuelData; isDummy: boolean }> => {
  try {
    const response = await fetch(API_ENDPOINTS.FUEL_DIRECT(date));
    if (!response.ok) throw new Error("Direct API failed");
    
    const fuelData = await response.json();
    const data = processFuelData(fuelData);
    
    if (data.petrolimex.length === 0 && data.pvoil.length === 0) throw new Error(MESSAGES.NO_FUEL_DATA);

    return { data, isDummy: false };
  } catch (err) {
    console.error("Fuel fetch error, using dummy data:", err);
    const data = processFuelData(dummyFuels);
    return { data, isDummy: true };
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
