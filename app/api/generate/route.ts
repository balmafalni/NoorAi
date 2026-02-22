import { NextResponse } from "next/server";

export const runtime = "nodejs";

type Mode = "faith_advice" | "history_facts";
type Goal = "saves" | "shares" | "comments" | "follows";
type Language = "arabic" | "english" | "bilingual";
type Tone = "calm" | "emotional" | "intense";

function jsonError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

function stripCodeFences(s: string) {
  const trimmed = (s ?? "").trim();

  // Remove leading/trailing code fences if present
  if (trimmed.startsWith("```")) {
    return trimmed
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/```\s*$/i, "")
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
    "Do not add any text before or after the JSON object."
  ].join("\n");
}
function buildUserPrompt(input: {
  mode: Mode;
  topic: string;
  lengthSeconds: 30 | 45 | 60;
  goal: Goal;
  language: Language;
  tone: Tone;
  referenceText?: string;
  sourceNotes?: string;
}) {
  const schema = {
    mode: "faith_advice | history_facts",
    topic: "",
    length_seconds: 45,
    hooks: [""],
    certainty: "Confirmed | Disputed | Legend | N/A",
    verification_note: "",
    script_beats: [{ t: "0-3", voiceover: "", visual: "", onscreen: "" }],
    caption: "",
    hashtags: [""],
    ctas: [""],
  };

  const base = [
    `APP: NoorAi`,
    `MODE: ${input.mode === "faith_advice" ? "Faith/Advice" : "History Facts"}`,
    `TOPIC: ${input.topic}`,
    `LENGTH: ${input.lengthSeconds}s`,
    `GOAL: ${input.goal}`,
    `LANGUAGE: ${input.language}`,
    `TONE: ${input.tone}`,
    "",
    "You must generate:",
    "- 6 hooks (<= 7 words each; if bilingual use 'AR — EN')",
    "- 1 final script as timestamped beats (cover full duration; short spoken sentences)
- Max 8 script beats total",
    "- shot list inside each beat (visual field)",
    "- on-screen text per beat (<= 6 words)",
    "- caption (1–2 lines) + 8 hashtags",
    "- 3 CTA variants (based on GOAL)",
    "",
  ];

  const faithRules = [
    "FAITH RULES:",
    "- Respectful faith tone. No claiming exact quotes unless reference text is provided by the user.",
    "- If reference text is missing: general advice only; do NOT attribute quotes to Quran/Hadith.",
    "- Set certainty = 'N/A'.",
    "- verification_note: remind to verify references if using quotes.",
  ];

  const historyRules = [
    "HISTORY RULES:",
    "- Include dates/locations/names when known; if uncertain mark as 'estimated' or 'disputed'.",
    "- Set certainty to one of: Confirmed, Disputed, Legend.",
    "- verification_note: one line telling creator what to verify before posting.",
    "- Do not present disputed claims as confirmed.",
  ];

  const extras: string[] = [];
  if (input.mode === "faith_advice") {
    if (input.referenceText?.trim()) {
      extras.push("USER PROVIDED REFERENCE TEXT (user-supplied; do not invent extra quotes):");
      extras.push(input.referenceText.trim());
    } else {
      extras.push("No reference text provided.");
    }
    extras.push(...faithRules);
  } else {
    if (input.sourceNotes?.trim()) {
      extras.push("USER NOTES/SOURCES (user-supplied hints; do not invent citations):");
      extras.push(input.sourceNotes.trim());
    } else {
      extras.push("No source notes provided.");
    }
    extras.push(...historyRules);
  }

  return [
    ...base,
    ...extras,
    "",
    "Return STRICT JSON exactly matching this schema keys (same keys, no extra keys):",
    JSON.stringify(schema, null, 2),
  ].join("\n");
}

async function callOpenRouter(opts: {
  model: string;
  system: string;
  user: string;
  maxTokens?: number;
}) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) throw new Error("Missing OPENROUTER_API_KEY");

  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": process.env.OPENROUTER_SITE_URL ?? "http://localhost:3000",
      "X-Title": "NoorAi",
    },
    body: JSON.stringify({
      model: opts.model,
      messages: [
        { role: "system", content: opts.system },
        { role: "user", content: opts.user },
      ],
      temperature: 0.2,
      max_tokens: opts.maxTokens ?? 800,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`OpenRouter error ${res.status}: ${text}`);
  }

  const data = await res.json();
  return (data?.choices?.[0]?.message?.content ?? "") as string;
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    if (!body) return jsonError("Invalid JSON body");

    const mode: Mode = body.mode;
    const topic: string = (body.topic ?? "").trim();
    const lengthSeconds = body.lengthSeconds as 30 | 45 | 60;
    const goal: Goal = body.goal;
    const language: Language = body.language;
    const tone: Tone = body.tone;
    const referenceText: string | undefined = body.referenceText;
    const sourceNotes: string | undefined = body.sourceNotes;

    if (!mode || (mode !== "faith_advice" && mode !== "history_facts"))
      return jsonError("mode must be 'faith_advice' or 'history_facts'");
    if (!topic) return jsonError("topic is required");
    if (![30, 45, 60].includes(lengthSeconds))
      return jsonError("lengthSeconds must be 30, 45, or 60");
    if (!["saves", "shares", "comments", "follows"].includes(goal))
      return jsonError("Invalid goal");
    if (!["arabic", "english", "bilingual"].includes(language))
      return jsonError("Invalid language");
    if (!["calm", "emotional", "intense"].includes(tone))
      return jsonError("Invalid tone");

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

    const model = "anthropic/claude-3.5-sonnet";

    const raw = await callOpenRouter({ model, system, user });
    const cleaned = stripCodeFences(raw);

    let parsed: any = null;

    // 1) Try direct JSON parse
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      // 2) Try extracting the first {...} block and parsing that
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

    return NextResponse.json({ data: parsed }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message ?? "Server error" },
      { status: 500 }
    );
  }
}