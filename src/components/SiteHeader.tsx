import { Link, useNavigate } from "@tanstack/react-router";
import { FolderOpen, GraduationCap, LogOut, Scale } from "lucide-react";
import { signOut, useAuth, useFavs } from "@/lib/store";

export function SiteHeader() {
  const favs = useFavs();
  const { user } = useAuth();
  const navigate = useNavigate();
  const link = "flex items-center gap-1.5 rounded-md px-2 py-2 hover:bg-muted sm:px-3";
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-2 px-4">
        <Link to="/" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <GraduationCap className="h-5 w-5" />
          </span>
          <span className="hidden font-serif text-xl font-bold tracking-tight sm:inline">
            UniPath <span className="text-accent-foreground/70 font-sans text-sm font-normal">启程留学</span>
          </span>
        </Link>
        <nav className="flex items-center gap-0.5 text-sm">
          <Link to="/" className={link} activeProps={{ className: "font-semibold text-primary" }} activeOptions={{ exact: true, includeSearch: false }}>
            智能选校
          </Link>
          <Link to="/compare" className={link} activeProps={{ className: "font-semibold text-primary" }}>
            <Scale className="h-4 w-4" /> <span className="hidden sm:inline">收藏对比</span>
            {favs.length > 0 && (
              <span className="rounded-full bg-gold px-1.5 text-xs font-semibold text-gold-foreground">{favs.length}</span>
            )}
          </Link>
          <Link to="/plans" className={link} activeProps={{ className: "font-semibold text-primary" }}>
            <FolderOpen className="h-4 w-4" /> <span className="hidden sm:inline">我的方案</span>
          </Link>
          {user ? (
            <button
              title={user.email ?? ""}
              onClick={async () => { await signOut(); navigate({ to: "/", replace: true }); }}
              className={link}
            >
              <LogOut className="h-4 w-4" /> <span className="hidden sm:inline">退出</span>
            </button>
          ) : (
            <Link to="/auth" className="ml-1 rounded-md bg-primary px-3 py-1.5 text-primary-foreground">登录</Link>
          )}
        </nav>
      </div>
    </header>
  );
}
