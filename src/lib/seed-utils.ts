export type Seed = {
  _row_id: number;
  seed_code: string;
  version: string;
  category: string;
  title: string;
  description?: string | null;
  spawn_biome?: string | null;
  bastion_type?: string | null;
  overworld_route?: string | null;
  best_time_seconds?: number | null;
  difficulty?: string | null;
  tags?: string | null;
  author_name?: string | null;
  verified?: number | null;
};

export type Run = {
  _row_id: number;
  seed_code: string;
  seed_title?: string | null;
  category: string;
  time_seconds: number;
  status: string;
  notes?: string | null;
  runner_name?: string | null;
  _created_at?: number;
};

export function formatTime(total?: number | null): string {
  if (!total && total !== 0) return "—";
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export function parseTags(tags?: string | null): string[] {
  if (!tags) return [];
  try {
    const parsed = JSON.parse(tags);
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return tags.split(",").map((t) => t.trim()).filter(Boolean);
  }
}

export function parseTimeInput(value: string): number | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  if (trimmed.includes(":")) {
    const [m, s] = trimmed.split(":");
    const mins = Number(m);
    const secs = Number(s);
    if (Number.isNaN(mins) || Number.isNaN(secs)) return null;
    return mins * 60 + secs;
  }
  const n = Number(trimmed);
  return Number.isNaN(n) ? null : Math.round(n);
}

export const difficultyStyles: Record<string, string> = {
  easy: "text-accent border-accent/40 bg-accent/10",
  medium: "text-primary border-primary/40 bg-primary/10",
  hard: "text-ender border-ender/40 bg-ender/10",
};
