import React from "react";
import { Calculator } from "lucide-react";
import { FuelPrice, BikeData } from "../types";
import FuelPriceList from "./ui/FuelPriceList";
import TipCard from "./ui/TipCard";
import VehicleSearch from "./ui/VehicleSearch";
import ComparisonTable from "./ui/ComparisonTable";

interface MotorcycleTabProps {
  loading: boolean;
  fuelPrices: FuelPrice[];
  selectedFuel: FuelPrice | null;
  setSelectedFuel: (fuel: FuelPrice) => void;
  bikes: BikeData[];
  selectedBikes: BikeData[];
  toggleBikeSelection: (bike: BikeData) => void;
  bikeSearch: string;
  setBikeSearch: (search: string) => void;
  showBikeResults: boolean;
  setShowBikeResults: (show: boolean) => void;
  bikeSearchRef: React.RefObject<HTMLInputElement | null>;
  filteredBikes: BikeData[];
  comparisonFuels: FuelPrice[];
}

export default function BikeTab({
  loading,
  fuelPrices,
  selectedFuel,
  setSelectedFuel,
  selectedBikes,
  toggleBikeSelection,
  bikeSearch,
  setBikeSearch,
  showBikeResults,
  setShowBikeResults,
  bikeSearchRef,
  filteredBikes,
  comparisonFuels,
}: MotorcycleTabProps) {
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
          title="Mẹo tiết kiệm xăng"
          description="Duy trì tốc độ ổn định, kiểm tra áp suất lốp thường xuyên và bảo dưỡng định kỳ giúp xe của bạn tiết kiệm xăng hơn tới 15%."
        />
      </div>

      {/* Calculator Section (70% width on large screens) */}
      <div className="lg:col-span-7 space-y-6">
        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-800 p-6 sm:p-8 transition-colors duration-300">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-gray-900 dark:bg-slate-800 rounded-xl flex items-center justify-center">
              <Calculator className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold dark:text-white">Bảng Giá Đổ Đầy Bình</h2>
              <p className="text-sm text-gray-500 dark:text-slate-400">Tìm xe để xem chi phí cho tất cả loại xăng</p>
            </div>
          </div>

          <div className="space-y-8">
            <VehicleSearch
              loading={loading}
              label="Tìm Kiếm Loại Xe Máy"
              placeholder="Nhập tên xe (ví dụ: Vision, SH...)"
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

            <ComparisonTable
              loading={loading}
              selectedVehicles={selectedBikes}
              comparisonFuels={comparisonFuels}
              toggleSelection={toggleBikeSelection}
              onAddMore={() => {
                bikeSearchRef.current?.focus();
                setShowBikeResults(true);
                bikeSearchRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
