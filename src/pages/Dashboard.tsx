import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import db from "@/lib/shared/kliv-database.js";
import { toast } from "sonner";
import { Timer, Trophy, ListChecks, Star } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import StatTile from "@/components/StatTile";
import RunHistoryTable from "@/components/RunHistoryTable";
import { Button } from "@/components/ui/button";
import { type Run, formatTime } from "@/lib/seed-utils";

const Dashboard = () => {
  const [runs, setRuns] = useState<Run[]>([]);
  const [favCount, setFavCount] = useState(0);

  const load = useCallback(async () => {
    const rows = await db.query("runs", { order: "_created_at.desc", limit: "300" });
    setRuns(rows as Run[]);
    setFavCount(await db.count("favorites", {}));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const deleteRun = async (run: Run) => {
    await db.delete("runs", { _row_id: `eq.${run._row_id}` });
    toast.success("Run deleted");
    load();
  };

  const stats = useMemo(() => {
    const completed = runs.filter((r) => r.status === "completed");
    const pb = completed.length ? Math.min(...completed.map((r) => r.time_seconds)) : null;
    const avg = completed.length
      ? Math.round(completed.reduce((sum, r) => sum + r.time_seconds, 0) / completed.length)
      : null;
    return { total: runs.length, completed: completed.length, pb, avg };
  }, [runs]);

  return (
    <div className="min-h-screen">
      <SiteHeader />

      <main className="mx-auto max-w-6xl px-4 py-12">
        <h1 className="text-3xl font-700">Run history</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          All runs logged by the community on this device.
        </p>

        {runs.length === 0 ? (
          <div className="mt-10 border border-dashed border-border p-14 text-center">
            <p className="font-display text-lg">No runs yet</p>
            <p className="mt-1 text-sm text-muted-foreground">Pick a seed from the vault and hit “Log run”.</p>
            <Button asChild className="mt-5 font-display uppercase tracking-wider">
              <Link to="/">Browse seeds</Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <StatTile label="Best time" value={formatTime(stats.pb)} icon={Trophy} hint="Completed runs only" />
              <StatTile label="Average" value={formatTime(stats.avg)} icon={Timer} />
              <StatTile label="Runs logged" value={String(stats.total)} icon={ListChecks} hint={`${stats.completed} completed`} />
              <StatTile label="Saved seeds" value={String(favCount)} icon={Star} />
            </div>

            <h2 className="mt-12 mb-4 text-xl font-600">History</h2>
            <RunHistoryTable runs={runs} onDelete={deleteRun} />
          </>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
