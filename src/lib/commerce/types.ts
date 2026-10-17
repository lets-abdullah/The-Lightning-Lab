// src/lib/commerce/types.ts

/* ============================================================
 * Primitives referenced by the domain types below.
 * (The blueprint named these but never defined them — defining
 * minimal versions here so the file compiles. Flag any concern
 * before Prompt 1 is run.)
 * ============================================================ */

export type RichText = string; // HTML string for this phase

export interface Media {
  url: string;
  alt: string;
  width?: number;
  height?: number;
  type: "image" | "video";
}

export interface FileRef {
  url: string;
  label: string; // "Spec Sheet", "IES File"
  mimeType?: string;
  sizeBytes?: number;
}

export interface ShippingProfile {
  requiresFreight: boolean; // LTL for oversize
  weightOz?: number;
  dimensions?: { l: number; w: number; h: number; unit: "in" };
  shipsWithin: string; // "1 business day"
  freeShippingEligible: boolean;
}

export interface ReviewRef {
  id: string;
  rating: 1 | 2 | 3 | 4 | 5;
  authorName: string;
  excerpt?: string;
  createdAt: string;
}

export interface ProductRef {
  handle: string;
  title: string;
  image: string;
  price: number;
  sku: string;
}

export interface Faq {
  question: string;
  answer: string;
}

export type FacetConfig = {
  key:
    | "price"
    | "wattage"
    | "cct"
    | "voltage"
    | "certification"
    | "dimmable"
    | "availability"
    | "brand";
  label: string;
  type: "range" | "checkbox" | "radio";
  options?: string[];
};

export interface SeoFields {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: Media;
  noIndex?: boolean;
  jsonLd?: Record<string, unknown>;
}

/* ============================================================
 * Product (Blueprint §4)
 * ============================================================ */

export interface ProductSpecs {
  wattage?: string; // "40W / 50W / 60W selectable"
  lumens?: number;
  lumensPerWatt?: number;
  voltage?: string; // "120-277V"
  cct?: string; // "3000K/4000K/5000K selectable"
  cri?: number; // 80+
  beamAngle?: string;
  dimmable?: boolean;
  dimmingType?: ("0-10V" | "TRIAC" | "ELV" | "DALI")[];
  ipRating?: string; // "IP65"
  locationRating?: "dry" | "damp" | "wet";
  lifespan?: number; // hours
  warrantyYears?: number;
  certifications?: ("UL" | "ETL" | "DLC" | "Energy Star" | "FCC")[];
  operatingTemp?: string;
  dimensions?: {
    length?: number;
    width?: number;
    height?: number;
    unit: "in" | "mm";
  };
  weight?: number;
  material?: string;
  finish?: string;
  extra?: Record<string, string | number>; // category-specific escape hatch
}

export interface ProductOption {
  name: string; // "Wattage" | "Color Temperature" | "Length"
  position: number;
  values: string[]; // ["40W","50W","60W"]
  presentation: "dropdown" | "swatch" | "radio";
}

export interface BulkTier {
  minQty: number; // 10
  price: number; // cents
  label?: string; // "Contractor 10+"
}

export interface InventoryState {
  available: boolean;
  quantity: number;
  leadTimeDays?: number;
  shipsWithin?: string; // "1 business day"
}

export interface ProductVariant {
  id: string;
  sku: string;
  title: string; // "50W / 4000K / 2x4"
  optionValues: Record<string, string>;
  price: number;
  compareAtPrice?: number;
  inventoryQuantity: number;
  inventoryPolicy: "deny" | "continue"; // backorder allowed?
  weight?: number;
  barcode?: string;
  image?: Media;
  bulkPricing?: BulkTier[];
}

export interface Product {
  id: string;
  handle: string; // "2x4-led-panel-40w-selectable-cct"
  title: string;
  subtitle?: string;
  brand?: string;
  sku: string; // "STL-0345"
  status: "active" | "draft" | "archived";

  price: number; // cents
  compareAtPrice?: number; // strike-through
  currency: "USD";
  costPerItem?: number;

  productType: string; // "LED Panel Light"
  collections: string[]; // collection handles
  tags: string[]; // ["dimmable","etl","2x4","selectable-cct"]

  shortDescription: string;
  descriptionHtml: string;
  features: string[];
  specSheet?: FileRef;
  iesFile?: FileRef;
  installationGuide?: FileRef;

  images: Media[];
  videos?: Media[];
  documents?: FileRef[];

  specs: ProductSpecs;

  options: ProductOption[];
  variants: ProductVariant[];

  inventory: InventoryState;
  shipping: ShippingProfile;
  bulkPricing?: BulkTier[];
  isB2BOnly?: boolean;

