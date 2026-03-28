/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo, useRef } from "react";
import { RefreshCw, AlertCircle } from "lucide-react";
import { motion } from "motion/react";
import { FuelPrice, VehicleData, FuelData } from "./types";
import VehicleTabComponent from "./components/VehicleTab";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import { fetchFuelPrices, fetchVehicles } from "./services/apiService";
import { MESSAGES, CONFIG } from "./constants";
import { validateArray } from "./lib/utils";

export default function App() {
  const [fuelData, setFuelData] = useState<FuelData>({ petrolimex: [], pvoil: [] });
  const [selectedProvider, setSelectedProvider] = useState<"Petrolimex" | "PVOIL">("Petrolimex");
  const [selectedZone, setSelectedZone] = useState<1 | 2>(1);
  const [bikes, setBikes] = useState<VehicleData[]>([]);
  const [cars, setCars] = useState<VehicleData[]>([]);
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
      const today = new Date().toISOString().split("T")[0];
      const { data, isDummy } = await fetchFuelPrices(today);
      setFuelData(data);
      setLastUpdated(new Date().toLocaleTimeString() + (isDummy ? MESSAGES.DUMMY_SUFFIX : ""));
    } catch (err) {
      console.error("Fuel fetch error:", err);
    } finally {
      setFuelLoading(false);
    }
  };

  const fetchVehicleData = async () => {
    setVehicleLoading(true);
    try {
      const [parsedBikes, parsedCars] = await Promise.all([
        fetchVehicles("motorcycle"),
        fetchVehicles("car")
      ]);
      setBikes(parsedBikes);
      setCars(parsedCars);
    } catch (err) {
      console.error("Vehicle fetch error:", err);
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
    const savedProvider = localStorage.getItem("selectedProvider");
    const savedZone = localStorage.getItem("selectedZone");

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

    if (savedProvider === "Petrolimex" || savedProvider === "PVOIL") {
      setSelectedProvider(savedProvider);
    }

    if (savedZone === "1" || savedZone === "2") {
      setSelectedZone(Number(savedZone) as 1 | 2);
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

  useEffect(() => {
    localStorage.setItem("selectedProvider", selectedProvider);
  }, [selectedProvider]);

  useEffect(() => {
    localStorage.setItem("selectedZone", selectedZone.toString());
  }, [selectedZone]);

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
    if (!carSearch) return cars;
    return cars.filter(car => 
      car.name.toLowerCase().includes(carSearch.toLowerCase())
    );
  }, [cars, carSearch]);

  const comparisonFuels = useMemo(() => {
    const prices = selectedProvider === "Petrolimex" ? fuelData.petrolimex : fuelData.pvoil;
    return prices.filter(p => {
      const name = p.name.toLowerCase();
      // Always exclude kerosene (Dầu hỏa) and Diesel (DO)
      if (name.includes(MESSAGES.FILTER_KEROSENE) || name.includes(MESSAGES.FILTER_DIESEL)) return false;
      return true;
    }).map(p => {
      if (selectedProvider === "Petrolimex" && selectedZone === 2 && p.zone2_price !== undefined) {
        return {
          ...p,
          price: p.zone2_price,
          change: p.change2
        };
      }
      return p;
    });
  }, [fuelData, selectedProvider, selectedZone]);

  if (fuelLoading && fuelData.petrolimex.length === 0 && fuelData.pvoil.length === 0 && vehicleLoading && bikes.length === 0) {
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
        {(fuelLoading || vehicleLoading) && (fuelData.petrolimex.length > 0 || fuelData.pvoil.length > 0 || bikes.length > 0) && (
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
          fuelPrices={comparisonFuels}
          fuelData={fuelData}
          selectedProvider={selectedProvider}
          setSelectedProvider={setSelectedProvider}
          selectedZone={selectedZone}
          setSelectedZone={setSelectedZone}
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
