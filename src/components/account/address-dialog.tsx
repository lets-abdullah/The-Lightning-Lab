"use client";

import { useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Address } from "@/lib/commerce/types";
import { AddressSchema } from "@/lib/checkout/schema";
import { upsertAddressAction } from "@/lib/auth/actions";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface AddressDialogProps {
  mode: "create" | "edit";
  address?: Address;
  trigger?: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function AddressDialog({
  mode,
  address,
  trigger,
  open: controlledOpen,
  onOpenChange: setControlledOpen,
}: AddressDialogProps) {
  const router = useRouter();
  const [internalOpen, setInternalOpen] = useState(false);
  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setIsOpen = setControlledOpen || setInternalOpen;

  const [label, setLabel] = useState(address?.label || "");
  const [firstName, setFirstName] = useState(address?.firstName || "");
  const [lastName, setLastName] = useState(address?.lastName || "");
  const [company, setCompany] = useState(address?.company || "");
  const [line1, setLine1] = useState(address?.line1 || "");
  const [line2, setLine2] = useState(address?.line2 || "");
  const [city, setCity] = useState(address?.city || "");
  const [state, setState] = useState(address?.state || "");
  const [postalCode, setPostalCode] = useState(address?.postalCode || "");
  const [country, setCountry] = useState(address?.country || "US");
  const [phone, setPhone] = useState(address?.phone || "");
  const [isDefaultBilling, setIsDefaultBilling] = useState(
    address?.isDefaultBilling || false
  );
  const [isDefaultShipping, setIsDefaultShipping] = useState(
    address?.isDefaultShipping || false
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const inputData = {
      id: address?.id,
      label: label.trim() || undefined,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      company: company.trim() || undefined,
      line1: line1.trim(),
      line2: line2.trim() || undefined,
      city: city.trim(),
      state: state.trim(),
      postalCode: postalCode.trim(),
      country: country.trim(),
      phone: phone.trim() || undefined,
      isDefaultBilling,
      isDefaultShipping,
    };

    const parsed = AddressSchema.safeParse(inputData);
    if (!parsed.success) {
      setError(
        parsed.error.issues[0]?.message ??
          "Please complete all required fields"
      );
      return;
    }

    setLoading(true);
    try {
      const res = await upsertAddressAction(inputData);
      if (res.ok) {
        toast.success(
          mode === "create"
            ? "Address added successfully"
            : "Address updated successfully"
        );
        setIsOpen(false);
        router.refresh();
      } else {
        setError(res.error);
      }
    } catch {
      setError("Failed to save address. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Add New Address" : "Edit Address"}
          </DialogTitle>
        </DialogHeader>

        {error && (
          <div className="p-3 text-sm rounded-md bg-destructive/15 text-destructive font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label htmlFor="label">Address Label (Optional)</Label>
            <Input
              id="label"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="e.g. Warehouse, Office, Home"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="firstName">First name *</Label>
              <Input
                id="firstName"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last name *</Label>
              <Input
                id="lastName"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="company">Company (Optional)</Label>
            <Input
              id="company"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="line1">Street Address *</Label>
            <Input
              id="line1"
              required
              value={line1}
              onChange={(e) => setLine1(e.target.value)}
              placeholder="123 Main St"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="line2">Apartment, suite, unit (Optional)</Label>
            <Input
              id="line2"
              value={line2}
              onChange={(e) => setLine2(e.target.value)}
              placeholder="Suite 100"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-2">
              <Label htmlFor="city">City *</Label>
              <Input
                id="city"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">State *</Label>
              <Input
                id="state"
                required
                value={state}
                onChange={(e) => setState(e.target.value)}
                placeholder="GA"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="postalCode">Postal Code *</Label>
              <Input
                id="postalCode"
                required
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                placeholder="30092"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="country">Country *</Label>
              <Input
                id="country"
                required
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone (Optional)</Label>
              <Input
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-border">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isDefaultShipping"
                checked={isDefaultShipping}
                onCheckedChange={(c) => setIsDefaultShipping(c === true)}
              />
              <Label
                htmlFor="isDefaultShipping"
                className="text-sm font-normal cursor-pointer"
              >
                Set as default shipping address
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isDefaultBilling"
                checked={isDefaultBilling}
                onCheckedChange={(c) => setIsDefaultBilling(c === true)}
              />
              <Label
                htmlFor="isDefaultBilling"
                className="text-sm font-normal cursor-pointer"
              >
                Set as default billing address
              </Label>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading
                ? "Saving..."
                : mode === "create"
                  ? "Add Address"
                  : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
