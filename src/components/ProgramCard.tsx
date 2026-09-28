import { Link } from "@tanstack/react-router";
import { BadgeCheck, Heart, Star } from "lucide-react";
import { mentorsForProgram, MAJORS, type Program, type Tier } from "@/lib/data";
import { toggleFav, useFavs } from "@/lib/store";
import { cn } from "@/lib/utils";

const TIER_STYLE: Record<Tier, string> = {
  Safety: "bg-safety/10 text-safety border-safety/30",
  Target: "bg-target/10 text-target border-target/30",
  Reach: "bg-reach/10 text-reach border-reach/30",
};

export function ProgramCard({ p, tier, gaokaoMode }: { p: Program; tier: Tier; gaokaoMode: boolean }) {
  const favs = useFavs();
  const fav = favs.includes(p.id);
  const mentors = mentorsForProgram(p);
  const major = MAJORS.find((m) => m.id === p.major)!;
  return (
    <article className="flex flex-col rounded-xl border border-border bg-card p-5 shadow-card transition hover:-translate-y-0.5 hover:shadow-elegant">
      <div className="flex items-start justify-between gap-3">
        <div>
          <span className={cn("inline-block rounded border px-2 py-0.5 text-xs font-semibold", TIER_STYLE[tier])}>{tier}</span>
          <h3 className="mt-2 font-serif text-lg font-bold leading-tight">{p.uni.name}</h3>
          <p className="text-xs text-muted-foreground">{p.uni.en} · QS #{p.uni.qs} · {p.uni.city}</p>
        </div>
        <button
          aria-label="收藏"
          onClick={() => toggleFav(p.id)}
          className={cn("rounded-full border p-2 transition", fav ? "border-reach bg-reach/10 text-reach" : "border-border text-muted-foreground hover:text-reach")}
        >
          <Heart className={cn("h-4 w-4", fav && "fill-current")} />
        </button>
      </div>

      <p className="mt-3 text-sm font-medium">{p.name} <span className="text-muted-foreground">· {major.en}</span></p>

      <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-1.5 text-xs">
        {p.level === "ug" && gaokaoMode && (
          <div className="col-span-2">
            <dt className="inline text-muted-foreground">高考要求：</dt>
            <dd className="inline font-medium">{p.uni.gaokao}</dd>
          </div>
        )}
        {p.level === "pg" && (
          <div className="col-span-2">
            <dt className="inline text-muted-foreground">GPA 要求：</dt>
            <dd className="inline font-medium">{p.pgGpa}</dd>
          </div>
        )}
        <div><dt className="inline text-muted-foreground">雅思：</dt><dd className="inline font-medium">{p.ielts.toFixed(1)}</dd></div>
        <div><dt className="inline text-muted-foreground">托福：</dt><dd className="inline font-medium">{p.toefl}</dd></div>
        <div><dt className="inline text-muted-foreground">学制：</dt><dd className="inline font-medium">{p.duration}</dd></div>
        <div><dt className="inline text-muted-foreground">学费：</dt><dd className="inline font-medium">{p.tuition}</dd></div>
      </dl>

      <div className="mt-4 border-t border-dashed border-border pt-3">
        <p className="mb-2 text-xs font-semibold text-muted-foreground">在读学长学姐 · 1v1 咨询</p>
        <div className="space-y-2">
          {mentors.map((m) => (
            <Link
              key={m.id}
              to="/mentors/$id"
              params={{ id: m.id }}
              className="flex items-center gap-3 rounded-lg bg-muted/60 p-2 transition hover:bg-muted"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary font-serif text-sm text-primary-foreground">{m.name[0]}</span>
              <div className="min-w-0 flex-1">
                <p className="flex items-center gap-1 text-sm font-medium">
                  {m.name}
                  <BadgeCheck className="h-3.5 w-3.5 text-gold" />
                  <span className="text-[10px] font-normal text-muted-foreground">官方认证 · {m.year}</span>
                </p>
                <p className="truncate text-[11px] text-muted-foreground">录取背景：{m.background}</p>
              </div>
              <div className="text-right text-[11px]">
                <p className="flex items-center gap-0.5 font-semibold"><Star className="h-3 w-3 fill-gold text-gold" />{m.rating.toFixed(1)}</p>
                <p className="text-muted-foreground">{m.sessions} 次</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </article>
  );
}
