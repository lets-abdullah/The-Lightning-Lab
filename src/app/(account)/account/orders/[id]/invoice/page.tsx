import { notFound } from "next/navigation";
import { and, eq } from "drizzle-orm";
import { auth } from "@/auth";
import { db } from "@/db";
import { orders, orderLines } from "@/db/schema";
import { formatPrice } from "@/lib/utils/format";
import { PrintButton } from "@/components/account/print-button";

export const dynamic = "force-dynamic";

export default async function OrderInvoicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) return notFound();

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

  return (
    <div className="bg-white text-black min-h-screen p-8 max-w-4xl mx-auto font-sans">
      <style>{`@media print { .no-print { display: none !important; } body { background: white !important; color: black !important; } }`}</style>

      {/* Top action bar */}
      <div className="no-print mb-8 flex justify-end">
        <PrintButton />
      </div>

      {/* Invoice Header */}
      <div className="flex justify-between items-start border-b border-gray-200 pb-8 mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            The Lightning Lab
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            6135 Peachtree Pkwy
            <br />
            Norcross, GA 30092
            <br />
            United States
            <br />
            support@thelightninglab.com
          </p>
        </div>
        <div className="text-right">
          <h2 className="text-3xl font-extrabold uppercase text-gray-900 tracking-wider">
            INVOICE
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            <span className="font-semibold text-gray-800">Order:</span>{" "}
            {order.orderNumber}
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-semibold text-gray-800">Date:</span>{" "}
            {new Date(order.createdAt).toLocaleDateString()}
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-semibold text-gray-800">Status:</span>{" "}
            <span className="uppercase font-medium">{order.status}</span>
          </p>
        </div>
      </div>

      {/* Bill To & Ship To */}
      <div className="grid grid-cols-2 gap-8 mb-8">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
            Bill To
          </h3>
          <div className="text-sm text-gray-800 leading-relaxed">
            {bill.firstName} {bill.lastName}
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
                {bill.phone}
              </>
            )}
          </div>
        </div>
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
            Ship To
          </h3>
          <div className="text-sm text-gray-800 leading-relaxed">
            {ship.firstName} {ship.lastName}
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
                {ship.phone}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Line Items Table */}
      <table className="w-full text-left text-sm mb-8 border-collapse">
        <thead>
          <tr className="border-b-2 border-gray-300 text-xs uppercase tracking-wider text-gray-700">
            <th className="py-3 px-2">Description</th>
            <th className="py-3 px-2">SKU</th>
            <th className="py-3 px-2 text-center">Qty</th>
            <th className="py-3 px-2 text-right">Unit Price</th>
            <th className="py-3 px-2 text-right">Amount</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {lines.map((line) => (
            <tr key={line.id}>
              <td className="py-3 px-2">
                <span className="font-semibold text-gray-900">
                  {line.title}
                </span>
                {line.variantTitle && (
                  <span className="block text-xs text-gray-500">
                    {line.variantTitle}
                  </span>
                )}
              </td>
              <td className="py-3 px-2 text-gray-600 font-mono text-xs">
                {line.sku}
              </td>
              <td className="py-3 px-2 text-center text-gray-800">
                {line.quantity}
              </td>
              <td className="py-3 px-2 text-right text-gray-800">
                {formatPrice(line.unitPrice, order.currency)}
              </td>
              <td className="py-3 px-2 text-right font-medium text-gray-900">
                {formatPrice(line.lineTotal, order.currency)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totals Block */}
      <div className="flex justify-end mb-12">
        <div className="w-64 space-y-2 text-sm">
          <div className="flex justify-between py-1 text-gray-600">
            <span>Subtotal</span>
            <span>{formatPrice(order.subtotal, order.currency)}</span>
          </div>
          {order.discountTotal > 0 && (
            <div className="flex justify-between py-1 text-green-700">
              <span>Discounts</span>
              <span>-{formatPrice(order.discountTotal, order.currency)}</span>
            </div>
          )}
          <div className="flex justify-between py-1 text-gray-600">
            <span>Shipping</span>
            <span>
              {order.shippingTotal === 0
                ? "Free"
                : formatPrice(order.shippingTotal, order.currency)}
            </span>
          </div>
          <div className="flex justify-between py-1 text-gray-600">
            <span>Tax</span>
            <span>{formatPrice(order.taxTotal, order.currency)}</span>
          </div>
          <div className="flex justify-between py-2 border-t-2 border-gray-900 font-bold text-base text-gray-900">
            <span>Total</span>
            <span>{formatPrice(order.total, order.currency)}</span>
          </div>
        </div>
      </div>

      {/* Invoice Footer */}
      <div className="border-t border-gray-200 pt-6 text-center text-xs text-gray-500">
        <p className="font-medium text-gray-700 mb-1">
          Thank you for your business!
        </p>
        <p>
          Questions about your order? Contact our support team at
          support@thelightninglab.com.
        </p>
      </div>
    </div>
  );
}
