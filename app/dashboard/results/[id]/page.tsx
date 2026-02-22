"use client";

import { useParams, useRouter } from "next/navigation";
import { loadResult } from "@/lib/nooraiStorage";

export default function ResultPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const data = loadResult(params.id);

  if (!data) {
    return (
      <div className="p-6">
        <h1 className="text-xl font-bold">Result not found</h1>
        <button
          onClick={() => router.push("/dashboard")}
          className="mt-4 px-4 py-2 border rounded"
        >
          Back
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">{data.topic}</h1>

      <section className="mb-6">
        <h2 className="font-bold mb-2">Hooks</h2>
        <ul className="list-disc pl-5">
          {data.hooks?.map((h: string, i: number) => (
            <li key={i}>{h}</li>
          ))}
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="font-bold mb-2">Script</h2>
        {data.script_beats?.map((b: any, i: number) => (
          <div key={i} className="mb-3">
            <div className="font-semibold">{b.t}</div>
            <div>{b.voiceover}</div>
          </div>
        ))}
      </section>

      <section className="mb-6">
        <h2 className="font-bold mb-2">Caption</h2>
        <p>{data.caption}</p>
      </section>

      <section>
        <h2 className="font-bold mb-2">Hashtags</h2>
        <p>{data.hashtags?.join(" ")}</p>
      </section>
    </div>
  );
}