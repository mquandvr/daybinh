import React from "react";
import { Fuel, RefreshCw, Sun, Moon } from "lucide-react";
import { UI_TEXT, MESSAGES } from "../../constants";

interface HeaderProps {
  lastUpdated: string;
  fuelLoading: boolean;
  vehicleLoading: boolean;
  onRefresh: () => void;
}

export default function Header({
  lastUpdated,
  fuelLoading,
  vehicleLoading,
  onRefresh,
}: HeaderProps) {
  const loading = fuelLoading || vehicleLoading;

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-orange-600 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-200 rotate-3 hover:rotate-0 transition-transform duration-300">
              <Fuel className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tighter text-gray-900 uppercase italic">
                {UI_TEXT.APP_TITLE}
              </h1>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  {UI_TEXT.LAST_UPDATED}: {lastUpdated || MESSAGES.LOADING_PLACEHOLDER}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onRefresh}
              disabled={loading}
              className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 hover:bg-gray-800 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-gray-200 active:scale-95"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">{UI_TEXT.REFRESH_BUTTON}</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
