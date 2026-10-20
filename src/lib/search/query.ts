import "server-only";
import { typesense, SEARCH_COLLECTION } from "./client";
import { hitToProduct, type SearchHit } from "./from-hit";

export interface SearchFacets {
  collections?: string[];
  wattage?: string[];
  cct?: string[];
  voltage?: string[];
  certifications?: string[];
  dimmable?: boolean;
  inStock?: boolean;
  minPrice?: number; // cents
  maxPrice?: number; // cents
}

export interface SearchQueryInput {
  q: string;
  page?: number;
  perPage?: number;
  sort?: string;
  collection?: string;
  filters?: SearchFacets;
}

export interface SearchResults {
  found: number;
  page: number;
  outOf: number;
  searchTimeMs: number;
  hits: SearchHit[];
  facetCounts: Record<string, unknown>;
  suggestions: string[];
  isUnavailable?: boolean;
}

export function escapeFilterValue(val: string): string {
  return "`" + val.replace(/`/g, "\\`") + "`";
}

export function parseSearchFilters(
  searchParams: Record<string, string | string[] | undefined>
): SearchFacets {
  const getParam = (k1: string, k2?: string): string | string[] | undefined => {
    return searchParams[k1] ?? (k2 ? searchParams[k2] : undefined);
  };

  const parseArray = (val: string | string[] | undefined): string[] | undefined => {
    if (!val) return undefined;
    if (Array.isArray(val)) {
      const flat = val.flatMap((v) => v.split(",")).map((s) => s.trim()).filter(Boolean);
      return flat.length ? flat : undefined;
    }
    const parts = val.split(",").map((s) => s.trim()).filter(Boolean);
    return parts.length ? parts : undefined;
  };

  const parseBool = (val: string | string[] | undefined): boolean | undefined => {
    if (val === "true" || val === "1") return true;
    if (val === "false" || val === "0") return false;
    return undefined;
  };

  const parseIntSafe = (val: string | string[] | undefined): number | undefined => {
    if (!val) return undefined;
    const str = Array.isArray(val) ? val[0] : val;
    const num = parseInt(str, 10);
    return Number.isNaN(num) ? undefined : num;
  };

  return {
    collections: parseArray(getParam("collection", "collections")),
    wattage: parseArray(getParam("wattage")),
    cct: parseArray(getParam("cct")),
    voltage: parseArray(getParam("voltage")),
    certifications: parseArray(getParam("certifications", "cert")),
    dimmable: parseBool(getParam("dimmable")),
    inStock: parseBool(getParam("inStock", "in_stock")),
    minPrice: parseIntSafe(getParam("minPrice", "min_price")),
    maxPrice: parseIntSafe(getParam("maxPrice", "max_price")),
  };
}

export function buildFilterBy(
  f?: SearchFacets,
  collection?: string
): string | undefined {
  const clauses: string[] = [];

  if (collection) {
    clauses.push(`collections:=${escapeFilterValue(collection)}`);
  } else if (f?.collections && f.collections.length > 0) {
    clauses.push(`collections:=[${f.collections.map(escapeFilterValue).join(",")}]`);
  }

  if (f?.wattage && f.wattage.length > 0) {
    clauses.push(`wattage:=[${f.wattage.map(escapeFilterValue).join(",")}]`);
  }

  if (f?.cct && f.cct.length > 0) {
    clauses.push(`cct:=[${f.cct.map(escapeFilterValue).join(",")}]`);
  }

  if (f?.voltage && f.voltage.length > 0) {
    clauses.push(`voltage:=[${f.voltage.map(escapeFilterValue).join(",")}]`);
  }

  if (f?.certifications && f.certifications.length > 0) {
    clauses.push(`certifications:=[${f.certifications.map(escapeFilterValue).join(",")}]`);
  }

  if (f?.dimmable === true) {
    clauses.push("dimmable:=true");
  }

  if (f?.inStock === true) {
    clauses.push("inStock:=true");
  }

  if (typeof f?.minPrice === "number") {
    clauses.push(`price:>=${Math.round(f.minPrice)}`);
  }

  if (typeof f?.maxPrice === "number") {
    clauses.push(`price:<=${Math.round(f.maxPrice)}`);
  }

  return clauses.length > 0 ? clauses.join(" && ") : undefined;
}

export async function searchProducts(input: SearchQueryInput): Promise<SearchResults> {
  try {
    const rawQ = (input.q ?? "").trim();
    // Normalize unicode symbols like '×' (U+00D7) -> 'x', smart quotes, etc.
    const normalizedQ = rawQ
      .replace(/\u00D7/g, "x")
      .replace(/[\u201C\u201D]/g, '"')
      .replace(/[\u2018\u2019]/g, "'")
      .trim();
    const q = normalizedQ.slice(0, 200) || "*";
    const page = Math.max(1, input.page ?? 1);
    const perPage = Math.min(24, Math.max(1, input.perPage ?? 24));

    let sortBy: string | undefined;
    switch (input.sort) {
      case "price-asc":
        sortBy = "price:asc";
        break;
      case "price-desc":
        sortBy = "price:desc";
        break;
      case "newest":
        sortBy = "createdAt:desc";
        break;
      case "relevance":
      default:
        sortBy = undefined;
        break;
    }

    const filterBy = buildFilterBy(input.filters, input.collection);

    const searchParams = {
      q,
      query_by: "title,sku,description,tags",
      query_by_weights: "10,10,1,3",
      prioritize_exact_match: true,
      prioritize_token_position: true,
      prefix: true,
      num_typos: 1,
      typo_tokens_threshold: 1,
      drop_tokens_threshold: 1,
      per_page: perPage,
      page,
      highlight_fields: "title,sku",
      highlight_full_fields: "title",
      snippet_threshold: 30,
      sort_by: sortBy,
      facet_by: "collections,wattage,cct,voltage,certifications,dimmable,inStock",
      max_facet_values: 20,
      filter_by: filterBy,
    };

    const res = await typesense
      .collections(SEARCH_COLLECTION)
      .documents()
      .search(searchParams as unknown as Record<string, unknown>);

    const hits: SearchHit[] = [];
    if (res.hits) {
      for (const h of res.hits) {
        const hitParsed = hitToProduct({
          document: h.document as { productSnapshot: string },
          highlight: h.highlight as Record<string, { snippet?: string }>,
        });
        if (hitParsed) {
          hits.push(hitParsed);
        }
      }
    }

    const rawFacetCounts = res.facet_counts ?? [];
    const facetCounts: Record<string, unknown> = {};
    for (const fc of rawFacetCounts) {
      facetCounts[fc.field_name] = fc;
    }

    const found = res.found ?? 0;
    const suggestions =
      found === 0 ? ["panel", "strip", "downlight", "high bay", "emergency"] : [];

    return {
      found,
      page: res.page ?? page,
      outOf: res.out_of ?? 0,
      searchTimeMs: res.search_time_ms ?? 0,
      hits,
      facetCounts,
      suggestions,
    };
  } catch (err) {
    console.error("searchProducts error:", err);
    return {
      found: 0,
      page: 1,
      outOf: 0,
      searchTimeMs: 0,
      hits: [],
      facetCounts: {},
      suggestions: ["panel", "strip", "downlight", "high bay", "emergency"],
      isUnavailable: true,
    };
  }
}
