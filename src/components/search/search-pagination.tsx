"use client";

import React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils/index";

interface SearchPaginationProps {
  found: number;
  perPage: number;
  currentPage: number;
  basePath: string;
}

export function SearchPagination({
  found,
  perPage,
  currentPage,
  basePath,
}: SearchPaginationProps) {
  const searchParams = useSearchParams();
  const totalPages = Math.ceil(found / perPage);

  if (totalPages <= 1) return null;

  const buildPageHref = (page: number): string => {
    const params = new URLSearchParams(searchParams.toString());
    if (page > 1) {
      params.set("page", String(page));
    } else {
      params.delete("page");
    }
    const qs = params.toString();
    return qs ? `${basePath}?${qs}` : basePath;
  };

  const pages: (number | "ellipsis")[] = [];
  const delta = 1;

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
      className="flex items-center justify-center gap-1.5 py-8"
    >
      {/* Previous Page */}
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
                "w-9 h-9 p-0 text-xs font-semibold pointer-events-none bg-[#8B1812] hover:bg-[#8B1812] text-white"
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

      {/* Next Page */}
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
