import { Product } from '../types/store';

export interface CategoryItem {
  id: string;
  name: string;
  image: string;
  link: string;
}

export interface SpaceItem {
  id: string;
  name: string;
  image: string;
  link: string;
}

export interface ReviewVideoItem {
  id: string;
  title: string;
  thumbnail: string;
  location: string;
}

export interface ProductItem {
  id: string;
  handle?: string;
  title: string;
  category: string;
  tab: 'commercial' | 'outdoor' | 'residential';
  originalPrice: string;
  salePrice: string;
  image: string;
  badge?: string;
  hasFrom?: boolean;
}

export const topBarData = {
  announcement: "Free Shipping Above Orders $99",
  phone: "(470)-939-0782",
  hours: "Monday - Sunday 5am - 5pm (PST)",
  promoCenter: "FREE SHIPPING / AUTOMATIC VOLUME DISCOUNT",
  bulkInquiries: "Bulk and Commercial Inquiries"
};

export const storeInfo = {
  name: "Switch To LED",
  brandName: "SWITCHTOLED",
  tagline: "High Efficiency Commercial & Architectural LED Solutions",
  phone: "(470)-939-0782",
  phoneDisplay: "(470)-939-0782",
  hours: "Monday - Sunday 5am - 5pm (PST)",
  email: "support@switchtoled.com",
  address: "Atlanta, GA • Direct Factory Warehouse Distribution",
  freeShippingThreshold: 99,
  announcements: [
    "Free Shipping Above Orders $99",
    "Contractor Volume Discounts Auto-Applied at Checkout",
    "DLC 5.1 Premium & UL Certified Fixtures — In Stock Ships in 24h"
  ]
};

export interface NavMegaItem {
  name: string;
  image: string;
  link: string;
}

export interface NavCategory {
  name: string;
  href: string;
  hasDropdown: boolean;
  items?: NavMegaItem[];
}

