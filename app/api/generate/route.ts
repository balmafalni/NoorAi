// app/api/generate/route.ts
import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export const runtime = "nodejs";

function jsonError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

function stripCodeFences(s: string) {
  const trimmed = (s ?? "").trim();
  // ```json ... ``` or ``` ... ```
  if (trimmed.startsWith("```")) {
    return trimmed
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/```$/i, "")
      .trim();
  }
  return trimmed;
}

function extractFirstJsonObject(text: string) {
  const s = (text ?? "").trim();
  const start = s.indexOf("{");
  const end = s.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) return null;
  return s.slice(start, end + 1);
}

function buildSystemPrompt() {
  return [
    "You are a short-form vertical video scriptwriter specialized in retention.",
    "Outputs must be practical to film and optimized for 30–60 second reels.",
    "",
    "Safety & integrity rules:",
    "- Do not invent citations or quotes.",
    "- If the user did not provide verified reference text, do not claim exact scripture/hadith quotes.",
    "- Avoid hate, harassment, or political incitement.",
    "",
    "Output MUST be STRICT JSON matching the schema provided by the user.",
    "Return ONLY valid JSON.",
    "No prose, no markdown, no code fences, no explanations.",
    "If Arabic text is present, it must appear only inside JSON string values.",
    "Do not add any text before or after the JSON object.",
  ].join("\n");
}

function buildUserPrompt(input: {
  mode: string;
  topic: string;
  lengthSeconds: number;
  goal: string;
  language: string;
  tone: string;
  referenceText?: string | null;
  sourceNotes?: string | null;
}) {
  const {
    mode,
    topic,
    lengthSeconds,
    goal,
    language,
    tone,
    referenceText,
    sourceNotes,
  } = input;

  return [
    "Generate a reel script package in STRICT JSON using this exact schema (no extra keys):",
    "",
    "{",
    '  "topic": string,',
    '  "mode": "faith_advice" | "history_facts" | "mixed",',
    '  "language": "English" | "Arabic" | "Bilingual",',
    '  "tone": string,',
    '  "length_seconds": 30 | 45 | 60,',
    '  "goal": string,',
    '  "hooks": string[],            // exactly 6 items',
    '  "script_beats": [             // max 8 beats',
    "    {",
    '      "t": string,              // timestamp like "0:00-0:07"',
    '      "visual": string,',
    '      "voiceover": string,',
    '      "on_screen_text": string',
    "    }",
    "  ],",
    '  "caption": string,',
    '  "hashtags": string[],         // exactly 8 items',
    '  "cta": string                 // one sentence CTA',
    "}",
    "",
    "Constraints:",
    "- hooks: exactly 6",
    "- hashtags: exactly 8",
    "- script_beats: maximum 8",
    "- Keep it accurate; do NOT fabricate exact scripture/hadith citations.",
    "- If the user supplies reference text, you may paraphrase it and you may quote ONLY what the user provided.",
    "- If Arabic language is requested, keep Arabic inside JSON strings only.",
    "",
    "Inputs:",
    `- mode: ${mode}`,
    `- topic: ${topic}`,
    `- length_seconds: ${lengthSeconds}`,
    `- goal: ${goal}`,
    `- language: ${language}`,
    `- tone: ${tone}`,
    referenceText?.trim()
      ? `- reference_text (user-provided): ${referenceText.trim()}`
      : "- reference_text: (none provided)",
    sourceNotes?.trim()
      ? `- source_notes (user-provided): ${sourceNotes.trim()}`
      : "- source_notes: (none provided)",
  ].join("\n");
}

export async function POST(req: Request) {
  try {
    // 1) Auth (must be logged in)
    const supabase = createSupabaseServerClient();
    const { data: userData } = await supabase.auth.getUser();

    if (!userData.user) {
      return jsonError("Unauthorized", 401);
    }
    const userId = userData.user.id;

    // 2) Parse body safely
    let body: any = null;
    try {
      body = await req.json();
    } catch {
      return jsonError("Invalid JSON body", 400);
    }

    const mode = String(body?.mode ?? "mixed");
    const topic = String(body?.topic ?? "").trim();
    const lengthSeconds = Number(body?.lengthSeconds ?? 45);
    const goal = String(body?.goal ?? "comments");
    const language = String(body?.language ?? "English");
    const tone = String(body?.tone ?? "Calm");
    const referenceText = (body?.referenceText ?? body?.reference_text ?? "") as string;
    const sourceNotes = (body?.sourceNotes ?? body?.source_notes ?? "") as string;

    if (!topic) return jsonError("Missing topic", 400);
    if (![30, 45, 60].includes(lengthSeconds)) return jsonError("Invalid lengthSeconds", 400);

    // 3) Build prompts
    const system = buildSystemPrompt();
    const user = buildUserPrompt({
      mode,
      topic,
      lengthSeconds,
      goal,
      language,
      tone,
      referenceText,
      sourceNotes,
    });

    // 4) Call OpenRouter
    const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
    if (!OPENROUTER_API_KEY) return jsonError("Missing OPENROUTER_API_KEY", 500);

    const model = process.env.OPENROUTER_MODEL ?? "anthropic/claude-3.5-sonnet";

    const resp = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        // Optional but helpful for OpenRouter routing/analytics:
        "HTTP-Referer": process.env.OPENROUTER_SITE_URL ?? "http://localhost:3000",
        "X-Title": "NoorAi",
      },
      body: JSON.stringify({
        model,
        temperature: 0.2,
        max_tokens: 900,
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
      }),
    });

    const payload = await resp.json();

    if (!resp.ok) {
      const msg =
        payload?.error?.message ||
        payload?.message ||
        `OpenRouter error (${resp.status})`;
      return jsonError(msg, resp.status);
    }

    const raw = payload?.choices?.[0]?.message?.content ?? "";
    const cleaned = stripCodeFences(raw);

    // 5) Robust JSON parse (Arabic-safe)
    let parsed: any = null;

    // Try direct
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      // Try extracting first {...}
      const extracted = extractFirstJsonObject(cleaned);
      if (extracted) {
        try {
          parsed = JSON.parse(extracted);
        } catch {
          parsed = null;
        }
      }
    }

    if (!parsed) {
      console.error("RAW MODEL OUTPUT (truncated):", cleaned.slice(0, 2000));
      return jsonError("Model did not return valid JSON. Try again.", 502);
    }

    // 6) Save to Supabase (DB history)
    const { data: inserted, error: insErr } = await supabaseAdmin
      .from("generations")
      .insert({
        user_id: userId,
        mode,
        topic,
        length_seconds: lengthSeconds,
        goal,
        language,
        tone,
        result: parsed,
      })
      .select("id")
      .single();

    if (insErr || !inserted?.id) {
      console.error("DB insert failed:", insErr);
      return jsonError("Failed to save generation", 500);
    }

    // 7) Return id for redirect to /dashboard/results/[id]
    return NextResponse.json({ id: inserted.id, data: parsed }, { status: 200 });
  } catch (err: any) {
    console.error(err);
    return jsonError(err?.message ?? "Server error", 500);
  }
}