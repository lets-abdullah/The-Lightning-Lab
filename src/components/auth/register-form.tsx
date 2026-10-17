"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { registerAction } from "@/lib/auth/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { GoogleButton } from "./google-button";

interface RegisterFormProps {
  defaultEmail?: string;
  next?: string;
}

export function RegisterForm({ defaultEmail = "", next }: RegisterFormProps) {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState(defaultEmail);
  const [password, setPassword] = useState("");
  const [terms, setTerms] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!terms) {
      setError("You must accept the terms and conditions");
      return;
    }

    setLoading(true);
    try {
      const res = await registerAction({
        firstName,
        lastName,
        email,
        password,
      });

      if (!res.ok) {
        setError(res.error);
        setLoading(false);
        return;
      }

      // Auto sign-in
      const s = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (s?.error) {
        router.push("/login?registered=1");
      } else {
        router.push("/account?welcome=1");
        router.refresh();
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="w-full space-y-4 text-gray-900">
      {error && (
        <div className="p-3 text-sm rounded-lg bg-red-50 text-red-600 border border-red-200 font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3.5">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label htmlFor="firstName" className="text-xs font-semibold text-gray-700">First name</Label>
            <Input
              id="firstName"
              required
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="John"
              className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus-visible:ring-[#8B1812] focus-visible:border-[#8B1812] h-9"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="lastName" className="text-xs font-semibold text-gray-700">Last name</Label>
            <Input
              id="lastName"
              required
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Doe"
              className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus-visible:ring-[#8B1812] focus-visible:border-[#8B1812] h-9"
            />
          </div>
        </div>

        <div className="space-y-1">
          <Label htmlFor="email" className="text-xs font-semibold text-gray-700">Email address</Label>
          <Input
            id="email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus-visible:ring-[#8B1812] focus-visible:border-[#8B1812] h-9"
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="password" className="text-xs font-semibold text-gray-700">Password</Label>
          <Input
            id="password"
            type="password"
            required
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus-visible:ring-[#8B1812] focus-visible:border-[#8B1812] h-9"
          />
          <p className="text-[11px] text-gray-500">
            Min 8 characters with at least one letter and one number.
          </p>
        </div>

        <div className="flex items-center space-x-2 pt-0.5">
          <Checkbox
            id="terms"
            checked={terms}
            onCheckedChange={(c) => setTerms(c === true)}
            className="border-gray-300 data-[state=checked]:bg-[#8B1812] data-[state=checked]:border-[#8B1812]"
          />
          <Label
            htmlFor="terms"
            className="text-xs text-gray-600 leading-normal font-normal cursor-pointer select-none"
          >
            I agree to the Terms of Service and Privacy Policy
          </Label>
        </div>

        <Button
          type="submit"
          className="w-full h-10 bg-[#8B1812] hover:bg-[#72130e] text-white font-bold transition-colors cursor-pointer"
          disabled={loading}
        >
          {loading ? "Creating account..." : "Create account"}
        </Button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-3 text-gray-400 font-medium">Or</span>
        </div>
      </div>

      <GoogleButton next={next} />

      <div className="text-center text-sm text-gray-600 pt-0.5">
        Already have an account?{" "}
        <Link
          href={`/login${next ? `?next=${encodeURIComponent(next)}` : ""}`}
          className="font-bold text-[#8B1812] hover:underline"
        >
          Sign in
        </Link>
      </div>
    </div>
  );
}
