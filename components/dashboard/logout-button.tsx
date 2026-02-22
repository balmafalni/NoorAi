"use client";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export function LogoutButton() {
  const supabase = createSupabaseBrowserClient();
  return (
    <button
      onClick={() => supabase.auth.signOut()}
      className="rounded border px-3 py-2"
    >
      Logout
    </button>
  );
}