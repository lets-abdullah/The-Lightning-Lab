import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { env } from "@/lib/env";
import * as schema from "./schema";
import type { InferSelectModel } from "drizzle-orm";

const globalForDb = globalThis as unknown as {
  conn: Pool | undefined;
};

const pool =
  globalForDb.conn ??
  new Pool({
    connectionString: env.DATABASE_URL,
  });

if (process.env.NODE_ENV !== "production") globalForDb.conn = pool;

export const db = drizzle(pool, { schema });

export type CollectionRow = InferSelectModel<typeof schema.collections>;
export type ProductRow = InferSelectModel<typeof schema.products>;
export type ProductVariantRow = InferSelectModel<typeof schema.productVariants>;
export type ReviewRow = InferSelectModel<typeof schema.reviews>;
export type CustomerRow = InferSelectModel<typeof schema.customers>;
export type AddressRow = InferSelectModel<typeof schema.addresses>;
export type OrderRow = InferSelectModel<typeof schema.orders>;
export type OrderLineRow = InferSelectModel<typeof schema.orderLines>;
export type QuoteRow = InferSelectModel<typeof schema.quotes>;
export type QuoteLineRow = InferSelectModel<typeof schema.quoteLines>;
export type BlogPostRow = InferSelectModel<typeof schema.blogPosts>;
export type PageRow = InferSelectModel<typeof schema.pages>;
