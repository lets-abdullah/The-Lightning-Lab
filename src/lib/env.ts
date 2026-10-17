import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),

  // Database (Postgres + Drizzle)
  DATABASE_URL: z.string().default("postgresql://postgres:postgres@localhost:5432/postgres"),

  // Auth (Auth.js v5)
  AUTH_SECRET: z.string().default("fallback_auth_secret_must_be_at_least_32_characters_long_for_build"),
  GOOGLE_CLIENT_ID: z.string().default("placeholder_google_client_id"),
  GOOGLE_CLIENT_SECRET: z.string().default("placeholder_google_client_secret"),
  AUTH_URL: z.string().url().optional(),
  AUTH_GOOGLE_ID: z.string().optional(),
  AUTH_GOOGLE_SECRET: z.string().optional(),

  // Stripe
  STRIPE_SECRET_KEY: z.string().default("sk_test_placeholder_key"),
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().default("pk_test_placeholder_key"),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),

  // Typesense
  TYPESENSE_API_KEY: z.string().optional(),
  NEXT_PUBLIC_TYPESENSE_SEARCH_ONLY_API_KEY: z.string().optional(),
  TYPESENSE_HOST: z.string().optional(),
  TYPESENSE_PORT: z.string().optional(),
  TYPESENSE_PROTOCOL: z.enum(["http", "https"]).default("https"),

  // Resend
  RESEND_API_KEY: z.string().optional(),
  EMAIL_FROM: z.string().optional(),

  // Cloudinary
  NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: z.string().optional(),
  CLOUDINARY_API_KEY: z.string().optional(),
  CLOUDINARY_API_SECRET: z.string().optional(),
});

const rawEnv = {
  ...process.env,
  DATABASE_URL: process.env.DATABASE_URL || undefined,
  AUTH_SECRET: process.env.AUTH_SECRET || undefined,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || undefined,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || undefined,
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY || undefined,
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || undefined,
};

const parsed = envSchema.safeParse(rawEnv);

if (!parsed.success) {
  console.warn("⚠️ Warning: Invalid environment variables detected during parsing:", parsed.error.format());
}

export const env = parsed.success
  ? parsed.data
  : (envSchema.parse({}) as z.infer<typeof envSchema>);
