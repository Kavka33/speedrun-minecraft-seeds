import { useEffect, useMemo, useState, useCallback } from "react";
import { toast } from "sonner";
import SiteHeader from "@/components/SiteHeader";
import HeroSection from "@/components/HeroSection";
import SeedFilters, { type Filters } from "@/components/SeedFilters";
import SeedCard from "@/components/SeedCard";
import LogRunDialog from "@/components/LogRunDialog";
import SubmitSeedDialog from "@/components/SubmitSeedDialog";
import { type Seed, formatTime, parseTags } from "@/lib/seed-utils";
import { loadLocalFavorites, saveLocalFavorites } from "@/lib/favorites";
import db from "@/lib/shared/kliv-database.js";

const Index = () => {
  const [seeds, setSeeds] = useState<Seed[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [runSeed, setRunSeed] = useState<Seed | null>(null);
  const [runDialogOpen, setRunDialogOpen] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    search: "",
    version: "all",
    category: "all",
    difficulty: "all",
    favoritesOnly: false,
  });

  const loadSeeds = useCallback(async () => {
    const rows = await db.query("seeds", { order: "_created_at.desc", limit: "200" });
    console.log("[seeds] loaded", rows.length);
    setSeeds(rows as Seed[]);
  }, []);

  useEffect(() => {
    loadSeeds();
    setFavorites(loadLocalFavorites());
  }, [loadSeeds]);

  const toggleFavorite = (seed: Seed) => {
    setFavorites((prev) => {
      const next = prev.includes(seed.seed_code)
        ? prev.filter((c) => c !== seed.seed_code)
        : [...prev, seed.seed_code];
      saveLocalFavorites(next);
      toast(prev.includes(seed.seed_code) ? "Removed from favourites" : "Saved to favourites");
      return next;
    });
  };

  const openLogRun = (seed: Seed) => {
    setRunSeed(seed);
    setRunDialogOpen(true);
  };

  const versions = useMemo(
    () => Array.from(new Set(seeds.map((s) => s.version))).sort().reverse(),
    [seeds]
  );

  const filtered = useMemo(() => {
    const q = filters.search.toLowerCase().trim();
    return seeds.filter((s) => {
      if (filters.version !== "all" && s.version !== filters.version) return false;
      if (filters.category !== "all" && s.category !== filters.category) return false;
      if (filters.difficulty !== "all" && (s.difficulty ?? "medium") !== filters.difficulty) return false;
      if (filters.favoritesOnly && !favorites.includes(s.seed_code)) return false;
      if (!q) return true;
      const haystack = [s.title, s.seed_code, s.spawn_biome, s.bastion_type, s.overworld_route, s.description, ...parseTags(s.tags)]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [seeds, filters, favorites]);

  const bestTime = useMemo(() => {
    const times = seeds.map((s) => s.best_time_seconds).filter((t): t is number => !!t);
    return times.length ? formatTime(Math.min(...times)) : "—";
  }, [seeds]);

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <HeroSection
        seedCount={seeds.length}
        verifiedCount={seeds.filter((s) => s.verified).length}
        bestTime={bestTime}
      />

      <main className="mx-auto max-w-6xl px-4 py-10">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-600">Seed vault</h2>
            <p className="mt-1 text-sm text-muted-foreground">{filtered.length} of {seeds.length} seeds shown</p>
          </div>
          <SubmitSeedDialog onSaved={loadSeeds} />
        </div>

        <SeedFilters filters={filters} versions={versions} onChange={setFilters} />

        {filtered.length === 0 ? (
          <div className="mt-10 border border-dashed border-border p-14 text-center">
            <p className="font-display text-lg">No seeds match those filters</p>
            <p className="mt-1 text-sm text-muted-foreground">Try clearing the search or switching version.</p>
          </div>
        ) : (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((seed) => (
              <SeedCard
                key={seed._row_id}
                seed={seed}
                isFavorite={favorites.includes(seed.seed_code)}
                onToggleFavorite={toggleFavorite}
                onLogRun={openLogRun}
              />
            ))}
          </div>
        )}
      </main>

      <footer className="border-t border-border py-8 text-center text-xs text-muted-foreground">
        Seedvault — community seeds for Minecraft speedrunning. Not affiliated with Mojang.
      </footer>

      <LogRunDialog
        seed={runSeed}
        open={runDialogOpen}
        onOpenChange={setRunDialogOpen}
        onSaved={() => {}}
      />
    </div>
  );
};

export default Index;
