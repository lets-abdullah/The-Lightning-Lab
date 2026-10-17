import Link from "next/link";
import { count, desc, eq } from "drizzle-orm";
import { auth } from "@/auth";
import { db } from "@/db";
import { orders } from "@/db/schema";
import { formatPrice } from "@/lib/utils/format";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function AccountOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) return null;

  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page || "1", 10) || 1);
  const pageSize = 20;
  const offset = (page - 1) * pageSize;

  const [totalCountRow] = await db
    .select({ count: count() })
    .from(orders)
    .where(eq(orders.userId, session.user.id));

  const totalOrders = Number(totalCountRow?.count || 0);
  const totalPages = Math.ceil(totalOrders / pageSize);

  const userOrders = await db
    .select()
    .from(orders)
    .where(eq(orders.userId, session.user.id))
    .orderBy(desc(orders.createdAt))
    .limit(pageSize)
    .offset(offset);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Order History</h1>
        <p className="text-sm text-muted-foreground mt-1">
          View and track all your previous orders.
        </p>
      </div>

      {userOrders.length === 0 ? (
        <div className="bg-card border border-border rounded-xl p-12 text-center space-y-4">
          <p className="text-muted-foreground">
            You haven&apos;t placed any orders yet.
          </p>
          <Button asChild>
            <Link href="/shop">Browse /shop</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-card border border-border rounded-xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-muted/50 border-b border-border text-xs uppercase text-muted-foreground">
                  <tr>
                    <th className="py-3 px-4">Order #</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Total</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {userOrders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-muted/30">
                      <td className="py-3 px-4 font-medium text-foreground">
                        {ord.orderNumber}
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">
                        {new Date(ord.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant="outline" className="capitalize">
                          {ord.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 font-medium">
                        {formatPrice(ord.total, ord.currency)}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Button
                          variant="link"
                          size="sm"
                          asChild
                          className="p-0 h-auto"
                        >
                          <Link href={`/account/orders/${ord.id}`}>View</Link>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-4">
              <div className="text-sm text-muted-foreground">
                Showing {offset + 1} to{" "}
                {Math.min(offset + pageSize, totalOrders)} of {totalOrders} orders
              </div>
              <div className="flex gap-2">
                {page > 1 && (
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/account/orders?page=${page - 1}`}>
                      Previous
                    </Link>
                  </Button>
                )}
                {page < totalPages && (
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/account/orders?page=${page + 1}`}>Next</Link>
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
