import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Sparkles } from "lucide-react";
import {
  ALEVEL_GRADES, CURRICULA, DSE_GRADES, MAJORS, PROGRAMS, REGIONS,
  classify, normalizePg, normalizeUg,
  type Curriculum, type Level, type Major, type PgInput, type Region, type Tier,
} from "@/lib/data";
import { ProgramCard } from "@/components/ProgramCard";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "UniPath 启程留学 · 智能选校匹配" },
      { name: "description", content: "面向高三与大四学生的海外及香港名校智能选校：高考、A-Level、IB、AP、HKDSE 自动折算，保底/匹配/冲刺分层推荐。" },
      { property: "og:title", content: "UniPath 启程留学 · 智能选校匹配" },
      { property: "og:description", content: "免费智能选校 + 在读学长学姐 1v1 咨询。" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-md border px-3 py-1.5 text-sm transition",
        active ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card hover:border-primary/50",
      )}
    >
      {children}
    </button>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
      {children}
    </div>
  );
}

const inputCls = "w-full rounded-md border border-input bg-card px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring";

const TIER_META: Record<Tier, { title: string; desc: string; color: string }> = {
  Reach: { title: "冲刺校 Reach", desc: "略高于当前背景，值得一搏", color: "bg-reach" },
  Target: { title: "匹配校 Target", desc: "与背景高度吻合，录取概率较高", color: "bg-target" },
  Safety: { title: "保底校 Safety", desc: "背景明显占优，稳妥之选", color: "bg-safety" },
};

