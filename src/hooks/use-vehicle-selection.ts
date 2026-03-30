import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { VehicleData, VehicleSelectionState, VehicleType } from "@/types";
import { fetchVehicles } from "@/services";
import { validateArray } from "@/lib";
import { CONFIG } from "@/constants/index";

function useVehicleSelectionByType(type: VehicleType, allVehicles: VehicleData[]) {
  const [selected, setSelected] = useState<VehicleData[]>([]);
  const [search, setSearch] = useState("");
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  const storageKey = type === "motorcycle" ? "selectedBikes" : "selectedCars";

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (validateArray(parsed)) setSelected(parsed);
      } catch (e) {}
    }
  }, [storageKey]);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(selected));
  }, [selected, storageKey]);

  const toggle = useCallback((vehicle: VehicleData) => {
    setSelected(prev => 
      prev.some(v => v.id === vehicle.id) 
        ? prev.filter(v => v.id !== vehicle.id) 
        : [...prev, vehicle]
    );
  }, []);

  const filtered = useMemo(() => 
    allVehicles.filter(v => v.name.toLowerCase().includes(search.toLowerCase())),
    [allVehicles, search]
  );

  return useMemo(() => ({
    all: allVehicles,
    selected,
    toggle,
    search: {
      value: search,
      setValue: setSearch,
      showResults,
      setShowResults,
      ref: searchRef,
      filtered
    }
  }), [allVehicles, selected, toggle, search, showResults, filtered]);
}

export function useVehicleSelection() {
  const [bikes, setBikes] = useState<VehicleData[]>([]);
  const [cars, setCars] = useState<VehicleData[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshVehicles = useCallback(async () => {
    setLoading(true);
    const timeoutId = setTimeout(() => setLoading(false), CONFIG.LOADING_TIMEOUT_MS);

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
    refreshVehicles();
  }, [refreshVehicles]);

  const bikeState = useVehicleSelectionByType("motorcycle", bikes);
  const carState = useVehicleSelectionByType("car", cars);

  return useMemo(() => ({
    bike: bikeState,
    car: carState,
    loading,
    refresh: refreshVehicles,
  }), [bikeState, carState, loading, refreshVehicles]);
}
