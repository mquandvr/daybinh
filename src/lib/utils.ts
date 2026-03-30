import { FuelPrice } from "@/types";
import { CONFIG } from "@/constants/index";

export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("vi-VN").format(value);
};

export const calculateFuelCost = (capacity: number, price: number) => {
  return capacity * price;
};

export const validateArray = <T>(data: unknown): data is readonly T[] => {
  return Array.isArray(data);
};

export const parseFuelCapacity = (fuelTank: unknown): number => {
  if (fuelTank === undefined || fuelTank === null) return 4.5;
  const capStr = String(fuelTank).replace(',', '.');
  const capNum = parseFloat(capStr);
  return isNaN(capNum) ? 4.5 : capNum;
};

export const isGasoline = (name: string): boolean => {
  const lowerName = name.toLowerCase();
  return CONFIG.GASOLINE_KEYWORDS.some(keyword => lowerName.includes(keyword));
};

/**
 * Generic filter function for fuel prices (OCP)
 */
export const filterFuels = (
  prices: FuelPrice[], 
  predicate: (p: FuelPrice) => boolean
): FuelPrice[] => {
  return prices.filter(predicate);
};

/**
 * Specific filter using the generic filterFuels
 */
export const filterFuelByType = (prices: FuelPrice[], isGasolineType: boolean): FuelPrice[] => {
  return filterFuels(prices, p => isGasoline(p.name) === isGasolineType);
};
