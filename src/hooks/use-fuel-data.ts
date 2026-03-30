import { useState, useEffect, useCallback } from "react";
import { FuelData, FuelProvider, PriceZone } from "@/types";
import { fetchFuelPrices } from "@/services";
import { MESSAGES, CONFIG } from "@/constants/index";

export function useFuelData() {
  const [fuelData, setFuelData] = useState<FuelData>({ petrolimex: [], pvoil: [] });
  const [selectedProvider, setSelectedProvider] = useState<FuelProvider>(CONFIG.FUEL_PROVIDERS.PETROLIMEX);
  const [selectedZone, setSelectedZone] = useState<PriceZone>(CONFIG.FUEL_ZONES.ZONE_1);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>("");
  const [isDummy, setIsDummy] = useState(false);

  const refreshFuelPrices = useCallback(async () => {
    setLoading(true);
    
    // 30s timeout to auto-disable loading
    const timeoutId = setTimeout(() => {
      setLoading(false);
    }, CONFIG.LOADING_TIMEOUT_MS);

    try {
      const today = new Date().toISOString().split("T")[0];
      const { data, isDummy: dummyStatus } = await fetchFuelPrices(today);
      setFuelData(data);
      setIsDummy(dummyStatus);
      setLastUpdated(new Date().toLocaleTimeString() + (dummyStatus ? MESSAGES.DUMMY_SUFFIX : ""));
    } catch (err) {
      console.error("Fuel fetch error:", err);
    } finally {
      clearTimeout(timeoutId);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const savedProvider = localStorage.getItem("selectedProvider");
    const savedZone = localStorage.getItem("selectedZone");

    if (CONFIG.FUEL_PROVIDERS_DATA.some(p => p.value === savedProvider)) {
      setSelectedProvider(savedProvider as FuelProvider);
    }
    if (CONFIG.FUEL_ZONES_DATA.some(z => z.value.toString() === savedZone)) {
      setSelectedZone(Number(savedZone) as PriceZone);
    }

    refreshFuelPrices();
    const interval = setInterval(refreshFuelPrices, CONFIG.REFRESH_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [refreshFuelPrices]);

  useEffect(() => {
    localStorage.setItem("selectedProvider", selectedProvider);
  }, [selectedProvider]);

  useEffect(() => {
    localStorage.setItem("selectedZone", selectedZone.toString());
  }, [selectedZone]);

  return {
    data: fuelData,
    selectedProvider,
    setSelectedProvider,
    selectedZone,
    setSelectedZone,
    loading,
    lastUpdated,
    isDummy,
    refresh: refreshFuelPrices,
  };
}