export const navCategories: NavCategory[] = [
  { name: "HOME", href: "/", hasDropdown: false },
  { 
    name: "OUR LED LIGHTING", 
    href: "/collections/all", 
    hasDropdown: true,
    items: [
      { name: "LED BULB", image: "/images/18-Picsart-AiImageEnhancer_640x.jpg", link: "/collections/led-bulbs" },
      { name: "DOWNLIGHT", image: "/images/14_505e5f36-350c-4bb3-850b-08f73fec4141_370x.jpeg", link: "/collections/led-downlights" },
      { name: "FLUSH MOUNT", image: "/images/15_ff70b1c7-9610-4451-bd7e-20335fcce83e_370x.jpeg", link: "/collections/flush-mount" },
      { name: "TRIMLESS DOWNLIGHT", image: "/images/17_3d7aeaae-7cfc-4e18-aaf2-06fc257f6228_370x.jpeg", link: "/collections/trimless-downlight" },
      { name: "RETROFIT CAN LIGHTS", image: "/images/11_c8f5e867-f13f-4bc7-a1a0-0f9120947f40_370x.jpeg", link: "/collections/retrofit-can-lights" },
      { name: "BATTEN LIGHT", image: "/images/19-Picsart-AiImageEnhancer_640x.jpg", link: "/collections/batten-lights" },
      { name: "LED LIGHT MIRROR", image: "/images/16-Picsart-AiImageEnhancer_640x.jpg", link: "/collections/mirror-lights" },
      { name: "TUBE LIGHTS", image: "/images/13-Picsart-AiImageEnhancer_640x.jpg", link: "/collections/tube-lights" }
    ]
  },
  { 
    name: "COMMERCIAL", 
    href: "/collections/commercial-industrial", 
    hasDropdown: true,
    items: [
      { name: "LED FLAT PANELS", image: "/images/Selectable-Wattage-LED-Panel_640x.jpg", link: "/collections/led-panel-lights" },
      { name: "LED TROFFERS", image: "/images/2x2-led-center-basket-troffer-light-4-pack-5200lm-selectable-cct-dimmable_640x.jpg", link: "/collections/troffer-lights" },
      { name: "LINEAR HIGH BAYS", image: "/images/8ft_led_shop_light_fixture_cct_selecatable_640x.jpg", link: "/collections/linear-high-bays" },
      { name: "UFO HIGH BAYS", image: "/images/ufo-led-high-bay-light-single-fixture-plug-play-150w-120w-100w_640x.jpg", link: "/collections/ufo-high-bays" },
      { name: "GRID FRAMES", image: "/images/2_2_FT_Edge-Lit_Frame_amp_T-Grid_LED_Panel_Lights_4_Pack_640x.jpg", link: "/collections/grid-frames" },
      { name: "LINEAR FIXTURES", image: "/images/4FT_Black_LED_Linear_Light_4_Pack_640x.jpg", link: "/collections/linear-fixtures" },
      { name: "VAPOR TIGHTS", image: "/images/20-Picsart-AiImageEnhancer_640x.jpg", link: "/collections/vapor-tights" },
      { name: "CANOPY LIGHTS", image: "/images/7_f43c6af2-2be4-4b3e-8a86-f36face86bde_370x.jpeg", link: "/collections/canopy-lights" }
    ]
  },
  { 
    name: "RESIDENTIAL", 
    href: "/collections/all", 
    hasDropdown: true,
    items: [
      { name: "LED BULB", image: "/images/18-Picsart-AiImageEnhancer_640x.jpg", link: "/collections/led-bulbs" },
      { name: "DOWNLIGHT", image: "/images/14_505e5f36-350c-4bb3-850b-08f73fec4141_370x.jpeg", link: "/collections/led-downlights" },
      { name: "FLUSH MOUNT", image: "/images/15_ff70b1c7-9610-4451-bd7e-20335fcce83e_370x.jpeg", link: "/collections/flush-mount" },
      { name: "TRIMLESS DOWNLIGHT", image: "/images/17_3d7aeaae-7cfc-4e18-aaf2-06fc257f6228_370x.jpeg", link: "/collections/trimless-downlight" },
      { name: "RETROFIT CAN LIGHTS", image: "/images/11_c8f5e867-f13f-4bc7-a1a0-0f9120947f40_370x.jpeg", link: "/collections/retrofit-can-lights" },
      { name: "BATTEN LIGHT", image: "/images/19-Picsart-AiImageEnhancer_640x.jpg", link: "/collections/batten-lights" },
      { name: "LED LIGHT MIRROR", image: "/images/16-Picsart-AiImageEnhancer_640x.jpg", link: "/collections/mirror-lights" }
    ]
  },
  { 
    name: "OUTDOOR", 
    href: "/collections/outdoor-lighting", 
    hasDropdown: true,
    items: [
      { name: "LED SHOEBOX LIGHTS", image: "/images/300W-LED-Parking-Lot-Light-1-Pack_640x.jpg", link: "/collections/shoebox-lights" },
      { name: "WALL PACKS", image: "/images/12_fcd611f8-493f-48de-97d9-afc5fbca0572_370x.jpeg", link: "/collections/wall-packs" },
      { name: "CANOPY LIGHTS", image: "/images/7_f43c6af2-2be4-4b3e-8a86-f36face86bde_370x.jpeg", link: "/collections/canopy-lights" },
      { name: "FLOOD LIGHTS", image: "/images/300W-LED-Parking-Lot-Light-IP65-Waterproof_640x.jpg", link: "/collections/flood-lights" },
      { name: "AREA LIGHTS", image: "/images/2-Picsart-AiImageEnhancer_1_640x.jpg", link: "/collections/area-lights" },
      { name: "BARN LIGHTS", image: "/images/ufo-led-high-bay-light-single-fixture-plug-play-150w-120w-100w_640x.jpg", link: "/collections/barn-lights" }
    ]
  },
  { 
    name: "STRIP", 
    href: "/collections/led-strip-lights", 
    hasDropdown: true,
    items: [
      { name: "LED SHEET ROLLS", image: "/images/Switchtoled_backlight_sheet_640x.jpg", link: "/collections/sheet-rolls" },
      { name: "GOLD SHEET ROLL", image: "/images/led_backlight_sheet_gold_roll_640x.jpg", link: "/collections/gold-sheet-roll" },
      { name: "FLEXIBLE LED SHEET", image: "/images/switchtoled_flexible_led_sheet_640x.jpg", link: "/collections/flexible-led-sheet" },
      { name: "RGBW COLOR SHEET", image: "/images/2_3d2dacb3-c239-4218-af8d-d055144054ac_640x.jpg", link: "/collections/rgbw-color-sheet" },
      { name: "COB TAPE LIGHT", image: "/images/Home_Decor_Lighting.jpeg", link: "/collections/cob-led-strip-lights" },
      { name: "POWER SUPPLIES", image: "/images/14_505e5f36-350c-4bb3-850b-08f73fec4141_370x.jpeg", link: "/collections/power-supplies" }
    ]
  },
  { 
    name: "EMERGENCY", 
    href: "/collections/emergency-exit", 
    hasDropdown: true,
    items: [
      { name: "EXIT SIGNS COMBO", image: "/images/Exit_lights_combo_640x.jpeg", link: "/collections/exit-signs-combo" },
      { name: "FIRE RESISTANT EXIT SIGN", image: "/images/fire_resistant_exit_sign_640x.jpeg", link: "/collections/fire-resistant-exit-sign" },
      { name: "EMERGENCY SKY PANELS", image: "/images/2x4-led-sky-panel-0-10v-dimmable-brightness-levels-drop-ceiling_640x.jpg", link: "/collections/emergency-sky-panels" },
      { name: "BATTERY BACKUP DRIVERS", image: "/images/6-Picsart-AiImageEnhancer_1_640x.jpg", link: "/collections/battery-backup-drivers" }
    ]
  }
];


