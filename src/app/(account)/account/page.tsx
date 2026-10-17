import Link from "next/link";
import { and, count, desc, eq, isNull, sql } from "drizzle-orm";
import { auth } from "@/auth";
import { db } from "@/db";
import { users, orders, addresses } from "@/db/schema";
import { formatPrice } from "@/lib/utils/format";
import { LinkOrdersBanner } from "@/components/account/link-orders-banner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

export default async function AccountDashboardPage() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const [userRow] = await db
    .select({
      firstName: users.firstName,
      name: users.name,
      email: users.email,
      emailVerified: users.emailVerified,
    })
    .from(users)
    .where(eq(users.id, session.user.id))
    .limit(1);

  const recentOrders = await db
    .select()
    .from(orders)
    .where(eq(orders.userId, session.user.id))
    .orderBy(desc(orders.createdAt))
    .limit(3);

  const [unlinked] = await db
    .select({ count: count() })
    .from(orders)
    .where(
      and(
        isNull(orders.userId),
        sql`lower(${orders.email}) = lower(${session.user.email})`
      )
    );

  const [defaultShipping] = await db
    .select()
    .from(addresses)
    .where(
      and(
        eq(addresses.userId, session.user.id),
        eq(addresses.isDefaultShipping, true)
      )
    )
    .limit(1);

  const unlinkedCount = Number(unlinked?.count || 0);
  const isVerified = Boolean(userRow?.emailVerified);
  const greetingName =
    userRow?.firstName || userRow?.name || session.user.name || "there";

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Hi, {greetingName}</h1>
        <p className="text-muted-foreground mt-1">
          Manage your orders, addresses, and account profile.
        </p>
      </div>

      {isVerified && unlinkedCount > 0 && (
        <LinkOrdersBanner count={unlinkedCount} />
      )}

      {/* Recent Orders Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Recent Orders</h2>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/account/orders">View all orders</Link>
          </Button>
        </div>

        {recentOrders.length === 0 ? (
          <div className="bg-card border border-border rounded-xl p-8 text-center space-y-3">
            <p className="text-muted-foreground">
              You haven&apos;t placed any orders yet.
            </p>
            <Button asChild>
              <Link href="/shop">Browse /shop</Link>
            </Button>
          </div>
        ) : (
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
                  {recentOrders.map((ord) => (
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
                          <Link href={`/account/orders/${ord.id}`}>Details</Link>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Default Shipping Address Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Default Shipping Address</h2>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/account/addresses">Manage addresses</Link>
          </Button>
        </div>

        {defaultShipping ? (
          <div className="bg-card border border-border rounded-xl p-5 shadow-xs max-w-md space-y-2">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-foreground">
                {defaultShipping.firstName} {defaultShipping.lastName}
              </span>
              {defaultShipping.company && (
                <span className="text-xs text-muted-foreground">
                  ({defaultShipping.company})
                </span>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              {defaultShipping.line1}
              {defaultShipping.line2 && (
                <>
                  <br />
                  {defaultShipping.line2}
                </>
              )}
              <br />
              {defaultShipping.city}, {defaultShipping.state}{" "}
              {defaultShipping.postalCode}
              <br />
              {defaultShipping.country}
            </p>
            {defaultShipping.phone && (
              <p className="text-xs text-muted-foreground">
                Phone: {defaultShipping.phone}
              </p>
            )}
          </div>
        ) : (
          <div className="bg-card border border-border rounded-xl p-6 text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              No default shipping address set.
            </p>
            <Button variant="outline" size="sm" asChild>
              <Link href="/account/addresses">Add Address</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
