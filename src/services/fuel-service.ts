import { FuelPrice, FuelData, FuelProvider, FuelApiResponse, RawFuelItem } from "@/types";
import { API_ENDPOINTS, MESSAGES, UI_TEXT, CONFIG } from "@/constants/index";
import { validateArray } from "@/lib";
import dummyFuels from "@/../data-dummy/dummy-fuels.json";

const processFuelData = (data: unknown): FuelData => {
  if (!validateArray(data)) return { petrolimex: [], pvoil: [] };
  
  const apiData = data as FuelApiResponse;
  const petrolimexCurrent = validateArray(apiData[0]) ? apiData[0] : [];
  const pvoilCurrent = validateArray(apiData[1]) ? apiData[1] : [];
  const petrolimexPrevious = validateArray(apiData[2]) ? apiData[2] : [];
  const pvoilPrevious = validateArray(apiData[3]) ? apiData[3] : [];

  const mapFuelDataToPrices = (current: readonly RawFuelItem[], previous: readonly RawFuelItem[], provider: FuelProvider): FuelPrice[] => {
    const displayData = current.length > 0 ? current : previous;
    if (displayData.length === 0) return [];

    const previousPricesMap = new Map<string, RawFuelItem>();
    previous.forEach((p) => {
      const id = p.petrolimex_id || p.id?.toString();
      const name = p.title || p.name;
      if (id) previousPricesMap.set(`id:${id}`, p);
      if (name) previousPricesMap.set(`name:${name}`, p);
    });

    return displayData.map((item) => {
      const name = item.title || item.name || MESSAGES.UNKNOWN_FUEL;
      const price = Number(item.zone1_price || item.price) || 0;
      const zone2_price = item.zone2_price ? Number(item.zone2_price) : undefined;
      const petrolimexId = item.petrolimex_id || item.id?.toString();
      
      let change = 0;
      let change2 = 0;
      
      if (current.length > 0 && previous.length > 0) {
        const previousPriceItem = (petrolimexId && previousPricesMap.get(`id:${petrolimexId}`)) || previousPricesMap.get(`name:${name}`);
        
        if (previousPriceItem) {
          const oldPrice = Number(previousPriceItem.zone1_price || previousPriceItem.price) || 0;
          change = price - oldPrice;
          
          if (zone2_price && previousPriceItem.zone2_price) {
            change2 = zone2_price - Number(previousPriceItem.zone2_price);
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
    petrolimex: mapFuelDataToPrices(petrolimexCurrent, petrolimexPrevious, CONFIG.FUEL_PROVIDERS.PETROLIMEX),
    pvoil: mapFuelDataToPrices(pvoilCurrent, pvoilPrevious, CONFIG.FUEL_PROVIDERS.PVOIL)
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
