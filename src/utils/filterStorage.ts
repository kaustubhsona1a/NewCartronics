export interface InventoryFilters {
  searchTerm: string;
  sortBy: string;
  budgetIndex: number;
  minYear: number | null;
  selectedOwners: string[];
  selectedTransmissions: string[];
  maxMileage: number | null;
  selectedFuelTypes: string[];
}

export const DEFAULT_BUDGET_OPTIONS = [
  1000000,  // Below 10L
  1500000,  // Under 15L
  2000000,  // Under 20L
  2500000,  // Under 25L
  3000000,  // Under 30L
  3500000,  // Under 35L
  4000500,  // Under 40L
  4500000,  // Under 45L
  5000000,  // Under 50L
  100000000 // 50 Lakh+ / Any
];

export const DEFAULT_FILTERS: InventoryFilters = {
  searchTerm: '',
  sortBy: 'newest',
  budgetIndex: DEFAULT_BUDGET_OPTIONS.length - 1,
  minYear: null,
  selectedOwners: [],
  selectedTransmissions: [],
  maxMileage: null,
  selectedFuelTypes: [],
};

const STORAGE_KEY = 'cartronics_inventory_filters_v1';
const SCROLL_POS_KEY = 'cartronics_inventory_scroll_pos';

export function loadSavedFilters(): InventoryFilters {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_FILTERS;
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_FILTERS,
      ...parsed,
      // Ensure array values are properly sanitized
      selectedOwners: Array.isArray(parsed.selectedOwners) ? parsed.selectedOwners : [],
      selectedTransmissions: Array.isArray(parsed.selectedTransmissions) ? parsed.selectedTransmissions : [],
      selectedFuelTypes: Array.isArray(parsed.selectedFuelTypes) ? parsed.selectedFuelTypes : [],
    };
  } catch {
    return DEFAULT_FILTERS;
  }
}

export function saveFilters(filters: InventoryFilters): void {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(filters));
  } catch {
    // ignore
  }
}

export function clearSavedFilters(): void {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
    sessionStorage.removeItem(SCROLL_POS_KEY);
  } catch {
    // ignore
  }
}

export function saveInventoryScrollPos(y: number): void {
  try {
    sessionStorage.setItem(SCROLL_POS_KEY, String(y));
  } catch {
    // ignore
  }
}

export function getSavedInventoryScrollPos(): number | null {
  try {
    const val = sessionStorage.getItem(SCROLL_POS_KEY);
    return val ? parseInt(val, 10) : null;
  } catch {
    return null;
  }
}
