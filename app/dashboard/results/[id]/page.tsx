import { createSupabaseServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function ResultPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createSupabaseServerClient();

  // Check logged-in user
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) redirect("/login");

  // Load generation from DB
  const { data, error } = await supabase
    .from("generations")
    .select("topic, mode, length_seconds, result, created_at")
    .eq("id", params.id)
    .single();

  if (error || !data) {
    return <div className="p-6">Result not found.</div>;
  }

  const r: any = data.result;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold">{data.topic}</h1>

      {/* Hooks */}
      <section className="mt-6">
        <h2 className="font-bold mb-2">Hooks</h2>
        <ul className="list-disc pl-5">
          {(r.hooks ?? []).map((h: string, i: number) => (
            <li key={i}>{h}</li>
          ))}
        </ul>
      </section>

      {/* Script */}
      <section className="mt-6">
        <h2 className="font-bold mb-2">Script</h2>
        {(r.script_beats ?? []).map((b: any, i: number) => (
          <div key={i} className="mb-3">
            <div className="font-semibold">{b.t}</div>
            <div>{b.voiceover}</div>
          </div>
        ))}
      </section>

      {/* Caption */}
      <section className="mt-6">
        <h2 className="font-bold mb-2">Caption</h2>
        <p>{r.caption}</p>
      </section>

      {/* Hashtags */}
      <section className="mt-6">
        <h2 className="font-bold mb-2">Hashtags</h2>
        <p>{(r.hashtags ?? []).join(" ")}</p>
      </section>
    </div>
  );
}