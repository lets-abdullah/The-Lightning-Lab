import * as React from "react";

export interface VerifyEmailProps {
  firstName?: string;
  verifyUrl: string;
}

export function VerifyEmail({ firstName, verifyUrl }: VerifyEmailProps) {
  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        lineHeight: "1.6",
        color: "#1a1a1a",
        maxWidth: "600px",
        margin: "0 auto",
        padding: "24px",
        backgroundColor: "#ffffff",
      }}
    >
      <div
        style={{
          marginBottom: "24px",
          borderBottom: "1px solid #e5e5e5",
          paddingBottom: "16px",
        }}
      >
        <h2
          style={{
            margin: 0,
            color: "#111827",
            fontSize: "20px",
            fontWeight: "bold",
          }}
        >
          The Lightning Lab
        </h2>
      </div>

      <h1 style={{ fontSize: "24px", color: "#111827", marginBottom: "16px" }}>
        Verify your email
      </h1>

      <p style={{ margin: "0 0 16px" }}>
        Hi {firstName ? firstName : "there"},
      </p>

      <p style={{ margin: "0 0 24px" }}>
        Please click the button below to verify your email address for your
        Lightning Lab account.
      </p>

      <div style={{ marginBottom: "24px" }}>
        <a
          href={verifyUrl}
          style={{
            display: "inline-block",
            backgroundColor: "#2563eb",
            color: "#ffffff",
            padding: "12px 24px",
            borderRadius: "6px",
            textDecoration: "none",
            fontWeight: 600,
            fontSize: "16px",
          }}
        >
          Verify Email Address
        </a>
      </div>

      <p style={{ fontSize: "14px", color: "#6b7280", margin: "0 0 8px" }}>
        If the button above does not work, copy and paste this link into your
        browser:
      </p>
      <p
        style={{
          fontSize: "14px",
          color: "#2563eb",
          wordBreak: "break-all",
          margin: "0 0 24px",
        }}
      >
        <a href={verifyUrl} style={{ color: "#2563eb" }}>
          {verifyUrl}
        </a>
      </p>

      <p style={{ fontSize: "12px", color: "#9ca3af", margin: 0 }}>
        This link expires in 24 hours. If you did not create an account, you can
        safely ignore this email.
      </p>
    </div>
  );
}

export default VerifyEmail;
