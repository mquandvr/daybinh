import React, { useState, useMemo, useRef } from "react";
import { Car, Calculator, ArrowLeft } from "lucide-react";
import { FuelPrice, BikeData } from "../types";
import FuelPriceList from "./ui/FuelPriceList";
import TipCard from "./ui/TipCard";
import VehicleSearch from "./ui/VehicleSearch";
import ComparisonTable from "./ui/ComparisonTable";

interface CarTabProps {
  loading: boolean;
  onBack: () => void;
  fuelPrices: FuelPrice[];
  selectedFuel: FuelPrice | null;
  setSelectedFuel: (fuel: FuelPrice) => void;
  comparisonFuels: FuelPrice[];
  selectedCars: BikeData[];
  toggleCarSelection: (car: BikeData) => void;
  carSearch: string;
  setCarSearch: (search: string) => void;
  showCarResults: boolean;
  setShowCarResults: (show: boolean) => void;
  carSearchRef: React.RefObject<HTMLInputElement | null>;
}

// Dummy car data for now
const DUMMY_CARS: BikeData[] = [
  { id: 1001, name: "Toyota Vios", capacity: 42 },
  { id: 1002, name: "Honda City", capacity: 40 },
  { id: 1003, name: "Hyundai Accent", capacity: 45 },
  { id: 1004, name: "Mazda 3", capacity: 51 },
  { id: 1005, name: "Kia Seltos", capacity: 50 },
  { id: 1006, name: "Toyota Camry", capacity: 60 },
  { id: 1007, name: "Honda CR-V", capacity: 57 },
  { id: 1008, name: "Ford Ranger", capacity: 80 },
];

export default function CarTab({
  loading,
  onBack,
  fuelPrices,
  selectedFuel,
  setSelectedFuel,
  comparisonFuels,
  selectedCars,
  toggleCarSelection,
  carSearch,
  setCarSearch,
  showCarResults,
  setShowCarResults,
  carSearchRef,
}: CarTabProps) {
  const filteredCars = useMemo(() => {
    if (!carSearch) return DUMMY_CARS;
    return DUMMY_CARS.filter(car => 
      car.name.toLowerCase().includes(carSearch.toLowerCase())
    );
  }, [carSearch]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-10 gap-6 items-start">
      {/* Fuel Prices Card (30% width on large screens) */}
      <div className="lg:col-span-3 space-y-4">
        <FuelPriceList
          loading={loading}
          fuelPrices={fuelPrices}
          selectedFuel={selectedFuel}
          setSelectedFuel={setSelectedFuel}
        />

        <TipCard
          title="Mẹo tiết kiệm xăng xe hơi"
          description="Tắt máy khi dừng chờ lâu, không chở đồ quá nặng và sử dụng điều hòa hợp lý giúp xe hơi của bạn tiết kiệm xăng hơn tới 20%."
        />
      </div>

      {/* Calculator Section (70% width on large screens) */}
      <div className="lg:col-span-7 space-y-6">
        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-800 p-6 sm:p-8 transition-colors duration-300">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-900 dark:bg-slate-800 rounded-xl flex items-center justify-center">
                <Calculator className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold dark:text-white">Bảng Giá Đổ Đầy Bình Xe Hơi</h2>
                <p className="text-sm text-gray-500 dark:text-slate-400">Tìm xe để xem chi phí cho tất cả loại xăng</p>
              </div>
            </div>
            <button
              onClick={onBack}
              disabled={loading}
              className={`flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white transition-colors ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <ArrowLeft className="w-4 h-4" /> Quay lại
            </button>
          </div>

          <div className="space-y-8">
            <VehicleSearch
              loading={loading}
              label="Tìm Kiếm Loại Xe Hơi"
              placeholder="Nhập tên xe (ví dụ: Vios, Camry...)"
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

            <ComparisonTable
              loading={loading}
              selectedVehicles={selectedCars}
              comparisonFuels={comparisonFuels}
              toggleSelection={toggleCarSelection}
              maxVehicles={5}
              onAddMore={() => {
                carSearchRef.current?.focus();
                setShowCarResults(true);
                carSearchRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
