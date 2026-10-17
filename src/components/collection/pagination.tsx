import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath: string;
  searchParams?: Record<string, string | string[] | undefined>;
  className?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  basePath,
  searchParams = {},
  className,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  function buildPageHref(page: number): string {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(searchParams)) {
      if (key === "page" || value === undefined) continue;
      if (Array.isArray(value)) {
        for (const v of value) params.append(key, v);
      } else {
        params.set(key, value);
      }
    }
    if (page > 1) {
      params.set("page", String(page));
    }
    const qs = params.toString();
    return qs ? `${basePath}?${qs}` : basePath;
  }

  // Generate page numbers to show (e.g., 1, 2, ..., totalPages)
  const pages: (number | "ellipsis")[] = [];
  const delta = 1; // pages around current

  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 ||
      i === totalPages ||
      (i >= currentPage - delta && i <= currentPage + delta)
    ) {
      pages.push(i);
    } else if (
      pages[pages.length - 1] !== "ellipsis" &&
      (i < currentPage - delta || i > currentPage + delta)
    ) {
      pages.push("ellipsis");
    }
  }

  const prevHref = currentPage > 1 ? buildPageHref(currentPage - 1) : null;
  const nextHref = currentPage < totalPages ? buildPageHref(currentPage + 1) : null;

  return (
    <nav
      role="navigation"
      aria-label="Pagination"
      className={cn("flex items-center justify-center gap-1.5 py-8", className)}
    >
      {/* Previous Page Link */}
      {prevHref ? (
        <Link
          href={prevHref}
          className={cn(
            buttonVariants({ variant: "outline", size: "sm" }),
            "gap-1 h-9 px-3"
          )}
          aria-label="Go to previous page"
        >
          <ChevronLeft className="size-4" />
          <span className="hidden sm:inline">Previous</span>
        </Link>
      ) : (
        <span
          className={cn(
            buttonVariants({ variant: "outline", size: "sm" }),
            "gap-1 h-9 px-3 opacity-40 cursor-not-allowed pointer-events-none"
          )}
          aria-disabled="true"
        >
          <ChevronLeft className="size-4" />
          <span className="hidden sm:inline">Previous</span>
        </span>
      )}

      {/* Numbered Page Links */}
      <div className="flex items-center gap-1">
        {pages.map((p, idx) => {
          if (p === "ellipsis") {
            return (
              <span
                key={`ellipsis-${idx}`}
                className="w-9 h-9 flex items-center justify-center text-xs text-muted-foreground select-none"
              >
                …
              </span>
            );
          }

          const isCurrent = p === currentPage;
          return isCurrent ? (
            <span
              key={p}
              aria-current="page"
              className={cn(
                buttonVariants({ variant: "default", size: "sm" }),
                "w-9 h-9 p-0 text-xs font-semibold pointer-events-none"
              )}
            >
              {p}
            </span>
          ) : (
            <Link
              key={p}
              href={buildPageHref(p)}
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                "w-9 h-9 p-0 text-xs"
              )}
              aria-label={`Page ${p}`}
            >
              {p}
            </Link>
          );
        })}
      </div>

      {/* Next Page Link */}
      {nextHref ? (
        <Link
          href={nextHref}
          className={cn(
            buttonVariants({ variant: "outline", size: "sm" }),
            "gap-1 h-9 px-3"
          )}
          aria-label="Go to next page"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="size-4" />
        </Link>
      ) : (
        <span
          className={cn(
            buttonVariants({ variant: "outline", size: "sm" }),
            "gap-1 h-9 px-3 opacity-40 cursor-not-allowed pointer-events-none"
          )}
          aria-disabled="true"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="size-4" />
        </span>
      )}
    </nav>
  );
}
