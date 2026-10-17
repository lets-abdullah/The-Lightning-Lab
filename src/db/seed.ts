try {
  process.loadEnvFile();
} catch {
  // .env may already be in process.env
}

import { sql } from "drizzle-orm";
import type {
  FacetConfig,
  Media,
  ProductOption,
  BulkTier,
  ProductSpecs,
} from "@/lib/commerce/types";

async function runSeed() {
  const { db } = await import("./index");
  const {
    collections,
    products,
    productVariants,
    reviews,
    blogPosts,
    pages,
    discounts,
  } = await import("./schema");

  console.log("Starting deterministic database seed...");

  // Truncate tables touched by seed for deterministic re-runs
  await db.execute(sql`
    TRUNCATE TABLE
      reviews,
      quote_lines,
      quotes,
      order_lines,
      orders,
      addresses,
      customers,
      product_variants,
      products,
      collections,
      blog_posts,
      pages,
      discounts
    CASCADE;
  `);

  const commonFilters: FacetConfig[] = [
    {
      key: "price",
      label: "Price",
      type: "range",
    },
    {
      key: "wattage",
      label: "Wattage",
      type: "checkbox",
      options: ["30W", "40W", "50W", "60W", "100W", "150W", "200W"],
    },
    {
      key: "cct",
      label: "Color Temperature",
      type: "checkbox",
      options: ["3000K", "3500K", "4000K", "5000K", "5CCT Selectable"],
    },
    {
      key: "certification",
      label: "Certifications",
      type: "checkbox",
      options: ["DLC 5.1 Premium", "UL Listed", "ETL Listed", "Energy Star"],
    },
  ];

  // 15+ Collections taxonomy (8 top-level + 9 children = 17 collections)
  const collectionData = [
    // Top-level
    {
      handle: "led-strip-lights",
      title: "LED Strip Lights",
      description: "Commercial and architectural grade linear tape lights for cove, millwork, and accent lighting.",
      parentHandle: null,
      productCount: 8,
      seo: {
        title: "Commercial LED Strip Lights & Linear Tape | The Lightning Lab",
        description: "High CRI architectural LED strip lights, 24V tape lighting, and custom lengths with next-day shipping.",
      },
      filters: commonFilters,
      faqs: [
        {
          question: "What voltage is recommended for long strip light runs?",
          answer: "For runs exceeding 16 feet, 24V DC is strongly recommended over 12V to prevent voltage drop and ensure uniform brightness along the entire length.",
        },
      ],
    },
    {
      handle: "led-panel-lights",
      title: "LED Panel Lights",
      description: "Ultra-thin edgelit and backlit drop ceiling troffers and flat panels for offices, schools, and healthcare facilities.",
      parentHandle: null,
      productCount: 8,
      seo: {
        title: "LED Drop Ceiling Flat Panels & Troffers | The Lightning Lab",
        description: "DLC 5.1 Premium architectural LED flat panels in 2x4, 2x2, and 1x4 sizes. 0-10V dimmable standard.",
      },
      filters: commonFilters,
      faqs: [
        {
          question: "Are your flat panels DLC 5.1 Premium qualified for utility rebates?",
          answer: "Yes, all our architectural flat panels are DLC 5.1 Premium certified, delivering up to 135 lumens per watt to qualify for the highest tier rebates.",
        },
      ],
    },
    {
      handle: "led-downlights",
      title: "LED Downlights",
      description: "Recessed architectural downlights and commercial canless fixtures with selectable CCT and deep anti-glare baffles.",
      parentHandle: null,
      productCount: 6,
      seo: {
        title: "Commercial Recessed LED Downlights | The Lightning Lab",
        description: "IC-rated, airtight recessed downlights with multi-wattage and selectable color temperatures.",
      },
      filters: commonFilters,
      faqs: [
        {
          question: "Do these recessed downlights require a traditional housing canister?",
          answer: "No, our canless downlights include an attached remote junction box and spring clips that mount directly into drywall.",
        },
      ],
    },
    {
      handle: "outdoor-lighting",
      title: "Commercial Outdoor Lighting",
      description: "Heavy-duty shoebox parking lot fixtures, dusk-to-dawn wall packs, and architectural flood lights with IP65+ weatherproofing.",
      parentHandle: null,
      productCount: 6,
      seo: {
        title: "Outdoor Commercial LED Lighting Fixtures | The Lightning Lab",
        description: "Industrial grade LED parking lot lights, flood lights, and wall packs rated for wet locations.",
      },
      filters: commonFilters,
      faqs: [
        {
          question: "What optical distribution is best for parking lot lighting?",
          answer: "Type III distribution is ideal for perimeter parking stalls and roadways, while Type V provides 360-degree radial coverage for open interior parking bays.",
        },
      ],
    },
    {
      handle: "commercial-industrial",
      title: "Commercial & Industrial High Bays",
      description: "High-output UFO round high bays and linear warehouse luminaires engineered for 15ft to 40ft ceiling mounting heights.",
      parentHandle: null,
      productCount: 6,
      seo: {
        title: "Industrial UFO High Bay Lights & Warehouse Luminaires | The Lightning Lab",
        description: "High-efficacy industrial LED high bays delivering up to 36,000 lumens with 6kV surge protection.",
      },
      filters: commonFilters,
      faqs: [
        {
          question: "How do I choose between 100W, 150W, and 240W high bays?",
          answer: "As a rule of thumb: 100W for 12-18ft ceilings, 150W for 18-25ft ceilings, and 200W-240W for 25ft+ warehouse ceilings.",
        },
      ],
    },
    {
      handle: "emergency-exit",
      title: "Emergency & Exit Lighting",
      description: "UL 924 compliant battery backup emergency lights, illuminated exit signs, and combination architectural fixtures.",
      parentHandle: null,
      productCount: 4,
      seo: {
        title: "UL 924 Emergency Lights & LED Exit Signs | The Lightning Lab",
        description: "Code-compliant LED emergency exit signs and 90-minute battery backup emergency luminaires.",
      },
      filters: commonFilters,
      faqs: [
        {
          question: "What runtime is required for code-compliant emergency fixtures?",
          answer: "UL 924 mandates a minimum of 90 minutes of emergency illumination upon loss of primary AC power.",
        },
      ],
    },
    {
      handle: "smart-lighting",
      title: "Smart Lighting Controls & Sensors",
      description: "Zigbee, Bluetooth mesh, and 0-10V daylight harvesting occupancy sensors and networked room controllers.",
      parentHandle: null,
      productCount: 6,
      seo: {
        title: "Commercial Smart Lighting Sensors & Controls | The Lightning Lab",
        description: "Networked lighting controls, microwave motion sensors, and multi-zone commercial dimming interfaces.",
      },
      filters: commonFilters,
    },
    {
      handle: "accessories",
      title: "LED Power Supplies & Drivers",
      description: "Constant voltage 24V Class 2 LED drivers, 0-10V dimmable power packs, and architectural aluminum channels.",
      parentHandle: null,
      productCount: 6,
      seo: {
        title: "Commercial LED Drivers & Aluminum Channels | The Lightning Lab",
        description: "UL Listed Class 2 power supplies, junction box drivers, and extruded aluminum mounting channels.",
      },
      filters: commonFilters,
    },

    // Children of led-strip-lights
    {
      handle: "cob-led-strip-lights",
      title: "COB LED Strip Lights",
      description: "Continuous dot-free phosphor coated Chip-on-Board LED tape for seamless diffusion without hotspots.",
      parentHandle: "led-strip-lights",
      productCount: 3,
      seo: {
        title: "Dotless COB LED Strip Lights 24V | The Lightning Lab",
        description: "Seamless chip-on-board tape lighting with 528 LEDs per meter and 90+ CRI.",
      },
      filters: commonFilters,
    },
    {
      handle: "rgb-rgbw-strip-lights",
      title: "RGB & RGBW Strip Lights",
      description: "Full spectrum color changing and dedicated 3000K/4000K white pixel addressable tape lights.",
      parentHandle: "led-strip-lights",
      productCount: 2,
      seo: {
        title: "RGBW Color Changing LED Tape Lights | The Lightning Lab",
        description: "Dynamic color changing architectural linear strips with DMX and RF control compatibility.",
      },
      filters: commonFilters,
    },
    {
      handle: "single-color-strip-lights",
      title: "Single Color Strip Lights",
      description: "Dedicated static CCT high-output strips from 2700K warm white to 6000K daylight.",
      parentHandle: "led-strip-lights",
      productCount: 2,
      seo: {
        title: "Architectural Static White LED Strips | The Lightning Lab",
        description: "Premium single bin static white LED tape for precision architectural illumination.",
      },
      filters: commonFilters,
    },
    {
      handle: "waterproof-strip-lights",
      title: "Waterproof Strip Lights",
      description: "Silicone encapsulated IP68 submersible and exterior rated LED strip lights.",
      parentHandle: "led-strip-lights",
      productCount: 1,
      seo: {
        title: "IP68 Submersible & Wet Location Strip Lights | The Lightning Lab",
        description: "Solid silicone extruded outdoor LED linear tape lights for architectural facade and landscape use.",
      },
      filters: commonFilters,
    },

    // Children of led-panel-lights
    {
      handle: "2x2-led-panels",
      title: "2x2 LED Flat Panels",
      description: "Standard 2ft x 2ft drop ceiling architectural troffers with selectable wattage and CCT.",
      parentHandle: "led-panel-lights",
      productCount: 3,
      seo: {
        title: "2x2 LED Drop Ceiling Flat Panels | The Lightning Lab",
        description: "DLC 5.1 Premium 2x2 LED panels for office and grid ceiling installations.",
      },
      filters: commonFilters,
    },
    {
      handle: "2x4-led-panels",
      title: "2x4 LED Flat Panels",
      description: "Full size 2ft x 4ft commercial flat panels delivering up to 7,500 lumens with uniform low-glare diffusion.",
      parentHandle: "led-panel-lights",
      productCount: 3,
      seo: {
        title: "2x4 Commercial LED Flat Panels | The Lightning Lab",
        description: "Energy efficient 2x4 drop ceiling troffers with 50W output and DLC Premium certification.",
      },
      filters: commonFilters,
    },
    {
      handle: "1x4-led-panels",
      title: "1x4 LED Flat Panels",
      description: "Narrow footprint 1ft x 4ft troffer panels ideal for corridors, healthcare halls, and linear utility spaces.",
      parentHandle: "led-panel-lights",
      productCount: 2,
      seo: {
        title: "1x4 Architectural LED Linear Panels | The Lightning Lab",
        description: "Slim 1x4 drop ceiling LED troffer luminaires for modern linear grid layouts.",
      },
      filters: commonFilters,
    },

    // Children of led-downlights
    {
      handle: "4-inch-downlights",
      title: "4-Inch LED Downlights",
      description: "Compact 4-inch aperture architectural recessed downlights with deep regress and selectable trim styles.",
      parentHandle: "led-downlights",
      productCount: 3,
      seo: {
        title: "4-Inch Canless Architectural Recessed Downlights | The Lightning Lab",
        description: "High CRI 4-inch recessed downlights with anti-glare reflector and junction box.",
      },
      filters: commonFilters,
    },
    {
      handle: "6-inch-downlights",
      title: "6-Inch LED Downlights",
      description: "High-output 6-inch canless commercial retrofit and new construction recessed fixtures.",
      parentHandle: "led-downlights",
      productCount: 3,
      seo: {
        title: "6-Inch Commercial Recessed LED Downlights | The Lightning Lab",
        description: "High lumen 6-inch downlights for commercial retail, hospitality, and office lobbies.",
      },
      filters: commonFilters,
    },
  ];

  await db.insert(collections).values(collectionData);
  console.log(`Inserted ${collectionData.length} collections.`);

  // 50 Products definition
  const rawProducts = [
    // 1-8: Panels
    {
      handle: "2x4-led-flat-panel-selectable-wattage-cct",
      title: "2x4 LED Flat Panel, Selectable Wattage & CCT",
      productType: "LED Panel Light",
      collections: ["led-panel-lights", "2x4-led-panels"],
      price: 5999,
      compareAtPrice: 7499,
      wattage: "30W / 40W / 50W",
      lumens: 6500,
      voltage: "120-277V",
      cct: "3500K / 4000K / 5000K",
      cri: 84,
      options: [
        { name: "Wattage", position: 1, values: ["30W", "40W", "50W"], presentation: "dropdown" as const },
        { name: "CCT", position: 2, values: ["3500K", "4000K", "5000K"], presentation: "dropdown" as const },
      ],
      features: ["DLC 5.1 Premium qualified for utility rebates", "0-10V smooth flicker-free dimming down to 10%", "Even edge-lit optical PMMA light guide plate", "Built-in earthquake clips and surface mount ready"],
      requiresFreight: true,
    },
    {
      handle: "2x2-led-flat-panel-40w-cct-selectable",
      title: "2x2 LED Flat Panel, 40W CCT Selectable",
      productType: "LED Panel Light",
      collections: ["led-panel-lights", "2x2-led-panels"],
      price: 3899,
      compareAtPrice: 4899,
      wattage: "25W / 30W / 40W",
      lumens: 5200,
      voltage: "120-277V",
      cct: "3000K / 4000K / 5000K",
      cri: 82,
      options: [
        { name: "CCT", position: 1, values: ["3000K", "4000K", "5000K"], presentation: "radio" as const },
      ],
      features: ["Backlit optical design preventing lens yellowing", "Standard T-grid ceiling drop-in installation", "130 Lumens per Watt high-efficacy chips"],
      requiresFreight: false,
    },
    {
      handle: "1x4-led-flat-panel-36w-selectable",
      title: "1x4 Commercial LED Flat Panel, 36W Selectable",
      productType: "LED Panel Light",
      collections: ["led-panel-lights", "1x4-led-panels"],
      price: 4499,
      compareAtPrice: null,
      wattage: "20W / 30W / 36W",
      lumens: 4680,
      voltage: "120-277V",
      cct: "3500K / 4000K / 5000K",
      cri: 83,
      options: [
        { name: "Wattage", position: 1, values: ["20W", "30W", "36W"], presentation: "dropdown" as const },
      ],
      features: ["Architectural 1ft x 4ft slim profile", "Universal input voltage 120-277V driver", "Damp location rated with UL listing"],
      requiresFreight: false,
    },
    {
      handle: "2x4-architectural-center-basket-troffer",
      title: "2x4 Center Basket LED Troffer Luminaire",
      productType: "LED Panel Light",
      collections: ["led-panel-lights", "2x4-led-panels"],
      price: 6899,
      compareAtPrice: 8599,
      wattage: "34W / 45W",
      lumens: 5850,
      voltage: "120-277V",
      cct: "4000K / 5000K",
      cri: 85,
      options: [
        { name: "Wattage", position: 1, values: ["34W", "45W"], presentation: "dropdown" as const },
      ],
      features: ["Indirect visual comfort with frosted curved center basket", "Ideal for educational classrooms and healthcare corridors", "Pre-wired driver with emergency battery backup knockouts"],
      requiresFreight: true,
    },
    {
      handle: "2x2-center-basket-troffer-30w",
      title: "2x2 Center Basket LED Troffer Fixture",
      productType: "LED Panel Light",
      collections: ["led-panel-lights", "2x2-led-panels"],
      price: 4299,
      compareAtPrice: null,
      wattage: "24W / 30W",
      lumens: 3900,
      voltage: "120-277V",
      cct: "3500K / 4000K",
      cri: 84,
      options: [
        { name: "Wattage", position: 1, values: ["24W", "30W"], presentation: "dropdown" as const },
      ],
      features: ["Direct/indirect optical distribution", "Eliminates glare on computer screens (UGR < 19)", "DLC Premium certified"],
      requiresFreight: false,
    },
    {
      handle: "1x4-center-basket-linear-troffer",
      title: "1x4 Center Basket Linear Architectural Troffer",
      productType: "LED Panel Light",
      collections: ["led-panel-lights", "1x4-led-panels"],
      price: 4899,
      compareAtPrice: 5999,
      wattage: "30W",
      lumens: 4050,
      voltage: "120-277V",
      cct: "4000K",
      cri: 85,
      options: [
        { name: "Length", position: 1, values: ["4FT"], presentation: "radio" as const },
      ],
      features: ["Architectural aesthetic for narrow hallways", "Class 2 constant current dimmable driver", "High reflectivity matte white powder coat finish"],
      requiresFreight: false,
    },
    {
      handle: "2x4-surface-mount-led-panel-kit",
      title: "2x4 Surface Mount LED Panel Fixture Kit",
      productType: "LED Panel Light",
      collections: ["led-panel-lights", "2x4-led-panels"],
      price: 7999,
      compareAtPrice: 9999,
      wattage: "40W / 50W",
      lumens: 6500,
      voltage: "120-277V",
      cct: "4000K / 5000K",
      cri: 83,
      options: [
        { name: "Wattage", position: 1, values: ["40W", "50W"], presentation: "dropdown" as const },
      ],
      features: ["Includes aluminum surface mount frame for drywall or concrete ceilings", "Slim 2.2-inch total depth profile", "Fast click-together frame assembly"],
      requiresFreight: true,
    },
    {
      handle: "2x2-emergency-backup-led-panel",
      title: "2x2 LED Flat Panel with Built-In Emergency Driver",
      productType: "LED Panel Light",
      collections: ["led-panel-lights", "2x2-led-panels", "emergency-exit"],
      price: 6499,
      compareAtPrice: null,
      wattage: "30W / 40W",
      lumens: 5200,
      voltage: "120-277V",
      cct: "4000K / 5000K",
      cri: 82,
      options: [
        { name: "CCT", position: 1, values: ["4000K", "5000K"], presentation: "radio" as const },
      ],
      features: ["Integrated 90-minute UL 924 battery backup module", "External test switch and charging indicator light", "Automatic emergency switch-over during power loss"],
      requiresFreight: false,
    },

    // 9-16: Strips & Tape
    {
      handle: "cob-led-strip-24v-high-density-warm-white",
      title: "COB LED Strip Light 24V Dotless, 3000K Warm White 16.4FT",
      productType: "LED Strip Light",
      collections: ["led-strip-lights", "cob-led-strip-lights"],
      price: 3499,
      compareAtPrice: 4299,
      wattage: "14W/m",
      lumens: 1350,
      voltage: "24V DC",
      cct: "3000K",
      cri: 92,
      options: [
        { name: "Length", position: 1, values: ["16.4FT (5M)", "32.8FT (10M)"], presentation: "dropdown" as const },
      ],
      features: ["528 chips/meter continuous phosphor coating", "Zero hotspot diffusion in shallow aluminum channels", "Cuttable every 1.77 inches (45mm)", "3M 300LSE thermal conductive adhesive tape"],
      requiresFreight: false,
    },
    {
      handle: "cob-led-strip-24v-neutral-white-4000k",
      title: "COB LED Strip Light 24V Dotless, 4000K Neutral White",
      productType: "LED Strip Light",
      collections: ["led-strip-lights", "cob-led-strip-lights"],
      price: 3499,
      compareAtPrice: null,
      wattage: "14W/m",
      lumens: 1420,
      voltage: "24V DC",
      cct: "4000K",
      cri: 91,
      options: [
        { name: "Length", position: 1, values: ["16.4FT (5M)", "32.8FT (10M)"], presentation: "dropdown" as const },
      ],
      features: ["Crisp 4000K illumination for commercial retail displays", "High CRI 90+ true color rendering", "Class 2 low-voltage safety compliance"],
      requiresFreight: false,
    },
    {
      handle: "tunable-white-cob-led-strip-24v",
      title: "Tunable White COB LED Strip 24V (2700K - 6500K)",
      productType: "LED Strip Light",
      collections: ["led-strip-lights", "cob-led-strip-lights", "smart-lighting"],
      price: 4999,
      compareAtPrice: 6299,
      wattage: "18W/m",
      lumens: 1600,
      voltage: "24V DC",
      cct: "2700K-6500K Tunable",
      cri: 93,
      options: [
        { name: "Length", position: 1, values: ["16.4FT (5M)"], presentation: "radio" as const },
      ],
      features: ["Dual-channel warm to cool circadian tuning", "640 LEDs per meter high-density arrangement", "Seamless dimming with 2-channel PWM controllers"],
      requiresFreight: false,
    },
    {
      handle: "rgbw-4-in-1-led-strip-light-24v",
      title: "RGBW 4-in-1 Color Changing LED Strip 24V 16.4FT",
      productType: "LED Strip Light",
      collections: ["led-strip-lights", "rgb-rgbw-strip-lights"],
      price: 3999,
      compareAtPrice: 4999,
      wattage: "19W/m",
      lumens: 950,
      voltage: "24V DC",
      cct: "RGB + 3000K Warm White",
      cri: 88,
      options: [
        { name: "White Channel", position: 1, values: ["3000K Warm", "6000K Cool"], presentation: "radio" as const },
      ],
      features: ["Single diode 4-in-1 chip eliminates color fringing", "Full spectrum 16M RGB colors plus true architectural white", "DMX and DALI controller compatible"],
      requiresFreight: false,
    },
    {
      handle: "digital-addressable-rgb-pixel-strip",
      title: "Digital Addressable RGB Pixel LED Tape (WS2811 24V)",
      productType: "LED Strip Light",
      collections: ["led-strip-lights", "rgb-rgbw-strip-lights", "smart-lighting"],
      price: 5499,
      compareAtPrice: null,
      wattage: "18W/m",
      lumens: 880,
      voltage: "24V DC",
      cct: "RGB Addressable",
      cri: 80,
      options: [
        { name: "Length", position: 1, values: ["16.4FT (5M)"], presentation: "radio" as const },
      ],
      features: ["Individually addressable IC pixel segments", "Dynamic chase, wave, and sound reactive effects", "Compatible with SPI and Art-Net controllers"],
      requiresFreight: false,
    },
    {
      handle: "high-output-single-color-led-tape-5000k",
      title: "High-Output Static White LED Strip 24V, 5000K Daylight",
      productType: "LED Strip Light",
      collections: ["led-strip-lights", "single-color-strip-lights"],
      price: 2999,
      compareAtPrice: null,
      wattage: "12W/m",
      lumens: 1550,
      voltage: "24V DC",
      cct: "5000K",
      cri: 86,
      options: [
        { name: "Length", position: 1, values: ["16.4FT (5M)", "32.8FT (10M)"], presentation: "dropdown" as const },
      ],
      features: ["2835 SMD chips delivering 129 lm/W", "Thick 3-ounce copper PCB for superior heat management", "UL Listed for commercial under-cabinet and valence runs"],
      requiresFreight: false,
    },
    {
      handle: "architectural-2700k-ultra-warm-strip",
      title: "Architectural 2700K Ultra-Warm LED Strip 24V",
      productType: "LED Strip Light",
      collections: ["led-strip-lights", "single-color-strip-lights"],
      price: 3199,
      compareAtPrice: 3899,
      wattage: "12W/m",
      lumens: 1300,
      voltage: "24V DC",
      cct: "2700K",
      cri: 95,
      options: [
        { name: "Length", position: 1, values: ["16.4FT (5M)"], presentation: "radio" as const },
      ],
      features: ["Museum-grade 95+ CRI with R9 > 80", "Inviting candlelight warmth for high-end hospitality dining", "MacAdam 2-step single bin color consistency"],
      requiresFreight: false,
    },
    {
      handle: "ip68-submersible-outdoor-silicone-strip-24v",
      title: "IP68 Submersible Silicone Tube LED Strip 24V Outdoor",
      productType: "LED Strip Light",
      collections: ["led-strip-lights", "waterproof-strip-lights", "outdoor-lighting"],
      price: 5899,
      compareAtPrice: 6999,
      wattage: "15W/m",
      lumens: 1250,
      voltage: "24V DC",
      cct: "4000K",
      cri: 90,
      options: [
        { name: "Length", position: 1, values: ["16.4FT (5M)", "32.8FT (10M)"], presentation: "dropdown" as const },
      ],
      features: ["Solid extrusion food-grade silicone (non-yellowing)", "Salt spray and chlorine resistant for pool and marine applications", "Submersible rated up to 2 meters continuous depth"],
      requiresFreight: false,
    },

    // 17-22: Downlights
    {
      handle: "4-inch-canless-gimbal-downlight-5cct",
      title: "4-Inch Canless Eyeball Gimbal LED Downlight, 5CCT Selectable",
      productType: "LED Downlight",
      collections: ["led-downlights", "4-inch-downlights"],
      price: 1999,
      compareAtPrice: 2499,
      wattage: "9W",
      lumens: 850,
      voltage: "120V",
      cct: "5CCT (2700K-5000K)",
      cri: 90,
      options: [
        { name: "Trim Color", position: 1, values: ["Matte White", "Matte Black", "Brushed Nickel"], presentation: "dropdown" as const },
      ],
      features: ["360-degree rotation with 30-degree tilt directional aiming", "5-color selectable switch on remote junction box", "Airtight and IC rated for direct contact with attic insulation"],
      requiresFreight: false,
    },
    {
      handle: "4-inch-deep-regress-anti-glare-downlight",
      title: "4-Inch Deep Regress Architectural Downlight 12W",
      productType: "LED Downlight",
      collections: ["led-downlights", "4-inch-downlights"],
      price: 2499,
      compareAtPrice: null,
      wattage: "12W",
      lumens: 1050,
      voltage: "120V",
      cct: "3000K / 4000K",
      cri: 93,
      options: [
        { name: "CCT", position: 1, values: ["3000K", "4000K"], presentation: "radio" as const },
      ],
      features: ["Deep 1.5-inch regression baffle completely hides light source", "Virtually zero glare cutoff angle", "TRIAC/ELV dimmable down to 5%"],
      requiresFreight: false,
    },
    {
      handle: "4-inch-commercial-reflector-downlight-15w",
      title: "4-Inch Commercial Spec-Grade Downlight 15W (120-277V)",
      productType: "LED Downlight",
      collections: ["led-downlights", "4-inch-downlights"],
      price: 3499,
      compareAtPrice: 4299,
      wattage: "15W",
      lumens: 1400,
      voltage: "120-277V",
      cct: "4000K",
      cri: 91,
      options: [
        { name: "Reflector Finish", position: 1, values: ["Haze Silver", "Specular Clear"], presentation: "dropdown" as const },
      ],
      features: ["Commercial multi-voltage 120-277V with 0-10V dimming", "Specular aluminum cone reflector for maximum optical efficiency", "UL Wet Location listed for showers and soffits"],
      requiresFreight: false,
    },
    {
      handle: "6-inch-ultra-thin-canless-wafer-downlight",
      title: "6-Inch Ultra-Thin Canless Wafer Downlight 14W 5CCT",
      productType: "LED Downlight",
      collections: ["led-downlights", "6-inch-downlights"],
      price: 1899,
      compareAtPrice: 2299,
      wattage: "14W",
      lumens: 1100,
      voltage: "120V",
      cct: "5CCT Selectable",
      cri: 90,
      options: [
        { name: "Trim Color", position: 1, values: ["White", "Black"], presentation: "radio" as const },
      ],
      features: ["Super slim 0.5-inch profile fits under joists and ductwork", "Pre-attached spring clips and aluminum junction box", "ETL and Energy Star certified"],
      requiresFreight: false,
    },
    {
      handle: "6-inch-commercial-high-lumen-downlight-30w",
      title: "6-Inch High-Lumen Commercial Downlight 30W (2800 Lumens)",
      productType: "LED Downlight",
      collections: ["led-downlights", "6-inch-downlights"],
      price: 4999,
      compareAtPrice: null,
      wattage: "20W / 25W / 30W Selectable",
      lumens: 2800,
      voltage: "120-277V",
      cct: "3500K / 4000K / 5000K",
      cri: 84,
      options: [
        { name: "Wattage", position: 1, values: ["20W", "25W", "30W"], presentation: "dropdown" as const },
      ],
      features: ["Engineered for 12-20ft ceiling heights in hotel lobbies and airports", "Cast aluminum heat sink ensures 60,000 hour L70 lifespan", "0-10V dimming standard"],
      requiresFreight: false,
    },
    {
      handle: "6-inch-retrofit-baffle-downlight-trim",
      title: "6-Inch LED Retrofit Baffle Trim with E26 Adapter 13W",
      productType: "LED Downlight",
      collections: ["led-downlights", "6-inch-downlights"],
      price: 1499,
      compareAtPrice: 1899,
      wattage: "13W",
      lumens: 950,
      voltage: "120V",
      cct: "3000K / 4000K",
      cri: 90,
      options: [
        { name: "CCT", position: 1, values: ["3000K", "4000K"], presentation: "radio" as const },
      ],
      features: ["Simple screw-in E26 base replaces existing incandescent bulbs", "Torsion springs fit both 5-inch and 6-inch recessed cans", "Smooth stepped baffle minimizes ceiling brightness"],
      requiresFreight: false,
    },

    // 23-28: Outdoor Lighting
    {
      handle: "150w-led-shoebox-parking-lot-light",
      title: "150W LED Shoebox Area & Parking Lot Light (Type III)",
      productType: "Outdoor Commercial Fixture",
      collections: ["outdoor-lighting"],
      price: 14999,
      compareAtPrice: 18999,
      wattage: "150W",
      lumens: 21000,
      voltage: "120-277V",
      cct: "5000K",
      cri: 75,
      options: [
        { name: "Mounting Style", position: 1, values: ["Slip Fitter", "Arm Mount", "Trunnion"], presentation: "dropdown" as const },
      ],
      features: ["Precision Type III optical distribution for parking bays", "Die-cast aluminum housing with 10kV surge protector", "IP65 weatherproof with photocell receptacle", "DLC 5.1 Premium listed"],
      requiresFreight: true,
    },
    {
      handle: "300w-led-shoebox-parking-lot-light-high-output",
      title: "300W High-Output LED Shoebox Area Light (42,000 Lumens)",
      productType: "Outdoor Commercial Fixture",
      collections: ["outdoor-lighting"],
      price: 24999,
      compareAtPrice: 29999,
      wattage: "300W",
      lumens: 42000,
      voltage: "120-277V",
      cct: "5000K",
      cri: 75,
      options: [
        { name: "Mounting Style", position: 1, values: ["Slip Fitter", "Direct Arm"], presentation: "radio" as const },
      ],
      features: ["Replaces 1000W metal halide fixtures with 70% energy savings", "Aerodynamic low EPA wind resistance profile", "UL and DLC Premium certified"],
      requiresFreight: true,
    },
    {
      handle: "80w-led-wall-pack-rotatable-cutoff",
      title: "80W Full Cutoff Architectural LED Wall Pack",
      productType: "Outdoor Commercial Fixture",
      collections: ["outdoor-lighting"],
      price: 8999,
      compareAtPrice: 10999,
      wattage: "40W / 60W / 80W Selectable",
      lumens: 11200,
      voltage: "120-277V",
      cct: "4000K / 5000K",
      cri: 76,
      options: [
        { name: "Wattage", position: 1, values: ["40W", "60W", "80W"], presentation: "dropdown" as const },
      ],
      features: ["Zero uplight dark-sky compliant architectural design", "Integrated dusk-to-dawn photocell with bypass cap", "Side 1/2-inch conduit knockouts for surface installation"],
      requiresFreight: false,
    },
    {
      handle: "120w-traditional-glass-refractor-wall-pack",
      title: "120W Heavy-Duty Glass Refractor Wall Pack",
      productType: "Outdoor Commercial Fixture",
      collections: ["outdoor-lighting"],
      price: 9999,
      compareAtPrice: null,
      wattage: "120W",
      lumens: 16200,
      voltage: "120-277V",
      cct: "5000K",
      cri: 74,
      options: [
        { name: "Voltage", position: 1, values: ["120-277V"], presentation: "radio" as const },
      ],
      features: ["Borosilicate prismatic glass lens resists UV fading and vandalism", "Replaces up to 400W HPS commercial wall fixtures", "Sealed silicone gasket ensures IP65 moisture barrier"],
      requiresFreight: true,
    },
    {
      handle: "50w-led-flood-light-knuckle-mount",
      title: "50W Architectural LED Flood Light, 1/2-Inch Knuckle Mount",
      productType: "Outdoor Commercial Fixture",
      collections: ["outdoor-lighting"],
      price: 4999,
      compareAtPrice: 6299,
      wattage: "50W",
      lumens: 6500,
      voltage: "120-277V",
      cct: "3000K / 4000K / 5000K",
      cri: 82,
      options: [
        { name: "Beam Angle", position: 1, values: ["Wide Flood (7H x 7V)", "Spot (30 Deg)"], presentation: "radio" as const },
      ],
      features: ["Adjustable swivel knuckle mount fits standard weatherproof J-boxes", "Ideal for building facade, signage, and flag illumination", "Tempered glass front with anti-corrosion powder coating"],
      requiresFreight: false,
    },
    {
      handle: "100w-commercial-led-canopy-gas-station-light",
      title: "100W Commercial LED Canopy Light (Garage & Gas Station)",
      productType: "Outdoor Commercial Fixture",
      collections: ["outdoor-lighting", "commercial-industrial"],
      price: 7499,
      compareAtPrice: null,
      wattage: "60W / 80W / 100W",
      lumens: 13500,
      voltage: "120-277V",
      cct: "5000K",
      cri: 75,
      options: [
        { name: "Wattage", position: 1, values: ["60W", "80W", "100W"], presentation: "dropdown" as const },
      ],
      features: ["Low profile ceiling mount for parking garages and drive-thrus", "Drop lens optical polycarbonate distribution", "Motion sensor ready port for energy code compliance"],
      requiresFreight: false,
    },

    // 29-34: Industrial & High Bays
    {
      handle: "150w-ufo-led-high-bay-light-compact",
      title: "150W UFO LED High Bay Light, 21,000 Lumens (0-10V Dimmable)",
      productType: "Commercial & Industrial",
      collections: ["commercial-industrial"],
      price: 8999,
      compareAtPrice: 11999,
      wattage: "150W",
      lumens: 21000,
      voltage: "120-277V",
      cct: "5000K",
      cri: 80,
      options: [
        { name: "Voltage", position: 1, values: ["120-277V Standard", "347-480V Industrial"], presentation: "dropdown" as const },
      ],
      features: ["Fin-style pure aluminum cold-forged heat sink", "Pre-installed stainless steel safety cable and hook", "6kV surge protection built into isolated Sosen driver", "DLC 5.1 Premium qualified"],
      requiresFreight: false,
    },
    {
      handle: "240w-ufo-led-high-bay-commercial-warehouse",
      title: "240W UFO LED High Bay Light, 36,000 Lumens",
      productType: "Commercial & Industrial",
      collections: ["commercial-industrial"],
      price: 13999,
      compareAtPrice: 17999,
      wattage: "240W",
      lumens: 36000,
      voltage: "120-277V",
      cct: "5000K",
      cri: 80,
      options: [
        { name: "Reflector", position: 1, values: ["None (Standard)", "Clear Polycarbonate", "Aluminum Shroud"], presentation: "dropdown" as const },
      ],
      features: ["High-bay warehouse powerhouse delivering 150 lm/W", "Replaces up to 1000W metal halide with 75% energy savings", "IP65 wet location rated for washdown environments"],
      requiresFreight: true,
    },
    {
      handle: "165w-linear-led-high-bay-warehouse-aisle",
      title: "2FT Linear LED High Bay Light 165W (Aisle Distribution)",
      productType: "Commercial & Industrial",
      collections: ["commercial-industrial"],
      price: 9499,
      compareAtPrice: null,
      wattage: "110W / 135W / 165W Selectable",
      lumens: 24000,
      voltage: "120-277V",
      cct: "4000K / 5000K",
      cri: 82,
      options: [
        { name: "Lens Type", position: 1, values: ["Frosted Diffused", "Narrow Aisle Optic"], presentation: "radio" as const },
      ],
      features: ["Rectangular linear footprint ideal for pallet racking aisles", "Includes V-hooks and suspension hanging chains", "Plug-in PIR motion sensor socket pre-wired"],
      requiresFreight: false,
    },
    {
      handle: "220w-linear-led-high-bay-4ft-heavy-duty",
      title: "4FT Linear LED High Bay Light 220W, 31,900 Lumens",
      productType: "Commercial & Industrial",
      collections: ["commercial-industrial"],
      price: 12999,
      compareAtPrice: 15999,
      wattage: "220W",
      lumens: 31900,
      voltage: "120-277V",
      cct: "5000K",
      cri: 80,
      options: [
        { name: "Voltage", position: 1, values: ["120-277V", "277-480V"], presentation: "radio" as const },
      ],
      features: ["Rigid galvanized steel body with durable white enamel finish", "Frosted acrylic lens prevents glare for forklift drivers", "Emergency battery backup option available"],
      requiresFreight: true,
    },
    {
      handle: "4ft-led-vapor-tight-fixture-40w",
      title: "4FT LED Vapor Tight Linear Fixture 40W (IP66 Waterproof)",
      productType: "Commercial & Industrial",
      collections: ["commercial-industrial", "outdoor-lighting"],
      price: 4999,
      compareAtPrice: 5999,
      wattage: "30W / 40W Selectable",
      lumens: 5200,
      voltage: "120-277V",
      cct: "4000K / 5000K",
      cri: 82,
      options: [
        { name: "Hardware", position: 1, values: ["Stainless Steel Latches", "Polycarbonate Latches"], presentation: "dropdown" as const },
      ],
      features: ["IP66 / NEMA 4X rated against high-pressure water spray and dust", "Corrosion-resistant fiberglass reinforced housing", "Ideal for car washes, food processing, and parking garages"],
      requiresFreight: false,
    },
    {
      handle: "8ft-led-vapor-tight-fixture-80w",
      title: "8FT LED Vapor Tight Linear Industrial Luminaire 80W",
      productType: "Commercial & Industrial",
      collections: ["commercial-industrial"],
      price: 8999,
      compareAtPrice: null,
      wattage: "60W / 75W / 80W",
      lumens: 10400,
      voltage: "120-277V",
      cct: "5000K",
      cri: 81,
      options: [
        { name: "Wattage", position: 1, values: ["60W", "75W", "80W"], presentation: "dropdown" as const },
      ],
      features: ["Tandem 8FT single-body construction with continuous gasket", "High impact IK08 polycarbonate diffuser", "Surface or chain suspension mounting"],
      requiresFreight: true,
    },

    // 35-38: Emergency & Exit
    {
      handle: "red-led-exit-sign-battery-backup",
      title: "Compact LED Exit Sign with 90-Min Battery Backup (Red Letters)",
      productType: "Emergency Lighting",
      collections: ["emergency-exit"],
      price: 2299,
      compareAtPrice: null,
      wattage: "3W",
      lumens: 50,
      voltage: "120/277V",
      cct: "Red 660nm",
      cri: 70,
      options: [
        { name: "Letter Color", position: 1, values: ["Red", "Green"], presentation: "radio" as const },
      ],
      features: ["UL 924 compliant for universal emergency egress", "Universal canopy for ceiling, wall, or end mounting", "Maintenance-free Ni-Cd rechargeable battery"],
      requiresFreight: false,
    },
    {
      handle: "emergency-light-dual-head-led-battery-backup",
      title: "Dual-Head LED Emergency Light Fixture with Battery Backup",
      productType: "Emergency Lighting",
      collections: ["emergency-exit"],
      price: 2499,
      compareAtPrice: 2999,
      wattage: "2.5W",
      lumens: 250,
      voltage: "120/277V",
      cct: "6000K",
      cri: 75,
      options: [
        { name: "Housing Color", position: 1, values: ["White", "Black"], presentation: "radio" as const },
      ],
      features: ["Two fully adjustable glare-free round LED lamp heads", "Quick-connect backplate for effortless electrical box mounting", "Test switch with status diagnostic indicator LED"],
      requiresFreight: false,
    },
    {
      handle: "combo-exit-sign-and-emergency-light-heads",
      title: "LED Exit Sign & Dual Emergency Light Combo Unit (Red)",
      productType: "Emergency Lighting",
      collections: ["emergency-exit"],
      price: 3899,
      compareAtPrice: 4699,
      wattage: "4.5W",
      lumens: 300,
      voltage: "120/277V",
      cct: "Red / 6000K Heads",
      cri: 75,
      options: [
        { name: "Configuration", position: 1, values: ["Standard Single Face", "Double Face with Extra Panel"], presentation: "dropdown" as const },
      ],
      features: ["All-in-one space saving exit sign and emergency flood lights", "Internal solid-state transfer switch automatically activates lamps", "UL listed for damp locations"],
      requiresFreight: false,
    },
    {
      handle: "wet-location-outdoor-emergency-exit-combo",
      title: "Wet Location Outdoor Emergency Exit Combo Sign (NEMA 4X)",
      productType: "Emergency Lighting",
      collections: ["emergency-exit", "outdoor-lighting"],
      price: 7999,
      compareAtPrice: null,
      wattage: "5W",
      lumens: 350,
      voltage: "120/277V",
      cct: "Green / 6000K Heads",
      cri: 75,
      options: [
        { name: "Letter Color", position: 1, values: ["Green", "Red"], presentation: "radio" as const },
      ],
      features: ["Corrosion-resistant UV-stabilized polycarbonate housing", "Poured-in gasket ensures watertight seal in rain and sleet", "Cold-weather internal battery heater rated to -20C"],
      requiresFreight: false,
    },

    // 39-44: Smart Lighting & Controls
    {
      handle: "0-10v-wireless-smart-dimmer-switch",
      title: "Commercial 0-10V Wireless Smart Wall Dimmer Switch",
      productType: "Smart Lighting",
      collections: ["smart-lighting"],
      price: 4999,
      compareAtPrice: 5999,
      wattage: "Passive / 120-277V",
      lumens: 0,
      voltage: "120-277V",
      cct: "N/A",
      cri: 0,
      options: [
        { name: "Protocol", position: 1, values: ["Bluetooth Mesh", "Zigbee 3.0"], presentation: "radio" as const },
      ],
      features: ["Controls up to 50 fixtures on a single 0-10V dimming loop", "Smartphone app scheduled dimming and high-end trim calibration", "Fits standard single-gang decorator wall plates"],
      requiresFreight: false,
    },
    {
      handle: "microwave-motion-daylight-harvesting-sensor",
      title: "High-Bay Microwave Motion & Daylight Harvesting Sensor (12V/0-10V)",
      productType: "Smart Lighting",
      collections: ["smart-lighting", "commercial-industrial"],
      price: 2999,
      compareAtPrice: null,
      wattage: "0.5W",
      lumens: 0,
      voltage: "12V DC AUX",
      cct: "N/A",
      cri: 0,
      options: [
        { name: "Mounting", position: 1, values: ["UFO High Bay Screw-in", "Ceiling Junction Mount"], presentation: "dropdown" as const },
      ],
      features: ["Detects motion through glass, plastic, and thin drywall up to 50ft high", "Continuous daylight harvesting dims lights when natural ambient light increases", "Handheld IR remote control configuration"],
      requiresFreight: false,
    },
    {
      handle: "pir-ceiling-occupancy-sensor-commercial",
      title: "Commercial 360-Degree PIR Ceiling Mount Occupancy Sensor",
      productType: "Smart Lighting",
      collections: ["smart-lighting"],
      price: 3499,
      compareAtPrice: 4299,
      wattage: "1W",
      lumens: 0,
      voltage: "120-277V",
      cct: "N/A",
      cri: 0,
      options: [
        { name: "Coverage", position: 1, values: ["1200 Sq Ft", "1500 Sq Ft"], presentation: "dropdown" as const },
      ],
      features: ["Passive infrared quad-element detection with zero false triggers", "Adjustable time delay from 30 seconds to 30 minutes", "Title 24 and ASHRAE 90.1 energy code compliant"],
      requiresFreight: false,
    },
    {
      handle: "smart-gateway-mesh-bridge-controller",
      title: "Commercial Wireless Smart Lighting Gateway Hub",
      productType: "Smart Lighting",
      collections: ["smart-lighting"],
      price: 18999,
      compareAtPrice: null,
      wattage: "5W",
      lumens: 0,
      voltage: "120V / PoE",
      cct: "N/A",
      cri: 0,
      options: [
        { name: "Connectivity", position: 1, values: ["Ethernet + Cellular", "Ethernet + Wi-Fi"], presentation: "radio" as const },
      ],
      features: ["Bridges up to 250 mesh devices to central building management dashboard", "Cloud API access for energy consumption reporting and peak shaving", "PoE (Power over Ethernet) 802.3af support"],
      requiresFreight: false,
    },
    {
      handle: "photocell-twist-lock-receptacle-sensor",
      title: "Twist-Lock Photocell Sensor for Shoebox Fixtures (120-277V)",
      productType: "Smart Lighting",
      collections: ["smart-lighting", "outdoor-lighting"],
      price: 1499,
      compareAtPrice: 1899,
      wattage: "0.5W",
      lumens: 0,
      voltage: "120-277V",
      cct: "N/A",
      cri: 0,
      options: [
        { name: "Type", position: 1, values: ["Standard ANSI C136.10 3-Pin", "Surge Protected 7-Pin"], presentation: "dropdown" as const },
      ],
      features: ["Automatic dusk-to-dawn switching prevents daytime energy waste", "Time delay circuit prevents false cycling from car headlights", "Surge arrestor protected against lightning transients"],
      requiresFreight: false,
    },
    {
      handle: "wireless-push-button-kinetic-wall-remote",
      title: "Battery-Free Kinetic Wireless Lighting Wall Switch",
      productType: "Smart Lighting",
      collections: ["smart-lighting"],
      price: 3299,
      compareAtPrice: null,
      wattage: "Kinetic Micro-generator",
      lumens: 0,
      voltage: "Self-powered",
      cct: "N/A",
      cri: 0,
      options: [
        { name: "Gangs", position: 1, values: ["1-Button", "2-Button Dual Zone"], presentation: "radio" as const },
      ],
      features: ["Harvests kinetic finger press energy with zero batteries or wiring required", "Controls paired RF dimmer packs up to 100ft line of sight", "Mounts with double-sided adhesive tape on glass, brick, or drywall"],
      requiresFreight: false,
    },

    // 45-50: Accessories & Drivers
    {
      handle: "60w-24v-dimmable-class-2-led-driver",
      title: "60W 24V DC Dimmable Class 2 LED Power Supply (TRIAC / 0-10V)",
      productType: "LED Driver & Power Supply",
      collections: ["accessories"],
      price: 4499,
      compareAtPrice: 5499,
      wattage: "60W",
      lumens: 0,
      voltage: "Input 120-277V AC / Output 24V DC",
      cct: "N/A",
      cri: 0,
      options: [
        { name: "Wattage", position: 1, values: ["60W", "96W"], presentation: "dropdown" as const },
      ],
      features: ["5-in-1 multi-dimming compatibility: TRIAC, ELV, MLV, 0-10V, and 10V PWM", "Built-in wiring junction compartment with knockouts", "UL Listed Class 2 output with short circuit and overload protection"],
      requiresFreight: false,
    },
    {
      handle: "96w-24v-constant-voltage-led-driver",
      title: "96W 24V Class 2 Constant Voltage LED Driver (NEMA 3R)",
      productType: "LED Driver & Power Supply",
      collections: ["accessories"],
      price: 5899,
      compareAtPrice: null,
      wattage: "96W",
      lumens: 0,
      voltage: "Input 120-277V / Output 24V DC 4.0A",
      cct: "N/A",
      cri: 0,
      options: [
        { name: "Enclosure", position: 1, values: ["Junction Box Enclosure"], presentation: "radio" as const },
      ],
      features: ["Maximum wattage allowed under Class 2 electrical code without conduit requirements", "High power factor > 0.95 with 90% conversion efficiency", "Outdoor NEMA 3R rated enclosure"],
      requiresFreight: false,
    },
    {
      handle: "aluminum-led-channel-frosted-diffuser-8ft",
      title: "8FT Surface Aluminum Channel with Frosted Diffuser (Pack of 5)",
      productType: "Mounting Hardware",
      collections: ["accessories", "led-strip-lights"],
      price: 4999,
      compareAtPrice: 6299,
      wattage: "Passive Extrusion",
      lumens: 0,
      voltage: "N/A",
      cct: "N/A",
      cri: 0,
      options: [
        { name: "Diffuser Style", position: 1, values: ["Milky Frosted", "Semi-Clear"], presentation: "radio" as const },
      ],
      features: ["Anodized 6063-T5 aircraft aluminum dissipates heat for extended LED life", "Milky lens produces perfectly even dotless illumination", "Includes mounting clips, end caps, and mounting screws"],
      requiresFreight: true,
    },
    {
      handle: "corner-mount-45-degree-led-channel-8ft",
      title: "8FT 45-Degree Corner V-Shape Aluminum LED Channel (Pack of 5)",
      productType: "Mounting Hardware",
      collections: ["accessories", "led-strip-lights"],
      price: 5499,
      compareAtPrice: null,
      wattage: "Passive Extrusion",
      lumens: 0,
      voltage: "N/A",
      cct: "N/A",
      cri: 0,
      options: [
        { name: "Finish", position: 1, values: ["Silver Anodized", "Matte Black"], presentation: "dropdown" as const },
      ],
      features: ["Angles light beam at 45 degrees into under-cabinet countertops", "Snug friction fit frosted lens cover", "Easy 90-degree corner miter cutting"],
      requiresFreight: true,
    },
    {
      handle: "solderless-2-pin-cob-strip-connectors",
      title: "Solderless 8mm 2-Pin COB LED Strip Connector Terminal Pack (10-Pack)",
      productType: "Accessories",
      collections: ["accessories", "led-strip-lights"],
      price: 1299,
      compareAtPrice: 1599,
      wattage: "5A Max Current",
      lumens: 0,
      voltage: "5-24V DC",
      cct: "N/A",
      cri: 0,
      options: [
        { name: "Type", position: 1, values: ["Strip-to-Strip Bridge", "Strip-to-Wire Pigtail"], presentation: "dropdown" as const },
      ],
      features: ["Pierces PCB without stripping or soldering", "Transparent polycarbonate shell does not block light diodes", "Supports up to 5 Amps continuous load"],
      requiresFreight: false,
    },
    {
      handle: "2x4-led-panel-drywall-flange-kit",
      title: "2x4 LED Flat Panel Recessed Drywall Flange Mounting Kit",
      productType: "Accessories",
      collections: ["accessories", "led-panel-lights"],
      price: 3699,
      compareAtPrice: null,
      wattage: "Hardware",
      lumens: 0,
      voltage: "N/A",
      cct: "N/A",
      cri: 0,
      options: [
        { name: "Size", position: 1, values: ["2x4 FT", "2x2 FT"], presentation: "dropdown" as const },
      ],
      features: ["Allows standard drop ceiling panels to be recessed cleanly into sheetrock ceilings", "Pre-punched screw holes and white extruded aluminum perimeter trim", "Includes side hanging brackets"],
      requiresFreight: true,
    },
  ];

  console.log(`Prepared ${rawProducts.length} product definitions.`);

  let totalVariantsCount = 0;

  for (let i = 0; i < rawProducts.length; i++) {
    const p = rawProducts[i];
    const skuCode = `STL-${String(i + 1).padStart(4, "0")}`;

    const specs: ProductSpecs = {
      wattage: p.wattage,
      lumens: p.lumens,
      lumensPerWatt: p.lumens > 0 ? 130 : undefined,
      voltage: p.voltage,
      cct: p.cct,
      cri: p.cri > 0 ? p.cri : undefined,
      dimmable: true,
      dimmingType: ["0-10V"],
      lifespan: 50000,
      warrantyYears: 5,
      certifications: ["UL", "DLC", "FCC"],
    };

    const images: Media[] = [
      {
        url: `https://placehold.co/800x800/1e293b/ffffff?text=${encodeURIComponent(p.title.slice(0, 24))}`,
        alt: `${p.title} - Primary Angle`,
        width: 800,
        height: 800,
        type: "image",
      },
      {
        url: `https://placehold.co/800x800/334155/ffffff?text=${encodeURIComponent(skuCode)}+Specs`,
        alt: `${p.title} - Technical Dimensions`,
        width: 800,
        height: 800,
        type: "image",
      },
    ];

    const bulkPricing: BulkTier[] = [
      { minQty: 10, price: Math.round(p.price * 0.92), label: "Contractor 10+" },
      { minQty: 25, price: Math.round(p.price * 0.85), label: "Volume 25+" },
      { minQty: 100, price: Math.round(p.price * 0.78), label: "Pallet 100+" },
    ];

    const [insertedProduct] = await db
      .insert(products)
      .values({
        handle: p.handle,
        title: p.title,
        subtitle: "Commercial Grade Specification Luminaire",
        brand: "The Lightning Lab",
        sku: skuCode,
        status: "active",
        price: p.price,
        compareAtPrice: p.compareAtPrice,
        currency: "USD",
        costPerItem: Math.round(p.price * 0.45),
        productType: p.productType,
        collections: p.collections,
        tags: ["commercial", "energy-efficient", "0-10v-dimmable", "dlc-premium"],
        shortDescription: `${p.title} engineered with premium thermal management and DLC 5.1 qualification.`,
        descriptionHtml: `<p>${p.title} is designed for specification-grade commercial, institutional, and industrial applications. Features high luminous efficacy and low maintenance costs.</p>`,
        features: p.features,
        specSheet: {
          url: `https://example.com/specs/${skuCode}.pdf`,
          label: "Spec Sheet",
        },
        iesFile: {
          url: `https://example.com/ies/${skuCode}.ies`,
          label: "IES Photometric Data",
        },
        installationGuide: {
          url: `https://example.com/guides/${skuCode}.pdf`,
          label: "Installation Manual",
        },
        images,
        specs,
        options: p.options,
        inventory: {
          available: true,
          quantity: 250,
          shipsWithin: "1 business day",
        },
        shipping: {
          requiresFreight: p.requiresFreight,
          freeShippingEligible: true,
          shipsWithin: "1 business day",
          weightOz: p.requiresFreight ? 320 : 64,
        },
        bulkPricing,
        isB2BOnly: false,
        rating: { average: 4.9, count: 18 },
        seo: {
          title: `${p.title} | The Lightning Lab`,
          description: `Buy ${p.title} wholesale at The Lightning Lab. Bulk volume contractor pricing and DLC Premium rebates.`,
        },
        relatedHandles: [],
        crossSellHandles: [],
      })
      .returning();

    // Generate product variants per option combination
    const primaryOption = p.options[0];
    const optionValues = primaryOption ? primaryOption.values : ["Default"];

    const variantsToInsert = optionValues.map((val, idx) => ({
      productId: insertedProduct.id,
      sku: `${skuCode}-V${idx + 1}`,
      title: `${primaryOption ? primaryOption.name : "Standard"}: ${val}`,
      optionValues: { [primaryOption ? primaryOption.name : "Option"]: val },
      price: p.price,
      compareAtPrice: p.compareAtPrice,
      inventoryQuantity: 75,
      inventoryPolicy: "deny" as const,
      weight: p.requiresFreight ? 320 : 64,
      image: images[0],
      bulkPricing,
    }));

    await db.insert(productVariants).values(variantsToInsert);
    totalVariantsCount += variantsToInsert.length;
  }

  console.log(`Inserted 50 products and ${totalVariantsCount} variants.`);

  // 10 Reviews across 5 products
  const reviewData = [
    {
      productHandle: "2x4-led-flat-panel-selectable-wattage-cct",
      rating: 5 as const,
      title: "Best drop ceiling flat panels we've installed",
      body: "We replaced 350 fluorescent troffers in an office building with these 2x4 panels. The selectable wattage and CCT made site adjustments instant.",
      authorName: "Dan Sullivan (Electrical Contractor)",
      verifiedPurchase: true,
      helpfulCount: 8,
    },
    {
      productHandle: "2x4-led-flat-panel-selectable-wattage-cct",
      rating: 5 as const,
      title: "Bright, zero flicker, and rebate approved",
      body: "Our local utility rebate covered over 50% of the fixture cost thanks to the DLC 5.1 Premium listing. Delivery took only 2 business days.",
      authorName: "Marcus Vance",
      verifiedPurchase: true,
      helpfulCount: 4,
    },
    {
      productHandle: "cob-led-strip-24v-high-density-warm-white",
      rating: 5 as const,
      title: "Truly zero hotspots even in shallow channels",
      body: "The continuous COB phosphor delivers completely seamless light under our kitchen cabinets and floating bathroom vanities. Absolutely beautiful.",
      authorName: "Elena Rostova",
      verifiedPurchase: true,
      helpfulCount: 12,
    },
    {
      productHandle: "cob-led-strip-24v-high-density-warm-white",
      rating: 4 as const,
      title: "Superb tape light, needs quality power supply",
      body: "Pair this with a solid Class 2 driver and you get smooth dimming with no buzzing. High CRI quality is very evident in wood tones.",
      authorName: "Brian Miller",
      verifiedPurchase: false,
      helpfulCount: 3,
    },
    {
      productHandle: "150w-ufo-led-high-bay-light-compact",
      rating: 5 as const,
      title: "Transformed our 10,000 sq ft warehouse",
      body: "Replaced old 400W metal halides one for one. The light output at 20ft height is phenomenal. Our workers noticed the difference immediately.",
      authorName: "Rick Thompson (Facility Manager)",
      verifiedPurchase: true,
      helpfulCount: 15,
    },
    {
      productHandle: "150w-ufo-led-high-bay-light-compact",
      rating: 5 as const,
      title: "Heavy-duty heat sink and easy hook mount",
      body: "The cast aluminum body runs noticeably cool even after 14 hours of continuous operation. Pre-attached cable made hanging very quick.",
      authorName: "Carlos Mendez",
      verifiedPurchase: true,
      helpfulCount: 7,
    },
    {
      productHandle: "150w-led-shoebox-parking-lot-light",
      rating: 5 as const,
      title: "Excellent Type III distribution for perimeter parking",
      body: "Installed 12 of these on 25ft round steel poles. The illumination cutoff is clean and there is no light trespass into neighboring residences.",
      authorName: "Greg Harrison",
      verifiedPurchase: true,
      helpfulCount: 6,
    },
    {
      productHandle: "150w-led-shoebox-parking-lot-light",
      rating: 4 as const,
      title: "Durable construction and easy slip fitter aiming",
      body: "Solid powder-coated housing survived severe spring storms without a drop of condensation inside the optic chamber.",
      authorName: "Jim Kowalski",
      verifiedPurchase: false,
      helpfulCount: 2,
    },
    {
      productHandle: "4-inch-canless-gimbal-downlight-5cct",
      rating: 5 as const,
      title: "Great for vaulted ceilings and accent artwork",
      body: "The 30-degree tilt was perfect for our sloped living room ceilings. Spring clips held tight into the 1/2-inch drywall.",
      authorName: "Sarah Jenkins",
      verifiedPurchase: true,
      helpfulCount: 9,
    },
    {
      productHandle: "4-inch-canless-gimbal-downlight-5cct",
      rating: 5 as const,
      title: "No housing cans required — saved tons of attic labor",
      body: "Being able to run Romex directly into the included remote J-box without wrestling with metal canisters saved hours per room.",
      authorName: "Tony D'Amato",
      verifiedPurchase: true,
      helpfulCount: 5,
    },
  ];

  await db.insert(reviews).values(reviewData);
  console.log(`Inserted ${reviewData.length} reviews.`);

  // 5 Blog Posts (buying-guides / installation, 300-600 words each)
  const blogData = [
    {
      blogHandle: "buying-guides",
      handle: "how-to-choose-commercial-led-flat-panels",
      title: "The Contractor's Guide to Choosing Commercial LED Flat Panels",
      author: "David Vance, Master Electrician",
      excerpt: "Understand the key differences between edgelit and backlit drop ceiling LED panels, DLC 5.1 rebate requirements, and 0-10V dimming wiring.",
      bodyMd: `## Introduction to Commercial Drop Ceiling Lighting

Upgrading fluorescent troffers to modern commercial LED flat panels is one of the highest ROI investments for office spaces, educational campuses, and medical clinics. However, choosing between edgelit and backlit construction, understanding color temperature (CCT) tuning, and maximizing utility incentive programs requires evaluating key technical criteria.

### Edgelit vs. Backlit: Which Is Superior?

Commercial LED flat panels generally fall into two architectural categories:

1. **Backlit Panels:** In backlit fixtures, the LED chips are mounted on a rigid circuit board directly behind the optical diffuser. This layout provides superior thermal dissipation, higher luminous efficacy (typically 125 to 140 lumens per watt), and eliminates reliance on PMMA light guide plates that can degrade over time. Backlit panels are slightly deeper (typically 1.5 to 2.2 inches) but represent the industry gold standard for longevity.
2. **Edgelit Panels:** In edgelit panels, micro-diodes line the inner perimeter aluminum frame, projecting light horizontally through an extruded laser-etched PMMA guide plate. Edgelit panels offer an ultra-thin profile (under 0.5 inches), making them ideal for tight ceiling plenums obstructed by HVAC ducting and fire sprinkler plumbing.

### Maximizing Energy Rebates with DLC 5.1 Premium

The DesignLights Consortium (DLC) sets strict efficiency and optical standards across North America. To capture top-tier commercial utility rebates:
- **Efficacy Thresholds:** Standard DLC requires at least 100 lm/W, whereas DLC 5.1 Premium demands at least 125 lm/W.
- **Color Quality & Glare:** DLC 5.1 incorporates Unified Glare Rating (UGR) requirements and stricter chromaticity drift tolerances to protect occupant wellness.

### Why Multi-CCT & Multi-Wattage Selectable Fixtures Save Money

Stocking dedicated wattage and dedicated color temperature fixtures creates costly inventory overhead. Selectable LED flat panels feature discreet DIP switches on the external Class 2 driver enclosure:
- **Wattage Tuning:** Allows contractors to toggle between 30W, 40W, and 50W output depending on ceiling height and foot-candle design goals.
- **Color Selection:** Shifts color between 3500K warm-neutral, 4000K crisp office white, and 5000K clean daylight without purchasing separate SKUs.

### Summary Checklist Before Ordering
- Verify your plenum ceiling grid size (2x4, 2x2, or 1x4).
- Confirm voltage requirements (universal 120-277V covers 95% of commercial buildings).
- Check that low-voltage purple/pink 0-10V dimming wires are routed to your wall stations.`,
      seo: {
        title: "Commercial LED Flat Panel Buyer's Guide | The Lightning Lab",
        description: "Contractor guide to commercial LED drop ceiling panels: backlit vs edgelit, DLC 5.1 rebates, and 0-10V dimming.",
      },
    },
    {
      blogHandle: "buying-guides",
      handle: "ufo-high-bay-lighting-warehouse-spacing-guide",
      title: "Warehouse High Bay Lighting: Spacing and Lumen Calculation Guide",
      author: "David Vance, Master Electrician",
      excerpt: "Determine the exact wattage, mounting height, and fixture spacing required to achieve target foot-candles across warehouse pallet aisles.",
      bodyMd: `## Engineering Optimal Warehouse Illumination

Warehouses and industrial distribution centers require uniform, high-contrast illumination to maintain worker safety, minimize pick errors, and withstand continuous 24/7 operating cycles. Replacing legacy 400W metal halide or T5HO fluorescent high bays with UFO LED luminaires cuts electrical demand by 65% to 75%.

### Mounting Height vs. Wattage Matrix

Matching mounting height with correct luminaire wattage is critical to avoid under-illuminated dead spots or excessive glare:

- **12 to 18 Feet:** 100W UFO High Bay (13,000 to 15,000 Lumens). Fixture spacing: 10 to 12 feet on center.
- **18 to 25 Feet:** 150W UFO High Bay (20,000 to 22,000 Lumens). Fixture spacing: 12 to 15 feet on center.
- **25 to 35 Feet:** 200W to 240W UFO High Bay (30,000 to 36,000 Lumens). Fixture spacing: 15 to 20 feet on center.
- **35 Feet and Above:** 300W+ High-Output Industrial Fixture. Spacing: 20 to 25 feet on center with narrow 60-degree beam optics.

### Open Floor vs. High-Density Racking Aisles

Lighting open bulk storage requires broad 120-degree radial beam angles to create overlapping foot-candle patterns across forklift pathways. 

Conversely, narrow warehouse aisles between 20ft pallet racks benefit from specialized linear high bays with 30° x 70° or 60° x 90° aisle optics. Directing photometric energy downward and onto vertical rack faces ensures barcode labels remain crisp and readable without blinding lift operators.

### Surge Protection & Industrial Environmental Ratings
Industrial switchgear and heavy motor starts generate electrical voltage spikes that destroy budget LED drivers. Ensure all industrial fixtures feature:
1. **Integrated Surge Protection:** Minimum 6kV to 10kV surge suppression built directly into the isolated constant-current driver.
2. **IP65 Ingress Protection:** Complete sealing against dust ingress and low-pressure water spray during facility maintenance washdowns.
3. **Die-Cast Cold Forging:** Pure aluminum finned heat sinks that maintain junction temperatures below 75°C in unconditioned summer temperatures.`,
      seo: {
        title: "Warehouse High Bay Spacing & Lumen Guide | The Lightning Lab",
        description: "Calculate high bay mounting height, spacing, and wattage for warehouse and industrial lighting retrofits.",
      },
    },
    {
      blogHandle: "installation",
      handle: "step-by-step-cob-led-strip-installation",
      title: "Step-by-Step Installation: Seamless COB LED Strip Lights in Aluminum Channels",
      author: "David Vance, Master Electrician",
      excerpt: "How to properly cut, connect, power, and diffuse 24V Chip-on-Board LED tape light into aluminum extrusions for high-end millwork.",
      bodyMd: `## Achieving Flawless Linear Accent Illumination

Chip-on-Board (COB) LED strip lighting has quickly overtaken traditional SMD tape light as the premier choice for architects, cabinetmakers, and lighting designers. By packing 480 to 640 micro-LEDs per meter beneath a continuous phosphor bead, COB strips eliminate visible lighting hotspots completely.

### Required Materials and Tools
- 24V DC Constant Voltage Class 2 LED Power Supply
- COB LED Strip Light Reel (High CRI 90+)
- Anodized Aluminum Channel with Milky Diffuser Lens
- Heavy-Duty Solderless 2-Pin Terminal Connectors or Soldering Iron
- 18 AWG 2-Conductor Low Voltage Wire
- 99% Isopropyl Alcohol Cleaning Wipes

### Step 1: Surface Preparation and Channel Mounting
Clean the mounting substrate with isopropyl alcohol to remove dust, grease, and wood shavings. Screw the mounting clips into the millwork reveal or counter recess every 24 inches. Snap the aluminum channel firmly into the clips. The aluminum channel acts as an indispensable heat sink; never mount high-output tape directly to bare wood.

### Step 2: Precision Cutting and Placement
Locate the marked cut lines on the COB strip, spaced approximately every 1.77 inches (45mm). Cut only along the designated copper pads using sharp shears. Peel back the 3M 300LSE adhesive backing in 12-inch increments and firmly press the tape into the channel center using steady thumb pressure.

### Step 3: Low-Voltage Connections
Insert the cut copper pads into a transparent solderless bridge connector until fully seated, then clamp the terminal blades shut with pliers. Ensure positive (+) and negative (-) polarity aligns continuously from the power supply down the entire run.

### Step 4: Installing the Milky Diffuser Lens
Start at one end of the aluminum channel and gently press the flexible frosted polycarbonate lens into the channel lips until you hear a continuous snap along the run. Install the end caps, route the low-voltage lead wire back to your 24V Class 2 driver, and verify smooth dimming performance.`,
      seo: {
        title: "How to Install COB LED Strip in Aluminum Channels | The Lightning Lab",
        description: "Step-by-step guide to installing 24V dotless COB LED strip lighting and aluminum channels for under-cabinet and cove lighting.",
      },
    },
    {
      blogHandle: "installation",
      handle: "0-10v-dimming-wiring-explained-commercial",
      title: "Commercial 0-10V Dimming Explained: Wiring Diagrams and Troubleshooting",
      author: "David Vance, Master Electrician",
      excerpt: "A complete electrical breakdown of 0-10V sinking vs sourcing, Class 1 vs Class 2 control wire separation, and fixing common flickering issues.",
      bodyMd: `## Understanding the 0-10V Commercial Standard

In commercial construction, line-voltage phase dimming (TRIAC and ELV) is rarely used for large fixture groups due to load limits and waveform distortion. Instead, analog 0-10V (IEC 60929 Annex E) four-wire dimming is the universal commercial standard for offices, schools, and retail superstores.

### How 0-10V Sinking Architecture Works
In commercial LED drivers, the driver acts as a current source (supplying approximately 1mA of low-voltage DC current across the control wires), while the wall dimmer acts as a variable current sink:
- **10 Volts DC:** Fixture driver operates at 100% full light output.
- **1 Volt DC:** Fixture driver dims down to its lowest calibrated threshold (typically 10% or 1%).
- **0 Volts DC:** Signal indicates sleep mode or electronic switch off.

### NEC Code Wire Color Standards
Under recent National Electrical Code (NEC) updates, control wire colors were revised to prevent dangerous confusion with line-voltage neutrals:
- **Line Voltage:** Black (Line/Hot), White (Neutral), Green/Bare (Ground).
- **0-10V Positive Control Line:** **Violet / Purple** (+).
- **0-10V Return/Negative Line:** **Pink** (-) (Replaced grey to avoid confusion with neutral wires).

### Troubleshooting Common 0-10V Issues
1. **Fixtures Won't Dim Below 100%:** An open circuit on the violet/pink control loop will cause drivers to default to 100% full brightness as a built-in safety fail-safe.
2. **Fixtures Flashing or Strobe Effect:** Reversed polarity on one fixture in a daisy chain will pull the entire low-voltage bus to ground. Verify all purple-to-purple and pink-to-pink connections.
3. **Erratic Dimming and Ghosting:** Control wires run parallel to unshielded 277V line voltage conductors without proper physical isolation can pick up electromagnetic induction. Always run Class 2 control wires in compliant separated conduits or use UL listed rated cable assemblies.`,
      seo: {
        title: "0-10V Dimming Wiring & Troubleshooting Guide | The Lightning Lab",
        description: "Master commercial 0-10V dimming: wiring diagrams, NEC color codes (purple/pink), and fixing flickering fixtures.",
      },
    },
    {
      blogHandle: "buying-guides",
      handle: "understanding-ip-ratings-for-outdoor-lighting",
      title: "Deciphering IP Ratings: IP65 vs IP66 vs IP68 for Commercial Lighting",
      author: "David Vance, Master Electrician",
      excerpt: "Learn how Ingress Protection (IP) ratings dictate fixture suitability for wet locations, car washes, commercial parking lots, and fountains.",
      bodyMd: `## What Ingress Protection Means for Fixture Longevity

Outdoor and industrial luminaires are constantly exposed to environmental stressors: airborne dust, driving rain, seasonal snowpack, high-pressure pressure washers, and coastal salt mist. Understanding Ingress Protection (IP) testing ratings ensures your exterior fixtures deliver their rated 50,000-hour service life without moisture intrusion.

### The Two-Digit IP Rating Breakdown

An IP rating consists of two characteristic numbers defined by IEC Standard 60529:
- **First Digit (0 to 6):** Solid particle and dust protection.
- **Second Digit (0 to 9K):** Moisture and liquid ingress protection.

### Commercial IP Ratings Comparison

#### IP65: Jet Water Resistant
- **Protection:** Complete dust-tight barrier (6) plus protection against water jets projected by a 6.3mm nozzle from any direction (5).
- **Best For:** Commercial shoebox parking lot luminaires, building wall packs, standard exterior flood lights, and under-soffit canopies.

#### IP66: Powerful Water Jet & Heavy Seas
- **Protection:** Dust-tight (6) plus resistance against powerful water jets from a 12.5mm nozzle at 100 kPa pressure (6).
- **Best For:** Automatic drive-through car washes, industrial food processing sanitation zones, open marine piers, and roadside highway bridges.

#### IP67 & IP68: Continuous Immersion
- **IP67:** Temporary immersion in water up to 1 meter depth for 30 minutes.
- **IP68:** Continuous complete submersion in water under specified pressure conditions (typically 2 to 3 meters).
- **Best For:** In-ground architectural up-lights subject to standing puddles, decorative water features, landscape fountains, and swimming pool perimeters.

### Thermal Expansion and Gasket Integrity
Water ingress often occurs not during heavy storms, but immediately after fixtures shut off. As aluminum housings cool down, an internal vacuum draws in ambient moisture through compromised seals. Always specify silicone poured gaskets and anti-siphon cord grips on all wet location installations.`,
      seo: {
        title: "IP65 vs IP66 vs IP68 Outdoor Lighting Ratings | The Lightning Lab",
        description: "Guide to Ingress Protection (IP) ratings for commercial outdoor luminaires, parking lot lights, and waterproof fixtures.",
      },
    },
  ];

  await db.insert(blogPosts).values(blogData);
  console.log(`Inserted ${blogData.length} blog posts.`);

  // 3 Pages: about, faqs, warranty
  const pageData = [
    {
      handle: "about",
      title: "About The Lightning Lab",
      bodyMd: `# About The Lightning Lab

Founded by electrical contractors and lighting engineers, The Lightning Lab is a dedicated commercial lighting distributor delivering specification-grade LED fixtures directly to trade professionals, general contractors, and facility managers across North America.

## Our Core Mission

The commercial lighting market has long been weighed down by opaque distribution layers, weeks-long factory lead times, and confusing catalog numbering. The Lightning Lab changes that equation through transparent volume pricing, in-depth technical documentation, and inventory that actually ships within 24 hours.

## What Sets Us Apart

### 1. Specification-Grade Quality
Every luminaire in our catalog is engineered to withstand demanding commercial operating conditions. We partner directly with Tier-1 component manufacturers to feature isolated constant-current drivers, pure copper PCBs, and Samsung/Lumileds phosphor-coated diodes.

### 2. Rebate-Optimized Products
Over 90% of our indoor and industrial catalog is certified under **DLC 5.1 Premium** standards. Our in-house technical team assists contractors with utility rebate application paperwork, photometric point-by-point calculations, and lighting layout simulations.

### 3. Contractor-First B2B Programs
We offer volume bulk tiers, Net 30 trade credit accounts, and direct freight shipping straight to job sites. Whether retrofitting a 50,000 sq ft distribution center or outfitting a modern healthcare clinic, we provide the photometric accuracy and reliability your projects require.`,
      seo: {
        title: "About The Lightning Lab | Commercial LED Lighting Distributor",
        description: "Learn about The Lightning Lab: direct-to-contractor specification grade commercial LED lighting, DLC Premium rebates, and fast fulfillment.",
      },
    },
    {
      handle: "faqs",
      title: "Frequently Asked Questions",
      bodyMd: `# Frequently Asked Questions

Find quick answers to common commercial lighting, shipping, contractor account, and technical questions.

---

### Ordering & Contractor Accounts

#### How do contractor bulk pricing tiers work?
Our catalog features automatic volume tier discounts at 10+, 25+, and 100+ unit quantities. Verified electrical contractors and wholesale accounts can also apply for Net 30 payment terms and custom project quotes on orders exceeding $10,000.

#### Do you offer job site freight delivery?
Yes. Commercial fixtures exceeding standard parcel dimensions (such as 2x4 flat panels, 8ft linear fixtures, and large shoebox area lights) ship via dedicated LTL freight carriers with optional liftgate and call-ahead scheduling.

---

### Technical & Engineering

#### What is the difference between 0-10V and line voltage dimming?
0-10V dimming uses two dedicated low-voltage signal wires (violet/pink) to control light output smoothly down to 10% or 1% without generating harmonic hum or heating up dimmers. It is the required standard for commercial building energy codes (Title 24, ASHRAE 90.1).

#### How do I know if a product qualifies for energy utility rebates?
Look for the **DLC 5.1 Premium** or **DLC Standard** badge on the product page. You can download the official spec sheet containing the DLC Product ID to submit directly to your regional utility provider.

#### Can I select color temperature on site?
Yes! Our CCT selectable flat panels, downlights, and linear fixtures feature integrated DIP toggle switches that allow installers to adjust color between 3000K, 3500K, 4000K, and 5000K right before snapping the fixture into place.

---

### Shipping & Returns

#### How fast do orders ship?
In-stock items ship within **1 business day** from our central logistics hubs. Tracking numbers are transmitted via email as soon as freight bills of lading are created.

#### What is your return policy for commercial overages?
Unopened fixtures in their original manufacturer packaging can be returned within 30 days of delivery. Custom-cut LED strip lengths and special-order high-voltage (347-480V) units are final sale.`,
      seo: {
        title: "Commercial Lighting FAQs | The Lightning Lab",
        description: "Answers to commercial LED lighting questions: contractor pricing, 0-10V dimming, DLC rebates, and LTL shipping.",
      },
    },
    {
      handle: "warranty",
      title: "5-Year Commercial Warranty Policy",
      bodyMd: `# 5-Year Comprehensive Commercial Warranty

The Lightning Lab stands behind the commercial reliability and performance of our fixtures with an industry-leading **5-Year Comprehensive Warranty** covering both LED arrays and internal power supplies.

---

## What Is Covered

This warranty covers defects in materials and manufacturing under normal commercial operating conditions for a period of **5 years (60 months)** from the verified date of shipment. 

Covered components include:
- **LED Emitters:** Excessive lumen depreciation exceeding 30% (L70 failure) or catastrophic diode failure.
- **Internal Drivers & Power Supplies:** Complete component failure, internal capacitor breakdown, and loss of 0-10V dimming regulation.
- **Housing Integrity:** Severe finish peeling, structural cracking, and seal failure on IP65/IP66 wet-rated fixtures installed in accordance with product specifications.

---

## How to File a Warranty Claim

Our warranty process is streamlined to keep your job site moving without downtime:

1. **Submit Ticket:** Contact trade support with your original invoice or purchase order (PO) number, fixture SKU, and a brief description of the issue.
2. **Technical Review:** Our engineering team reviews operating voltage conditions and electrical photos within 24 business hours.
3. **Rapid Replacement:** For verified claims, replacement fixtures or modular driver components are dispatched via expedited freight without waiting for defective units to arrive back at our warehouse.

---

## Limitations and Exclusions

This warranty does not cover failures resulting from:
- Installation by non-licensed electrical personnel or violation of local National Electrical Code (NEC) standards.
- Voltage surges or transients exceeding the rated surge protection limits (recommend external surge arrestors in lightning-prone regions).
- Ambient operating temperatures exceeding the maximum rating stated on the technical spec sheet (typically -40°C to +50°C).
- Use with incompatible electronic dimming controls or unapproved phase-cut dimmers.`,
      seo: {
        title: "5-Year Commercial Warranty | The Lightning Lab",
        description: "Details on The Lightning Lab 5-year commercial LED fixture warranty: coverage terms, driver replacement, and rapid claim process.",
      },
    },
  ];

  await db.insert(pages).values(pageData);
  console.log(`Inserted ${pageData.length} informational pages.`);

  await db.insert(discounts).values({
    code: "TEST10",
    type: "percentage",
    value: 10,
    minSubtotal: null,
    active: true,
  });
  console.log("Inserted discount TEST10 (10% off).");

  // Print final summary counts
  console.log("\n==========================================");
  console.log("DATABASE SEED SUMMARY");
  console.log("==========================================");
  console.log(`Collections:      ${collectionData.length}`);
  console.log(`Products:         ${rawProducts.length}`);
  console.log(`Product Variants: ${totalVariantsCount}`);
  console.log(`Reviews:          ${reviewData.length}`);
  console.log(`Blog Posts:       ${blogData.length}`);
  console.log(`Pages:            ${pageData.length}`);
  console.log("==========================================\n");
}

runSeed()
  .then(() => {
    console.log("Seed completed successfully!");
    process.exit(0);
  })
  .catch((err) => {
    console.error("Seed failed with error:", err);
    process.exit(1);
  });
