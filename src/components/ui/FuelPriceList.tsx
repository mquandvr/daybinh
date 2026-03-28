import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { FuelPrice } from "../../types";
import { UI_TEXT, MESSAGES } from "../../constants";

interface FuelPriceListProps {
  loading?: boolean;
  fuelPrices: FuelPrice[];
}

export default function FuelPriceList({
  loading,
  fuelPrices,
}: FuelPriceListProps) {
  const gasolinePrices = fuelPrices.filter(
    (p) =>
      p.name.toLowerCase().includes("xăng") ||
      p.name.toLowerCase().includes("ron") ||
      p.name.toLowerCase().includes("e5")
  );
  
  const otherPrices = fuelPrices.filter(
    (p) =>
      p.name.toLowerCase().includes("do") ||
      p.name.toLowerCase().includes("dầu") ||
      p.name.toLowerCase().includes("ko")
  );

  const renderRow = (title: string, prices: FuelPrice[]) => (
    <div className="space-y-2">
      <div className="flex items-center gap-2 px-1">
        <div className="w-1 h-4 bg-orange-600 rounded-full" />
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
          {title}
        </h3>
      </div>
      <div className="w-full overflow-x-auto pb-2 scrollbar-hide">
        <div className="flex gap-3 min-w-max">
          {prices.map((fuel) => (
            <div
              key={fuel.name}
              className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm min-w-[200px] transition-all duration-300 hover:shadow-md"
            >
              <div className="flex-1">
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                  {fuel.name}
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-lg font-black text-gray-900 tracking-tighter">
                    {fuel.price.toLocaleString("vi-VN")}
                  </span>
                  <span className="text-[8px] font-bold text-gray-400 uppercase">{MESSAGES.UNIT_VND_SHORT}</span>
                </div>
              </div>
              
              {fuel.change !== 0 && (
                <div className={`flex items-center text-[11px] font-black px-2 py-1.5 rounded-lg shadow-sm ${
                  fuel.change! > 0 
                    ? "bg-rose-50 text-rose-600" 
                    : "bg-emerald-50 text-emerald-600"
                }`}>
                  {fuel.change! > 0 ? <TrendingUp className="w-3.5 h-3.5 mr-0.5" /> : <TrendingDown className="w-3.5 h-3.5 mr-0.5" />}
                  {Math.abs(fuel.change!).toLocaleString("vi-VN")}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className={`space-y-6 ${loading ? 'opacity-50 pointer-events-none' : ''}`}>
      {gasolinePrices.length > 0 && renderRow(UI_TEXT.FUEL_SECTION_GAS, gasolinePrices)}
      {otherPrices.length > 0 && renderRow(UI_TEXT.FUEL_SECTION_OTHER, otherPrices)}
    </div>
  );
}