export const heroGridData = {
  large: {
    title: "One Trusted Source For All Your LED Lighting Needs",
    subtitle: "LED Lighting Solutions\nFast U.S. Shipping & Expert Support",
    image: "/images/hero_one_trusted_source.png",
    cta: "Shop Now",
    link: "/collections/all"
  },
  items: [
    {
      id: "panel",
      title: "LED FLAT PANEL LIGHTS",
      image: "/images/led_flat_panel_lights_640x.jpeg",
      cta: "Shop Now",
      link: "/collections/led-panel-lights"
    },
    {
      id: "bulk",
      title: "Bulk Discounts",
      subtitle: "Volume Discounts + Free Shipping\nAuto-Calculated at Checkout",
      image: "/images/bulk_discounts_and_free_shippings_at_switchtoled_640x.jpeg",
      cta: "Shop Now",
      link: "/collections/all",
      isCustomText: true
    },
    {
      id: "shoebox",
      title: "LED SHOEBOX LIGHT",
      image: "/images/led_outdoor_lighting_640x.jpeg",
      cta: "Shop Now",
      link: "/collections/outdoor-lighting"
    },
    {
      id: "shipping",
      title: "Free Shipping",
      subtitle: "On Orders $99+\nShips Within One Business Day",
      image: "/images/Free_shipping_and_discount_coupons_640x.jpeg",
      cta: "Shop Now",
      link: "/collections/all",
      isCustomText: true
    }
  ]
};

export const categoriesCatalog: CategoryItem[] = [
  { id: "1", name: "LED Panels", image: "/images/Selectable-Wattage-LED-Panel_640x.jpg", link: "/collections/led-panel-lights" },
  { id: "2", name: "LED Troffers", image: "/images/2x2-led-center-basket-troffer-light-4-pack-5200lm-selectable-cct-dimmable_640x.jpg", link: "/collections/troffer-lights" },
  { id: "3", name: "Emergency Panels", image: "/images/2x4-led-sky-panel-0-10v-dimmable-brightness-levels-drop-ceiling_640x.jpg", link: "/collections/emergency-exit" },
  { id: "4", name: "Linear High Bays", image: "/images/8ft_led_shop_light_fixture_cct_selecatable_640x.jpg", link: "/collections/commercial-industrial" },
  { id: "5", name: "Grid Frames", image: "/images/2_2_FT_Edge-Lit_Frame_amp_T-Grid_LED_Panel_Lights_4_Pack_640x.jpg", link: "/collections/led-panel-lights" },
  { id: "6", name: "Linear Fixtures", image: "/images/4FT_Black_LED_Linear_Light_4_Pack_640x.jpg", link: "/collections/led-strip-lights" },
  { id: "7", name: "Vapor Tights", image: "/images/20-Picsart-AiImageEnhancer_640x.jpg", link: "/collections/commercial-industrial" },
  { id: "8", name: "Tube Lights", image: "/images/13-Picsart-AiImageEnhancer_640x.jpg", link: "/collections/commercial-industrial" },
  { id: "9", name: "UFO High Bays", image: "/images/ufo-led-high-bay-light-single-fixture-plug-play-150w-120w-100w_640x.jpg", link: "/collections/commercial-industrial" },
  { id: "10", name: "Canopy Lights", image: "/images/7_f43c6af2-2be4-4b3e-8a86-f36face86bde_370x.jpeg", link: "/collections/outdoor-lighting" },
  { id: "11", name: "Area Lights", image: "/images/300W-LED-Parking-Lot-Light-1-Pack_640x.jpg", link: "/collections/outdoor-lighting" },
  { id: "12", name: "Wall Packs", image: "/images/12_fcd611f8-493f-48de-97d9-afc5fbca0572_370x.jpeg", link: "/collections/outdoor-lighting" }
];

