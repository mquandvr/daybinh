import React, { useState } from "react";
import { TrendingUp, TrendingDown, Info, X } from "lucide-react";
import { FuelData, FuelPrice } from "../../types";
import { UI_TEXT, MESSAGES } from "../../constants";
import { motion, AnimatePresence } from "motion/react";

interface FuelPriceListProps {
  loading?: boolean;
  fuelData: FuelData;
}

export default function FuelPriceList({
  loading,
  fuelData,
}: FuelPriceListProps) {
  const [showZoneModal, setShowZoneModal] = useState(false);

  const renderPriceChange = (change: number | undefined) => {
    if (!change || change === 0) return null;
    return (
      <div className={`flex items-center text-sm font-black leading-none ${
        change > 0 ? "text-rose-600" : "text-emerald-600"
      }`}>
        <span className="flex items-center mr-0.5">
          {change > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
        </span>
        {Math.abs(change).toLocaleString("vi-VN")}
      </div>
    );
  };

  const renderFuelCard = (fuel: FuelPrice, isPetrolimex: boolean) => (
    <div
      key={`${fuel.provider}-${fuel.name}`}
      className="flex flex-col gap-3 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm min-w-[220px] transition-all duration-300 hover:shadow-md"
    >
      <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
        {fuel.name}
      </div>
      
      <div className="space-y-3">
        {/* Zone 1 / PVOIL Price */}
        <div className="flex items-end justify-between gap-2">
          <div className="flex flex-col">
            {isPetrolimex && (
              <button 
                onClick={() => setShowZoneModal(true)}
                className="text-[8px] font-black bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded mb-1 w-fit hover:bg-blue-100 transition-colors flex items-center gap-1"
              >
                VÙNG I <Info className="w-2 h-2" />
              </button>
            )}
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-black text-gray-900 tracking-tighter leading-none">
                {fuel.price.toLocaleString("vi-VN")}
              </span>
              <span className="text-[8px] font-bold text-gray-400 uppercase leading-none">{MESSAGES.UNIT_VND_SHORT}</span>
            </div>
          </div>
          {renderPriceChange(fuel.change)}
        </div>

        {/* Zone 2 Price (Petrolimex only) */}
        {isPetrolimex && fuel.zone2_price && (
          <div className="pt-2 border-t border-gray-50 flex items-end justify-between gap-2">
            <div className="flex flex-col">
              <button 
                onClick={() => setShowZoneModal(true)}
                className="text-[8px] font-black bg-orange-50 text-orange-600 px-1.5 py-0.5 rounded mb-1 w-fit hover:bg-orange-100 transition-colors flex items-center gap-1"
              >
                VÙNG II <Info className="w-2 h-2" />
              </button>
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-black text-gray-900 tracking-tighter leading-none">
                  {fuel.zone2_price.toLocaleString("vi-VN")}
                </span>
                <span className="text-[8px] font-bold text-gray-400 uppercase leading-none">{MESSAGES.UNIT_VND_SHORT}</span>
              </div>
            </div>
            {renderPriceChange(fuel.change2)}
          </div>
        )}
      </div>
    </div>
  );

  const gasolinePetrolimex = fuelData.petrolimex.filter(
    (p) =>
      p.name.toLowerCase().includes("xăng") ||
      p.name.toLowerCase().includes("ron") ||
      p.name.toLowerCase().includes("e5")
  );
  const otherPetrolimex = fuelData.petrolimex.filter(
    (p) =>
      !p.name.toLowerCase().includes("xăng") &&
      !p.name.toLowerCase().includes("ron") &&
      !p.name.toLowerCase().includes("e5")
  );

  const gasolinePvoil = fuelData.pvoil.filter(
    (p) =>
      p.name.toLowerCase().includes("xăng") ||
      p.name.toLowerCase().includes("ron") ||
      p.name.toLowerCase().includes("e5")
  );
  const otherPvoil = fuelData.pvoil.filter(
    (p) =>
      !p.name.toLowerCase().includes("xăng") &&
      !p.name.toLowerCase().includes("ron") &&
      !p.name.toLowerCase().includes("e5")
  );

  const renderRow = (title: string, prices: FuelPrice[], isPetrolimex: boolean) => (
    <div className="space-y-2">
      <div className="flex items-center gap-2 px-1">
        <div className={`w-1 h-4 ${isPetrolimex ? 'bg-orange-600' : 'bg-blue-600'} rounded-full`} />
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
          {title}
        </h3>
      </div>
      <div className="w-full overflow-x-auto pb-2 scrollbar-hide">
        <div className="flex gap-3 min-w-max">
          {prices.map((fuel) => renderFuelCard(fuel, isPetrolimex))}
        </div>
      </div>
    </div>
  );

  return (
    <div className={`space-y-6 ${loading ? 'opacity-50 pointer-events-none' : ''}`}>
      {gasolinePetrolimex.length > 0 && renderRow("PETROLIMEX - XĂNG (VÙNG I & II)", gasolinePetrolimex, true)}
      {otherPetrolimex.length > 0 && renderRow("PETROLIMEX - DẦU & DO (VÙNG I & II)", otherPetrolimex, true)}
      
      {gasolinePvoil.length > 0 && renderRow("PVOIL - XĂNG", gasolinePvoil, false)}
      {otherPvoil.length > 0 && renderRow("PVOIL - DẦU & DO", otherPvoil, false)}

      {/* Zone Info Modal */}
      <AnimatePresence>
        {showZoneModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative bg-white rounded-3xl overflow-hidden max-w-2xl w-full shadow-2xl"
            >
              <button 
                onClick={() => setShowZoneModal(false)}
                className="absolute top-4 right-4 z-10 p-2 bg-white/80 backdrop-blur rounded-full shadow-lg hover:bg-white transition-colors"
              >
                <X className="w-5 h-5 text-gray-900" />
              </button>
              <div className="p-2">
                <img 
                  src="https://taynamswp.com/upload/filemanager/files/4-danh-sach-cac-tinh-thanh-thuoc-vung-1-vung-2(1).png"
                  alt="Phân vùng Petrolimex" 
                  className="w-full h-auto rounded-2xl"
                  onError={(e) => {
                    // Fallback if image fails
                    (e.target as HTMLImageElement).src = "https://picsum.photos/seed/vietnam-map/800/800";
                  }}
                />
              </div>
              <div className="p-6 text-center">
                <h3 className="text-lg font-bold">Phân vùng giá Petrolimex</h3>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
