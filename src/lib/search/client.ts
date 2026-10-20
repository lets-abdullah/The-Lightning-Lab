import "server-only";
import { Client } from "typesense";
import { serverEnv } from "@/lib/env";

export const typesense = new Client({
  nodes: [
    {
      host: serverEnv.TYPESENSE_HOST,
      port: serverEnv.TYPESENSE_PORT,
      protocol: serverEnv.TYPESENSE_PROTOCOL,
    },
  ],
  apiKey: serverEnv.TYPESENSE_API_KEY,
  connectionTimeoutSeconds: 5,
});

export const SEARCH_COLLECTION = serverEnv.TYPESENSE_COLLECTION;