export const shopBySpacesCatalog: SpaceItem[] = [
  { id: "s1", name: "WAREHOUSE LIGHTS", image: "/images/1-Picsart-AiImageEnhancer_640x.jpg", link: "/collections/commercial-industrial" },
  { id: "s2", name: "DOWNLIGHTS", image: "/images/2-Picsart-AiImageEnhancer_640x.jpg", link: "/collections/led-downlights" },
  { id: "s3", name: "OFFICE LIGHTS", image: "/images/3-Picsart-AiImageEnhancer_640x.jpg", link: "/collections/led-panel-lights" },
  { id: "s4", name: "HEXAGON GARAGE LIGHTS", image: "/images/4-Picsart-AiImageEnhancer_640x.jpg", link: "/collections/commercial-industrial" },
  { id: "s5", name: "LINEAR FIXTURE LIGHTS", image: "/images/5-Picsart-AiImageEnhancer_640x.jpg", link: "/collections/led-strip-lights" },
  { id: "s6", name: "CEILING PANEL LIGHTS", image: "/images/7-Picsart-AiImageEnhancer_640x.jpg", link: "/collections/led-panel-lights" },
  { id: "s7", name: "LED TROFFER LIGHTS", image: "/images/6-Picsart-AiImageEnhancer_640x.jpg", link: "/collections/troffer-lights" },
  { id: "s8", name: "LED SHEET ROLL LIGHTS", image: "/images/8-Picsart-AiImageEnhancer_640x.jpg", link: "/collections/led-strip-lights" }
];

export const reviewVideos: ReviewVideoItem[] = [
  { id: "v1", title: "Gas Station Canopy Retrofit", thumbnail: "/images/72e14f471b224432973fb749a882d593.thumbnail.0000000000_600x.jpg", location: "Shell Station • Atlanta, GA" },
  { id: "v2", title: "Retail Convenience Store Fixtures", thumbnail: "/images/7136b66a13804423838b56f6eeebfa92.thumbnail.0000000000_600x.jpg", location: "Commercial Mart • Charlotte, NC" },
  { id: "v3", title: "Commercial Car Wash Bay Installation", thumbnail: "/images/0043677ff89348619df56b00602c2204.thumbnail.0000000000_600x.jpg", location: "Express Wash • Dallas, TX" },
  { id: "v4", title: "Outdoor Canopy & Perimeter Lighting", thumbnail: "/images/72e14f471b224432973fb749a882d593.thumbnail.0000000000_600x.jpg", location: "Carport Plaza • Tampa, FL" }
];

