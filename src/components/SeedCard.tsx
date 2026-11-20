import { useState } from "react";
import { Copy, Check, Star, Timer, ShieldCheck, MapPin } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { type Seed, formatTime, parseTags, difficultyStyles } from "@/lib/seed-utils";

type Props = {
  seed: Seed;
  isFavorite: boolean;
  onToggleFavorite: (seed: Seed) => void;
  onLogRun: (seed: Seed) => void;
};

const SeedCard = ({ seed, isFavorite, onToggleFavorite, onLogRun }: Props) => {
  const [copied, setCopied] = useState(false);
  const tags = parseTags(seed.tags);

  const copy = async () => {
    await navigator.clipboard.writeText(seed.seed_code);
    setCopied(true);
    toast.success("Seed copied to clipboard");
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <article className="group relative flex flex-col border border-border bg-card/70 p-5 transition-colors hover:border-primary/50">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="truncate text-base font-600">{seed.title}</h3>
            {seed.verified ? <ShieldCheck className="h-4 w-4 shrink-0 text-accent" /> : null}
          </div>
          <p className="mt-0.5 text-xs uppercase tracking-widest text-muted-foreground">
            {seed.version} · {seed.category}
          </p>
        </div>
        <button
          onClick={() => onToggleFavorite(seed)}
          aria-label="Toggle favourite"
          className={`shrink-0 p-1 transition-colors ${isFavorite ? "text-primary" : "text-muted-foreground hover:text-primary"}`}
        >
          <Star className={`h-4.5 w-4.5 ${isFavorite ? "fill-current" : ""}`} />
        </button>
      </div>

      {seed.description && (
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{seed.description}</p>
      )}

      <div className="mt-4 grid grid-cols-2 gap-y-2 text-xs">
        <span className="flex items-center gap-1.5 text-muted-foreground">
          <MapPin className="h-3.5 w-3.5 text-ender" />
          {seed.spawn_biome || "Unknown"}
        </span>
        <span className="flex items-center gap-1.5 text-muted-foreground">
          <Timer className="h-3.5 w-3.5 text-primary" />
          PB {formatTime(seed.best_time_seconds)}
        </span>
        <span className="text-muted-foreground">Bastion: {seed.bastion_type || "—"}</span>
        <span className="text-muted-foreground">Route: {seed.overworld_route || "—"}</span>
      </div>

      {tags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {tags.slice(0, 4).map((tag) => (
            <span key={tag} className="border border-border bg-secondary/60 px-2 py-0.5 text-[11px] text-muted-foreground">
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="mt-5 flex items-center gap-2 border-t border-border/70 pt-4">
        <code className="flex-1 truncate font-mono text-xs text-foreground/80">{seed.seed_code}</code>
        <span
          className={`border px-2 py-0.5 text-[10px] uppercase tracking-widest ${
            difficultyStyles[seed.difficulty ?? "medium"] ?? difficultyStyles.medium
          }`}
        >
          {seed.difficulty ?? "medium"}
        </span>
      </div>

      <div className="mt-3 flex gap-2">
        <Button variant="secondary" size="sm" onClick={copy} className="flex-1">
          {copied ? <Check className="mr-1.5 h-3.5 w-3.5" /> : <Copy className="mr-1.5 h-3.5 w-3.5" />}
          Copy seed
        </Button>
        <Button size="sm" onClick={() => onLogRun(seed)} className="flex-1 font-display uppercase tracking-wider">
          Log run
        </Button>
      </div>
    </article>
  );
};

export default SeedCard;
