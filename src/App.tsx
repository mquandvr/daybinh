/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo, useRef } from "react";
import { Fuel, Bike, RefreshCw, AlertCircle, Car, Moon, Sun } from "lucide-react";
import { motion } from "motion/react";
import { FuelPrice, BikeData, VehicleTab } from "./types";
import BikeTab from "./components/Bike";
import CarTab from "./components/Car";

export default function App() {
  const [fuelPrices, setFuelPrices] = useState<FuelPrice[]>([]);
  const [initialPrices, setInitialPrices] = useState<Record<string, number>>({});
  const [bikes, setBikes] = useState<BikeData[]>([]);
  const [selectedBikes, setSelectedBikes] = useState<BikeData[]>([]);
  const [selectedCars, setSelectedCars] = useState<BikeData[]>([]);
  const [selectedFuel, setSelectedFuel] = useState<FuelPrice | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>("");
  const [bikeSearch, setBikeSearch] = useState("");
  const [showBikeResults, setShowBikeResults] = useState(false);
  const [carSearch, setCarSearch] = useState("");
  const [showCarResults, setShowCarResults] = useState(false);
  const [activeTab, setActiveTab] = useState<VehicleTab>("motorcycle");
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem("darkMode");
      if (saved === "true") return true;
      if (saved === "false") return false;
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });
  const bikeSearchRef = useRef<HTMLInputElement>(null);
  const carSearchRef = useRef<HTMLInputElement>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      let fuelRes;
      try {
        const today = new Date().toISOString().split("T")[0];
        fuelRes = await fetch(`/api/proxy/fuel?date=${today}`);
        if (!fuelRes.ok) throw new Error("Proxy failed");
      } catch (e) {
        // Fallback for static hosting (GitHub Pages)
        const today = new Date().toISOString().split("T")[0];
        fuelRes = await fetch(`https://giaxanghomnay.com/api/pvdate/${today}`);
      }
      
      let fuelData = await fuelRes.json();
      
      if (!Array.isArray(fuelData) || fuelData.length === 0 || (Array.isArray(fuelData[0]) && fuelData[0].length === 0)) {
        const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
        try {
          fuelRes = await fetch(`/api/proxy/fuel?date=${yesterday}`);
          if (!fuelRes.ok) throw new Error("Proxy failed");
        } catch (e) {
          fuelRes = await fetch(`https://giaxanghomnay.com/api/pvdate/${yesterday}`);
        }
        fuelData = await fuelRes.json();
      }
      
      let rawPrices = [];
      if (Array.isArray(fuelData)) {
        if (Array.isArray(fuelData[0]) && fuelData[0].length > 0) {
          rawPrices = fuelData[0];
        } else if (Array.isArray(fuelData[1]) && fuelData[1].length > 0) {
          rawPrices = fuelData[1];
        }
      }
      
      const prices: FuelPrice[] = rawPrices.map((item: any) => {
        const name = item.title || item.name || "Unknown";
        let price = Number(item.zone1_price || item.price) || 0;
        
        const isFirstLoad = Object.keys(initialPrices).length === 0;

        const basePrice = isFirstLoad ? price : initialPrices[name];
        const change = basePrice ? price - basePrice : 0;
        
        return {
          name,
          price,
          unit: "VND/L",
          change: change
        };
      })
      .filter(p => p.price > 0);

      if (Object.keys(initialPrices).length === 0) {
        const firstPrices: Record<string, number> = {};
        prices.forEach(p => {
          firstPrices[p.name] = p.price;
        });
        setInitialPrices(firstPrices);
      }

      setFuelPrices(prices);
      if (prices.length > 0) setSelectedFuel(prices[0]);

      const bikeRes = await fetch("https://script.google.com/macros/s/AKfycbzyhYBKeJpj5DYNZ4s6He4X9CXE09lnckQTOeJA7S6M7DEPHYhKNOYsZayKMf-hLMre/exec");
      const bikeJson = await bikeRes.json();
      const parsedBikes: BikeData[] = bikeJson.map((item: any, index: number) => {
        const name = item.name || "Unknown Bike";
        let capacity = 4.5;
        if (item.fuel_tank !== undefined && item.fuel_tank !== null) {
          const capStr = item.fuel_tank.toString().replace(',', '.');
          const capNum = parseFloat(capStr);
          if (!isNaN(capNum)) {
            capacity = capNum;
          }
        }

        return {
          id: index,
          name: name,
          capacity: capacity,
        };
      });
      setBikes(parsedBikes);
      
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Không thể tải dữ liệu. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const savedBikes = localStorage.getItem("selectedBikes");
    const savedCars = localStorage.getItem("selectedCars");

    if (savedBikes) {
      try {
        const parsed = JSON.parse(savedBikes);
        if (Array.isArray(parsed)) setSelectedBikes(parsed);
      } catch (e) {}
    }

    if (savedCars) {
      try {
        const parsed = JSON.parse(savedCars);
        if (Array.isArray(parsed)) setSelectedCars(parsed);
      } catch (e) {}
    }

    fetchData();
    
    let timeoutId: NodeJS.Timeout;
    let intervalId: NodeJS.Timeout;

    // Align with the next 5-minute mark (cron-like behavior: */5 * * * *)
    const now = new Date();
    const msToNext5Min = (5 - (now.getMinutes() % 5)) * 60000 - now.getSeconds() * 1000 - now.getMilliseconds();

    timeoutId = setTimeout(() => {
      fetchData();
      intervalId = setInterval(fetchData, 300000);
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
    if (darkMode) {
      document.documentElement.classList.add("dark");
      document.body.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
      document.body.classList.remove("dark");
    }
    localStorage.setItem("darkMode", darkMode.toString());
  }, [darkMode]);

  const toggleBikeSelection = (bike: BikeData) => {
    setSelectedBikes(prev => {
      const isSelected = prev.some(b => b.id === bike.id);
      if (isSelected) {
        return prev.filter(b => b.id !== bike.id);
      }
      if (prev.length < 10) {
        return [...prev, bike];
      }
      return prev;
    });
  };

  const toggleCarSelection = (car: BikeData) => {
    setSelectedCars(prev => {
      const isSelected = prev.some(c => c.id === car.id);
      if (isSelected) {
        return prev.filter(c => c.id !== car.id);
      }
      if (prev.length < 5) {
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

  const comparisonFuels = useMemo(() => {
    return fuelPrices.filter(p => 
      !p.name.toLowerCase().includes("do") && 
      !p.name.toLowerCase().includes("dầu hỏa")
    );
  }, [fuelPrices]);

  if (loading && fuelPrices.length === 0) {
    return (
      <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <RefreshCw className="w-12 h-12 text-orange-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Đang tải dữ liệu giá xăng...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5] dark:bg-slate-950 text-[#1A1A1A] dark:text-slate-100 font-sans selection:bg-orange-100 transition-colors duration-300">
      {/* Header */}
      <header className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 sticky top-0 z-10 transition-colors duration-300">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 shrink-0">
              <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center">
                <Fuel className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl font-black tracking-tighter text-gray-900 dark:text-white hidden sm:block">Đầy Bình</h1>
            </div>

            {/* Tab Switcher in Header */}
            <nav className="flex p-1 bg-gray-100 dark:bg-slate-800 rounded-xl">
              <button
                onClick={() => setActiveTab("motorcycle")}
                disabled={loading}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                  activeTab === "motorcycle"
                    ? "bg-white dark:bg-slate-700 text-orange-600 dark:text-orange-400 shadow-sm"
                    : "text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200"
                } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <Bike className="w-3.5 h-3.5" />
                Xe Máy
              </button>
              <button
                onClick={() => setActiveTab("car")}
                disabled={loading}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                  activeTab === "car"
                    ? "bg-white dark:bg-slate-700 text-orange-600 dark:text-orange-400 shadow-sm"
                    : "text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200"
                } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <Car className="w-3.5 h-3.5" />
                Xe Hơi
              </button>
            </nav>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <span className="text-[10px] text-gray-400 dark:text-slate-500 hidden md:inline uppercase font-bold tracking-wider">
              Cập nhật: {lastUpdated}
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors text-gray-600 dark:text-slate-400"
                title={darkMode ? "Chế độ sáng" : "Chế độ tối"}
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <button 
                onClick={fetchData}
                disabled={loading}
                className={`p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors text-gray-600 dark:text-slate-400 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                title="Làm mới"
              >
                <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6 relative">
        {loading && fuelPrices.length > 0 && (
          <div className="fixed bottom-6 right-6 z-50">
            <div className="bg-white dark:bg-slate-900 px-4 py-2 rounded-full shadow-2xl border border-gray-100 dark:border-slate-800 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-300">
              <RefreshCw className="w-4 h-4 text-orange-600 animate-spin" />
              <span className="text-xs font-bold text-gray-700 dark:text-slate-200">Đang cập nhật...</span>
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

        {activeTab === "motorcycle" ? (
          <BikeTab
            loading={loading}
            fuelPrices={fuelPrices}
            selectedFuel={selectedFuel}
            setSelectedFuel={setSelectedFuel}
            bikes={bikes}
            selectedBikes={selectedBikes}
            toggleBikeSelection={toggleBikeSelection}
            bikeSearch={bikeSearch}
            setBikeSearch={setBikeSearch}
            showBikeResults={showBikeResults}
            setShowBikeResults={setShowBikeResults}
            bikeSearchRef={bikeSearchRef}
            filteredBikes={filteredBikes}
            comparisonFuels={comparisonFuels}
          />
        ) : (
          <CarTab
            loading={loading}
            onBack={() => setActiveTab("motorcycle")}
            fuelPrices={fuelPrices}
            selectedFuel={selectedFuel}
            setSelectedFuel={setSelectedFuel}
            comparisonFuels={comparisonFuels}
            selectedCars={selectedCars}
            toggleCarSelection={toggleCarSelection}
            carSearch={carSearch}
            setCarSearch={setCarSearch}
            showCarResults={showCarResults}
            setShowCarResults={setShowCarResults}
            carSearchRef={carSearchRef}
          />
        )}
      </main>

      <footer className="max-w-6xl mx-auto p-8 text-center text-gray-400 dark:text-slate-600 text-[10px] space-y-2">
        <p>© 2026 Daybinh. Dữ liệu giá xăng được cung cấp bởi giaxanghomnay.com</p>
        <p>Dữ liệu xe cung cấp bởi VnExpress</p>
      </footer>
    </div>
  );
}