export const showcaseProducts: ProductItem[] = [
  // Commercial (8 items - 2 full rows of 4)
  {
    id: "p1",
    handle: "2x4-led-flat-panel-selectable-wattage-cct",
    title: "2x4 LED Flat Panel Troffer Lights, 5CCT 3000K-6500K, 30W-72W Dimmable, 3750-9000Lumens, Recessed Drop...",
    category: "Commercial Fixtures",
    tab: "commercial",
    originalPrice: "$115.00",
    salePrice: "$103.50",
    image: "/images/2x4_LED_Flat_Panel_Troffer_Lights_640x.jpg",
    badge: "Sale",
    hasFrom: true
  },
  {
    id: "p2",
    handle: "2x2-led-flat-panel-40w-cct-selectable",
    title: "2×2 LED Flat Panel Light 20W/25W/30W/35W/40W Selectable, 3K/3.5K/4K/5K/6.5K 5CCT, 2500–50...",
    category: "Commercial Fixtures",
    tab: "commercial",
    originalPrice: "$125.00",
    salePrice: "$112.50",
    image: "/images/2x2-LED-Panels-4-Pack_640x.jpg",
    badge: "Sale",
    hasFrom: true
  },
  {
    id: "p3",
    handle: "8ft-led-vapor-tight-fixture-80w",
    title: "8FT Black LED Linear Light – 80W Commercial LED Ceiling Fixture, 9600 Lumens, 0-10V Dimmable, 5CCT...",
    category: "Architectural Linear",
    tab: "commercial",
    originalPrice: "$231.00",
    salePrice: "$210.00",
    image: "/images/8FT_Black_LED_Linear_Light_4_Pack_640x.jpg",
    badge: "Sale",
    hasFrom: true
  },
  {
    id: "p4",
    handle: "150w-ufo-led-high-bay-light-compact",
    title: "UFO LED High Bay Light, 100W/120W/150W Selectable, Plug & Play Warehouse Lighting, 22,500...",
    category: "High Bay Fixtures",
    tab: "commercial",
    originalPrice: "$30.80",
    salePrice: "$28.00",
    image: "/images/ufo-led-high-bay-light-single-fixture-plug-play-150w-120w-100w_640x.jpg",
    badge: "Sale",
    hasFrom: true
  },
  {
    id: "p5",
    handle: "1x4-led-flat-panel-36w-selectable",
    title: "1x4 LED Flat Panel Troffer Light, Surface & Recessed Mount, 40W 5000 Lumens, 5CCT Selectable...",
    category: "Commercial Fixtures",
    tab: "commercial",
    originalPrice: "$149.05",
    salePrice: "$135.50",
    image: "/images/1x4_LED_Flat_Panel_Light_Surface_Mount_640x.jpg",
    badge: "Sale",
    hasFrom: true
  },
  {
    id: "p6",
    handle: "2x4-architectural-center-basket-troffer",
    title: "2x4 LED Color Changing Sky Panel Light, App & Remote Controlled, Color Adjustable...",
    category: "Commercial Fixtures",
    tab: "commercial",
    originalPrice: "$329.00",
    salePrice: "$296.10",
    image: "/images/4-pack-2x4-led-sky-panel-lights-72w-6500k-dimmable-drop-ceiling_640x.jpg",
    badge: "Sale",
    hasFrom: false
  },
  {
    id: "p7",
    handle: "2x2-center-basket-troffer-30w",
    title: "2x2 Center Basket LED Troffer Light 4-Pack, Backlit Drop Ceiling Light, Recessed Lay...",
    category: "Commercial Fixtures",
    tab: "commercial",
    originalPrice: "$267.30",
    salePrice: "$243.00",
    image: "/images/2x2-led-center-basket-troffer-0-10v-dimmable-office-light_640x.jpg",
    badge: "Sale",
    hasFrom: true
  },
  {
    id: "p8",
    handle: "4ft-led-vapor-tight-fixture-40w",
    title: "4FT Black Architectural Linear Fixture 4-Pack, 2800/3700/5200LM, 20W/30W/40W...",
    category: "Architectural Linear",
    tab: "commercial",
    originalPrice: "$160.00",
    salePrice: "$144.00",
    image: "/images/4FT_Black_LED_Linear_Light_4_Pack_640x.jpg",
    badge: "Sale",
    hasFrom: true
  },

  // Outdoor (8 items - 2 full rows of 4)
  {
    id: "p9",
    handle: "300w-led-shoebox-parking-lot-light-high-output",
    title: "300W LED Parking Lot Light, 1000W Metal Halide Equivalent, 40,500 Lumens, 5000K Cool White, Type III-M...",
    category: "Area & Parking Lot",
    tab: "outdoor",
    originalPrice: "$137.50",
    salePrice: "$125.00",
    image: "/images/300W-LED-Parking-Lot-Light-1-Pack_640x.jpg",
    badge: "Sale",
    hasFrom: true
  },
  {
    id: "p10",
    handle: "100w-commercial-led-canopy-gas-station-light",
    title: "150W LED Gas Station Canopy Light, 19,500 Lumens, 5700K Daylight, 400W Metal Halide Equivalent...",
    category: "Canopy Fixtures",
    tab: "outdoor",
    originalPrice: "$88.00",
    salePrice: "$80.00",
    image: "/images/7_f43c6af2-2be4-4b3e-8a86-f36face86bde_370x.jpeg",
    badge: "Sale",
    hasFrom: true
  },
  {
    id: "p11",
    handle: "120w-traditional-glass-refractor-wall-pack",
    title: "120W Commercial LED Wall Pack, Outdoor Security Luminaire, 15,600 Lumens, 5000K Daylight...",
    category: "Wall Packs",
    tab: "outdoor",
    originalPrice: "$110.00",
    salePrice: "$95.00",
    image: "/images/12_fcd611f8-493f-48de-97d9-afc5fbca0572_370x.jpeg",
    badge: "Sale",
    hasFrom: true
  },
  {
    id: "p12",
    handle: "50w-led-flood-light-knuckle-mount",
    title: "200W LED Flood Light Outdoor with Slip Fitter Mount, 28,000 Lumens, Waterproof IP65...",
    category: "Area & Parking Lot",
    tab: "outdoor",
    originalPrice: "$185.00",
    salePrice: "$165.00",
    image: "/images/300W-LED-Parking-Lot-Light-IP65-Waterproof_640x.jpg",
    badge: "Sale",
    hasFrom: true
  },
  {
    id: "p13",
    handle: "240w-ufo-led-high-bay-commercial-warehouse",
    title: "150W UFO LED High Bay Light, Commercial Warehouse & Barn Fixture, 21,000 Lumens...",
    category: "High Bay Fixtures",
    tab: "outdoor",
    originalPrice: "$45.00",
    salePrice: "$38.00",
    image: "/images/ufo-led-high-bay-light-wattage-selectable-150w-120w-100w-lumens_640x.jpg",
    badge: "Sale",
    hasFrom: true
  },
  {
    id: "p14",
    handle: "80w-led-wall-pack-rotatable-cutoff",
    title: "80W Semi-Cutoff LED Wall Pack, Bronze Aluminum Housing, 10,400 Lumens, Dusk-to-Dawn Photocell...",
    category: "Wall Packs",
    tab: "outdoor",
    originalPrice: "$89.00",
    salePrice: "$78.00",
    image: "/images/2-Picsart-AiImageEnhancer_1_640x.jpg",
    badge: "Sale",
    hasFrom: true
  },
  {
    id: "p15",
    handle: "150w-led-shoebox-parking-lot-light",
    title: "40W LED Dusk to Dawn Security Barn Light, 5200 Lumens, Heavy Duty Outdoor Fixture...",
    category: "Outdoor Fixtures",
    tab: "outdoor",
    originalPrice: "$58.00",
    salePrice: "$49.00",
    image: "/images/1_af9adb42-601d-4caf-9fab-62b31d41cd21_640x.jpg",
    badge: "Sale",
    hasFrom: true
  },
  {
    id: "p16",
    handle: "150w-ufo-led-high-bay-light-compact",
    title: "240W LED Parking Lot Shoebox Fixture, 36,000 Lumens, Type III Distribution, 0-10V Dimmable...",
    category: "Area & Parking Lot",
    tab: "outdoor",
    originalPrice: "$198.00",
    salePrice: "$179.00",
    image: "/images/led_outdoor_lighting_640x.jpeg",
    badge: "Sale",
    hasFrom: true
  },

  // Residential (8 items - 2 full rows of 4)
  {
    id: "p17",
    handle: "cob-led-strip-24v-high-density-warm-white",
    title: "16.4ft x 9.45in Giant LED Sheet Roll, 24V 6000K Cool White Flexible Cuttable Dimmable LED Backlight...",
    category: "Backlight Sheets",
    tab: "residential",
    originalPrice: "$220.00",
    salePrice: "$200.00",
    image: "/images/Switchtoled_backlight_sheet_640x.jpg",
    badge: "Sale",
    hasFrom: false
  },
  {
    id: "p18",
    handle: "tunable-white-cob-led-strip-24v",
    title: "COB LED Strip Lights Warm White 3000K, 32.8FT (10M) High Density 24V Flexible Dotless Tape Light...",
    category: "Linear Strip Light",
    tab: "residential",
    originalPrice: "$79.00",
    salePrice: "$68.00",
    image: "/images/Home_Decor_Lighting.jpeg",
    badge: "Sale",
    hasFrom: true
  },
  {
    id: "p19",
    handle: "6-inch-ultra-thin-canless-wafer-downlight",
    title: "Ultra-Thin Recessed 6-Inch Canless Downlight 6-Pack with Junction Box, 5CCT Selectable...",
    category: "Residential Fixtures",
    tab: "residential",
    originalPrice: "$85.00",
    salePrice: "$74.50",
    image: "/images/14_505e5f36-350c-4bb3-850b-08f73fec4141_370x.jpeg",
    badge: "Sale",
    hasFrom: true
  },
  {
    id: "p20",
    handle: "2x2-led-flat-panel-40w-cct-selectable",
    title: "Modern Round Flush Mount LED Ceiling Light Fixture 12-Inch, 24W Brushed Nickel, 3000K-5000K...",
    category: "Residential Fixtures",
    tab: "residential",
    originalPrice: "$62.00",
    salePrice: "$54.00",
    image: "/images/15_ff70b1c7-9610-4451-bd7e-20335fcce83e_370x.jpeg",
    badge: "Sale",
    hasFrom: true
  },
  {
    id: "p21",
    handle: "4-inch-deep-regress-anti-glare-downlight",
    title: "Trimless Plaster-In Architectural Downlight, Deep Baffle Anti-Glare 15W COB LED...",
    category: "Residential Fixtures",
    tab: "residential",
    originalPrice: "$48.00",
    salePrice: "$42.00",
    image: "/images/17_3d7aeaae-7cfc-4e18-aaf2-06fc257f6228_370x.jpeg",
    badge: "Sale",
    hasFrom: true
  },
  {
    id: "p22",
    handle: "6-inch-retrofit-baffle-downlight-trim",
    title: "Recessed Retrofit Can Light Baffle 6-Pack with E26 Socket Adapter, Dimmable 12W 5CCT...",
    category: "Residential Fixtures",
    tab: "residential",
    originalPrice: "$69.00",
    salePrice: "$59.00",
    image: "/images/11_c8f5e867-f13f-4bc7-a1a0-0f9120947f40_370x.jpeg",
    badge: "Sale",
    hasFrom: true
  },
  {
    id: "p23",
    handle: "4ft-led-vapor-tight-fixture-40w",
    title: "Slim LED Batten Linear Light Fixture 4FT, 36W Linkable Surface Ceiling Mount...",
    category: "Residential Fixtures",
    tab: "residential",
    originalPrice: "$38.00",
    salePrice: "$32.00",
    image: "/images/19-Picsart-AiImageEnhancer_640x.jpg",
    badge: "Sale",
    hasFrom: true
  },
  {
    id: "p24",
    handle: "2x4-led-flat-panel-selectable-wattage-cct",
    title: "Frameless Backlit LED Bathroom Vanity Mirror with Touch Sensor & Anti-Fog Demister Pad...",
    category: "Residential Fixtures",
    tab: "residential",
    originalPrice: "$180.00",
    salePrice: "$159.00",
    image: "/images/16-Picsart-AiImageEnhancer_640x.jpg",
    badge: "Sale",
    hasFrom: false
  }
];

