import { NextRequest, NextResponse } from "next/server";
import { searchProducts, parseSearchFilters } from "@/lib/search/query";
import { serverEnv } from "@/lib/env";
import { typesense } from "@/lib/search/client";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const rawQ = searchParams.get("q") ?? "";
    const q = rawQ.trim().slice(0, 200);

    const rawPage = parseInt(searchParams.get("page") ?? "1", 10);
    const page = Number.isNaN(rawPage) ? 1 : Math.max(1, rawPage);

    const rawPerPage = parseInt(
      searchParams.get("per_page") ?? searchParams.get("perPage") ?? "8",
      10
    );
    const perPage = Number.isNaN(rawPerPage) ? 8 : Math.min(24, Math.max(1, rawPerPage));

    const collection = searchParams.get("collection") ?? undefined;
    const sort = searchParams.get("sort") ?? undefined;

    const paramsObj: Record<string, string> = {};
    searchParams.forEach((val, key) => {
      paramsObj[key] = val;
    });
    const filters = parseSearchFilters(paramsObj);

    const results = await searchProducts({
      q,
      page,
      perPage,
      collection,
      sort,
      filters,
    });

    if (results.isUnavailable) {
      return NextResponse.json(
        { error: "Search temporarily unavailable" },
        { status: 503 }
      );
    }

    if (serverEnv.TYPESENSE_ANALYTICS && q.length >= 2 && results.found >= 0) {
      try {
        await (typesense as any).analytics?.events?.()?.create?.({
          type: "search",
          name: "products_search",
          data: {
            q,
            results_found: results.found,
          },
        });
      } catch {
        // Analytics failure should never break search response
      }
    }

    return NextResponse.json(results);
  } catch (err) {
    console.error("API search route error:", err);
    return NextResponse.json(
      { error: "Search temporarily unavailable" },
      { status: 503 }
    );
  }
}
