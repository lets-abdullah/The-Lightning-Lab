import type { Media } from "./types";

export function resolveProductImage(product: {
  handle?: string;
  title?: string;
  collections?: string[];
  images?: Media[];
}): string {
  const existing = product.images?.[0]?.url;
  if (existing && !existing.includes("placehold.co") && !existing.includes("example.com")) {
    return existing;
  }

  const text = `${product.handle || ""} ${product.title || ""} ${(product.collections || []).join(" ")}`.toLowerCase();

  if (text.includes("ufo") || text.includes("high-bay") || text.includes("high bay") || text.includes("commercial-industrial")) {
    return "/images/ufo-led-high-bay-light-wattage-selectable-150w-120w-100w-lumens_640x.jpg";
  }
  if (text.includes("troffer") || text.includes("basket")) {
    return "/images/Selectable-Wattage-LED-Panel_640x.jpg";
  }
  if (text.includes("1x4") || text.includes("surface mount")) {
    return "/images/1x4_LED_Flat_Panel_Light_Surface_Mount_640x.jpg";
  }
  if (text.includes("panel") || text.includes("2x2") || text.includes("2x4") || text.includes("flat-panel")) {
    return "/images/led_flat_panel_lights_640x.jpeg";
  }
  if (text.includes("strip") || text.includes("linear") || text.includes("cob") || text.includes("tape") || text.includes("channel")) {
    return "/images/8ft_led_shop_light_fixture_cct_selecatable_640x.jpg";
  }
  if (text.includes("outdoor") || text.includes("wall-pack") || text.includes("canopy") || text.includes("flood") || text.includes("area")) {
    return "/images/led_outdoor_lighting_640x.jpeg";
  }
  if (text.includes("emergency") || text.includes("exit")) {
    return "/images/Exit_lights_combo_640x.jpeg";
  }
  if (text.includes("downlight") || text.includes("decor") || text.includes("recessed")) {
    return "/images/Home_Decor_Lighting.jpeg";
  }

  return "/images/Selectable-Wattage-LED-Panel_640x.jpg";
}

export function resolveGalleryImages(product: {
  handle?: string;
  title?: string;
  collections?: string[];
  images?: Media[];
}): Media[] {
  const primaryUrl = resolveProductImage(product);
  const text = `${product.handle || ""} ${product.title || ""} ${(product.collections || []).join(" ")}`.toLowerCase();

  const alt = product.title || "Commercial LED Luminaire";

  // Category complementary secondary images
  let secondaryUrl = "/images/1x4_LED_Flat_Panel_Light_Surface_Mount_640x.jpg";
  let tertiaryUrl = "/images/Selectable-Wattage-LED-Panel_640x.jpg";

  if (text.includes("ufo") || text.includes("high-bay")) {
    secondaryUrl = "/images/ufo-led-high-bay-light-single-fixture-plug-play-150w-120w-100w_640x.jpg";
    tertiaryUrl = "/images/Selectable-Wattage-LED-Panel_640x.jpg";
  } else if (text.includes("strip") || text.includes("linear")) {
    secondaryUrl = "/images/8FT_Black_LED_Linear_Light_4_Pack_640x.jpg";
    tertiaryUrl = "/images/Switchtoled_backlight_sheet_640x.jpg";
  } else if (text.includes("outdoor")) {
    secondaryUrl = "/images/commercial_lighting_solutions.jpeg";
    tertiaryUrl = "/images/led_outdoor_lighting_640x.jpeg";
  } else if (text.includes("emergency") || text.includes("exit")) {
    secondaryUrl = "/images/fire_resistant_exit_sign_640x.jpeg";
    tertiaryUrl = "/images/Exit_lights_combo_640x.jpeg";
  }

  return [
    { url: primaryUrl, alt: `${alt} - Main View`, type: "image" },
    { url: secondaryUrl, alt: `${alt} - Detail View`, type: "image" },
    { url: tertiaryUrl, alt: `${alt} - Application View`, type: "image" },
  ];
}
