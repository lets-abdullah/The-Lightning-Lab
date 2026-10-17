import {
  pgTable,
  uuid,
  text,
  integer,
  boolean,
  timestamp,
  jsonb,
  smallint,
  check,
  unique,
  index,
  primaryKey,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import type {
  Media,
  FileRef,
  ShippingProfile,
  ProductSpecs,
  ProductOption,
  BulkTier,
  InventoryState,
  FacetConfig,
  ProductRef,
  Faq,
  SeoFields,
  Address,
} from "@/lib/commerce/types";

export const collections = pgTable("collections", {
  id: uuid("id").primaryKey().defaultRandom(),
  handle: text("handle").notNull().unique(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  longDescription: text("long_description"),
  parentHandle: text("parent_handle"),
  heroImage: jsonb("hero_image").$type<Media>(),
  icon: jsonb("icon").$type<Media>(),
  seo: jsonb("seo").$type<SeoFields>().notNull(),
  productCount: integer("product_count").notNull().default(0),
  sortDefault: text("sort_default").notNull().default("featured"),
  filters: jsonb("filters").$type<FacetConfig[]>().notNull().default(sql`'[]'::jsonb`),
  featuredProducts: jsonb("featured_products").$type<ProductRef[]>(),
  faqs: jsonb("faqs").$type<Faq[]>(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const products = pgTable("products", {
  id: uuid("id").primaryKey().defaultRandom(),
  handle: text("handle").notNull().unique(),
  title: text("title").notNull(),
  subtitle: text("subtitle"),
  brand: text("brand"),
  sku: text("sku").notNull().unique(),
  status: text("status").notNull().default("active"),
  price: integer("price").notNull(),
  compareAtPrice: integer("compare_at_price"),
  currency: text("currency").notNull().default("USD"),
  costPerItem: integer("cost_per_item"),
  productType: text("product_type").notNull(),
  collections: text("collections").array().notNull(),
  tags: text("tags").array().notNull(),
  shortDescription: text("short_description").notNull(),
  descriptionHtml: text("description_html").notNull(),
  features: text("features").array().notNull(),
  specSheet: jsonb("spec_sheet").$type<FileRef>(),
  iesFile: jsonb("ies_file").$type<FileRef>(),
  installationGuide: jsonb("installation_guide").$type<FileRef>(),
  images: jsonb("images").$type<Media[]>().notNull(),
  videos: jsonb("videos").$type<Media[]>(),
  documents: jsonb("documents").$type<FileRef[]>(),
  specs: jsonb("specs").$type<ProductSpecs>().notNull(),
  options: jsonb("options").$type<ProductOption[]>().notNull(),
  inventory: jsonb("inventory").$type<InventoryState>().notNull(),
  shipping: jsonb("shipping").$type<ShippingProfile>().notNull(),
  bulkPricing: jsonb("bulk_pricing").$type<BulkTier[]>(),
  isB2BOnly: boolean("is_b2b_only").notNull().default(false),
  rating: jsonb("rating").$type<{ average: number; count: number }>(),
  seo: jsonb("seo").$type<SeoFields>().notNull(),
  relatedHandles: text("related_handles").array(),
  crossSellHandles: text("cross_sell_handles").array(),
  publishedAt: timestamp("published_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const productVariants = pgTable("product_variants", {
  id: uuid("id").primaryKey().defaultRandom(),
  productId: uuid("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  sku: text("sku").notNull().unique(),
  title: text("title").notNull(),
  optionValues: jsonb("option_values").$type<Record<string, string>>().notNull(),
  price: integer("price").notNull(),
  compareAtPrice: integer("compare_at_price"),
  inventoryQuantity: integer("inventory_quantity").notNull().default(0),
  inventoryPolicy: text("inventory_policy").notNull().default("deny"),
  weight: integer("weight"),
  barcode: text("barcode"),
  image: jsonb("image").$type<Media>(),
  bulkPricing: jsonb("bulk_pricing").$type<BulkTier[]>(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const reviews = pgTable(
  "reviews",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    productHandle: text("product_handle").notNull(),
    rating: smallint("rating").notNull(),
    title: text("title"),
    body: text("body").notNull(),
    authorName: text("author_name").notNull(),
    verifiedPurchase: boolean("verified_purchase").notNull().default(false),
    helpfulCount: integer("helpful_count").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    check("rating_check", sql`${table.rating} >= 1 AND ${table.rating} <= 5`),
  ]
);

export const customers = pgTable("customers", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  phone: text("phone"),
  type: text("type").notNull().default("retail"),
  company: jsonb("company").$type<{
    name: string;
    taxId?: string;
    taxExempt: boolean;
    paymentTerms: "prepaid" | "net30" | "net60";
  }>(),
  defaultAddressId: uuid("default_address_id"),
  marketingOptIn: boolean("marketing_opt_in").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const addresses = pgTable("addresses", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id, {
    onDelete: "cascade",
  }),
  customerId: uuid("customer_id").references(() => customers.id, {
    onDelete: "set null",
  }),
  label: text("label"),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  company: text("company"),
  line1: text("line1").notNull(),
  line2: text("line2"),
  city: text("city").notNull(),
  state: text("state").notNull(),
  postalCode: text("postal_code").notNull(),
  country: text("country").notNull(),
  phone: text("phone"),
  isDefaultBilling: boolean("is_default_billing").notNull().default(false),
  isDefaultShipping: boolean("is_default_shipping").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const orders = pgTable("orders", {
  id: uuid("id").primaryKey().defaultRandom(),
  orderNumber: text("order_number").notNull().unique(),
  userId: uuid("user_id").references(() => users.id, {
    onDelete: "set null",
  }),
  customerId: uuid("customer_id").references(() => customers.id, {
    onDelete: "set null",
  }),
  email: text("email").notNull(),
  phone: text("phone"),
  status: text("status").notNull().default("pending"),
  currency: text("currency").notNull().default("USD"),
  subtotal: integer("subtotal").notNull(),
  discountTotal: integer("discount_total").notNull().default(0),
  shippingTotal: integer("shipping_total").notNull().default(0),
  taxTotal: integer("tax_total").notNull().default(0),
  total: integer("total").notNull(),
  discountCodes: text("discount_codes").array().notNull().default(sql`ARRAY[]::text[]`),
  shippingAddress: jsonb("shipping_address").$type<Address>().notNull(),
  billingAddress: jsonb("billing_address").$type<Address>().notNull(),
  shippingMethod: text("shipping_method").notNull(),
  trackingNumber: text("tracking_number"),
  trackingUrl: text("tracking_url"),
  notes: text("notes"),
  poNumber: text("po_number"),
  paymentIntentId: text("payment_intent_id"),
  paymentMethod: text("payment_method").notNull().default("card"),
  paymentTerms: text("payment_terms"),
  paidAt: timestamp("paid_at", { withTimezone: true }),
  fulfilledAt: timestamp("fulfilled_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const orderLines = pgTable("order_lines", {
  id: uuid("id").primaryKey().defaultRandom(),
  orderId: uuid("order_id")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  productHandle: text("product_handle").notNull(),
  variantId: text("variant_id").notNull(),
  title: text("title").notNull(),
  variantTitle: text("variant_title").notNull(),
  sku: text("sku").notNull(),
  image: text("image").notNull(),
  quantity: integer("quantity").notNull(),
  unitPrice: integer("unit_price").notNull(),
  lineTotal: integer("line_total").notNull(),
  bulkTierApplied: text("bulk_tier_applied"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const quotes = pgTable("quotes", {
  id: uuid("id").primaryKey().defaultRandom(),
  customerId: uuid("customer_id").references(() => customers.id, {
    onDelete: "set null",
  }),
  email: text("email").notNull(),
  company: text("company"),
  status: text("status").notNull().default("submitted"),
  message: text("message"),
  quotedTotal: integer("quoted_total"),
  expiresAt: timestamp("expires_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const quoteLines = pgTable("quote_lines", {
  id: uuid("id").primaryKey().defaultRandom(),
  quoteId: uuid("quote_id")
    .notNull()
    .references(() => quotes.id, { onDelete: "cascade" }),
  variantId: text("variant_id").notNull(),
  sku: text("sku").notNull(),
  quantity: integer("quantity").notNull(),
  targetPrice: integer("target_price"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const blogPosts = pgTable("blog_posts", {
  id: uuid("id").primaryKey().defaultRandom(),
  blogHandle: text("blog_handle").notNull(),
  handle: text("handle").notNull(),
  title: text("title").notNull(),
  excerpt: text("excerpt").notNull(),
  bodyMd: text("body_md").notNull(),
  author: text("author").notNull(),
  publishedAt: timestamp("published_at", { withTimezone: true }).notNull().defaultNow(),
  seo: jsonb("seo").$type<SeoFields>().notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const pages = pgTable("pages", {
  id: uuid("id").primaryKey().defaultRandom(),
  handle: text("handle").notNull().unique(),
  title: text("title").notNull(),
  bodyMd: text("body_md").notNull(),
  seo: jsonb("seo").$type<SeoFields>().notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const carts = pgTable("carts", {
  id: uuid("id").primaryKey().defaultRandom(),
  token: text("token").notNull().unique(),
  customerId: uuid("customer_id"),
  note: text("note"),
  poNumber: text("po_number"),
  discountCodes: text("discount_codes")
    .array()
    .notNull()
    .default(sql`'{}'::text[]`),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const cartLines = pgTable(
  "cart_lines",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    cartId: uuid("cart_id")
      .notNull()
      .references(() => carts.id, { onDelete: "cascade" }),
    variantId: uuid("variant_id").notNull(),
    quantity: integer("quantity").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    check("cart_lines_quantity_check", sql`${table.quantity} > 0`),
    unique("cart_lines_cart_variant_unique").on(table.cartId, table.variantId),
  ]
);

export const discounts = pgTable(
  "discounts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    code: text("code").notNull().unique(),
    type: text("type").notNull(),
    value: integer("value").notNull(),
    minSubtotal: integer("min_subtotal"),
    active: boolean("active").notNull().default(true),
    expiresAt: timestamp("expires_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    check("discounts_type_check", sql`${table.type} IN ('percentage', 'fixed')`),
  ]
);

export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    email: text("email").notNull().unique(),
    emailVerified: timestamp("email_verified", { withTimezone: true, mode: "date" }),
    name: text("name"),
    firstName: text("first_name"),
    lastName: text("last_name"),
    phone: text("phone"),
    passwordHash: text("password_hash"),
    image: text("image"),
    type: text("type").notNull().default("retail"),
    marketingOptIn: boolean("marketing_opt_in").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    check("users_type_check", sql`${table.type} IN ('retail', 'contractor', 'wholesale')`),
  ]
);

export const accounts = pgTable(
  "accounts",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("provider_account_id").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => [
    primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  ]
);

export const sessions = pgTable("sessions", {
  sessionToken: text("session_token").primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { withTimezone: true, mode: "date" }).notNull(),
});

export const verificationTokens = pgTable(
  "verification_tokens",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { withTimezone: true, mode: "date" }).notNull(),
  },
  (vt) => [
    primaryKey({
      columns: [vt.identifier, vt.token],
    }),
  ]
);

export const authTokens = pgTable(
  "auth_tokens",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    purpose: text("purpose").notNull(),
    tokenHash: text("token_hash").notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    usedAt: timestamp("used_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    check("auth_tokens_purpose_check", sql`${table.purpose} IN ('email_verify', 'password_reset')`),
    index("auth_tokens_user_purpose_idx").on(table.userId, table.purpose),
    index("auth_tokens_token_hash_idx").on(table.tokenHash),
  ]
);

