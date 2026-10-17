import { Metadata } from "next";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export const metadata: Metadata = {
  title: "Forgot password - The Lightning Lab",
  description: "Reset your Lightning Lab account password",
};

export default function ForgotPasswordPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold tracking-tight">Forgot password</h1>
        <p className="text-sm text-muted-foreground">
          Enter your email address and we will send you a link to reset your
          password
        </p>
      </div>
      <ForgotPasswordForm />
    </div>
  );
}
