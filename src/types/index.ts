import React from "react";

export type VehicleType = "motorcycle" | "car";
export type FuelProvider = "Petrolimex" | "PVOIL";
export type PriceZone = 1 | 2;

export interface FuelPrice {
  name: string;
  price: number; // zone 1 price or PVOIL price
  zone2_price?: number; // only for Petrolimex
  unit: string;
  change?: number; // zone 1 change
  change2?: number; // zone 2 change
  provider: FuelProvider;
  petrolimexId?: string;
}

export interface FuelData {
  petrolimex: FuelPrice[];
  pvoil: FuelPrice[];
}

export interface VehicleData {
  id: number;
  name: string;
  capacity: number;
  type: VehicleType;
}

export interface SearchState {
  value: string;
  setValue: (val: string) => void;
  showResults: boolean;
  setShowResults: (show: boolean) => void;
  ref: React.RefObject<HTMLInputElement | null>;
  filtered: VehicleData[];
}

export interface VehicleSelectionState {
  all: VehicleData[];
  selected: VehicleData[];
  toggle: (vehicle: VehicleData) => void;
  search: SearchState;
}

export interface ProviderSelectionState {
  selected: FuelProvider;
  setSelected: (provider: FuelProvider) => void;
}

export interface ZoneSelectionState {
  selected: PriceZone;
  setSelected: (zone: PriceZone) => void;
}

export interface FuelState {
  loading: boolean;
  data: FuelData;
  selectedProvider: FuelProvider;
  setSelectedProvider: (provider: FuelProvider) => void;
  selectedZone: PriceZone;
  setSelectedZone: (zone: PriceZone) => void;
  comparisonFuels: FuelPrice[];
}
