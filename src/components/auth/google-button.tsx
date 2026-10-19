"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { checkGoogleAuthConfigAction } from "@/lib/auth/actions";
import { AlertCircle, CheckCircle2, ExternalLink, Key, Sparkles, X, ChevronDown, ChevronUp } from "lucide-react";

interface GoogleButtonProps {
  next?: string;
  className?: string;
}

export function GoogleButton({ next, className }: GoogleButtonProps) {
  const [showMockModal, setShowMockModal] = useState(false);
  const [isDemoLoading, setIsDemoLoading] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [checking, setChecking] = useState(false);

  const handleClick = async () => {
    setChecking(true);
    try {
      const { isMock } = await checkGoogleAuthConfigAction();
      setChecking(false);

      if (isMock) {
        // Intercept to prevent the ugly Google "Error 401: invalid_client" screen!
        setShowMockModal(true);
      } else {
        signIn("google", { callbackUrl: next ?? "/account" });
      }
    } catch {
      setChecking(false);
      signIn("google", { callbackUrl: next ?? "/account" });
    }
  };

  const handleDemoSignIn = async () => {
    setIsDemoLoading(true);
    await signIn("credentials", {
      email: "google.demo@thelightninglab.com",
      password: "DemoGoogle2026!",
      callbackUrl: next ?? "/account",
    });
  };

  return (
    <>
      <Button
        type="button"
        variant="outline"
        disabled={checking}
        className={`w-full flex items-center justify-center gap-2 border-gray-300 hover:border-gray-900 font-semibold cursor-pointer ${
          className ?? ""
        }`}
        onClick={handleClick}
      >
        {checking ? (
          <span className="size-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
        ) : (
          <svg
            className="w-4 h-4 shrink-0"
            viewBox="0 0 24 24"
            width="16"
            height="16"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              fill="#EA4335"
            />
          </svg>
        )}
        <span>Continue with Google</span>
      </Button>

      {/* Helpful Modal Intercepting Google 401 invalid_client Error */}
      {showMockModal && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setShowMockModal(false)}
        >
          <div
            className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-gray-200 p-6 space-y-5 animate-in fade-in zoom-in-95 duration-150 text-left"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <div className="size-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center">
                  <Key className="size-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-gray-950">
                    Google OAuth Setup Notice
                  </h3>
                  <span className="text-[11px] text-gray-500 block">
                    Why Error 401: invalid_client occurs
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowMockModal(false)}
                className="text-gray-400 hover:text-gray-700 transition-colors cursor-pointer p-1"
                aria-label="Close dialog"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Explanation */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 text-xs text-amber-900 leading-relaxed space-y-1.5">
              <p className="font-bold">
                Your environment has a placeholder Google Client ID:
              </p>
              <code className="block bg-amber-100/70 p-1.5 rounded-sm font-mono text-[11px] text-amber-950 break-all">
                GOOGLE_CLIENT_ID=&quot;mock_google_client_id&quot;
              </code>
              <p>
                Google rejects placeholder IDs with <em>&quot;Error 401: invalid_client&quot;</em> because they are not registered in Google Cloud.
              </p>
            </div>

            {/* Instant Demo Sign-In Action */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-gray-900 block">
                Instant One-Click Contractor Login:
              </span>
              <Button
                type="button"
                onClick={handleDemoSignIn}
                disabled={isDemoLoading}
                className="w-full bg-[#8B1812] hover:bg-[#70130e] text-white font-bold py-3 text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md cursor-pointer"
              >
                {isDemoLoading ? (
                  <span className="size-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Sparkles className="size-4 text-yellow-300" />
                    Sign In with Demo Google Contractor Account &rarr;
                  </>
                )}
              </Button>
              <span className="text-[11px] text-gray-500 block text-center">
                Signs in as verified contractor (Alex Vance • Vance Commercial Electric)
              </span>
            </div>

            {/* Collapsible Setup Instructions */}
            <div className="border-t border-gray-200 pt-3">
              <button
                type="button"
                onClick={() => setShowGuide(!showGuide)}
                className="w-full flex items-center justify-between text-xs font-bold text-gray-700 hover:text-[#8B1812] transition-colors py-1 cursor-pointer"
              >
                <span>How to configure real Google Sign-In:</span>
                {showGuide ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
              </button>

              {showGuide && (
                <div className="mt-2.5 space-y-2 text-[11px] text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-200">
                  <ol className="list-decimal pl-4 space-y-1">
                    <li>
                      Go to{" "}
                      <a
                        href="https://console.cloud.google.com/apis/credentials"
                        target="_blank"
                        rel="noreferrer"
                        className="text-[#8B1812] font-bold underline inline-flex items-center gap-0.5"
                      >
                        Google Cloud Console <ExternalLink className="size-2.5" />
                      </a>
                    </li>
                    <li>Create an <strong>OAuth 2.0 Client ID</strong> (Web Application).</li>
                    <li>
                      Add Authorized redirect URI:
                      <code className="block bg-white p-1 rounded-sm mt-0.5 font-mono text-[10px] border border-gray-300">
                        http://localhost:3001/api/auth/callback/google
                      </code>
                    </li>
                    <li>
                      Paste your Client ID and Client Secret into your project <code className="font-mono bg-white px-1">.env</code> file.
                    </li>
                  </ol>
                </div>
              )}
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-end gap-2 pt-1">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowMockModal(false)}
                className="text-xs text-gray-500"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
