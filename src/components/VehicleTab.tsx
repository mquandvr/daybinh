import { Calculator } from "lucide-react";
import { FuelState, VehicleSelectionState } from "@/types";
import { FuelPriceList, VehicleSearch, ComparisonTable } from "@/components/ui";
import { MESSAGES, UI_TEXT } from "@/constants";

interface VehicleTabProps {
  fuel: FuelState;
  vehicles: {
    loading: boolean;
    bike: VehicleSelectionState;
    car: VehicleSelectionState;
  };
}

export function VehicleTab({
  fuel,
  vehicles,
}: VehicleTabProps) {
  const allSelected = [...vehicles.bike.selected, ...vehicles.car.selected];

  return (
    <div className="space-y-8">
      {/* Fuel Prices Section */}
      <FuelPriceList
        loading={fuel.loading}
        fuelData={fuel.data}
      />

      {/* Calculator Section */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sm:p-8 transition-colors duration-300">
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            {allSelected.length > 0 ? (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <ComparisonTable
                  loading={vehicles.loading}
                  selectedVehicles={allSelected}
                  comparisonFuels={fuel.comparisonFuels}
                  provider={{
                    selected: fuel.selectedProvider,
                    setSelected: fuel.setSelectedProvider
                  }}
                  zone={{
                    selected: fuel.selectedZone,
                    setSelected: fuel.setSelectedZone
                  }}
                  toggleSelection={(vehicle) => {
                    if (vehicle.type === "motorcycle") vehicles.bike.toggle(vehicle);
                    else vehicles.car.toggle(vehicle);
                  }}
                  onAddMore={() => {
                    // Default to bike search focus if adding more
                    vehicles.bike.search.ref.current?.focus();
                    vehicles.bike.search.setShowResults(true);
                    vehicles.bike.search.ref.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  }}
                />
              </div>
            ) : (
              <div className="h-full flex items-center justify-center p-12 border-2 border-dashed border-gray-100 rounded-3xl text-gray-400 font-medium">
                {MESSAGES.NO_VEHICLE_SELECTED}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
