import type { CollectionCreateSchema } from "typesense/lib/Typesense/Collections";

export const PRODUCT_SCHEMA: CollectionCreateSchema = {
  name: "products",
  fields: [
    { name: "handle", type: "string" },
    { name: "title", type: "string" },
    { name: "sku", type: "string", sort: false },
    { name: "description", type: "string", optional: true },
    { name: "image", type: "string", index: false },
    { name: "imageAlt", type: "string", index: false },
    { name: "specLine", type: "string", index: false, optional: true },
    { name: "price", type: "int32" },
    { name: "compareAtPrice", type: "int32", optional: true },
    { name: "collections", type: "string[]", facet: true },
    { name: "tags", type: "string[]", facet: true },
    { name: "wattage", type: "string[]", facet: true, optional: true },
    { name: "cct", type: "string[]", facet: true, optional: true },
    { name: "voltage", type: "string[]", facet: true, optional: true },
    { name: "certifications", type: "string[]", facet: true, optional: true },
    { name: "dimmable", type: "bool", facet: true, optional: true },
    { name: "inStock", type: "bool", facet: true },
    { name: "ratingAvg", type: "float", optional: true },
    { name: "ratingCount", type: "int32", optional: true },
    { name: "createdAt", type: "int64" }, // epoch seconds
    { name: "productSnapshot", type: "string", index: false }, // JSON of Product
  ],
  default_sorting_field: "createdAt",
};

export type ProductDocument = {
  id: string; // = product.id
  handle: string;
  title: string;
  sku: string;
  description?: string;
  image: string;
  imageAlt: string;
  specLine?: string;
  price: number;
  compareAtPrice?: number;
  collections: string[];
  tags: string[];
  wattage?: string[];
  cct?: string[];
  voltage?: string[];
  certifications?: string[];
  dimmable?: boolean;
  inStock: boolean;
  ratingAvg?: number;
  ratingCount?: number;
  createdAt: number;
  productSnapshot: string;
};
