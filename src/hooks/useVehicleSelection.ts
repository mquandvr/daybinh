import { useState, useEffect, useCallback, useRef } from "react";
import { VehicleData, VehicleSelectionState } from "@/types";
import { fetchVehicles } from "@/services";
import { validateArray } from "@/lib";
import { CONFIG } from "@/constants";

export function useVehicleSelection() {
  const [bikes, setBikes] = useState<VehicleData[]>([]);
  const [cars, setCars] = useState<VehicleData[]>([]);
  const [selectedBikes, setSelectedBikes] = useState<VehicleData[]>([]);
  const [selectedCars, setSelectedCars] = useState<VehicleData[]>([]);
  const [loading, setLoading] = useState(true);
  const [bikeSearch, setBikeSearch] = useState("");
  const [showBikeResults, setShowBikeResults] = useState(false);
  const [carSearch, setCarSearch] = useState("");
  const [showCarResults, setShowCarResults] = useState(false);
  const bikeSearchRef = useRef<HTMLInputElement>(null);
  const carSearchRef = useRef<HTMLInputElement>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    
    // 30s timeout to auto-disable loading
    const timeoutId = setTimeout(() => {
      setLoading(false);
    }, CONFIG.LOADING_TIMEOUT_MS);

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
      clearTimeout(timeoutId);
      setLoading(false);
    }
  }, []);

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
  }, [fetchData]);

  useEffect(() => {
    localStorage.setItem("selectedBikes", JSON.stringify(selectedBikes));
  }, [selectedBikes]);

  useEffect(() => {
    localStorage.setItem("selectedCars", JSON.stringify(selectedCars));
  }, [selectedCars]);

  const toggleBikeSelection = useCallback((bike: VehicleData) => {
    setSelectedBikes(prev => 
      prev.some(b => b.id === bike.id) 
        ? prev.filter(b => b.id !== bike.id) 
        : [...prev, bike]
    );
  }, []);

  const toggleCarSelection = useCallback((car: VehicleData) => {
    setSelectedCars(prev => 
      prev.some(c => c.id === car.id) 
        ? prev.filter(c => c.id !== car.id) 
        : [...prev, car]
    );
  }, []);

  const filteredBikes = bikes.filter(bike => 
    bike.name.toLowerCase().includes(bikeSearch.toLowerCase())
  );

  const filteredCars = cars.filter(car => 
    car.name.toLowerCase().includes(carSearch.toLowerCase())
  );

  const bikeState: VehicleSelectionState = {
    all: bikes,
    selected: selectedBikes,
    toggle: toggleBikeSelection,
    search: {
      value: bikeSearch,
      setValue: setBikeSearch,
      showResults: showBikeResults,
      setShowResults: setShowBikeResults,
      ref: bikeSearchRef,
      filtered: filteredBikes
    }
  };

  const carState: VehicleSelectionState = {
    all: cars,
    selected: selectedCars,
    toggle: toggleCarSelection,
    search: {
      value: carSearch,
      setValue: setCarSearch,
      showResults: showCarResults,
      setShowResults: setShowCarResults,
      ref: carSearchRef,
      filtered: filteredCars
    }
  };

  return {
    bike: bikeState,
    car: carState,
    loading,
    refresh: fetchData,
  };
}
