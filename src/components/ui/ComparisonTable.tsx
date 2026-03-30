import { memo } from "react";
import { Trash2, Plus, Bike, Car, MapPin, Fuel } from "lucide-react";
import { FuelPrice, VehicleData, ProviderSelectionState, ZoneSelectionState } from "@/types";
import { BIKE_COLORS, UI_TEXT, CONFIG } from "@/constants/index";
import { formatCurrency, calculateFuelCost } from "@/lib";

interface ComparisonTableProps {
  loading?: boolean;
  selectedVehicles: VehicleData[];
  comparisonFuels: FuelPrice[];
  toggleSelection: (vehicle: VehicleData) => void;
  onAddMore: () => void;
  maxVehicles?: number;
  provider: ProviderSelectionState;
  zone: ZoneSelectionState;
}

const TableHeader = memo(({ comparisonFuels }: { comparisonFuels: FuelPrice[] }) => (
  <thead>
    <tr className="bg-slate-100/50">
      <th className="text-left py-4 pl-10 pr-6 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200 w-1/4">
        {UI_TEXT.TABLE_COL_VEHICLE_NAME}
      </th>
      {comparisonFuels.map((fuel) => (
        <th
          key={fuel.name}
          className="text-right py-4 px-6 border-b border-slate-200 text-slate-400 hover:bg-slate-100 transition-all duration-300"
        >
          <div className="flex flex-col items-end">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-600">{fuel.name}</span>
            <span className="text-[10px] font-black text-slate-400">
              {fuel.price.toLocaleString("vi-VN")}
            </span>
          </div>
        </th>
      ))}
    </tr>
  </thead>
));

const VehicleRow = memo(({ 
  vehicle, 
  index, 
  comparisonFuels, 
  loading, 
  toggleSelection 
}: { 
  vehicle: VehicleData, 
  index: number, 
  comparisonFuels: FuelPrice[], 
  loading: boolean, 
  toggleSelection: (v: VehicleData) => void 
}) => {
  const color = BIKE_COLORS[index % BIKE_COLORS.length];
  
  return (
    <tr className="group transition-colors hover:bg-slate-50">
      <td className="py-5 pl-10 pr-6 relative">
        <div className="flex items-center gap-3">
          <button
            onClick={() => !loading && toggleSelection(vehicle)}
            disabled={loading}
            className="opacity-20 group-hover:opacity-100 transition-all duration-300 absolute left-2 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-rose-50 text-slate-400 hover:text-rose-500 hover:scale-110 disabled:cursor-not-allowed"
            title={UI_TEXT.ACTION_DELETE_VEHICLE}
          >
            <Trash2 className="w-3 h-3" />
          </button>
          <div className="flex items-center gap-2">
            {vehicle.type === "motorcycle" ? (
              <Bike className="w-4 h-4 text-slate-800" />
            ) : (
              <Car className="w-4 h-4 text-slate-800" />
            )}
            <div className={`font-bold ${color.text} text-sm tracking-tight`}>{vehicle.name}</div>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-1.5 ml-5.5">
          <div className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider shadow-sm ${color.bg} text-white`}>
            {vehicle.capacity} {UI_TEXT.UNIT_LITRE}
          </div>
        </div>
      </td>
      {comparisonFuels.map((fuel) => (
        <td
          key={fuel.name}
          className="py-5 px-6 text-right transition-all duration-300"
        >
          <div className={`text-sm font-black tracking-tighter ${color.text}`}>
            {formatCurrency(calculateFuelCost(vehicle.capacity, fuel.price))}
          </div>
        </td>
      ))}
    </tr>
  );
});

export const ComparisonTable = memo(({
  loading,
  selectedVehicles,
  comparisonFuels,
  toggleSelection,
  onAddMore,
  maxVehicles = 10,
  provider,
  zone,
}: ComparisonTableProps) => {
  return (
    <div className={`space-y-4 ${loading ? 'opacity-50 pointer-events-none' : ''}`}>
      <div className="flex flex-col sm:flex-row justify-between items-end gap-4 min-h-[120px] sm:min-h-[64px]">
        <div className="flex flex-wrap gap-3 items-end">
          {/* Provider Selection */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest flex items-center gap-1">
              <Fuel className="w-3 h-3" /> {UI_TEXT.LABEL_FUEL_PROVIDER}
            </label>
            <div className="flex p-1 bg-gray-100 rounded-xl">
              {CONFIG.FUEL_PROVIDERS_DATA.map((p) => (
                <button
                  key={p.id}
                  onClick={() => provider.setSelected(p.value)}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-black transition-all duration-300 ${
                    provider.selected === p.value
                      ? `bg-white ${p.value === CONFIG.FUEL_PROVIDERS.PETROLIMEX ? 'text-orange-600' : 'text-blue-600'} shadow-sm`
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Zone Selection (Petrolimex only) */}
          {provider.selected === CONFIG.FUEL_PROVIDERS.PETROLIMEX && (
            <div className="flex flex-col gap-1.5 animate-in fade-in slide-in-from-left-2 duration-300">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest flex items-center gap-1">
                <MapPin className="w-3 h-3" /> {UI_TEXT.LABEL_PRICE_ZONE}
              </label>
              <div className="flex p-1 bg-gray-100 rounded-xl">
                {CONFIG.FUEL_ZONES_DATA.map((z) => (
                  <button
                    key={z.id}
                    onClick={() => zone.setSelected(z.value)}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-black transition-all duration-300 ${
                      zone.selected === z.value
                        ? `bg-white ${z.value === CONFIG.FUEL_ZONES.ZONE_1 ? 'text-blue-600' : 'text-orange-600'} shadow-sm`
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {z.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="text-[10px] text-gray-400 font-medium italic self-end">
          {UI_TEXT.COMPARE_TABLE_UNIT}
        </div>
      </div>

      <div className="overflow-x-auto -mx-6 sm:mx-0 border border-slate-200 rounded-2xl shadow-md bg-white transition-colors duration-300">
        <table className="w-full border-collapse min-w-[600px]">
          <TableHeader comparisonFuels={comparisonFuels} />
          <tbody className="divide-y divide-slate-100">
            {selectedVehicles.map((vehicle, index) => (
              <VehicleRow 
                key={`${vehicle.type}-${vehicle.id}`}
                vehicle={vehicle}
                index={index}
                comparisonFuels={comparisonFuels}
                loading={!!loading}
                toggleSelection={toggleSelection}
              />
            ))}
            {selectedVehicles.length < maxVehicles && (
              <tr
                className={`cursor-pointer hover:bg-emerald-50/80 transition-all group ${loading ? 'cursor-not-allowed opacity-50' : ''}`}
                onClick={() => !loading && onAddMore()}
              >
                <td
                  colSpan={comparisonFuels.length + 1}
                  className="py-8 pl-10 pr-6 italic text-slate-400 text-xs text-center font-medium bg-slate-50/20"
                >
                  <div className="flex items-center justify-center gap-4">
                    <div className="w-8 h-8 rounded-full border-2 border-dashed border-slate-200 flex items-center justify-center group-hover:border-emerald-400 group-hover:bg-emerald-50 group-hover:scale-110 transition-all duration-300">
                      <span className="group-hover:text-emerald-500">
                        <Plus className="w-4 h-4 text-slate-300 group-hover:text-emerald-500" />
                      </span>
                    </div>
                    <span className="group-hover:text-emerald-600 group-hover:translate-x-1 transition-all duration-300 text-sm font-bold">
                      {UI_TEXT.ACTION_ADD_MORE(maxVehicles - selectedVehicles.length)}
                    </span>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
});
