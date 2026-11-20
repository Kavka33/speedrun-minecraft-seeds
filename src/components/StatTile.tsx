import type { LucideIcon } from "lucide-react";

type Props = { label: string; value: string; icon: LucideIcon; hint?: string };

const StatTile = ({ label, value, icon: Icon, hint }: Props) => (
  <div className="border border-border bg-card/70 p-4">
    <div className="flex items-center justify-between">
      <span className="text-[11px] uppercase tracking-widest text-muted-foreground">{label}</span>
      <Icon className="h-4 w-4 text-primary" />
    </div>
    <p className="mt-2 font-display text-2xl">{value}</p>
    {hint && <p className="mt-0.5 text-xs text-muted-foreground">{hint}</p>}
  </div>
);

export default StatTile;
