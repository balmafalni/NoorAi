export type NoorAiResult = any;

const KEY_PREFIX = "noorai:result:";
const LATEST_KEY = "noorai:latest_id";

export function saveResult(id: string, data: NoorAiResult) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY_PREFIX + id, JSON.stringify(data));
  localStorage.setItem(LATEST_KEY, id);
}

export function loadResult(id: string): NoorAiResult | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(KEY_PREFIX + id);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function loadLatestId(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(LATEST_KEY);
}