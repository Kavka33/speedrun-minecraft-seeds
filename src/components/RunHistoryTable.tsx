import { Trash2 } from "lucide-react";
import { type Run, formatTime } from "@/lib/seed-utils";

type Props = { runs: Run[]; onDelete: (run: Run) => void };

const statusColor: Record<string, string> = {
  completed: "text-accent",
  reset: "text-destructive",
  practice: "text-ender",
};

const RunHistoryTable = ({ runs, onDelete }: Props) => (
  <div className="overflow-x-auto border border-border bg-card/60">
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b border-border text-left text-[11px] uppercase tracking-widest text-muted-foreground">
          <th className="px-4 py-3 font-500">Seed</th>
          <th className="px-4 py-3 font-500">Category</th>
          <th className="px-4 py-3 font-500">Time</th>
          <th className="px-4 py-3 font-500">Result</th>
          <th className="px-4 py-3 font-500">Notes</th>
          <th className="px-4 py-3" />
        </tr>
      </thead>
      <tbody>
        {runs.map((run) => (
          <tr key={run._row_id} className="border-b border-border/60 last:border-0">
            <td className="px-4 py-3">
              <div className="font-500">{run.seed_title || "Unnamed"}</div>
              <div className="font-mono text-[11px] text-muted-foreground">{run.seed_code}</div>
            </td>
            <td className="px-4 py-3 text-muted-foreground">{run.category}</td>
            <td className="px-4 py-3 font-mono text-primary">{formatTime(run.time_seconds)}</td>
            <td className={`px-4 py-3 text-xs uppercase tracking-widest ${statusColor[run.status] ?? ""}`}>{run.status}</td>
            <td className="max-w-[220px] truncate px-4 py-3 text-muted-foreground">{run.notes || "—"}</td>
            <td className="px-4 py-3 text-right">
              <button onClick={() => onDelete(run)} aria-label="Delete run" className="text-muted-foreground transition-colors hover:text-destructive">
                <Trash2 className="h-4 w-4" />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default RunHistoryTable;
