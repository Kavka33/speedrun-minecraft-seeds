import { Link, useLocation } from "react-router-dom";
import { Pickaxe } from "lucide-react";

const SiteHeader = () => {
  const { pathname } = useLocation();
  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="grid h-8 w-8 place-items-center border border-primary/50 bg-primary/15 text-primary">
            <Pickaxe className="h-4 w-4" />
          </span>
          <span className="font-display text-lg font-700 uppercase tracking-[0.18em]">Seedvault</span>
        </Link>

        <nav className="flex items-center gap-1 sm:gap-2">
          <Link
            to="/"
            className={`px-3 py-1.5 text-sm font-medium transition-colors ${pathname === "/" ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
          >
            Seeds
          </Link>
          <Link
            to="/dashboard"
            className={`px-3 py-1.5 text-sm font-medium transition-colors ${pathname === "/dashboard" ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
          >
            My runs
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default SiteHeader;
