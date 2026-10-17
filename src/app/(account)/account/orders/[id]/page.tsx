import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { and, eq } from "drizzle-orm";
import { auth } from "@/auth";
import { db } from "@/db";
import { orders, orderLines } from "@/db/schema";
import { formatPrice } from "@/lib/utils/format";
import { addLineAction } from "@/lib/cart/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  ExternalLink,
  RotateCcw,
  ShoppingBag,
  FileDown,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) notFound();

  const { id } = await params;

  const [order] = await db
    .select()
    .from(orders)
    .where(and(eq(orders.id, id), eq(orders.userId, session.user.id)))
    .limit(1);

  if (!order) {
    notFound();
  }

  const lines = await db
    .select()
    .from(orderLines)
    .where(eq(orderLines.orderId, order.id));

  const ship = order.shippingAddress;
  const bill = order.billingAddress;

  async function handleReorder() {
    "use server";
    for (const item of lines) {
      try {
        await addLineAction({
          variantId: item.variantId,
          quantity: item.quantity,
        });
      } catch (err) {
        console.error("Reorder item failed:", err);
      }
    }
    redirect("/cart");
  }

  return (
    <div className="space-y-8">
      {/* Back button & Header */}
      <div>
        <Link
          href="/account/orders"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to all orders
        </Link>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight">
                Order {order.orderNumber}
              </h1>
              <Badge variant="outline" className="capitalize">
                {order.status}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Placed on {new Date(order.createdAt).toLocaleDateString()} at{" "}
              {new Date(order.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>

          {/* Action Row */}
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="outline" size="sm" asChild>
              <Link
                href={`/account/orders/${order.id}/invoice`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <FileDown className="w-4 h-4 mr-2" />
                Download invoice
              </Link>
            </Button>

            <form action={handleReorder}>
              <Button type="submit" size="sm" className="gap-2">
                <ShoppingBag className="w-4 h-4" />
                Reorder
              </Button>
            </form>

            <Button variant="ghost" size="sm" asChild>
              <Link href="/account/returns">
                <RotateCcw className="w-4 h-4 mr-2" />
                Request return
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Tracking Info if available */}
      {order.trackingNumber && (
        <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-foreground">
              Shipment Tracking
            </p>
            <p className="text-xs text-muted-foreground font-mono mt-0.5">
              Tracking Number: {order.trackingNumber}
            </p>
          </div>
          {order.trackingUrl && (
            <Button variant="outline" size="sm" asChild>
              <a
                href={order.trackingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="gap-1.5"
              >
                <span>Track Package</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </Button>
          )}
        </div>
      )}

      {/* Line Items Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden shadow-xs">
        <div className="p-4 border-b border-border bg-muted/40 font-semibold text-sm">
          Items Ordered ({lines.length})
        </div>
        <div className="divide-y divide-border">
          {lines.map((line) => (
            <div
              key={line.id}
              className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4">
                {line.image ? (
                  <img
                    src={line.image}
                    alt={line.title}
                    className="w-16 h-16 object-cover rounded-md border border-border shrink-0 bg-muted"
                  />
                ) : (
                  <div className="w-16 h-16 bg-muted rounded-md border border-border flex items-center justify-center shrink-0 text-muted-foreground text-xs">
                    No image
                  </div>
                )}
                <div>
                  <Link
                    href={`/products/${line.productHandle}`}
                    className="font-medium text-foreground hover:underline"
                  >
                    {line.title}
                  </Link>
                  {line.variantTitle && (
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {line.variantTitle}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground font-mono mt-0.5">
                    SKU: {line.sku}
                  </p>
                </div>
              </div>
              <div className="text-right sm:shrink-0">
                <p className="text-sm font-medium">
                  {formatPrice(line.lineTotal, order.currency)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {line.quantity} ×{" "}
                  {formatPrice(line.unitPrice, order.currency)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Addresses & Totals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Shipping Address */}
        <div className="bg-card border border-border rounded-xl p-5 shadow-xs space-y-2">
          <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">
            Shipping Address
          </h3>
          <div className="text-sm leading-relaxed">
            <span className="font-medium text-foreground">
              {ship.firstName} {ship.lastName}
            </span>
            {ship.company && (
              <>
                <br />
                {ship.company}
              </>
            )}
            <br />
            {ship.line1}
            {ship.line2 && (
              <>
                <br />
                {ship.line2}
              </>
            )}
            <br />
            {ship.city}, {ship.state} {ship.postalCode}
            <br />
            {ship.country}
            {ship.phone && (
              <>
                <br />
                <span className="text-muted-foreground text-xs">
                  Phone: {ship.phone}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Billing Address */}
        <div className="bg-card border border-border rounded-xl p-5 shadow-xs space-y-2">
          <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">
            Billing Address
          </h3>
          <div className="text-sm leading-relaxed">
            <span className="font-medium text-foreground">
              {bill.firstName} {bill.lastName}
            </span>
            {bill.company && (
              <>
                <br />
                {bill.company}
              </>
            )}
            <br />
            {bill.line1}
            {bill.line2 && (
              <>
                <br />
                {bill.line2}
              </>
            )}
            <br />
            {bill.city}, {bill.state} {bill.postalCode}
            <br />
            {bill.country}
            {bill.phone && (
              <>
                <br />
                <span className="text-muted-foreground text-xs">
                  Phone: {bill.phone}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Totals Summary */}
        <div className="bg-card border border-border rounded-xl p-5 shadow-xs space-y-3">
          <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">
            Order Summary
          </h3>
          <div className="space-y-1.5 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal</span>
              <span>{formatPrice(order.subtotal, order.currency)}</span>
            </div>
            {order.discountTotal > 0 && (
              <div className="flex justify-between text-green-600 dark:text-green-400">
                <span>Discounts</span>
                <span>-{formatPrice(order.discountTotal, order.currency)}</span>
              </div>
            )}
            <div className="flex justify-between text-muted-foreground">
              <span>Shipping</span>
              <span>
                {order.shippingTotal === 0
                  ? "Free"
                  : formatPrice(order.shippingTotal, order.currency)}
              </span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Tax</span>
              <span>{formatPrice(order.taxTotal, order.currency)}</span>
            </div>
            <div className="flex justify-between font-bold text-foreground text-base pt-2 border-t border-border">
              <span>Total</span>
              <span>{formatPrice(order.total, order.currency)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