  rating?: { average: number; count: number };
  reviews?: ReviewRef[];

  seo: SeoFields;
  relatedHandles?: string[];
  crossSellHandles?: string[];

  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

/* ============================================================
 * Review (Blueprint §4)
 * ============================================================ */

export interface Review {
  id: string;
  productHandle: string;
  rating: 1 | 2 | 3 | 4 | 5;
  title?: string;
  body: string;
  authorName: string;
  verifiedPurchase: boolean;
  createdAt: string;
  helpfulCount?: number;
}

/* ============================================================
 * Collection (Blueprint §3.3)
 * ============================================================ */

export interface Collection {
  id: string;
  handle: string; // "2x4-led-panels"
  title: string; // "2x4 LED Panel Lights"
  description: string;
  longDescription?: RichText; // 300–600 word SEO block below grid
  parentHandle?: string; // null for top-level
  heroImage?: Media;
  icon?: Media;
  seo: SeoFields;
  productCount: number;
  sortDefault: "featured" | "price-asc" | "price-desc" | "newest" | "best-selling";
  filters: FacetConfig[];
  featuredProducts?: ProductRef[];
  faqs?: Faq[];
}

/* ============================================================
 * Cart (Blueprint §7)
 * ============================================================ */

export interface CartLine {
  id: string;
  productHandle: string;
  variantId: string;
  title: string;
  variantTitle: string;
  sku: string;
  image: string;
  quantity: number;
  unitPrice: number; // cents, already includes bulk tier
  lineTotal: number;
  bulkTierApplied?: string;
}

export interface Cart {
  id: string;
  token: string;
  lines: CartLine[];
  subtotal: number;
  discountTotal: number;
  shippingEstimate?: number;
  taxEstimate?: number;
  total: number;
  currency: string;
  discountCodes: string[];
  note?: string;
  poNumber?: string;
  freeShippingRemaining: number;
}

/* ============================================================
 * Address / Order / OrderLine (confirmed in the previous turn)
 * ============================================================ */

export interface Address {
  id: string;
  customerId: string | null; // null for guest order snapshot
  label?: string;
  firstName: string;
  lastName: string;
  company?: string;
  line1: string;
  line2?: string;
  city: string;
  state: string; // 2-letter (US)
  postalCode: string;
  country: string; // ISO 3166-1 alpha-2
  phone?: string;
  isDefaultBilling: boolean;
  isDefaultShipping: boolean;
}

export type OrderStatus =
  | "pending"
  | "paid"
  | "processing"
  | "fulfilled"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "refunded"
  | "partially_refunded";

export interface OrderLine {
  id: string;
  orderId: string;
  productHandle: string;
  variantId: string;
  title: string;
  variantTitle: string;
  sku: string;
  image: string;
  quantity: number;
  unitPrice: number; // cents at time of order — never recompute
  lineTotal: number;
  bulkTierApplied?: string;
}

export interface Order {
  id: string;
  orderNumber: string; // "STL-2026-00001"
  customerId?: string; // null for guest checkout
  email: string;
  phone?: string;
  status: OrderStatus;
  currency: "USD";
  lines: OrderLine[];
  subtotal: number;
  discountTotal: number;
  shippingTotal: number;
  taxTotal: number;
  total: number;
  discountCodes: string[];
  shippingAddress: Address;
  billingAddress: Address;
  shippingMethod: string;
  trackingNumber?: string;
  trackingUrl?: string;
  notes?: string;
  poNumber?: string;
  paymentIntentId?: string;
  paymentMethod: "card" | "ach" | "wire" | "check" | "net30";
  paymentTerms?: "prepaid" | "net30" | "net60";
  paidAt?: string;
  fulfilledAt?: string;
  createdAt: string;
  updatedAt: string;
}

/* ============================================================
 * Customer (Blueprint §9.3)
 * ============================================================ */

export interface Customer {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  type: "retail" | "contractor" | "wholesale";
  company?: {
    name: string;
    taxId?: string;
    taxExempt: boolean;
    paymentTerms: "prepaid" | "net30" | "net60";
  };
  defaultAddressId?: string;
  addresses: Address[];
  marketingOptIn: boolean;
  createdAt: string;
}

/* ============================================================
 * Quote (Blueprint §11)
 * ============================================================ */

export interface Quote {
  id: string;
  customerId?: string;
  email: string;
  company?: string;
  lines: {
    variantId: string;
    sku: string;
    quantity: number;
    targetPrice?: number;
  }[];
  status: "submitted" | "reviewing" | "quoted" | "accepted" | "declined" | "expired";
  message?: string;
  quotedTotal?: number;
  expiresAt?: string;
  createdAt: string;
}
