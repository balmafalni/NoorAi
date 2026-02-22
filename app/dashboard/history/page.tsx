import { createSupabaseServerClient } from "@/lib/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function HistoryPage() {
  const supabase = createSupabaseServerClient();

  // Require login
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) redirect("/login");

  // Load latest generations for this user (RLS ensures only own rows)
  const { data, error } = await supabase
    .from("generations")
    .select("id, topic, mode, created_at")
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    return <div className="p-6">Failed to load history.</div>;
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold">History</h1>

      <div className="mt-4 space-y-3">
        {(data ?? []).map((g) => (
          <Link
            key={g.id}
            href={`/dashboard/results/${g.id}`}
            className="block rounded border p-4 hover:bg-muted/50"
          >
            <div className="font-semibold">{g.topic}</div>
            <div className="text-sm opacity-70">
              {g.mode} • {new Date(g.created_at).toLocaleString()}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}