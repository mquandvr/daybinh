# Business Logic Documentation - Đầy Bình

The "Đầy Bình" application helps users calculate the cost of filling up their fuel tanks for motorcycles and cars based on real-time fuel price updates.

## 1. Fuel Price Data
- **Data Source:** Fetched from the API `https://giaxanghomnay.com/api/pvdate/{today}`.
- **API Structure:** Returns 4 arrays `[[arr1], [arr2], [arr3], [arr4]]`.
    - `arr1`: Fuel price data for the current date.
    - `arr3`: Most recent adjusted fuel price data (fallback if `arr1` is empty).
    - Arrays `arr2` and `arr4` are ignored.
- **Data Processing:**
    - Calculates the price change (`change`) by comparing the current price (`arr1`) with the most recent adjusted price (`arr3`).
    - Categorizes fuel into 2 groups: "Gasoline" and "Kerosene & DO".

## 2. Vehicle Data
- **Motorcycles:** Fetched from the proxy API `/api/proxy/vehicles` (VnExpress source) combined with `dummy_motorcycles.json` to ensure availability.
- **Cars:** Uses `dummy_cars.json` data integrated into the source code.
- **Fuel Capacity:** Extracted from the `fuel_tank` field of the vehicle data or taken directly from dummy data.

## 3. Cost Calculation
- **Formula:** `Cost = Fuel Tank Capacity (Liters) * Fuel Price (VND/Liter)`.
- **Comparison Table:** Displays the cost of filling the tank for each selected vehicle against all common fuel types (RON 95-V, RON 95-III, E5 RON 92-II, etc.). The comparison table supports displaying up to 10 motorcycles and 5 cars simultaneously.

## 4. UI & User Experience
- **Light Mode:** The application exclusively uses a Light Mode interface.
- **Search:** Users can search for motorcycles and cars simultaneously through two separate search inputs (50/50 split).
- **Colors:** Uses standard Google colors (Blue, Red, Yellow, Green) to distinguish vehicles in the comparison table.
- **Storage:** The list of selected vehicles is saved to `localStorage` to persist state across page reloads.
- **Auto-Update:** Data is automatically refreshed every 5 minutes.

## 5. Source Code Structure & Constants
- **Constants:** All messages (`MESSAGES`), UI text (`UI_TEXT`), API endpoints (`API_ENDPOINTS`), and application configuration (`CONFIG`) are centralized in `src/constants.ts`.
- **Utils:** Common functions for cost calculation (`calculateFuelCost`), currency formatting (`formatCurrency`), data validation (`validateArray`), and fuel capacity parsing (`parseFuelCapacity`) are located in `src/lib/utils.ts`.
- **State Management:** Uses React Hooks (`useState`, `useEffect`, `useMemo`, `useCallback`) to manage fuel data, vehicle lists, and UI state.
- **Component Organization:** The source code is divided into `layout` (Header, Footer), `ui` (FuelPriceList, VehicleSearch, ComparisonTable, VehicleTabs), and functional tabs (`Bike`, `Car`).
