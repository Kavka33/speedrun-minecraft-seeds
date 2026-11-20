import { useState } from "react";
import db from "@/lib/shared/kliv-database.js";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { parseTimeInput } from "@/lib/seed-utils";

type Props = { onSaved: () => void };

const SubmitSeedDialog = ({ onSaved }: Props) => {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    seed_code: "",
    title: "",
    version: "1.16.1",
    category: "RSG",
    spawn_biome: "",
    bastion_type: "",
    overworld_route: "",
    difficulty: "medium",
    best_time: "",
    tags: "",
    description: "",
  });

  const set = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    await db.insert("seeds", {
      seed_code: form.seed_code.trim(),
      title: form.title.trim(),
      version: form.version.trim(),
      category: form.category,
      spawn_biome: form.spawn_biome || null,
      bastion_type: form.bastion_type || null,
      overworld_route: form.overworld_route || null,
      difficulty: form.difficulty,
      best_time_seconds: parseTimeInput(form.best_time),
      tags: JSON.stringify(form.tags.split(",").map((t) => t.trim()).filter(Boolean)),
      description: form.description || null,
      verified: 0,
    });
    console.log("[seeds] submitted", form.seed_code);
    toast.success("Seed added to the vault");
    setOpen(false);
    onSaved();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="secondary" className="font-display uppercase tracking-wider">
          <Plus className="mr-1.5 h-4 w-4" /> Submit seed
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg border-border bg-card">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">Submit a seed</DialogTitle>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5 sm:col-span-2">
              <Label className="text-xs uppercase tracking-widest text-muted-foreground">Title</Label>
              <Input required value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="Ruined Portal Buried Treasure" />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label className="text-xs uppercase tracking-widest text-muted-foreground">Seed code</Label>
              <Input required value={form.seed_code} onChange={(e) => set("seed_code", e.target.value)} className="font-mono" placeholder="-4530634556500121041" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs uppercase tracking-widest text-muted-foreground">Version</Label>
              <Input value={form.version} onChange={(e) => set("version", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs uppercase tracking-widest text-muted-foreground">Category</Label>
              <div className="flex gap-1.5">
                {["RSG", "SSG"].map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => set("category", c)}
                    className={`flex-1 border px-2 py-2 text-xs uppercase tracking-widest ${form.category === c ? "border-primary bg-primary/15 text-primary" : "border-border text-muted-foreground"}`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs uppercase tracking-widest text-muted-foreground">Spawn biome</Label>
              <Input value={form.spawn_biome} onChange={(e) => set("spawn_biome", e.target.value)} placeholder="Plains" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs uppercase tracking-widest text-muted-foreground">Bastion type</Label>
              <Input value={form.bastion_type} onChange={(e) => set("bastion_type", e.target.value)} placeholder="Housing" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs uppercase tracking-widest text-muted-foreground">Overworld route</Label>
              <Input value={form.overworld_route} onChange={(e) => set("overworld_route", e.target.value)} placeholder="Ruined Portal" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs uppercase tracking-widest text-muted-foreground">Known best (mm:ss)</Label>
              <Input value={form.best_time} onChange={(e) => set("best_time", e.target.value)} placeholder="9:45" />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label className="text-xs uppercase tracking-widest text-muted-foreground">Difficulty</Label>
              <div className="flex gap-1.5">
                {["easy", "medium", "hard"].map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => set("difficulty", d)}
                    className={`flex-1 border px-2 py-2 text-xs uppercase tracking-widest ${form.difficulty === d ? "border-primary bg-primary/15 text-primary" : "border-border text-muted-foreground"}`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label className="text-xs uppercase tracking-widest text-muted-foreground">Tags (comma separated)</Label>
              <Input value={form.tags} onChange={(e) => set("tags", e.target.value)} placeholder="ruined portal, buried treasure" />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label className="text-xs uppercase tracking-widest text-muted-foreground">Notes / route description</Label>
              <Textarea value={form.description} onChange={(e) => set("description", e.target.value)} />
            </div>
          </div>
          <Button type="submit" className="w-full font-display uppercase tracking-wider">Add to vault</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SubmitSeedDialog;
