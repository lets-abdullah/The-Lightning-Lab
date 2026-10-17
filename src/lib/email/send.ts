import "server-only";

export async function sendVerificationEmail(input: {
  email: string;
  firstName?: string;
  token: string;
}): Promise<void> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const url = `${baseUrl}/verify-email?token=${input.token}`;

  if (process.env.NODE_ENV === "development") {
    console.log(`[Email] Verification link for ${input.email}: ${url}`);
  }

  try {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) return;

    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from:
          process.env.EMAIL_FROM ||
          "The Lightning Lab <no-reply@thelightninglab.com>",
        to: input.email,
        subject: "Verify your email address - The Lightning Lab",
        html: `<p>Hi ${input.firstName || "there"},</p><p>Please verify your email: <a href="${url}">${url}</a></p><p>This link expires in 24 hours.</p>`,
      }),
    });
  } catch (err) {
    console.error("Failed to send verification email:", err);
  }
}

export async function sendPasswordResetEmail(input: {
  email: string;
  firstName?: string;
  token: string;
}): Promise<void> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const url = `${baseUrl}/reset-password?token=${input.token}`;

  if (process.env.NODE_ENV === "development") {
    console.log(`[Email] Password reset link for ${input.email}: ${url}`);
  }

  try {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) return;

    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from:
          process.env.EMAIL_FROM ||
          "The Lightning Lab <no-reply@thelightninglab.com>",
        to: input.email,
        subject: "Reset your password - The Lightning Lab",
        html: `<p>Hi ${input.firstName || "there"},</p><p>Reset your password here: <a href="${url}">${url}</a></p><p>This link expires in 1 hour. If you didn't request this, ignore this email.</p>`,
      }),
    });
  } catch (err) {
    console.error("Failed to send password reset email:", err);
  }
}
