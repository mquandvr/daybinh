import { memo, useMemo, useCallback } from "react";
import { Calculator, Plus } from "lucide-react";
import { FuelState, VehicleSelectionState, VehicleData } from "@/types";
import { FuelPriceList, VehicleSearch, ComparisonTable } from "@/components/ui";
import { MESSAGES, UI_TEXT } from "@/constants/index";

interface VehicleTabProps {
  fuel: FuelState;
  vehicles: {
    loading: boolean;
    bike: VehicleSelectionState;
    car: VehicleSelectionState;
  };
}

export const VehicleTab = memo(({
  fuel,
  vehicles,
}: VehicleTabProps) => {
  const selectedVehiclesList = useMemo(() => 
    [...vehicles.bike.selected, ...vehicles.car.selected],
    [vehicles.bike.selected, vehicles.car.selected]
  );

  const handleToggleVehicle = useCallback((vehicle: VehicleData) => {
    if (vehicle.type === "motorcycle") vehicles.bike.toggle(vehicle);
    else vehicles.car.toggle(vehicle);
  }, [vehicles.bike, vehicles.car]);

  const handleFocusSearch = useCallback(() => {
    vehicles.bike.search.ref.current?.focus();
    vehicles.bike.search.setShowResults(true);
    vehicles.bike.search.ref.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [vehicles.bike.search]);

  const memoizedProviderState = useMemo(() => ({
    selected: fuel.selectedProvider,
    setSelected: fuel.setSelectedProvider
  }), [fuel.selectedProvider, fuel.setSelectedProvider]);

  const memoizedZoneState = useMemo(() => ({
    selected: fuel.selectedZone,
    setSelected: fuel.setSelectedZone
  }), [fuel.selectedZone, fuel.setSelectedZone]);

  return (
    <div className="space-y-8">
      {/* Fuel Prices Section */}
      <FuelPriceList
        loading={fuel.loading}
        fuelData={fuel.data}
      />

      {/* Calculator Section */}
      <div className="card-base p-6 sm:p-8">
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            <VehicleSearch
              loading={vehicles.loading}
              label={MESSAGES.SEARCH_LABEL_BIKE}
              placeholder={MESSAGES.SEARCH_PLACEHOLDER_BIKE}
              search={vehicles.bike.search}
              selectedVehicles={vehicles.bike.selected}
              toggleSelection={vehicles.bike.toggle}
              type="motorcycle"
            />

            <VehicleSearch
              loading={vehicles.loading}
              label={MESSAGES.SEARCH_LABEL_CAR}
              placeholder={MESSAGES.SEARCH_PLACEHOLDER_CAR}
              search={vehicles.car.search}
              selectedVehicles={vehicles.car.selected}
              toggleSelection={vehicles.car.toggle}
              type="car"
            />
          </div>

          {/* Comparison Table Section - 100% Width */}
          <div className="w-full min-w-0">
            {selectedVehiclesList.length > 0 ? (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <ComparisonTable
                  loading={vehicles.loading}
                  selectedVehicles={selectedVehiclesList}
                  comparisonFuels={fuel.comparisonFuels}
                  provider={memoizedProviderState}
                  zone={memoizedZoneState}
                  toggleSelection={handleToggleVehicle}
                  onAddMore={handleFocusSearch}
                />
              </div>
            ) : (
              <button
                onClick={handleFocusSearch}
                className="w-full h-full flex flex-col items-center justify-center p-12 border-2 border-dashed border-gray-100 rounded-3xl text-gray-400 font-medium gap-4 bg-slate-50/10 hover:bg-emerald-50/30 hover:border-emerald-200 hover:text-emerald-600 transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-full border-2 border-dashed border-slate-200 flex items-center justify-center group-hover:border-emerald-400 group-hover:bg-emerald-50 group-hover:scale-110 transition-all duration-300">
                  <Plus className="w-6 h-6 text-slate-300 group-hover:text-emerald-500" />
                </div>
                <div className="text-center group-hover:font-bold transition-all">{MESSAGES.NO_VEHICLE_SELECTED}</div>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});