export const footerLinks = {
  shopBy: [
    { title: "2x4 LED Flat Panels", href: "#panels" },
    { title: "2x2 Center Basket Troffers", href: "#troffers" },
    { title: "8FT Architectural Linear Lights", href: "#linear" },
    { title: "UFO High Bay Lights", href: "#ufo" },
    { title: "LED Shoebox Parking Lights", href: "#outdoor" },
    { title: "Cuttable Backlight Sheets", href: "#residential" }
  ],
  quickLinks: [
    { title: "Track Your Order", href: "#track" },
    { title: "Bulk Contractor Quote", href: "#quote" },
    { title: "Shipping & Delivery Policy", href: "#shipping" },
    { title: "DLC 5.1 Qualified Specs", href: "#dlc" }
  ],
  legal: [
    { title: "Privacy Policy", href: "#privacy" },
    { title: "Terms of Service", href: "#terms" },
    { title: "Return & Refund Policy", href: "#returns" },
    { title: "Warranty Coverage (5-Year)", href: "#warranty" }
  ]
};

export const productsCatalog: Product[] = showcaseProducts.map((p) => {
  const priceNum = parseFloat(p.salePrice.replace('$', ''));
  const origPriceNum = parseFloat(p.originalPrice.replace('$', ''));
  return {
    id: p.id,
    title: p.title,
    description: "Specification grade luminaire engineered with DLC 5.1 Premium certification and 0-10V dimmable drivers.",
    category: p.category,
    tab: p.tab === 'commercial' ? 'commercial' : p.tab === 'outdoor' ? 'outdoor' : 'sheets',
    price: priceNum,
    originalPrice: origPriceNum,
    rating: 4.9,
    reviewsCount: 38,
    image: p.image,
    badge: p.badge || 'Sale',
    specs: ["DLC 5.1 Premium", "5CCT Selectable", "0-10V Dimmable", "5-Yr Warranty"],
    inStock: true
  };
});


