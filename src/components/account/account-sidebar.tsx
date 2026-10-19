"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Package,
  MapPin,
  User,
  FileText,
  RotateCcw,
  LogOut,
  Home,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const navItems = [
  { href: "/account", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/account/orders", label: "Orders", icon: Package, exact: false },
  { href: "/account/addresses", label: "Addresses", icon: MapPin, exact: false },
  { href: "/account/profile", label: "Profile", icon: User, exact: false },
  { href: "/account/quotes", label: "Quotes", icon: FileText, exact: false },
  { href: "/account/returns", label: "Returns", icon: RotateCcw, exact: false },
];

export function AccountSidebar() {
  const pathname = usePathname();

  return (
    <nav className="w-full flex flex-col justify-between h-full space-y-6">
      <div className="space-y-1">
        {navItems.map((item) => {
          const isActive = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>

      <div className="pt-4 border-t border-border space-y-1">
        <Button
          variant="ghost"
          size="sm"
          asChild
          className="w-full justify-start text-foreground hover:bg-muted font-bold"
        >
          <Link href="/">
            <Home className="w-4 h-4 mr-2 text-[#8B1812]" />
            <span>Back to Home Page</span>
          </Link>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/10"
          onClick={() => signOut({ redirect: true, callbackUrl: "/" })}
        >
          <LogOut className="w-4 h-4 mr-2" />
          <span>Sign out</span>
        </Button>
      </div>
    </nav>
  );
}
