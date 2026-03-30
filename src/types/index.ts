import React from "react";

export type VehicleType = "motorcycle" | "car";
export type FuelProvider = "Petrolimex" | "PVOIL";
export type PriceZone = 1 | 2;

export interface FuelPrice {
  readonly name: string;
  readonly price: number; // zone 1 price or PVOIL price
  readonly zone2_price?: number; // only for Petrolimex
  readonly unit: string;
  readonly change?: number; // zone 1 change
  readonly change2?: number; // zone 2 change
  readonly provider: FuelProvider;
  readonly petrolimexId?: string;
}

export interface FuelData {
  readonly petrolimex: readonly FuelPrice[];
  readonly pvoil: readonly FuelPrice[];
}

export interface VehicleData {
  readonly id: number;
  readonly name: string;
  readonly capacity: number;
  readonly type: VehicleType;
}

export interface SearchState {
  readonly value: string;
  readonly setValue: (val: string) => void;
  readonly showResults: boolean;
  readonly setShowResults: (show: boolean) => void;
  readonly ref: React.RefObject<HTMLInputElement | null>;
  readonly filtered: readonly VehicleData[];
}

export interface VehicleSelectionState {
  readonly all: readonly VehicleData[];
  readonly selected: readonly VehicleData[];
  readonly toggle: (vehicle: VehicleData) => void;
  readonly search: SearchState;
}

export interface ProviderSelectionState {
  readonly selected: FuelProvider;
  readonly setSelected: (provider: FuelProvider) => void;
}

export interface ZoneSelectionState {
  readonly selected: PriceZone;
  readonly setSelected: (zone: PriceZone) => void;
}

export interface FuelState {
  readonly loading: boolean;
  readonly data: FuelData;
  readonly selectedProvider: FuelProvider;
  readonly setSelectedProvider: (provider: FuelProvider) => void;
  readonly selectedZone: PriceZone;
  readonly setSelectedZone: (zone: PriceZone) => void;
  readonly comparisonFuels: readonly FuelPrice[];
}

/**
 * Raw data structure from the fuel API
 */
export interface RawFuelItem {
  readonly title?: string;
  readonly name?: string;
  readonly zone1_price?: string | number;
  readonly price?: string | number;
  readonly zone2_price?: string | number;
  readonly petrolimex_id?: string;
  readonly id?: string | number;
}

export type FuelApiResponse = readonly (readonly RawFuelItem[])[];
