import type { Collection, FacetConfig } from "./types";

export interface ProductFilter {
  minPrice?: number; // cents
  maxPrice?: number; // cents
  wattage?: string[]; // ["40W", "50W"]
  cct?: string[]; // ["4000K", "5000K"]
  voltage?: string[]; // ["120V"]
  certifications?: string[]; // ["DLC", "ETL"]
  dimmable?: boolean;
  inStock?: boolean;
}

export type SortOption =
  | "featured"
  | "price-asc"
  | "price-desc"
  | "newest"
  | "best-selling";

export const DEFAULT_PER_PAGE = 24;

export const DEFAULT_FILTERS: FacetConfig[] = [
  { key: "price", label: "Price", type: "range" },
  {
    key: "wattage",
    label: "Wattage",
    type: "checkbox",
    options: [
      "20W",
      "30W",
      "40W",
      "50W",
      "60W",
      "75W",
      "100W",
      "150W",
      "200W",
      "300W",
    ],
  },
  {
    key: "cct",
    label: "Color Temp",
    type: "checkbox",
    options: ["2700K", "3000K", "3500K", "4000K", "5000K", "6500K"],
  },
  {
    key: "voltage",
    label: "Voltage",
    type: "checkbox",
    options: ["120V", "277V", "120-277V", "24V"],
  },
  {
    key: "certification",
    label: "Certification",
    type: "checkbox",
    options: ["UL", "ETL", "DLC", "Energy Star", "FCC"],
  },
  { key: "dimmable", label: "Dimmable", type: "radio" },
  { key: "availability", label: "Availability", type: "radio" },
];

export const DEFAULT_SORT: SortOption = "featured";

function getParamValue(raw: string | string[] | undefined): string | undefined {
  if (Array.isArray(raw)) return raw[0];
  return raw;
}

export function parseFilters(
  searchParams: Record<string, string | string[] | undefined>
): ProductFilter {
  const filter: ProductFilter = {};

  const minPriceRaw = getParamValue(searchParams.min_price);
  if (minPriceRaw) {
    const val = parseInt(minPriceRaw, 10);
    if (!isNaN(val) && val >= 0) filter.minPrice = val;
  }

  const maxPriceRaw = getParamValue(searchParams.max_price);
  if (maxPriceRaw) {
    const val = parseInt(maxPriceRaw, 10);
    if (!isNaN(val) && val >= 0) filter.maxPrice = val;
  }

  const wattageRaw = getParamValue(searchParams.wattage);
  if (wattageRaw) {
    const arr = wattageRaw.split(",").map((s) => s.trim()).filter(Boolean);
    if (arr.length > 0) filter.wattage = arr;
  }

  const cctRaw = getParamValue(searchParams.cct);
  if (cctRaw) {
    const arr = cctRaw.split(",").map((s) => s.trim()).filter(Boolean);
    if (arr.length > 0) filter.cct = arr;
  }

  const voltageRaw = getParamValue(searchParams.voltage);
  if (voltageRaw) {
    const arr = voltageRaw.split(",").map((s) => s.trim()).filter(Boolean);
    if (arr.length > 0) filter.voltage = arr;
  }

  const certRaw =
    getParamValue(searchParams.cert) ??
    getParamValue(searchParams.certification) ??
    getParamValue(searchParams.certifications);
  if (certRaw) {
    const arr = certRaw.split(",").map((s) => s.trim()).filter(Boolean);
    if (arr.length > 0) filter.certifications = arr;
  }

  const dimmableRaw = getParamValue(searchParams.dimmable);
  if (dimmableRaw === "true") filter.dimmable = true;
  else if (dimmableRaw === "false") filter.dimmable = false;

  const inStockRaw =
    getParamValue(searchParams.in_stock) ??
    getParamValue(searchParams.availability) ??
    getParamValue(searchParams.inStock);
  if (inStockRaw === "true") filter.inStock = true;
  else if (inStockRaw === "false") filter.inStock = false;

  return filter;
}

export function serializeFilters(f: ProductFilter): URLSearchParams {
  const params = new URLSearchParams();

  if (f.minPrice !== undefined && f.minPrice >= 0) {
    params.set("min_price", String(f.minPrice));
  }
  if (f.maxPrice !== undefined && f.maxPrice >= 0) {
    params.set("max_price", String(f.maxPrice));
  }
  if (f.wattage && f.wattage.length > 0) {
    params.set("wattage", f.wattage.join(","));
  }
  if (f.cct && f.cct.length > 0) {
    params.set("cct", f.cct.join(","));
  }
  if (f.voltage && f.voltage.length > 0) {
    params.set("voltage", f.voltage.join(","));
  }
  if (f.certifications && f.certifications.length > 0) {
    params.set("cert", f.certifications.join(","));
  }
  if (f.dimmable !== undefined) {
    params.set("dimmable", f.dimmable ? "true" : "false");
  }
  if (f.inStock !== undefined) {
    params.set("in_stock", f.inStock ? "true" : "false");
  }

  return params;
}

export function parseSort(raw: string | undefined): SortOption {
  if (
    raw === "price-asc" ||
    raw === "price-desc" ||
    raw === "newest" ||
    raw === "best-selling" ||
    raw === "featured"
  ) {
    return raw;
  }
  return DEFAULT_SORT;
}

export function parsePage(raw: string | undefined): number {
  if (!raw) return 1;
  const n = parseInt(raw, 10);
  return Number.isInteger(n) && n > 0 ? n : 1;
}

export function resolveFacets(collection: Collection | null): FacetConfig[] {
  if (collection && collection.filters && collection.filters.length > 0) {
    return collection.filters;
  }
  return DEFAULT_FILTERS;
}

export function resolveFacetOptions(facet: FacetConfig): string[] {
  if (facet.options && facet.options.length > 0) {
    return facet.options;
  }
  const match = DEFAULT_FILTERS.find((f) => f.key === facet.key);
  return match?.options ?? [];
}

export function buildCollectionHref({
  basePath,
  filters,
  sort,
  page,
}: {
  basePath: string;
  filters?: ProductFilter;
  sort?: SortOption;
  page?: number;
}): string {
  const params = filters ? serializeFilters(filters) : new URLSearchParams();
  if (sort && sort !== DEFAULT_SORT) {
    params.set("sort", sort);
  }
  if (page && page > 1) {
    params.set("page", String(page));
  }
  const qs = params.toString();
  return qs ? `${basePath}?${qs}` : basePath;
}
