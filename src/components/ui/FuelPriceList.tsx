import React from "react";
import { Info, TrendingUp, TrendingDown } from "lucide-react";
import { FuelPrice } from "../../types";

interface FuelPriceListProps {
  loading?: boolean;
  fuelPrices: FuelPrice[];
  selectedFuel: FuelPrice | null;
  setSelectedFuel: (fuel: FuelPrice) => void;
}

export default function FuelPriceList({
  loading,
  fuelPrices,
  selectedFuel,
  setSelectedFuel,
}: FuelPriceListProps) {
  return (
    <div className={`space-y-4 ${loading ? 'opacity-50 pointer-events-none' : ''}`}>
      <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-slate-400 flex items-center gap-2">
        <Info className="w-4 h-4" /> Giá Xăng Hôm Nay
      </h2>
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 overflow-hidden transition-colors duration-300">
        {fuelPrices.map((fuel) => (
          <button
            key={fuel.name}
            disabled={loading}
            onClick={() => setSelectedFuel(fuel)}
            className={`w-full text-left p-3 border-b border-gray-50 dark:border-slate-800 last:border-0 transition-all ${
              selectedFuel?.name === fuel.name
                ? "bg-slate-50 dark:bg-slate-800 border-l-4 border-l-slate-900 dark:border-l-white"
                : "hover:bg-gray-50 dark:hover:bg-slate-800/50 border-l-4 border-l-transparent"
            } ${loading ? 'cursor-not-allowed' : ''}`}
          >
            <div className="flex flex-col gap-1">
              <div className="flex justify-between items-baseline">
                <span className={`font-bold ${selectedFuel?.name === fuel.name ? "text-slate-900 dark:text-white" : "text-slate-600 dark:text-slate-400"}`}>{fuel.name}</span>
                <span className="font-black text-slate-900 dark:text-white text-lg leading-none">
                  {fuel.price.toLocaleString("vi-VN")}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <div className="text-[10px] text-slate-400 dark:text-slate-500 font-black uppercase leading-none">VND / Lít</div>
                <div className={`flex items-center px-1.5 py-0.5 rounded-md text-[10px] font-black min-h-[18px] ${
                  fuel.change === 0
                    ? "invisible"
                    : fuel.change! > 0
                      ? "bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-900/50"
                      : "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/50"
                }`}>
                  {fuel.change! > 0 ? <TrendingUp className="w-3 h-3 mr-0.5" /> : fuel.change! < 0 ? <TrendingDown className="w-3 h-3 mr-0.5" /> : null}
                  {fuel.change !== 0 ? Math.abs(fuel.change!).toLocaleString("vi-VN") : "0"}
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
