import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export type Filters = {
  search: string;
  version: string;
  category: string;
  difficulty: string;
  favoritesOnly: boolean;
};

type Props = {
  filters: Filters;
  versions: string[];
  onChange: (filters: Filters) => void;
};

const chip = (active: boolean) =>
  `px-3 py-1 text-xs uppercase tracking-widest border transition-colors ${
    active
      ? "border-primary bg-primary/15 text-primary"
      : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/40"
  }`;

const SeedFilters = ({ filters, versions, onChange }: Props) => {
  const set = (patch: Partial<Filters>) => onChange({ ...filters, ...patch });

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={filters.search}
          onChange={(e) => set({ search: e.target.value })}
          placeholder="Search title, seed code, biome or tag..."
          className="pl-9"
        />
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        <span className="mr-1 text-[11px] uppercase tracking-widest text-muted-foreground/70">Version</span>
        <button className={chip(filters.version === "all")} onClick={() => set({ version: "all" })}>All</button>
        {versions.map((v) => (
          <button key={v} className={chip(filters.version === v)} onClick={() => set({ version: v })}>{v}</button>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        <span className="mr-1 text-[11px] uppercase tracking-widest text-muted-foreground/70">Category</span>
        {["all", "RSG", "SSG"].map((c) => (
          <button key={c} className={chip(filters.category === c)} onClick={() => set({ category: c })}>
            {c === "all" ? "All" : c}
          </button>
        ))}
        <span className="ml-3 mr-1 text-[11px] uppercase tracking-widest text-muted-foreground/70">Difficulty</span>
        {["all", "easy", "medium", "hard"].map((d) => (
          <button key={d} className={chip(filters.difficulty === d)} onClick={() => set({ difficulty: d })}>
            {d === "all" ? "All" : d}
          </button>
        ))}
        <button
          className={`${chip(filters.favoritesOnly)} ml-3`}
          onClick={() => set({ favoritesOnly: !filters.favoritesOnly })}
        >
          ★ Favourites
        </button>
      </div>
    </div>
  );
};

export default SeedFilters;
