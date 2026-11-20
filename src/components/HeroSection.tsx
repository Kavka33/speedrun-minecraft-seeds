import { Flame } from "lucide-react";

type Props = { seedCount: number; verifiedCount: number; bestTime: string };

const HeroSection = ({ seedCount, verifiedCount, bestTime }: Props) => (
  <section className="relative overflow-hidden border-b border-border">
    <div className="absolute inset-0 grid-etch opacity-70" />
    <div className="relative mx-auto max-w-6xl px-4 py-16 sm:py-24">
      <span className="inline-flex items-center gap-2 border border-primary/40 bg-primary/10 px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-primary">
        <Flame className="h-3.5 w-3.5" /> Random seed glitchless
      </span>
      <h1 className="mt-6 max-w-3xl text-4xl leading-[1.05] font-700 sm:text-6xl">
        The seeds that <span className="text-ember">beat the game</span> before the sun sets.
      </h1>
      <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground">
        A curated vault of speedrun seeds — spawn biome, bastion type, portal route and known best times.
        Copy the seed, run it, log your split.
      </p>

      <dl className="mt-10 grid max-w-lg grid-cols-3 gap-px border border-border bg-border">
        {[
          { label: "Seeds", value: String(seedCount) },
          { label: "Verified", value: String(verifiedCount) },
          { label: "Fastest", value: bestTime },
        ].map((stat) => (
          <div key={stat.label} className="bg-card px-4 py-4">
            <dd className="font-display text-2xl text-primary">{stat.value}</dd>
            <dt className="mt-0.5 text-[11px] uppercase tracking-widest text-muted-foreground">{stat.label}</dt>
          </div>
        ))}
      </dl>
    </div>
  </section>
);

export default HeroSection;
