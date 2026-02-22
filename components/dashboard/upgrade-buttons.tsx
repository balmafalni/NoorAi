"use client";
import { useState } from "react";

export function UpgradeButtons() {
  const [loading, setLoading] = useState<null | string>(null);

  async function go(plan: "creator" | "pro") {
    setLoading(plan);
    const res = await fetch("/api/billing/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan }),
    });
    const json = await res.json();
    setLoading(null);
    if (json.url) window.location.href = json.url;
    else alert(json.error ?? "Billing failed");
  }

  return (
    <div className="space-y-2">
      <button className="w-full rounded border p-3" onClick={() => go("creator")} disabled={loading!==null}>
        {loading==="creator" ? "Loading..." : "Upgrade to Creator ($9/mo)"}
      </button>
      <button className="w-full rounded border p-3" onClick={() => go("pro")} disabled={loading!==null}>
        {loading==="pro" ? "Loading..." : "Upgrade to Pro ($19/mo)"}
      </button>
    </div>
  );
}