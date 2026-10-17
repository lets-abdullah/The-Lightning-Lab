import { Metadata } from "next";
import { RegisterForm } from "@/components/auth/register-form";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Create account - The Lightning Lab",
  description: "Create a new customer account with The Lightning Lab",
};

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string; next?: string }>;
}) {
  const params = await searchParams;
  const email = typeof params.email === "string" ? params.email : "";
  const next = typeof params.next === "string" ? params.next : undefined;

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold tracking-tight">Create account</h1>
        <p className="text-sm text-muted-foreground">
          Enter your details below to create your account
        </p>
      </div>
      <RegisterForm defaultEmail={email} next={next} />
    </div>
  );
}
