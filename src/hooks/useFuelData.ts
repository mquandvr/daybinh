import { useState, useEffect, useCallback } from "react";
import { FuelData, FuelProvider, PriceZone } from "@/types";
import { fetchFuelPrices } from "@/services";
import { MESSAGES, CONFIG } from "@/constants";

export function useFuelData() {
  const [fuelData, setFuelData] = useState<FuelData>({ petrolimex: [], pvoil: [] });
  const [selectedProvider, setSelectedProvider] = useState<FuelProvider>("Petrolimex");
  const [selectedZone, setSelectedZone] = useState<PriceZone>(1);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>("");
  const [isDummy, setIsDummy] = useState(false);

  const fetchData = useCallback(async () => {
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

    if (savedProvider === "Petrolimex" || savedProvider === "PVOIL") {
      setSelectedProvider(savedProvider as FuelProvider);
    }
    if (savedZone === "1" || savedZone === "2") {
      setSelectedZone(Number(savedZone) as PriceZone);
    }

    fetchData();
    const interval = setInterval(fetchData, CONFIG.REFRESH_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [fetchData]);

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
    refresh: fetchData,
  };
}
