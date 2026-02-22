"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { loadLatestId } from "@/lib/nooraiStorage";

export default function ResultsIndexPage() {
  const router = useRouter();

  useEffect(() => {
    const latest = loadLatestId();
    if (latest) router.replace(`/dashboard/results/${latest}`);
    else router.replace("/dashboard");
  }, [router]);

  return <div className="p-6">Loading…</div>;
}