import { desc, eq } from "drizzle-orm";
import { Plus } from "lucide-react";
import { auth } from "@/auth";
import { db } from "@/db";
import { addresses } from "@/db/schema";
import { Address } from "@/lib/commerce/types";
import { AddressCard } from "@/components/account/address-card";
import { AddressDialog } from "@/components/account/address-dialog";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function AccountAddressesPage() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const userAddresses = await db
    .select()
    .from(addresses)
    .where(eq(addresses.userId, session.user.id))
    .orderBy(desc(addresses.isDefaultShipping), desc(addresses.createdAt));

  const typedAddresses: Address[] = userAddresses.map((row) => ({
    id: row.id,
    customerId: row.customerId,
    label: row.label ?? undefined,
    firstName: row.firstName,
    lastName: row.lastName,
    company: row.company ?? undefined,
    line1: row.line1,
    line2: row.line2 ?? undefined,
    city: row.city,
    state: row.state,
    postalCode: row.postalCode,
    country: row.country,
    phone: row.phone ?? undefined,
    isDefaultBilling: row.isDefaultBilling,
    isDefaultShipping: row.isDefaultShipping,
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Address Book</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your saved delivery and billing addresses.
          </p>
        </div>

        <AddressDialog
          mode="create"
          trigger={
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              <span>Add address</span>
            </Button>
          }
        />
      </div>

      {typedAddresses.length === 0 ? (
        <div className="bg-card border border-border rounded-xl p-12 text-center space-y-4">
          <p className="text-muted-foreground">No saved addresses yet.</p>
          <AddressDialog
            mode="create"
            trigger={
              <Button variant="outline" className="gap-2">
                <Plus className="w-4 h-4" />
                <span>Add your first address</span>
              </Button>
            }
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {typedAddresses.map((addr) => (
            <AddressCard key={addr.id} address={addr} />
          ))}
        </div>
      )}
    </div>
  );
}
