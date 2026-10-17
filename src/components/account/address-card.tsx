"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Address } from "@/lib/commerce/types";
import {
  deleteAddressAction,
  setDefaultAddressAction,
} from "@/lib/auth/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AddressDialog } from "./address-dialog";

interface AddressCardProps {
  address: Address;
}

export function AddressCard({ address }: AddressCardProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [editOpen, setEditOpen] = useState(false);

  const handleDelete = () => {
    if (!confirm("Are you sure you want to delete this address?")) return;
    startTransition(async () => {
      try {
        const res = await deleteAddressAction({ id: address.id });
        if (res.ok) {
          toast.success("Address deleted");
          router.refresh();
        } else {
          toast.error(res.error);
        }
      } catch {
        toast.error("Failed to delete address");
      }
    });
  };

  const handleSetDefault = (kind: "shipping" | "billing") => {
    startTransition(async () => {
      try {
        const res = await setDefaultAddressAction({ id: address.id, kind });
        if (res.ok) {
          toast.success(`Default ${kind} address updated`);
          router.refresh();
        } else {
          toast.error(res.error);
        }
      } catch {
        toast.error(`Failed to update default ${kind} address`);
      }
    });
  };

  return (
    <div className="bg-card border border-border rounded-xl p-5 shadow-xs flex flex-col justify-between space-y-4">
      <div className="space-y-3">
        {/* Header badges */}
        <div className="flex flex-wrap items-center gap-2">
          {address.label && (
            <Badge variant="secondary" className="font-semibold text-xs">
              {address.label}
            </Badge>
          )}
          {address.isDefaultShipping && (
            <Badge variant="default" className="text-xs">
              Default Shipping
            </Badge>
          )}
          {address.isDefaultBilling && (
            <Badge variant="outline" className="text-xs">
              Default Billing
            </Badge>
          )}
        </div>

        {/* Address text */}
        <div className="text-sm leading-relaxed">
          <p className="font-semibold text-foreground">
            {address.firstName} {address.lastName}
          </p>
          {address.company && (
            <p className="text-muted-foreground">{address.company}</p>
          )}
          <div className="text-muted-foreground mt-1">
            {address.line1}
            {address.line2 && (
              <>
                <br />
                {address.line2}
              </>
            )}
            <br />
            {address.city}, {address.state} {address.postalCode}
            <br />
            {address.country}
          </div>
          {address.phone && (
            <p className="text-xs text-muted-foreground mt-2">
              Phone: {address.phone}
            </p>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-3 border-t border-border flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setEditOpen(true)}
            disabled={isPending}
          >
            Edit
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            disabled={isPending}
            className="text-destructive hover:bg-destructive/10 hover:text-destructive"
          >
            Delete
          </Button>
        </div>

        <div className="flex flex-wrap items-center gap-1">
          {!address.isDefaultShipping && (
            <Button
              variant="link"
              size="sm"
              disabled={isPending}
              onClick={() => handleSetDefault("shipping")}
              className="text-xs h-auto p-1"
            >
              Set default shipping
            </Button>
          )}
          {!address.isDefaultBilling && (
            <Button
              variant="link"
              size="sm"
              disabled={isPending}
              onClick={() => handleSetDefault("billing")}
              className="text-xs h-auto p-1"
            >
              Set default billing
            </Button>
          )}
        </div>
      </div>

      <AddressDialog
        mode="edit"
        address={address}
        open={editOpen}
        onOpenChange={setEditOpen}
      />
    </div>
  );
}
