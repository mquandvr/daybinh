import React from "react";
import { Trash2, Plus } from "lucide-react";
import { FuelPrice, BikeData } from "../../types";
import { BIKE_COLORS } from "../../constants";
import { formatCurrency } from "../../lib/utils";

interface ComparisonTableProps {
  loading?: boolean;
  selectedVehicles: BikeData[];
  comparisonFuels: FuelPrice[];
  toggleSelection: (vehicle: BikeData) => void;
  onAddMore: () => void;
  maxVehicles?: number;
}

export default function ComparisonTable({
  loading,
  selectedVehicles,
  comparisonFuels,
  toggleSelection,
  onAddMore,
  maxVehicles = 10,
}: ComparisonTableProps) {
  return (
    <div className={`space-y-4 ${loading ? 'opacity-50 pointer-events-none' : ''}`}>
      <div className="flex justify-between items-end">
        <label className="text-xs font-bold uppercase text-gray-400 tracking-widest">
          Bảng So Sánh Chi Phí (Dự Kiến)
        </label>
        <div className="text-[10px] text-gray-400 font-medium italic">
          * Đơn vị: VND
        </div>
      </div>

      <div className="overflow-x-auto -mx-6 sm:mx-0 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-md bg-white dark:bg-slate-900 transition-colors duration-300">
        <table className="w-full border-collapse min-w-[600px]">
          <thead>
            <tr className="bg-slate-100/50 dark:bg-slate-800/50">
              <th className="text-left py-4 pl-10 pr-6 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800 w-1/4">Tên Xe</th>
              {comparisonFuels.map((fuel) => (
                <th
                  key={fuel.name}
                  className="text-right py-4 px-6 border-b border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-300"
                >
                  <div className="flex flex-col items-end">
                    <span className="text-xs font-bold uppercase tracking-widest text-slate-600 dark:text-slate-300">{fuel.name}</span>
                    <span className="text-[10px] font-black text-slate-400 dark:text-slate-500">
                      {fuel.price.toLocaleString("vi-VN")}
                    </span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {selectedVehicles.map((vehicle, index) => (
              <tr key={vehicle.id} className="group transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/30">
                <td className="py-5 pl-10 pr-6 relative">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => !loading && toggleSelection(vehicle)}
                      disabled={loading}
                      className="opacity-20 group-hover:opacity-100 transition-all duration-300 absolute left-2 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-rose-50 dark:hover:bg-rose-900/30 text-slate-400 hover:text-rose-500 hover:scale-110 disabled:cursor-not-allowed"
                      title="Xoá xe"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                    <div className={`font-bold ${BIKE_COLORS[index % BIKE_COLORS.length].text} text-sm tracking-tight`}>{vehicle.name}</div>
                  </div>
                  <div className="inline-flex px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-md text-[9px] font-bold uppercase mt-1">
                    {vehicle.capacity} Lít
                  </div>
                </td>
                {comparisonFuels.map((fuel) => (
                  <td
                    key={fuel.name}
                    className="py-5 px-6 text-right transition-all duration-300"
                  >
                    <div className={`text-sm font-black tracking-tighter ${BIKE_COLORS[index % BIKE_COLORS.length].text}`}>
                      {formatCurrency(vehicle.capacity * fuel.price)}
                    </div>
                  </td>
                ))}
              </tr>
            ))}
            {selectedVehicles.length < maxVehicles && (
              <tr
                className={`cursor-pointer hover:bg-emerald-50/80 dark:hover:bg-emerald-900/20 transition-all group ${loading ? 'cursor-not-allowed opacity-50' : ''}`}
                onClick={() => !loading && onAddMore()}
              >
                <td
                  colSpan={comparisonFuels.length + 1}
                  className="py-8 pl-10 pr-6 italic text-slate-400 dark:text-slate-500 text-xs text-center font-medium bg-slate-50/20 dark:bg-slate-800/10"
                >
                  <div className="flex items-center justify-center gap-4">
                    <div className="w-8 h-8 rounded-full border-2 border-dashed border-slate-200 dark:border-slate-700 flex items-center justify-center group-hover:border-emerald-400 group-hover:bg-emerald-50 dark:group-hover:bg-emerald-900/30 group-hover:scale-110 transition-all duration-300">
                      <Plus className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-emerald-500" />
                    </div>
                    <span className="group-hover:text-emerald-600 dark:group-hover:text-emerald-400 group-hover:translate-x-1 transition-all duration-300 text-sm font-bold">
                      Chọn thêm (còn {maxVehicles - selectedVehicles.length})
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
}