function Index() {
  const [level, setLevel] = useState<Level>("ug");
  const [regions, setRegions] = useState<Region[]>(["HK", "UK"]);
  const [major, setMajor] = useState<Major>("CS");
  const [track, setTrack] = useState(MAJORS[1].tracks[0]);
  const [curriculum, setCurriculum] = useState<Curriculum>("gaokao");
  const [gaokao, setGaokao] = useState(620);
  const [alevel, setAlevel] = useState(["A*", "A", "A"]);
  const [ib, setIb] = useState(38);
  const [ap, setAp] = useState(4.6);
  const [dse, setDse] = useState(["5*", "5", "5", "5", "4"]);
  const [pg, setPg] = useState<PgInput>({ tier: "211", gpa: 3.5 });
  const [ielts, setIelts] = useState(6.5);
  const [tierFilter, setTierFilter] = useState<Tier | "All">("All");

  const score = level === "ug" ? normalizeUg({ curriculum, gaokao, alevel, ib, ap, dse }) : normalizePg(pg);
  const gaokaoMode = level === "ug" && curriculum === "gaokao";

  const results = useMemo(() => {
    const out: Record<Tier, typeof PROGRAMS> = { Reach: [], Target: [], Safety: [] };
    PROGRAMS.filter((p) => p.level === level && p.major === major && regions.includes(p.uni.region))
      .filter((p) => !gaokaoMode || p.uni.acceptsGaokao)
      .forEach((p) => {
        const t = classify(score, p.bar);
        if (t) out[t].push(p);
      });
    (Object.keys(out) as Tier[]).forEach((k) => out[k].sort((a, b) => a.uni.qs - b.uni.qs));
    return out;
  }, [level, major, regions, score, gaokaoMode]);

  const total = results.Reach.length + results.Target.length + results.Safety.length;
  const toggleRegion = (r: Region) => setRegions((rs) => (rs.includes(r) ? rs.filter((x) => x !== r) : [...rs, r]));

  return (
    <div>
      <section className="border-b border-border bg-hero text-primary-foreground">
        <div className="mx-auto max-w-7xl px-4 py-12 md:py-16">
          <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary-foreground/20 px-3 py-1 text-xs">
            <Sparkles className="h-3.5 w-3.5 text-gold" /> 全部检索匹配功能免费开放
          </p>
          <h1 className="max-w-3xl font-serif text-3xl font-bold leading-tight md:text-5xl">
            找到属于你的那所大学，<br className="hidden md:block" />再听听在读学长学姐怎么说。
          </h1>
          <p className="mt-4 max-w-2xl text-sm text-primary-foreground/75 md:text-base">
            覆盖中国香港、英国、美国、加拿大 18 所名校。支持高考、A-Level、IB、AP、HKDSE 自动折算与本科院校层次 + GPA 精细匹配。
          </p>
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-8 lg:grid-cols-[340px_1fr]">
        {/* Filters */}
        <aside className="h-fit space-y-6 rounded-xl border border-border bg-card p-5 shadow-card lg:sticky lg:top-20">
          <Field label="申请身份">
            <div className="grid grid-cols-2 gap-2">
              <Chip active={level === "ug"} onClick={() => setLevel("ug")}>申请本科</Chip>
              <Chip active={level === "pg"} onClick={() => setLevel("pg")}>申请研究生</Chip>
            </div>
          </Field>

          <Field label="意向地区（多选）">
            <div className="flex flex-wrap gap-2">
              {REGIONS.map((r) => (
                <Chip key={r.id} active={regions.includes(r.id)} onClick={() => toggleRegion(r.id)}>{r.label}</Chip>
              ))}
            </div>
          </Field>

          <Field label="专业大类与方向">
            <div className="grid grid-cols-2 gap-2">
              {MAJORS.map((m) => (
                <Chip key={m.id} active={major === m.id} onClick={() => { setMajor(m.id); setTrack(m.tracks[0]); }}>
                  <span className="block text-xs leading-tight">{m.en}</span>
                </Chip>
              ))}
            </div>
            <select className={inputCls} value={track} onChange={(e) => setTrack(e.target.value)}>
              {MAJORS.find((m) => m.id === major)!.tracks.map((t) => <option key={t}>{t}</option>)}
            </select>
          </Field>

          {level === "ug" ? (
            <Field label="生源背景 / 课程体系">
              <div className="flex flex-wrap gap-1.5">
                {CURRICULA.map((c) => (
                  <Chip key={c.id} active={curriculum === c.id} onClick={() => setCurriculum(c.id)}>{c.label}</Chip>
                ))}
              </div>
              {curriculum === "gaokao" && (
                <label className="block text-sm">高考总分（750）
                  <input type="number" className={inputCls} value={gaokao} min={300} max={750} onChange={(e) => setGaokao(Math.min(750, +e.target.value))} />
                  <span className="text-xs text-muted-foreground">已自动筛选接受高考成绩的院校</span>
                </label>
              )}
              {curriculum === "alevel" && (
                <div className="grid grid-cols-3 gap-2">
                  {alevel.map((g, i) => (
                    <select key={i} className={inputCls} value={g} onChange={(e) => setAlevel(alevel.map((x, j) => (j === i ? e.target.value : x)))}>
                      {ALEVEL_GRADES.map((x) => <option key={x}>{x}</option>)}
                    </select>
                  ))}
                </div>
              )}
              {curriculum === "ib" && (
                <label className="block text-sm">IB 总分（45）
                  <input type="number" className={inputCls} value={ib} min={24} max={45} onChange={(e) => setIb(Math.min(45, +e.target.value))} />
                </label>
              )}
              {curriculum === "ap" && (
                <label className="block text-sm">AP 平均分（1–5）
                  <input type="number" step={0.1} className={inputCls} value={ap} min={1} max={5} onChange={(e) => setAp(Math.min(5, +e.target.value))} />
                </label>
              )}
              {curriculum === "hkdse" && (
                <div className="grid grid-cols-5 gap-1">
                  {dse.map((g, i) => (
                    <select key={i} className={cn(inputCls, "px-1")} value={g} onChange={(e) => setDse(dse.map((x, j) => (j === i ? e.target.value : x)))}>
                      {DSE_GRADES.map((x) => <option key={x}>{x}</option>)}
                    </select>
                  ))}
                </div>
              )}
            </Field>
          ) : (
            <Field label="本科背景">
              <div className="grid grid-cols-4 gap-1.5">
                {(["985", "211", "双非", "海本"] as const).map((t) => (
                  <Chip key={t} active={pg.tier === t} onClick={() => setPg({ ...pg, tier: t })}>{t}</Chip>
                ))}
              </div>
              <label className="block text-sm">GPA（4.0 制）
                <input type="number" step={0.05} className={inputCls} value={pg.gpa} min={2} max={4} onChange={(e) => setPg({ ...pg, gpa: Math.min(4, +e.target.value) })} />
              </label>
            </Field>
          )}

          <Field label="雅思成绩（可选）">
            <input type="number" step={0.5} className={inputCls} value={ielts} min={4} max={9} onChange={(e) => setIelts(+e.target.value)} />
          </Field>

          <div className="rounded-lg bg-muted p-4">
            <p className="text-xs text-muted-foreground">综合折算竞争力指数</p>
            <p className="font-serif text-3xl font-bold text-primary">{score.toFixed(1)}<span className="text-sm text-muted-foreground"> / 100</span></p>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-border">
              <div className="h-full bg-gold transition-all" style={{ width: `${score}%` }} />
            </div>
          </div>
        </aside>

        {/* Results */}
        <main className="min-w-0">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="font-serif text-2xl font-bold">匹配结果</h2>
              <p className="text-sm text-muted-foreground">
                {MAJORS.find((m) => m.id === major)!.en} · {track} · 共 {total} 个项目
              </p>
            </div>
            <div className="flex gap-1.5">
              {(["All", "Reach", "Target", "Safety"] as const).map((t) => (
                <Chip key={t} active={tierFilter === t} onClick={() => setTierFilter(t)}>{t === "All" ? "全部" : t}</Chip>
              ))}
            </div>
          </div>

          {total === 0 && (
            <div className="rounded-xl border border-dashed border-border p-12 text-center text-muted-foreground">
              暂无匹配项目，试试增加意向地区或调整成绩。
            </div>
          )}

          <div className="space-y-10">
            {(["Reach", "Target", "Safety"] as Tier[])
              .filter((t) => tierFilter === "All" || tierFilter === t)
              .filter((t) => results[t].length > 0)
              .map((t) => (
                <section key={t}>
                  <div className="mb-4 flex items-center gap-3">
                    <span className={cn("h-6 w-1.5 rounded-full", TIER_META[t].color)} />
                    <h3 className="font-serif text-xl font-bold">{TIER_META[t].title}</h3>
                    <span className="text-sm text-muted-foreground">{TIER_META[t].desc} · {results[t].length}</span>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {results[t].map((p) => (
                      <div key={p.id} className="relative">
                        {ielts < p.ielts && (
                          <span className="absolute -top-2 right-14 z-10 rounded bg-destructive px-1.5 py-0.5 text-[10px] text-destructive-foreground">雅思差 {(p.ielts - ielts).toFixed(1)}</span>
                        )}
                        <ProgramCard p={p} tier={t} gaokaoMode={gaokaoMode} />
                      </div>
                    ))}
                  </div>
                </section>
              ))}
          </div>
        </main>
      </div>
    </div>
  );
}
