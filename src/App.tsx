import { useMemo } from "react";
import { motion } from "motion/react";
import { VehicleTab, Header, Footer } from "@/components";
import { MESSAGES } from "@/constants";
import { useFuelData, useVehicleSelection } from "@/hooks";

export default function App() {
  const fuel = useFuelData();
  const vehicles = useVehicleSelection();

  const comparisonFuels = useMemo(() => {
    const prices = fuel.selectedProvider === "Petrolimex" ? fuel.data.petrolimex : fuel.data.pvoil;
    return prices.filter(p => {
      const name = p.name.toLowerCase();
      return !(name.includes(MESSAGES.FILTER_KEROSENE) || name.includes(MESSAGES.FILTER_DIESEL));
    }).map(p => {
      if (fuel.selectedProvider === "Petrolimex" && fuel.selectedZone === 2 && p.zone2_price !== undefined) {
        return {
          ...p,
          price: p.zone2_price,
          change: p.change2
        };
      }
      return p;
    });
  }, [fuel.data, fuel.selectedProvider, fuel.selectedZone]);

  const isInitialLoading = fuel.loading && fuel.data.petrolimex.length === 0 && vehicles.loading && vehicles.bike.all.length === 0;

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
        lastUpdated={fuel.lastUpdated}
        fuelLoading={fuel.loading}
        vehicleLoading={vehicles.loading}
        isDummy={fuel.isDummy}
        onRefresh={() => {
          fuel.refresh();
          vehicles.refresh();
        }}
      />

      <main className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6 relative">
        {(fuel.loading || vehicles.loading) && (fuel.data.petrolimex.length > 0 || vehicles.bike.all.length > 0) && (
          <div className="fixed bottom-6 right-6 z-50">
            <div className="bg-white px-4 py-2 rounded-full shadow-2xl border border-gray-100 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className="w-4 h-4 border-2 border-orange-600 border-t-transparent rounded-full animate-spin" />
              <span className="text-xs font-bold text-gray-700">{MESSAGES.UPDATING_DATA}</span>
            </div>
          </div>
        )}

        <VehicleTab
          fuel={{
            loading: fuel.loading,
            data: fuel.data,
            selectedProvider: fuel.selectedProvider,
            setSelectedProvider: fuel.setSelectedProvider,
            selectedZone: fuel.selectedZone,
            setSelectedZone: fuel.setSelectedZone,
            comparisonFuels
          }}
          vehicles={{
            loading: vehicles.loading,
            bike: vehicles.bike,
            car: vehicles.car
          }}
        />
      </main>

      <Footer />
    </div>
  );
}
