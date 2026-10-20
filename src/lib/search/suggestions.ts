export interface SearchSuggestion {
  text: string;
  categoryHint?: string;
  targetHref?: string;
}

export const POPULAR_SEARCHES: SearchSuggestion[] = [
  { text: "roof lights", categoryHint: "Outdoor & Canopy" },
  { text: "roof lights for commercial", categoryHint: "Commercial" },
  { text: "2x4 LED Flat Panel", categoryHint: "LED Panels" },
  { text: "150W UFO LED High Bay Light", categoryHint: "High Bays" },
  { text: "6-Inch Canless Wafer Downlight", categoryHint: "Downlights" },
  { text: "100W Commercial LED Canopy Light", categoryHint: "Canopy & Roof" },
  { text: "COB LED Strip Light 24V", categoryHint: "Linear / Strip" },
  { text: "Commercial Emergency Exit Sign", categoryHint: "Life Safety" },
  { text: "240W UFO High Bay 36000 Lumens", categoryHint: "Industrial" },
  { text: "Commercial 0-10V Dimmer Switch", categoryHint: "Controls" },
];

export const LIGHTING_SEARCH_DICTIONARY: SearchSuggestion[] = [
  // 1. Roof & Canopy Lights
  { text: "roof lights", categoryHint: "Canopy Fixtures" },
  { text: "roof lights for commercial", categoryHint: "Commercial" },
  { text: "roof lights for gas station", categoryHint: "Canopy Fixtures" },
  { text: "roof lights for garage", categoryHint: "Commercial" },
  { text: "roof lights canopy", categoryHint: "Outdoor & Canopy" },
  { text: "roof lights 100w", categoryHint: "Canopy Fixtures" },
  { text: "roof lights outdoor commercial", categoryHint: "Exterior" },
  { text: "roof light fixtures", categoryHint: "Canopy" },
  { text: "roof lights ceiling mount", categoryHint: "Surface Mount" },
  { text: "roof lights waterproof ip65", categoryHint: "Weatherproof" },
  { text: "canopy roof lights", categoryHint: "Outdoor & Canopy" },
  { text: "100W Commercial LED Canopy Light", categoryHint: "Canopy Light" },
  { text: "canopy light garage & gas station", categoryHint: "Canopy Light" },

  // 2. High Bay Lighting
  { text: "high bay led lights", categoryHint: "High Bays" },
  { text: "ufo high bay light", categoryHint: "High Bays" },
  { text: "150w ufo led high bay", categoryHint: "High Bays" },
  { text: "240w ufo led high bay", categoryHint: "High Bays" },
  { text: "4ft linear led high bay", categoryHint: "Linear High Bay" },
  { text: "2ft linear led high bay", categoryHint: "Linear High Bay" },
  { text: "high bay warehouse lighting", categoryHint: "Industrial" },
  { text: "high bay fixture 0-10v dimmable", categoryHint: "High Bays" },
  { text: "high-bay microwave motion sensor", categoryHint: "Sensors" },

  // 3. Flat Panels & Troffers
  { text: "led flat panel 2x4", categoryHint: "LED Panels" },
  { text: "led flat panel 2x2", categoryHint: "LED Panels" },
  { text: "1x4 led flat panel", categoryHint: "LED Panels" },
  { text: "2x4 led flat panel selectable wattage", categoryHint: "LED Panels" },
  { text: "2x2 led flat panel emergency driver", categoryHint: "LED Panels" },
  { text: "2x4 center basket troffer", categoryHint: "Troffers" },
  { text: "surface mount led panel kit", categoryHint: "Accessories" },
  { text: "2x4 led flat panel drywall flange kit", categoryHint: "Accessories" },

  // 4. Commercial Downlights
  { text: "commercial led downlights", categoryHint: "Downlights" },
  { text: "6-inch canless wafer downlight", categoryHint: "Downlights" },
  { text: "4-inch commercial downlight", categoryHint: "Downlights" },
  { text: "6-inch ultra-thin wafer downlight 14w", categoryHint: "Downlights" },
  { text: "high-lumen commercial downlight 30w", categoryHint: "Downlights" },
  { text: "4-inch deep regress downlight", categoryHint: "Architectural" },
  { text: "4-inch eyeball gimbal downlight", categoryHint: "Downlights" },
  { text: "6-inch retrofit baffle trim downlight", categoryHint: "Retrofit" },

  // 5. LED Strip & Linear
  { text: "cob led strip lights", categoryHint: "Strip Lights" },
  { text: "24v dotless cob led strip", categoryHint: "Strip Lights" },
  { text: "tunable white cob led strip", categoryHint: "Strip Lights" },
  { text: "cob led strip 4000k neutral white", categoryHint: "Strip Lights" },
  { text: "cob led strip 3000k warm white", categoryHint: "Strip Lights" },
  { text: "solderless 8mm 2-pin cob connector", categoryHint: "Accessories" },
  { text: "8ft aluminum channel for led strip", categoryHint: "Extrusions" },
  { text: "v-shape corner aluminum channel", categoryHint: "Extrusions" },

  // 6. Emergency & Exit
  { text: "emergency exit signs", categoryHint: "Life Safety" },
  { text: "led exit sign & emergency light combo", categoryHint: "Life Safety" },
  { text: "dual-head led emergency light", categoryHint: "Life Safety" },
  { text: "compact led exit sign 90-min battery", categoryHint: "Life Safety" },
  { text: "wet location outdoor exit sign nema 4x", categoryHint: "NEMA 4X" },
  { text: "emergency battery backup driver", categoryHint: "Drivers" },

  // 7. Outdoor & Vapor Tight
  { text: "commercial outdoor lighting", categoryHint: "Exterior" },
  { text: "50w architectural led flood light", categoryHint: "Flood Lights" },
  { text: "8ft led vapor tight linear industrial 80w", categoryHint: "Vapor Tight" },
  { text: "4ft led vapor tight linear fixture 40w", categoryHint: "Vapor Tight" },
  { text: "twist-lock photocell sensor", categoryHint: "Sensors" },

  // 8. Drivers & Controls
  { text: "commercial 0-10v dimmer switch", categoryHint: "Controls" },
  { text: "360-degree pir occupancy sensor", categoryHint: "Sensors" },
  { text: "battery-free kinetic wireless wall switch", categoryHint: "Controls" },
  { text: "commercial wireless smart lighting hub", categoryHint: "Smart Controls" },
  { text: "96w 24v constant voltage led driver", categoryHint: "Drivers" },
  { text: "60w 24v dimmable class 2 power supply", categoryHint: "Power Supplies" },
];

