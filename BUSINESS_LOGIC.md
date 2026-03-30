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

## 5. Performance & Memory Optimization

The application implements several strategies to ensure high performance, low memory footprint, and fast page load times:

### 5.1. Component Memoization
- **React.memo:** Used extensively across the codebase (`FuelPriceList`, `ComparisonTable`, `VehicleSearch`, `VehicleTab`, `Header`, `Footer`) to prevent unnecessary re-renders of components when their props haven't changed.
- **Granular Sub-components:** Large components are broken down into smaller, memoized sub-components (e.g., `FuelCard`, `FuelRow`, `VehicleRow`, `TableHeader`, `SearchResultItem`) to isolate re-renders.

### 5.2. Hook & State Optimization
- **useMemo:** Stabilizes complex objects and arrays returned by hooks (`useFuelData`, `useVehicleSelection`) and derived state in components. This ensures that child components receiving these objects as props don't re-render unless the underlying data actually changes.
- **useCallback:** Memoizes event handlers and callbacks (e.g., `toggleSelection`, `onRefresh`) to maintain stable function references across renders.
- **State Stabilization:** In `App.tsx`, state objects passed to `VehicleTab` are wrapped in `useMemo` to prevent cascading re-renders.

### 5.3. Efficient Data Processing
- **Map-based Lookups:** In `apiService.ts`, fuel price changes are calculated using a `Map` for $O(1)$ lookups instead of $O(N)$ array searches, significantly improving processing speed for large datasets.
- **Centralized Logic:** Utility functions like `isGasoline` and `filterFuelByType` are used to perform data filtering efficiently and consistently.

### 5.4. Resource Loading
- **Lazy Loading:** Images (e.g., the Petrolimex zone map) use the `loading="lazy"` attribute to defer loading until they are near the viewport, improving initial page load speed.
- **Conditional Rendering:** Heavy components or sections (like the comparison table) are only rendered when needed (e.g., when vehicles are selected).

## 6. Extensibility & Maintainability (SOLID Principles)

### 6.1. Single Responsibility Principle (SRP)
- **Service Splitting:** The monolithic `apiService.ts` has been split into `fuelService.ts` and `vehicleService.ts`. Each service is now responsible for a single domain (fuel data vs. vehicle data).
- **Component Decomposition:** UI components are broken down into small, focused sub-components that handle specific parts of the interface.

### 6.2. Open/Closed Principle (OCP)
- **Generic Utilities:** The `filterFuels` utility in `src/lib/utils.ts` is now a generic function that accepts a predicate, allowing for new filtering criteria to be added without modifying the utility itself.

### 6.3. Dependency Inversion Principle (DIP)
- **Hook Abstraction:** Components depend on high-level hooks (`useFuelData`, `useVehicleSelection`) rather than low-level service implementations. This allows for easier swapping of data sources or logic.

### 6.4. CSS Optimization & Consistency
- **Tailwind Component Layer:** Common UI patterns are abstracted into the `@layer components` in `src/index.css`.
- **Utility Classes:** Classes like `card-base`, `badge-base`, `btn-primary`, and `input-base` ensure visual consistency across the app while significantly reducing the number of utility classes repeated in JSX.
- **Maintainability:** Changing a global style (like card border radius or button padding) now only requires a single update in the CSS file.

### 6.5. Naming Standards
- **Components:** PascalCase (e.g., `Header.tsx`, `VehicleSearch.tsx`).
- **Hooks:** kebab-case (e.g., `use-fuel-data.ts`, `use-vehicle-selection.ts`).
- **Services:** kebab-case (e.g., `fuel-service.ts`, `vehicle-service.ts`).
- **Data Files:** kebab-case (e.g., `dummy-cars.json`, `dummy-fuels.json`).
- **Directories:** kebab-case (e.g., `data-dummy`).
- **Variables & Methods:** camelCase (e.g., `fuelDataState`, `refreshFuelPrices`).
- **Constants:** UPPER_SNAKE_CASE (e.g., `API_ENDPOINTS`, `CONFIG`).
- **Descriptive Naming:** Avoid generic names like `data`, `item`, `arr1`. Use descriptive names like `petrolimexCurrent`, `vehicle`, `memoizedFuelState`.

### 6.6. Type Safety
- **Strict TypeScript:** The application uses strict TypeScript configurations.
- **Readonly Properties:** Interfaces use `readonly` to enforce immutability where appropriate, preventing accidental state mutations.
- **Advanced Types:** Utilizes advanced TS features like `readonly` arrays, type guards (`is data is T[]`), and explicit API response types (`FuelApiResponse`, `RawFuelItem`).
- **No 'any':** The codebase is refactored to eliminate the use of `any`, replacing it with `unknown` and proper type assertions or guards for safer data handling.
- **Exhaustive Checks:** Type safety is enforced at the service level by mapping raw API data to strictly typed internal models.

## 7. Development Guidelines
- **Clean Code:** Always check for clean code to ensure readability and maintainability.
- **Documentation:** Always update markdown files (`README.md`, `BUSINESS_LOGIC.md`) when there are changes in logic or structure.
