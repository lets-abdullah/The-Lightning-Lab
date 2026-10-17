import type {
  Product,
  Collection,
  Cart,
  Customer,
  Order,
  Quote,
} from "./types";

export * from "./types";

export abstract class CommerceAdapter {
  getProduct(_handle: string): Promise<Product | null> {
    throw new Error("not implemented");
  }

  listProducts(_params?: {
    collection?: string;
    limit?: number;
    cursor?: string;
  }): Promise<{ products: Product[]; nextCursor?: string }> {
    throw new Error("not implemented");
  }

  getCollection(_handle: string): Promise<Collection | null> {
    throw new Error("not implemented");
  }

  listCollections(): Promise<Collection[]> {
    throw new Error("not implemented");
  }

  createCart(): Promise<Cart> {
    throw new Error("not implemented");
  }

  addLine(
    _cartId: string,
    _variantId: string,
    _quantity: number
  ): Promise<Cart> {
    throw new Error("not implemented");
  }

  updateLine(
    _cartId: string,
    _lineId: string,
    _quantity: number
  ): Promise<Cart> {
    throw new Error("not implemented");
  }

  removeLine(_cartId: string, _lineId: string): Promise<Cart> {
    throw new Error("not implemented");
  }

  getCart(_cartId: string): Promise<Cart | null> {
    throw new Error("not implemented");
  }

  applyDiscount(_cartId: string, _code: string): Promise<Cart> {
    throw new Error("not implemented");
  }

  getCustomer(_id: string): Promise<Customer | null> {
    throw new Error("not implemented");
  }

  listOrders(_customerId: string): Promise<Order[]> {
    throw new Error("not implemented");
  }

  createQuote(_input: {
    email: string;
    lines: {
      variantId: string;
      sku: string;
      quantity: number;
      targetPrice?: number;
    }[];
    company?: string;
    message?: string;
  }): Promise<Quote> {
    throw new Error("not implemented");
  }
}

import { DbAdapter } from "./db-adapter";
export const commerce = new DbAdapter();
