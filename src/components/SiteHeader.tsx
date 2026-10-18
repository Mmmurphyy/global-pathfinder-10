import { Link, useNavigate } from "@tanstack/react-router";
import { FolderOpen, GraduationCap, Languages, LogOut, Scale } from "lucide-react";
import { signOut, useAuth, useFavs } from "@/lib/store";
import { useI18n } from "@/lib/i18n-context";

export function SiteHeader() {
  const { locale, setLocale, t } = useI18n();
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
            UniBridge <span className="text-accent-foreground/70 font-sans text-sm font-normal">留学桥</span>
          </span>
        </Link>
        <nav className="flex items-center gap-0.5 text-sm">
          <Link to="/" className={link} activeProps={{ className: "font-semibold text-primary" }} activeOptions={{ exact: true, includeSearch: false }}>
            {t("智能选校")}
          </Link>
          <Link to="/compare" className={link} activeProps={{ className: "font-semibold text-primary" }}>
            <Scale className="h-4 w-4" /> <span className="hidden sm:inline">{t("收藏对比")}</span>
            {favs.length > 0 && (
              <span className="rounded-full bg-gold px-1.5 text-xs font-semibold text-gold-foreground">{favs.length}</span>
            )}
          </Link>
          <Link to="/plans" className={link} activeProps={{ className: "font-semibold text-primary" }}>
            <FolderOpen className="h-4 w-4" /> <span className="hidden sm:inline">{t("我的方案")}</span>
          </Link>
          {user ? (
            <button
              title={user.email ?? ""}
              onClick={async () => { await signOut(); navigate({ to: "/", replace: true }); }}
              className={link}
            >
              <LogOut className="h-4 w-4" /> <span className="hidden sm:inline">{t("退出")}</span>
            </button>
          ) : (
            <Link to="/auth" className="ml-1 rounded-md bg-primary px-3 py-1.5 text-primary-foreground">{t("登录")}</Link>
          )}
          <label className="ml-1 flex items-center gap-1 rounded-md border border-border px-1.5 py-1.5 sm:ml-2 sm:px-2">
            <Languages className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span className="sr-only">{t("选择语言")}</span>
            <select
              aria-label={t("选择语言")}
              value={locale}
              onChange={(event) => {
                const nextLocale = event.currentTarget.value;
                if (nextLocale === "zh-CN" || nextLocale === "zh-TW" || nextLocale === "en") {
                  setLocale(nextLocale);
                }
              }}
              className="max-w-[76px] bg-transparent text-xs outline-none sm:max-w-none sm:text-sm"
            >
              <option value="zh-CN">{locale === "en" ? "Simplified Chinese" : locale === "zh-TW" ? "簡體中文" : "简体中文"}</option>
              <option value="zh-TW">{locale === "en" ? "Traditional Chinese" : "繁體中文"}</option>
              <option value="en">English</option>
            </select>
          </label>
        </nav>
      </div>
    </header>
  );
}
