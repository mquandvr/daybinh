import { useMemo, useCallback } from "react";
import { motion } from "motion/react";
import { VehicleTab, Header, Footer } from "@/components";
import { MESSAGES, CONFIG } from "@/constants/index";
import { useFuelData, useVehicleSelection } from "@/hooks";
import { isGasoline } from "@/lib";

export default function App() {
  const fuelDataState = useFuelData();
  const vehicleSelectionState = useVehicleSelection();

  const comparisonFuels = useMemo(() => {
    const prices = fuelDataState.selectedProvider === CONFIG.FUEL_PROVIDERS.PETROLIMEX ? fuelDataState.data.petrolimex : fuelDataState.data.pvoil;
    return prices.filter(p => isGasoline(p.name)).map(p => {
      if (fuelDataState.selectedProvider === CONFIG.FUEL_PROVIDERS.PETROLIMEX && fuelDataState.selectedZone === CONFIG.FUEL_ZONES.ZONE_2 && p.zone2_price !== undefined) {
        return {
          ...p,
          price: p.zone2_price,
          change: p.change2
        };
      }
      return p;
    });
  }, [fuelDataState.data, fuelDataState.selectedProvider, fuelDataState.selectedZone]);

  const refreshAllData = useCallback(() => {
    fuelDataState.refresh();
    vehicleSelectionState.refresh();
  }, [fuelDataState, vehicleSelectionState]);

  const memoizedFuelState = useMemo(() => ({
    loading: fuelDataState.loading,
    data: fuelDataState.data,
    selectedProvider: fuelDataState.selectedProvider,
    setSelectedProvider: fuelDataState.setSelectedProvider,
    selectedZone: fuelDataState.selectedZone,
    setSelectedZone: fuelDataState.setSelectedZone,
    comparisonFuels
  }), [fuelDataState.loading, fuelDataState.data, fuelDataState.selectedProvider, fuelDataState.setSelectedProvider, fuelDataState.selectedZone, fuelDataState.setSelectedZone, comparisonFuels]);

  const memoizedVehicleState = useMemo(() => ({
    loading: vehicleSelectionState.loading,
    bike: vehicleSelectionState.bike,
    car: vehicleSelectionState.car
  }), [vehicleSelectionState.loading, vehicleSelectionState.bike, vehicleSelectionState.car]);

  const isInitialLoading = fuelDataState.loading && fuelDataState.data.petrolimex.length === 0 && vehicleSelectionState.loading && vehicleSelectionState.bike.all.length === 0;

  if (isInitialLoading) {
    return (
      <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="w-12 h-12 border-4 border-orange-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">{MESSAGES.LOADING_DATA}</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5] text-[#1A1A1A] font-sans selection:bg-orange-100 transition-colors duration-300">
      <Header 
        lastUpdated={fuelDataState.lastUpdated}
        fuelLoading={fuelDataState.loading}
        vehicleLoading={vehicleSelectionState.loading}
        isDummy={fuelDataState.isDummy}
        onRefresh={refreshAllData}
      />

      <main className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6 relative">
        {(fuelDataState.loading || vehicleSelectionState.loading) && (fuelDataState.data.petrolimex.length > 0 || vehicleSelectionState.bike.all.length > 0) && (
          <div className="fixed bottom-6 right-6 z-50">
            <div className="bg-white px-4 py-2 rounded-full shadow-2xl border border-gray-100 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className="w-4 h-4 border-2 border-orange-600 border-t-transparent rounded-full animate-spin" />
              <span className="text-xs font-bold text-gray-700">{MESSAGES.UPDATING_DATA}</span>
            </div>
          </div>
        )}

        <VehicleTab
          fuel={memoizedFuelState}
          vehicles={memoizedVehicleState}
        />
      </main>

      <Footer />
    </div>
  );
}
