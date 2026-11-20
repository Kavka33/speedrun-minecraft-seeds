import { useState } from "react";
import db from "@/lib/shared/kliv-database.js";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { type Seed, parseTimeInput } from "@/lib/seed-utils";

type Props = {
  seed: Seed | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaved: () => void;
};

const statuses = ["completed", "reset", "practice"];

const LogRunDialog = ({ seed, open, onOpenChange, onSaved }: Props) => {
  const [time, setTime] = useState("");
  const [status, setStatus] = useState("completed");
  const [notes, setNotes] = useState("");
  const [runner, setRunner] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!seed) return;
    const seconds = parseTimeInput(time);
    if (seconds === null) {
      toast.error("Enter a time like 9:45 or 585");
      return;
    }
    setBusy(true);
    await db.insert("runs", {
      seed_code: seed.seed_code,
      seed_title: seed.title,
      category: seed.category,
      time_seconds: seconds,
      status,
      notes: notes || null,
      runner_name: runner.trim() || "Anonymous",
    });
    console.log("[runs] logged run", seed.seed_code, seconds);
    toast.success("Run logged");
    setTime("");
    setNotes("");
    setRunner("");
    setStatus("completed");
    setBusy(false);
    onSaved();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md border-border bg-card">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">Log a run</DialogTitle>
        </DialogHeader>
        {seed && (
          <p className="-mt-2 font-mono text-xs text-muted-foreground">{seed.title} · {seed.seed_code}</p>
        )}
        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="run-runner" className="text-xs uppercase tracking-widest text-muted-foreground">Your name (optional)</Label>
            <Input id="run-runner" value={runner} onChange={(e) => setRunner(e.target.value)} placeholder="Anonymous" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="run-time" className="text-xs uppercase tracking-widest text-muted-foreground">Final time (mm:ss)</Label>
            <Input id="run-time" value={time} onChange={(e) => setTime(e.target.value)} placeholder="9:45" required />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs uppercase tracking-widest text-muted-foreground">Result</Label>
            <div className="flex gap-1.5">
              {statuses.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setStatus(s)}
                  className={`flex-1 border px-2 py-1.5 text-xs uppercase tracking-widest transition-colors ${
                    status === s ? "border-primary bg-primary/15 text-primary" : "border-border text-muted-foreground"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="run-notes" className="text-xs uppercase tracking-widest text-muted-foreground">Notes</Label>
            <Textarea id="run-notes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Lost 40s in the fortress..." />
          </div>
          <Button type="submit" disabled={busy} className="w-full font-display uppercase tracking-wider">Save run</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default LogRunDialog;
