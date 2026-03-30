export const CONFIG = {
  MAX_BIKES: 10,
  MAX_CARS: 5,
  REFRESH_INTERVAL_MS: 300000, // 5 minutes
  LOADING_TIMEOUT_MS: 30000, // 30 seconds
  FUEL_PROVIDERS: {
    PETROLIMEX: "Petrolimex" as const,
    PVOIL: "PVOIL" as const,
  },
  FUEL_ZONES: {
    ZONE_1: 1 as const,
    ZONE_2: 2 as const,
  },
  FUEL_PROVIDERS_DATA: [
    { id: "petrolimex", value: "Petrolimex" as const, label: "PETROLIMEX" },
    { id: "pvoil", value: "PVOIL" as const, label: "PVOIL" },
  ],
  FUEL_ZONES_DATA: [
    { id: "zone1", value: 1 as const, label: "VÙNG 1" },
    { id: "zone2", value: 2 as const, label: "VÙNG 2" },
  ],
  GASOLINE_KEYWORDS: ["xăng", "ron", "e5"],
};
