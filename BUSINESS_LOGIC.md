# Business Logic Documentation - Đầy Bình

The "Đầy Bình" application helps users calculate the cost of filling up their fuel tanks for motorcycles and cars based on real-time fuel price updates.

## 1. Fuel Price Data
- **Data Source:** Fetched from the API `https://giaxanghomnay.com/api/pvdate/{today}`.
- **API Structure:** Returns 4 arrays `[[arr1], [arr2], [arr3], [arr4]]`.
    - `arr1` & `arr3`: Petrolimex fuel price data (Zone 1 and Zone 2).
    - `arr2` & `arr4`: PVOIL fuel price data.
- **Data Processing:**
    - **Petrolimex:** Processes data from `arr1` (current) and `arr3` (previous) to calculate prices and changes for both **Zone 1** and **Zone 2**.
    - **PVOIL:** Processes data from `arr2` (current) and `arr4` (previous) to calculate prices and changes.
    - Categorizes fuel into 2 providers: **Petrolimex** and **PVOIL**.

## 2. Vehicle Data
- **Motorcycles:** Fetched from a Google Script API `https://script.google.com/macros/s/AKfycbzyhYBKeJpj5DYNZ4s6He4X9CXE09lnckQTOeJA7S6M7DEPHYhKNOYsZayKMf-hLMre/exec` combined with `dummy_motorcycles.json` as a fallback.
- **Cars:** Currently uses `dummy_cars.json` data, managed through the common `apiService` for future API integration.
- **Fuel Capacity:** Extracted from the `fuel_tank` or `capacity` field of the vehicle data.

## 3. Cost Calculation
- **Formula:** `Cost = Fuel Tank Capacity (Liters) * Fuel Price (VND/Liter)`.
- **Provider & Zone Selection:** 
    - Users can choose between **Petrolimex** and **PVOIL** for price calculation.
    - If **Petrolimex** is selected, users can further choose between **Zone 1** and **Zone 2** prices.
    - **PVOIL** uses a single price for all calculations.
- **Comparison Table:** Displays the cost of filling the tank for each selected vehicle against all common fuel types (RON 95-V, RON 95-III, E5 RON 92-II, etc.) based on the selected provider and zone.

## 4. UI & User Experience
- **Light Mode:** The application exclusively uses a Light Mode interface.
- **Search:** Users can search for motorcycles and cars simultaneously through two separate search inputs (50/50 split).
- **Colors:** Uses standard Google colors (Blue, Red, Yellow, Green) to distinguish vehicles in the comparison table.
- **Fuel Price Display:** 
    - Shows Petrolimex and PVOIL data in separate rows.
    - Petrolimex cards display both Zone 1 and Zone 2 prices with distinct badges.
    - Clicking on a zone badge opens a modal with an image explaining the geographical distribution of Petrolimex price zones.
    - Shows the current price and the price change (increase/decrease) with corresponding icons (TrendingUp/TrendingDown) and colors (Rose/Emerald).
- **Storage:** The list of selected vehicles, selected provider, and selected zone are saved to `localStorage` to persist state across page reloads.
- **Auto-Update:** Data is automatically refreshed every 5 minutes.

## 5. Source Code Structure & Constants
- **Constants:** Organized into subfolders in `src/constants/` for better management:
    - `api.ts`: API endpoints.
    - `colors.ts`: UI color palettes.
    - `messages.ts`: Application messages and labels.
    - `ui.ts`: UI text and titles.
    - `config.ts`: Application configuration (limits, intervals).
- **Custom Hooks:** Business logic is encapsulated in custom hooks for better reusability and cleaner components:
    - `useFuelData.ts`: Manages fetching, processing, and state for fuel prices, providers, and zones. Includes a 30-second loading timeout and dummy data detection.
    - `useVehicleSelection.ts`: Manages vehicle fetching, search, selection, and persistence. Groups search parameters into a unified `SearchState` interface and includes a 30-second loading timeout.
- **Project Structure & Path Aliases:**
    - **Path Aliases:** The project uses the `@/` alias to point to the `src/` directory, simplifying import paths (e.g., `import { ... } from "@/components"`).
    - **Index Files:** Each major directory (`components`, `hooks`, `lib`, `services`, `types`, `constants`) contains an `index.ts` file that centralizes exports, allowing for cleaner and more organized imports.
    - **Named Exports:** Components and functions are exported as named exports to improve code discoverability and consistency.
- **Utils:** Common functions for cost calculation (`calculateFuelCost`), currency formatting (`formatCurrency`), data validation (`validateArray`), and fuel capacity parsing (`parseFuelCapacity`) are located in `src/lib/utils.ts` and exported via `src/lib/index.ts`.
- **Component Organization:** Components are refactored to use grouped props (e.g., `fuel`, `vehicles`) to reduce prop drilling and improve readability. The `FuelState`, `VehicleSelectionState`, `SearchState`, `ProviderSelectionState`, and `ZoneSelectionState` interfaces are used to standardize data management and selection logic across the application.
- **Loading State:** A 30-second timeout is implemented in data fetching hooks to automatically disable the loading state if the API does not respond within the expected timeframe, ensuring the UI remains interactive.
- **Dummy Data Notification:** The application explicitly notifies the user via a "Dữ liệu mẫu" (Dummy Data) badge in the header if the live API fails and fallback data is being used.
