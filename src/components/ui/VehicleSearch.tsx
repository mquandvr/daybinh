import React from "react";
import { RefreshCw, Bike, Car } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { VehicleData } from "../../types";
import { UI_TEXT } from "../../constants";

interface VehicleSearchProps {
  loading?: boolean;
  label: string;
  placeholder: string;
  searchValue: string;
  setSearchValue: (val: string) => void;
  showResults: boolean;
  setShowResults: (show: boolean) => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
  filteredVehicles: VehicleData[];
  selectedVehicles: VehicleData[];
  toggleSelection: (vehicle: VehicleData) => void;
  type: "motorcycle" | "car";
}

export default function VehicleSearch({
  loading,
  label,
  placeholder,
  searchValue,
  setSearchValue,
  showResults,
  setShowResults,
  inputRef,
  filteredVehicles,
  selectedVehicles,
  toggleSelection,
  type,
}: VehicleSearchProps) {
  const Icon = type === "motorcycle" ? Bike : Car;

  return (
    <div className={`space-y-3 relative ${loading ? 'opacity-50 pointer-events-none' : ''}`}>
      <label className="text-xs font-bold uppercase text-gray-400 tracking-widest">
        {label}
      </label>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          disabled={loading}
          placeholder={placeholder}
          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-slate-500/20 focus:border-slate-500 transition-all font-medium disabled:cursor-not-allowed"
          value={searchValue}
          onChange={(e) => {
            setSearchValue(e.target.value);
            setShowResults(true);
          }}
          onFocus={() => setShowResults(true)}
        />
        {searchValue && !loading && (
          <button
            onClick={() => {
              setSearchValue("");
              setShowResults(false);
            }}
            className="absolute right-10 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-200 rounded-full transition-colors"
            title={UI_TEXT.ACTION_DELETE}
          >
            <RefreshCw className="w-4 h-4 text-gray-400 rotate-45" />
          </button>
        )}
        <Icon className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
      </div>

      {/* Search Results Dropdown */}
      <AnimatePresence>
        {showResults && filteredVehicles.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            className="absolute z-20 w-full mt-2 bg-white border border-gray-100 rounded-xl shadow-xl max-h-60 overflow-y-auto"
          >
            {filteredVehicles.map((vehicle) => {
              const isSelected = selectedVehicles.some(v => v.id === vehicle.id);
              return (
                <button
                  key={vehicle.id}
                  className={`w-full text-left px-4 py-3 transition-colors border-b border-gray-50 last:border-0 flex justify-between items-center ${
                    isSelected ? "bg-slate-100" : "hover:bg-slate-50"
                  }`}
                  onClick={() => toggleSelection(vehicle)}
                >
                  <div className="flex items-center gap-2">
                    <span className={`font-bold ${isSelected ? "text-slate-900" : "text-gray-700"}`}>{vehicle.name}</span>
                    {isSelected && <div className="w-1.5 h-1.5 bg-slate-900 rounded-full" />}
                  </div>
                  <div className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded-md text-[10px] font-black uppercase">
                    {vehicle.capacity} {UI_TEXT.UNIT_LITRE}
                  </div>
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay to close dropdown */}
      {showResults && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => setShowResults(false)}
        />
      )}
    </div>
  );
}
