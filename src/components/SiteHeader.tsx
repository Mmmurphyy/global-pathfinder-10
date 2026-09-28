import { Link } from "@tanstack/react-router";
import { GraduationCap, Scale } from "lucide-react";
import { useFavs } from "@/lib/store";

export function SiteHeader() {
  const favs = useFavs();
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <GraduationCap className="h-5 w-5" />
          </span>
          <span className="font-serif text-xl font-bold tracking-tight">
            UniPath <span className="text-accent-foreground/70 font-sans text-sm font-normal">启程留学</span>
          </span>
        </Link>
        <nav className="flex items-center gap-1 text-sm">
          <Link to="/" className="rounded-md px-3 py-2 hover:bg-muted" activeProps={{ className: "font-semibold text-primary" }} activeOptions={{ exact: true }}>
            智能选校
          </Link>
          <Link to="/compare" className="flex items-center gap-1.5 rounded-md px-3 py-2 hover:bg-muted" activeProps={{ className: "font-semibold text-primary" }}>
            <Scale className="h-4 w-4" /> 收藏对比
            {favs.length > 0 && (
              <span className="rounded-full bg-gold px-1.5 text-xs font-semibold text-gold-foreground">{favs.length}</span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
}
