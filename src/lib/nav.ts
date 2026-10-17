export interface NavNode {
  handle: string;
  title: string;
  children?: NavNode[];
}

export const primaryNav: NavNode[] = [
  {
    handle: "commercial-industrial",
    title: "Commercial & Industrial",
    children: [
      { handle: "linear-high-bays", title: "Linear High Bays" },
      { handle: "ufo-high-bays", title: "UFO High Bays" },
      { handle: "vapor-tights", title: "Vapor Tight Fixtures" },
      { handle: "tube-lights", title: "Tube Lights" },
      { handle: "batten-lights", title: "Batten Lights" },
    ],
  },
  {
    handle: "led-panel-lights",
    title: "LED Panel Lights",
    children: [
      { handle: "2x2-led-panels", title: "2x2 LED Flat Panels" },
      { handle: "2x4-led-panels", title: "2x4 LED Flat Panels" },
      { handle: "1x4-led-panels", title: "1x4 LED Flat Panels" },
      { handle: "troffer-lights", title: "LED Troffers" },
      { handle: "grid-frames", title: "Grid Frames" },
      { handle: "flush-mount", title: "Flush Mount Fixtures" },
    ],
  },
  {
    handle: "led-downlights",
    title: "LED Downlights",
    children: [
      { handle: "4-inch-downlights", title: "4-Inch LED Downlights" },
      { handle: "6-inch-downlights", title: "6-Inch LED Downlights" },
      { handle: "trimless-downlight", title: "Trimless Downlights" },
      { handle: "retrofit-can-lights", title: "Retrofit Can Lights" },
      { handle: "led-bulbs", title: "LED Bulbs" },
      { handle: "mirror-lights", title: "LED Light Mirrors" },
    ],
  },
  {
    handle: "outdoor-lighting",
    title: "Outdoor Commercial",
    children: [
      { handle: "shoebox-lights", title: "LED Shoebox Lights" },
      { handle: "wall-packs", title: "LED Wall Packs" },
      { handle: "canopy-lights", title: "Canopy Lights" },
      { handle: "flood-lights", title: "Flood Lights" },
      { handle: "area-lights", title: "Area Lights" },
      { handle: "barn-lights", title: "Barn Lights" },
    ],
  },
  {
    handle: "led-strip-lights",
    title: "LED Strip Lights",
    children: [
      { handle: "cob-led-strip-lights", title: "COB LED Strip Lights" },
      { handle: "rgb-rgbw-strip-lights", title: "RGB & RGBW Strip Lights" },
      { handle: "single-color-strip-lights", title: "Single Color Strip Lights" },
      { handle: "waterproof-strip-lights", title: "Waterproof Strip Lights" },
      { handle: "sheet-rolls", title: "LED Sheet Rolls" },
      { handle: "gold-sheet-roll", title: "Gold Sheet Rolls" },
      { handle: "flexible-led-sheet", title: "Flexible LED Sheets" },
      { handle: "rgbw-color-sheet", title: "RGBW Color Sheets" },
      { handle: "linear-fixtures", title: "Linear Fixtures" },
    ],
  },
  {
    handle: "emergency-exit",
    title: "Emergency & Exit",
    children: [
      { handle: "exit-signs-combo", title: "Exit Signs Combo" },
      { handle: "fire-resistant-exit-sign", title: "Fire Resistant Exit Signs" },
      { handle: "emergency-sky-panels", title: "Emergency Sky Panels" },
      { handle: "battery-backup-drivers", title: "Battery Backup Drivers" },
    ],
  },
  {
    handle: "smart-lighting",
    title: "Smart Controls",
  },
  {
    handle: "accessories",
    title: "Drivers & Accessories",
    children: [
      { handle: "power-supplies", title: "Power Supplies" },
    ],
  },
];
