"use client";

import React, { useEffect } from "react";
import { Search } from "lucide-react";

export function SearchTrigger() {
  const focusSearch = () => {
    const input = document.querySelector<HTMLInputElement>(
      'input[aria-label="Search luminaires and fixtures"]'
    );
    if (input) {
      input.focus();
      input.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        const target = e.target as HTMLElement | null;
        if (target) {
          const tagName = target.tagName;
          if (
            tagName === "INPUT" ||
            tagName === "TEXTAREA" ||
            target.isContentEditable ||
            target.getAttribute("contenteditable") === "true"
          ) {
            return;
          }
        }
        e.preventDefault();
        focusSearch();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <button
      type="button"
      onClick={focusSearch}
      className="p-1.5 text-gray-700 hover:text-[#8B1812] transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary rounded-xs cursor-pointer"
      aria-label="Focus search bar"
      title="Search (Ctrl+K)"
    >
      <Search className="size-5" />
    </button>
  );
}