/**
 * Returns prioritized suggestions for a query.
 * Matches exact prefix first, then word-boundary matches, then substring matches.
 */
export function getSearchSuggestions(query: string, limit = 10): SearchSuggestion[] {
  const trimmed = query.trim().toLowerCase();
  if (!trimmed) {
    return POPULAR_SEARCHES.slice(0, limit);
  }

  const queryWords = trimmed.split(/\s+/).filter(Boolean);

  const scored = LIGHTING_SEARCH_DICTIONARY.map((item) => {
    const textLower = item.text.toLowerCase();
    let score = 0;

    // Exact match
    if (textLower === trimmed) {
      score = 100;
    }
    // Starts with full query
    else if (textLower.startsWith(trimmed)) {
      score = 80;
    }
    // All words match
    else if (queryWords.every((w) => textLower.includes(w))) {
      score = 60;
      // Bonus if words appear in same order
      if (textLower.includes(trimmed)) {
        score += 15;
      }
    }
    // Any word matches
    else if (queryWords.some((w) => textLower.includes(w))) {
      score = 20;
    }

    return { item, score };
  })
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score);

  // Deduplicate by text
  const seen = new Set<string>();
  const results: SearchSuggestion[] = [];

  // Always ensure the typed query itself is at the top or represented if valid
  for (const { item } of scored) {
    const key = item.text.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      results.push(item);
    }
    if (results.length >= limit) break;
  }

  // If query is non-empty and not in results, prepend the literal query as the first search suggestion
  const exactKey = trimmed.toLowerCase();
  if (!seen.has(exactKey) && trimmed.length >= 2) {
    results.unshift({
      text: query.trim(),
      categoryHint: "Search Query",
    });
  }

  return results.slice(0, limit);
}
