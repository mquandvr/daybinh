import React from "react";
import { Calculator } from "lucide-react";
import { FuelPrice, VehicleData, FuelData } from "../types";
import FuelPriceList from "./ui/FuelPriceList";
import VehicleSearch from "./ui/VehicleSearch";
import ComparisonTable from "./ui/ComparisonTable";
import { MESSAGES, UI_TEXT, CONFIG } from "../constants";

interface VehicleTabProps {
  fuelLoading: boolean;
  vehicleLoading: boolean;
  fuelPrices: FuelPrice[];
  fuelData: FuelData;
  selectedProvider: "Petrolimex" | "PVOIL";
  setSelectedProvider: (provider: "Petrolimex" | "PVOIL") => void;
  selectedZone: 1 | 2;
  setSelectedZone: (zone: 1 | 2) => void;
  bikes: VehicleData[];
  selectedBikes: VehicleData[];
  selectedCars: VehicleData[];
  toggleBikeSelection: (bike: VehicleData) => void;
  toggleCarSelection: (car: VehicleData) => void;
  bikeSearch: string;
  setBikeSearch: (search: string) => void;
  showBikeResults: boolean;
  setShowBikeResults: (show: boolean) => void;
  bikeSearchRef: React.RefObject<HTMLInputElement | null>;
  filteredBikes: VehicleData[];
  carSearch: string;
  setCarSearch: (search: string) => void;
  showCarResults: boolean;
  setShowCarResults: (show: boolean) => void;
  carSearchRef: React.RefObject<HTMLInputElement | null>;
  filteredCars: VehicleData[];
  comparisonFuels: FuelPrice[];
}

export default function VehicleTabComponent({
  fuelLoading,
  vehicleLoading,
  fuelPrices,
  fuelData,
  selectedProvider,
  setSelectedProvider,
  selectedZone,
  setSelectedZone,
  selectedBikes,
  selectedCars,
  toggleBikeSelection,
  toggleCarSelection,
  bikeSearch,
  setBikeSearch,
  showBikeResults,
  setShowBikeResults,
  bikeSearchRef,
  filteredBikes,
  carSearch,
  setCarSearch,
  showCarResults,
  setShowCarResults,
  carSearchRef,
  filteredCars,
  comparisonFuels,
}: VehicleTabProps) {
  const allSelected = [...selectedBikes, ...selectedCars];

  return (
    <div className="space-y-8">
      {/* Fuel Prices Section */}
      <FuelPriceList
        loading={fuelLoading}
        fuelData={fuelData}
      />

      {/* Calculator Section */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sm:p-8 transition-colors duration-300">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center">
              <Calculator className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold">{UI_TEXT.CALCULATOR_TITLE}</h2>
              <p className="text-sm text-gray-500">{UI_TEXT.CALCULATOR_SUBTITLE}</p>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {/* Search Section - 50/50 Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <VehicleSearch
              loading={vehicleLoading}
              label={MESSAGES.SEARCH_LABEL_BIKE}
              placeholder={MESSAGES.SEARCH_PLACEHOLDER_BIKE}
              searchValue={bikeSearch}
              setSearchValue={setBikeSearch}
              showResults={showBikeResults}
              setShowResults={setShowBikeResults}
              inputRef={bikeSearchRef}
              filteredVehicles={filteredBikes}
              selectedVehicles={selectedBikes}
              toggleSelection={toggleBikeSelection}
              type="motorcycle"
            />

            <VehicleSearch
              loading={vehicleLoading}
              label={MESSAGES.SEARCH_LABEL_CAR}
              placeholder={MESSAGES.SEARCH_PLACEHOLDER_CAR}
              searchValue={carSearch}
              setSearchValue={setCarSearch}
              showResults={showCarResults}
              setShowResults={setShowCarResults}
              inputRef={carSearchRef}
              filteredVehicles={filteredCars}
              selectedVehicles={selectedCars}
              toggleSelection={toggleCarSelection}
              type="car"
            />
          </div>

          {/* Comparison Table Section - 100% Width */}
          <div className="w-full min-w-0">
            {allSelected.length > 0 ? (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <ComparisonTable
                  loading={vehicleLoading}
                  selectedVehicles={allSelected}
                  comparisonFuels={comparisonFuels}
                  selectedProvider={selectedProvider}
                  setSelectedProvider={setSelectedProvider}
                  selectedZone={selectedZone}
                  setSelectedZone={setSelectedZone}
                  toggleSelection={(vehicle) => {
                    if (vehicle.type === "motorcycle") toggleBikeSelection(vehicle);
                    else toggleCarSelection(vehicle);
                  }}
                  onAddMore={() => {
                    // Default to bike search focus if adding more
                    bikeSearchRef.current?.focus();
                    setShowBikeResults(true);
                    bikeSearchRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  }}
                />
              </div>
            ) : (
              <div className="h-full flex items-center justify-center p-12 border-2 border-dashed border-gray-100 rounded-3xl text-gray-400 font-medium">
                {MESSAGES.NO_VEHICLE_SELECTED}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
