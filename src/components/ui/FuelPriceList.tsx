import { useState, useMemo, memo } from "react";
import { TrendingUp, TrendingDown, Info, X } from "lucide-react";
import { FuelData, FuelPrice } from "@/types";
import { MESSAGES, CONFIG, UI_TEXT, API_ENDPOINTS } from "@/constants/index";
import { motion, AnimatePresence } from "motion/react";
import { filterFuelByType } from "@/lib";

interface FuelPriceListProps {
  loading?: boolean;
  fuelData: FuelData;
}

const PriceChange = memo(({ change }: { change: number | undefined }) => {
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
});

const FuelCard = memo(({ fuel, isPetrolimex, onShowZoneModal }: { fuel: FuelPrice, isPetrolimex: boolean, onShowZoneModal: () => void }) => (
  <div
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
              onClick={onShowZoneModal}
              className="text-[8px] font-black bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded mb-1 w-fit hover:bg-blue-100 transition-colors flex items-center gap-1"
            >
              {UI_TEXT.LABEL_ZONE_PREFIX} {CONFIG.FUEL_ZONES.ZONE_1} <Info className="w-2 h-2" />
            </button>
          )}
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-black text-gray-900 tracking-tighter leading-none">
              {fuel.price.toLocaleString("vi-VN")}
            </span>
            <span className="text-[8px] font-bold text-gray-400 uppercase leading-none">{MESSAGES.UNIT_VND_SHORT}</span>
          </div>
        </div>
        <PriceChange change={fuel.change} />
      </div>

      {/* Zone 2 Price (Petrolimex only) */}
      {isPetrolimex && fuel.zone2_price && (
        <div className="pt-2 border-t border-gray-50 flex items-end justify-between gap-2">
          <div className="flex flex-col">
            <button 
              onClick={onShowZoneModal}
              className="text-[8px] font-black bg-orange-50 text-orange-600 px-1.5 py-0.5 rounded mb-1 w-fit hover:bg-orange-100 transition-colors flex items-center gap-1"
            >
              {UI_TEXT.LABEL_ZONE_PREFIX} {CONFIG.FUEL_ZONES.ZONE_2} <Info className="w-2 h-2" />
            </button>
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-black text-gray-900 tracking-tighter leading-none">
                {fuel.zone2_price.toLocaleString("vi-VN")}
              </span>
              <span className="text-[8px] font-bold text-gray-400 uppercase leading-none">{MESSAGES.UNIT_VND_SHORT}</span>
            </div>
          </div>
          <PriceChange change={fuel.change2} />
        </div>
      )}
    </div>
  </div>
));

const FuelRow = memo(({ title, prices, isPetrolimex, onShowZoneModal }: { title: string, prices: FuelPrice[], isPetrolimex: boolean, onShowZoneModal: () => void }) => (
  <div className="space-y-2">
    <div className="flex items-center gap-2 px-1">
      <div className={`w-1 h-4 ${isPetrolimex ? 'bg-orange-600' : 'bg-blue-600'} rounded-full`} />
      <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
        {title}
      </h3>
    </div>
    <div className="w-full overflow-x-auto pb-2 scrollbar-hide">
      <div className="flex gap-3 min-w-max">
        {prices.map((fuel) => (
          <FuelCard 
            key={`${fuel.provider}-${fuel.name}`} 
            fuel={fuel} 
            isPetrolimex={isPetrolimex} 
            onShowZoneModal={onShowZoneModal} 
          />
        ))}
      </div>
    </div>
  </div>
));

export const FuelPriceList = memo(({
  loading,
  fuelData,
}: FuelPriceListProps) => {
  const [showZoneModal, setShowZoneModal] = useState(false);

  const providers = useMemo(() => [
    { 
      data: fuelData.petrolimex, 
      name: CONFIG.FUEL_PROVIDERS.PETROLIMEX, 
      isPetrolimex: true,
      zones: `(${UI_TEXT.LABEL_ZONE_PREFIX} ${CONFIG.FUEL_ZONES.ZONE_1} & ${CONFIG.FUEL_ZONES.ZONE_2})`
    },
    { 
      data: fuelData.pvoil, 
      name: CONFIG.FUEL_PROVIDERS.PVOIL, 
      isPetrolimex: false,
      zones: ""
    }
  ], [fuelData]);

  const providerRows = useMemo(() => {
    return providers.map(provider => {
      const gasoline = filterFuelByType(provider.data, true);
      const other = filterFuelByType(provider.data, false);
      
      return {
        provider,
        gasoline,
        other
      };
    });
  }, [providers]);

  return (
    <div className={`space-y-6 ${loading ? 'opacity-50 pointer-events-none' : ''}`}>
      {providerRows.map(({ provider, gasoline, other }) => (
        <div key={provider.name} className="space-y-6">
          {gasoline.length > 0 && (
            <FuelRow 
              title={`${provider.name.toUpperCase()} - ${UI_TEXT.FUEL_SECTION_GAS.toUpperCase()} ${provider.zones}`} 
              prices={gasoline} 
              isPetrolimex={provider.isPetrolimex} 
              onShowZoneModal={() => setShowZoneModal(true)}
            />
          )}
          {other.length > 0 && (
            <FuelRow 
              title={`${provider.name.toUpperCase()} - ${UI_TEXT.FUEL_SECTION_OTHER.toUpperCase()} ${provider.zones}`} 
              prices={other} 
              isPetrolimex={provider.isPetrolimex} 
              onShowZoneModal={() => setShowZoneModal(true)}
            />
          )}
        </div>
      ))}

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
                  src={API_ENDPOINTS.PETROLIMEX_ZONE_MAP}
                  alt={UI_TEXT.ZONE_MODAL_ALT} 
                  className="w-full h-auto rounded-2xl"
                  loading="lazy"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = API_ENDPOINTS.FALLBACK_MAP;
                  }}
                />
              </div>
              <div className="p-6 text-center">
                <h3 className="text-lg font-bold">{UI_TEXT.ZONE_MODAL_TITLE}</h3>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
});
