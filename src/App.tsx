/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo, useRef } from "react";
import { RefreshCw, AlertCircle } from "lucide-react";
import { motion } from "motion/react";
import { FuelPrice, VehicleData } from "./types";
import VehicleTabComponent from "./components/VehicleTab";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import { API_ENDPOINTS, MESSAGES, CONFIG, UI_TEXT } from "./constants";
import { validateArray, parseFuelCapacity } from "./lib/utils";
import dummyMotorcycles from "../data-dummy/dummy_motorcycles.json";
import dummyCars from "../data-dummy/dummy_cars.json";
import dummyFuels from "../data-dummy/dummy_fuels.json";

export default function App() {
  const [fuelPrices, setFuelPrices] = useState<FuelPrice[]>([]);
  const [bikes, setBikes] = useState<VehicleData[]>([]);
  const [selectedBikes, setSelectedBikes] = useState<VehicleData[]>([]);
  const [selectedCars, setSelectedCars] = useState<VehicleData[]>([]);
  const [fuelLoading, setFuelLoading] = useState(true);
  const [vehicleLoading, setVehicleLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>("");
  const [bikeSearch, setBikeSearch] = useState("");
  const [showBikeResults, setShowBikeResults] = useState(false);
  const [carSearch, setCarSearch] = useState("");
  const [showCarResults, setShowCarResults] = useState(false);
  const bikeSearchRef = useRef<HTMLInputElement>(null);
  const carSearchRef = useRef<HTMLInputElement>(null);

  const fetchFuelData = async () => {
    setFuelLoading(true);
    try {
      let fuelRes;
      const today = new Date().toISOString().split("T")[0];
      try {
        fuelRes = await fetch(`${API_ENDPOINTS.FUEL_PROXY}?date=${today}`);
        if (!fuelRes.ok) throw new Error("Proxy failed");
      } catch (e) {
        fuelRes = await fetch(API_ENDPOINTS.FUEL_DIRECT(today));
      }
      
      const fuelData = await fuelRes.json();
      
      // Basic validation
      if (!validateArray(fuelData)) {
        throw new Error(MESSAGES.INVALID_DATA_FORMAT);
      }

      const arr1 = validateArray(fuelData[0]) ? fuelData[0] : [];
      const arr3 = validateArray(fuelData[2]) ? fuelData[2] : [];

      const displayData = arr1.length > 0 ? arr1 : arr3;
      
      if (displayData.length === 0) {
        throw new Error(MESSAGES.NO_FUEL_DATA);
      }

      const prices: FuelPrice[] = displayData.map((item: any) => {
        const name = item.title || item.name || MESSAGES.UNKNOWN_FUEL;
        const price = Number(item.zone1_price) || 0;
        const petrolimexId = item.petrolimex_id;
        
        let change = 0;
        if (arr1.length > 0 && arr3.length > 0 && petrolimexId) {
          const compareItem = arr3.find((p: any) => p.petrolimex_id === petrolimexId);
          if (compareItem) {
            const oldPrice = Number(compareItem.zone1_price) || 0;
            change = price - oldPrice;
          }
        }
        
        return { name, price, unit: UI_TEXT.UNIT_VND_PER_LITRE, change };
      }).filter(p => p.price > 0);

      setFuelPrices(prices);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (err) {
      console.error("Fuel fetch error, using dummy data:", err);
      
      const dData = dummyFuels as any[][];
      const dArr1 = validateArray(dData[0]) ? dData[0] : [];
      const dArr3 = validateArray(dData[2]) ? dData[2] : [];
      const dDisplay = dArr1.length > 0 ? dArr1 : dArr3;

      const dPrices: FuelPrice[] = dDisplay.map((item: any) => {
        const name = item.title || item.name || MESSAGES.UNKNOWN_FUEL;
        const price = Number(item.zone1_price || item.price) || 0;
        const petrolimexId = item.petrolimex_id;
        
        let change = 0;
        if (dArr1.length > 0 && dArr3.length > 0 && petrolimexId) {
          const compareItem = dArr3.find((p: any) => p.petrolimex_id === petrolimexId);
          if (compareItem) {
            const oldPrice = Number(compareItem.zone1_price || compareItem.price) || 0;
            change = price - oldPrice;
          }
        }
        
        return { name, price, unit: UI_TEXT.UNIT_VND_PER_LITRE, change };
      }).filter(p => p.price > 0);

      setFuelPrices(dPrices);
      setLastUpdated(new Date().toLocaleTimeString() + MESSAGES.DUMMY_SUFFIX);
    } finally {
      setFuelLoading(false);
    }
  };

  const fetchVehicleData = async () => {
    setVehicleLoading(true);
    try {
      const bikeRes = await fetch(API_ENDPOINTS.VEHICLE_PROXY);
      if (!bikeRes.ok) throw new Error(MESSAGES.VEHICLE_FETCH_ERROR);
      
      const bikeJson = await bikeRes.json();
      if (!validateArray(bikeJson)) throw new Error(MESSAGES.INVALID_DATA_FORMAT);

      const parsedBikes: VehicleData[] = bikeJson.map((item: any, index: number) => {
        const name = item.name || MESSAGES.UNKNOWN_BIKE;
        const capacity = parseFuelCapacity(item.fuel_tank);
        return { id: index, name, capacity, type: "motorcycle" };
      });
      setBikes(parsedBikes);
    } catch (err) {
      console.error("Vehicle fetch error, using dummy data:", err);
      setBikes(dummyMotorcycles as VehicleData[]);
    } finally {
      setVehicleLoading(false);
    }
  };

  const fetchData = async () => {
    setError(null);
    await Promise.all([fetchFuelData(), fetchVehicleData()]);
  };

  useEffect(() => {
    const savedBikes = localStorage.getItem("selectedBikes");
    const savedCars = localStorage.getItem("selectedCars");

    if (savedBikes) {
      try {
        const parsed = JSON.parse(savedBikes);
        if (validateArray(parsed)) setSelectedBikes(parsed);
      } catch (e) {}
    }

    if (savedCars) {
      try {
        const parsed = JSON.parse(savedCars);
        if (validateArray(parsed)) setSelectedCars(parsed);
      } catch (e) {}
    }

    fetchData();
    
    let timeoutId: NodeJS.Timeout;
    let intervalId: NodeJS.Timeout;

    const now = new Date();
    const msToNext5Min = (5 - (now.getMinutes() % 5)) * 60000 - now.getSeconds() * 1000 - now.getMilliseconds();

    timeoutId = setTimeout(() => {
      fetchData();
      intervalId = setInterval(fetchData, CONFIG.REFRESH_INTERVAL_MS);
    }, msToNext5Min);

    return () => {
      clearTimeout(timeoutId);
      if (intervalId) clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem("selectedBikes", JSON.stringify(selectedBikes));
  }, [selectedBikes]);

  useEffect(() => {
    localStorage.setItem("selectedCars", JSON.stringify(selectedCars));
  }, [selectedCars]);

  const toggleBikeSelection = (bike: VehicleData) => {
    setSelectedBikes(prev => {
      const isSelected = prev.some(b => b.id === bike.id);
      if (isSelected) {
        return prev.filter(b => b.id !== bike.id);
      }
      if (prev.length < CONFIG.MAX_BIKES) {
        return [...prev, bike];
      }
      return prev;
    });
  };

  const toggleCarSelection = (car: VehicleData) => {
    setSelectedCars(prev => {
      const isSelected = prev.some(c => c.id === car.id);
      if (isSelected) {
        return prev.filter(c => c.id !== car.id);
      }
      if (prev.length < CONFIG.MAX_CARS) {
        return [...prev, car];
      }
      return prev;
    });
  };

  const filteredBikes = useMemo(() => {
    if (!bikeSearch) return bikes;
    return bikes.filter(bike => 
      bike.name.toLowerCase().includes(bikeSearch.toLowerCase())
    );
  }, [bikes, bikeSearch]);

  const filteredCars = useMemo(() => {
    if (!carSearch) return dummyCars as VehicleData[];
    return (dummyCars as VehicleData[]).filter(car => 
      car.name.toLowerCase().includes(carSearch.toLowerCase())
    );
  }, [carSearch]);

  const comparisonFuels = useMemo(() => {
    return fuelPrices.filter(p => {
      const name = p.name.toLowerCase();
      // Always exclude kerosene (Dầu hỏa) and Diesel (DO)
      if (name.includes(MESSAGES.FILTER_KEROSENE) || name.includes(MESSAGES.FILTER_DIESEL)) return false;
      return true;
    });
  }, [fuelPrices]);

  if (fuelLoading && fuelPrices.length === 0 && vehicleLoading && bikes.length === 0) {
    return (
      <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <RefreshCw className="w-12 h-12 text-orange-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">{MESSAGES.LOADING_DATA}</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5] text-[#1A1A1A] font-sans selection:bg-orange-100 transition-colors duration-300">
      <Header 
        lastUpdated={lastUpdated}
        fuelLoading={fuelLoading}
        vehicleLoading={vehicleLoading}
        onRefresh={fetchData}
      />

      <main className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6 relative">
        {(fuelLoading || vehicleLoading) && (fuelPrices.length > 0 || bikes.length > 0) && (
          <div className="fixed bottom-6 right-6 z-50">
            <div className="bg-white px-4 py-2 rounded-full shadow-2xl border border-gray-100 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-300">
              <RefreshCw className="w-4 h-4 text-orange-600 animate-spin" />
              <span className="text-xs font-bold text-gray-700">{MESSAGES.UPDATING_DATA}</span>
            </div>
          </div>
        )}

        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border border-red-200 p-4 rounded-xl flex items-start gap-3"
          >
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <p className="text-red-800 text-sm">{error}</p>
          </motion.div>
        )}

        <VehicleTabComponent
          fuelLoading={fuelLoading}
          vehicleLoading={vehicleLoading}
          fuelPrices={fuelPrices}
          bikes={bikes}
          selectedBikes={selectedBikes}
          selectedCars={selectedCars}
          toggleBikeSelection={toggleBikeSelection}
          toggleCarSelection={toggleCarSelection}
          bikeSearch={bikeSearch}
          setBikeSearch={setBikeSearch}
          showBikeResults={showBikeResults}
          setShowBikeResults={setShowBikeResults}
          bikeSearchRef={bikeSearchRef}
          filteredBikes={filteredBikes}
          carSearch={carSearch}
          setCarSearch={setCarSearch}
          showCarResults={showCarResults}
          setShowCarResults={setShowCarResults}
          carSearchRef={carSearchRef}
          filteredCars={filteredCars}
          comparisonFuels={comparisonFuels}
        />
      </main>

      <Footer />
    </div>
  );
}
