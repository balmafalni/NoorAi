"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const sp = useSearchParams();

  const [email, setEmail] = useState("");
  const [loadingEmail, setLoadingEmail] = useState(false);
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const next = sp.get("next") || "/dashboard";

  async function signInWithGoogle() {
    setMsg(null);
    setLoadingGoogle(true);

    // IMPORTANT: this must be your deployed URL in Vercel env
    const redirectTo = `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback?next=${encodeURIComponent(
      next
    )}`;

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo },
    });

    if (error) setMsg(error.message);
    setLoadingGoogle(false);
  }

  async function signInWithEmail() {
    setMsg(null);

    const clean = email.trim();
    if (!clean || !clean.includes("@")) {
      setMsg("Enter a valid email.");
      return;
    }

    setLoadingEmail(true);

    const emailRedirectTo = `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback?next=${encodeURIComponent(
      next
    )}`;

    const { error } = await supabase.auth.signInWithOtp({
      email: clean,
      options: { emailRedirectTo },
    });

    setLoadingEmail(false);

    if (error) setMsg(error.message);
    else setMsg("Check your email for the sign-in link.");
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto flex min-h-screen max-w-md items-center px-4">
        <div className="w-full rounded-2xl border bg-card p-6 shadow-sm">
          <div className="mb-6">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary">
                <span className="text-sm font-bold text-primary-foreground">N</span>
              </div>
              <div>
                <h1 className="text-xl font-semibold">Welcome to NoorAi</h1>
                <p className="text-sm text-muted-foreground">
                  Sign in to generate reels and save history.
                </p>
              </div>
            </div>
          </div>

          {msg && (
            <div className="mb-4 rounded-lg border px-3 py-2 text-sm">
              {msg}
            </div>
          )}

          <button
            onClick={signInWithGoogle}
            disabled={loadingGoogle}
            className="flex w-full items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium hover:bg-accent disabled:opacity-60"
          >
            {loadingGoogle ? "Signing in..." : "Continue with Google"}
          </button>

          <div className="my-5 flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs text-muted-foreground">or</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          <label className="text-sm font-medium">Email</label>
          <input
            className="mt-2 w-full rounded-xl border bg-background px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-primary"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />

          <button
            onClick={signInWithEmail}
            disabled={loadingEmail}
            className="mt-3 w-full rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground hover:opacity-95 disabled:opacity-60"
          >
            {loadingEmail ? "Sending..." : "Send magic link"}
          </button>

          <p className="mt-4 text-xs text-muted-foreground">
            By continuing you agree to NoorAi’s terms. (Add Terms/Privacy later.)
          </p>
        </div>
      </div>
    </div>
  );
}