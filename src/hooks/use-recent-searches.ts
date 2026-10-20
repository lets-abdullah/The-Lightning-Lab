"use client";

import { useState, useEffect, useCallback } from "react";

export interface RecentSearch {
  term: string;
  timestamp: number;
}

const KEY = "recent-searches-v1";
const MAX = 5;

export function useRecentSearches() {
  const [recent, setRecent] = useState<RecentSearch[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setRecent(parsed.slice(0, MAX));
        }
      }
    } catch {
      // Ignore if localStorage unavailable or corrupted
    }
  }, []);

  const add = useCallback((rawTerm: string) => {
    const trimmed = rawTerm.trim();
    if (!trimmed) return;

    setRecent((prev) => {
      const lower = trimmed.toLowerCase();
      const filtered = prev.filter((item) => item.term.toLowerCase() !== lower);
      const next = [{ term: trimmed, timestamp: Date.now() }, ...filtered].slice(0, MAX);
      try {
        localStorage.setItem(KEY, JSON.stringify(next));
      } catch {
        // Ignore if localStorage disabled
      }
      return next;
    });
  }, []);

  const remove = useCallback((rawTerm: string) => {
    const lower = rawTerm.trim().toLowerCase();
    setRecent((prev) => {
      const next = prev.filter((item) => item.term.toLowerCase() !== lower);
      try {
        localStorage.setItem(KEY, JSON.stringify(next));
      } catch {
        // Ignore if localStorage disabled
      }
      return next;
    });
  }, []);

  const clear = useCallback(() => {
    setRecent([]);
    try {
      localStorage.removeItem(KEY);
    } catch {
      // Ignore if localStorage disabled
    }
  }, []);

  return { recent, add, remove, clear };
}
