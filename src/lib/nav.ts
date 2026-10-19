export interface NavNode {
  handle: string;
  title: string;
  children?: NavNode[];
}

export const primaryNav: NavNode[] = [
  {
    handle: "shop-all",
    title: "Our LED Lighting",
    children: [
      {
        handle: "#",
        title: "Shop by Application",
        children: [
          { handle: "commercial", title: "Commercial Lighting" },
          { handle: "residential", title: "Residential Lighting" },
          { handle: "outdoor", title: "Outdoor Lighting" },
        ],
      },
      {
        handle: "#",
        title: "Shop by Product",
        children: [
          { handle: "led-panel-lights", title: "LED Panel Lights" },
          { handle: "downlight", title: "LED Downlights" },
          { handle: "strip-lighting", title: "LED Strip Lighting" },
          { handle: "emergency-exit", title: "Emergency & Exit" },
        ],
      },
      {
        handle: "#",
        title: "Shop by Feature",
        children: [
          { handle: "high-bay-lights", title: "High Bay Lights" },
          { handle: "troffers", title: "Troffers & Troffer Lights" },
          { handle: "flood-lights", title: "Flood Lights" },
        ],
      },
    ],
  },
  {
    handle: "commercial",
    title: "Commercial",
    children: [
      {
        handle: "#",
        title: "Panels & Troffers",
        children: [
          { handle: "led-panel-lights", title: "LED Panel Lights" },
          { handle: "troffers", title: "Troffer Lights" },
          { handle: "led-emergency-panel-light", title: "LED Emergency Panel Light" },
          { handle: "led-edge-light", title: "LED Edge Light" },
          { handle: "artificial-sky-panel", title: "Artificial Sky Panel" },
        ],
      },
      {
        handle: "#",
        title: "High Bays & Linear",
        children: [
          { handle: "linear-high-bay", title: "LED Linear High Bay Light" },
          { handle: "ufo-high-bay", title: "UFO High Bay Lights" },
          { handle: "vapor-tight-fixture", title: "Vapor Tight Fixture" },
          { handle: "strip-light-fixtures", title: "Strip Light Fixtures" },
          { handle: "architectural-linear", title: "Architectural Linear Light" },
          { handle: "linear-connectors", title: "Linear Connectors" },
        ],
      },
      {
        handle: "#",
        title: "Downlights & Tubes",
        children: [
          { handle: "commercial-recessed-downlights", title: "Commercial Recessed Downlights" },
          { handle: "led-tube-light-fixture", title: "LED Tube Light Fixture" },
          { handle: "t8-led-tube-light", title: "T8 LED Tube Light" },
        ],
      },
      {
        handle: "#",
        title: "Misc & Fixtures",
        children: [
          { handle: "track-lights", title: "Track Lights" },
          { handle: "under-cabinet-lights", title: "Under Cabinet Lights" },
          { handle: "hexagon-garage-lights", title: "Hexagon LED Garage Lights" },
          { handle: "explosion-proof-lighting", title: "Explosion Proof Lighting" },
          { handle: "pendant-light", title: "Pendant Light" },
          { handle: "exhaust-fan", title: "Exhaust Fan" },
        ],
      },
    ],
  },
  {
    handle: "residential",
    title: "Residential",
    children: [
      { handle: "led-bulb", title: "LED Bulb" },
      { handle: "downlight", title: "Downlight" },
      { handle: "flush-mount", title: "Flush Mount" },
      { handle: "trimless-downlight", title: "Trimless Downlight" },
      { handle: "retrofit-can-lights", title: "Retrofit Can Lights" },
      { handle: "batten-light", title: "Batten Light" },
      { handle: "led-light-mirror", title: "LED Light Mirror" },
    ],
  },
  {
    handle: "outdoor",
    title: "Outdoor",
    children: [
      {
        handle: "#",
        title: "Flood & Area",
        children: [
          { handle: "led-area-lights", title: "LED Area Lights" },
          { handle: "led-flood-lights", title: "LED Flood Lights" },
          { handle: "wall-pack", title: "Wall Pack" },
          { handle: "canopy-light", title: "Canopy Light" },
          { handle: "security-lights", title: "Security Lights" },
        ],
      },
      {
        handle: "#",
        title: "Landscape & Decor",
        children: [
          { handle: "landscaping-light", title: "Landscaping Light" },
          { handle: "post-light", title: "Post Light" },
          { handle: "bollard-lights", title: "Bollard Lights" },
          { handle: "up-down-sconce", title: "Up Down Sconce Lights" },
          { handle: "rgb-wall-washer", title: "RGB Wall Washer" },
        ],
      },
      {
        handle: "#",
        title: "Accessories & Bulbs",
        children: [
          { handle: "led-light-brackets", title: "LED Light Brackets" },
          { handle: "pole", title: "Pole" },
          { handle: "corn-bulb", title: "Corn Bulb" },
          { handle: "landscaping-transformer", title: "Landscaping Transformer" },
          { handle: "double-sided-tube", title: "Double Sided Tube Light" },
        ],
      },
    ],
  },
  {
    handle: "strip",
    title: "Strip",
    children: [
      {
        handle: "#",
        title: "Strips & Tapes",
        children: [
          { handle: "12v-cob-strip", title: "12V COB LED Strip Light" },
          { handle: "24v-cob-strip", title: "24V COB LED Strip Light" },
          { handle: "waterproof-led-tape", title: "Waterproof LED Tape" },
          { handle: "led-sheet-roll", title: "LED Sheet Roll" },
          { handle: "module", title: "Module" },
        ],
      },
      {
        handle: "#",
        title: "Power & Controls",
        children: [
          { handle: "power-supply", title: "Power Supply" },
          { handle: "dimmable-power-supply", title: "Dimmable Power Supply" },
          { handle: "dimmer-switch", title: "Dimmer Switch" },
          { handle: "controller-remote", title: "Controller & Remote" },
          { handle: "connector", title: "Connector" },
          { handle: "aluminum-track", title: "Aluminum Track" },
        ],
      },
    ],
  },
  {
    handle: "emergency",
    title: "Emergency",
    children: [
      { handle: "led-exit-signs", title: "LED Exit Signs" },
      { handle: "emergency-drivers", title: "Emergency Drivers" },
    ],
  },
];
