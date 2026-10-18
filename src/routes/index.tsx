import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Save, Sparkles } from "lucide-react";
import {
  ALEVEL_GRADES,
  ALEVEL_SUBJECTS,
  CURRICULA,
  DSE_GRADES,
  ESTIMATED_REACH_MARGIN,
  MAJORS,
  PROGRAMS,
  REGIONS,
  SEARCHABLE_MAJORS,
  additionalEvidenceAdjustment,
  alevelSubjectAdjustment,
  classify,
  competitionAdjustedBar,
  normalizePg,
  normalizeUg,
  type ALevelSubject,
  type Curriculum,
  type Level,
  type Major,
  type PgInput,
  type Region,
  type Tier,
} from "@/lib/data";
import { ProgramCard } from "@/components/ProgramCard";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/store";
import type { PlanFilters } from "@/lib/plans";
import { useI18n } from "@/lib/i18n-context";

export const Route = createFileRoute("/")({
  validateSearch: (s: Record<string, unknown>): { plan?: string } =>
    typeof s["plan"] === "string" ? { plan: s["plan"] } : {},
  head: () => ({
    meta: [
      { title: "UniBridge 留学桥 · 智能选校匹配" },
      {
        name: "description",
        content: "将你的梦想与世界大学相连，走向世界，迈向你人生独特的道路。",
      },
      { property: "og:title", content: "UniBridge 留学桥 · 智能选校匹配" },
      {
        property: "og:description",
        content: "将你的梦想与世界大学相连，走向世界，迈向你人生独特的道路。",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-md border px-3 py-1.5 text-sm transition",
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-card hover:border-primary/50",
      )}
    >
      {children}
    </button>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      {children}
    </div>
  );
}

const inputCls =
  "w-full rounded-md border border-input bg-card px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring";

const TIER_META: Record<Tier, { title: string; desc: string; color: string }> = {
  Reach: { title: "冲刺校 Reach", desc: "略高于当前背景，值得一搏", color: "bg-reach" },
  Target: { title: "匹配校 Target", desc: "与当前背景和专业要求较为匹配", color: "bg-target" },
  Safety: { title: "保底校 Safety", desc: "背景明显占优，稳妥之选", color: "bg-safety" },
};

function Index() {
  const { locale, t } = useI18n();
  const [level, setLevel] = useState<Level>("ug");
  const [regions, setRegions] = useState<Region[]>(["HK", "UK"]);
  const [major, setMajor] = useState<Major>("CS");
  const [track, setTrack] = useState(MAJORS[1]!.tracks[0]!);
  const [majorSearch, setMajorSearch] = useState("");
  const [curriculum, setCurriculum] = useState<Curriculum>("gaokao");
  const [gaokao, setGaokao] = useState(620);
  const [alevel, setAlevel] = useState(["A*", "A", "A"]);
  const [alevelSubjects, setAlevelSubjects] = useState<ALevelSubject[]>([
    "mathematics",
    "physics",
    "chemistry",
  ]);
  const [personalStatement, setPersonalStatement] = useState<"typical" | "strong">("typical");
  const [supercurricular, setSupercurricular] = useState<"none" | "some" | "strong">("none");
  const [ib, setIb] = useState(38);
  const [ap, setAp] = useState(4.6);
  const [dse, setDse] = useState(["5*", "5", "5", "5", "4"]);
  const [pg, setPg] = useState<PgInput>({ tier: "211", gpa: 3.5 });
  const [ielts, setIelts] = useState(6.5);
  const [tierFilter, setTierFilter] = useState<Tier | "All">("All");

  const gradeScore =
    level === "ug"
      ? normalizeUg({
          curriculum,
          gaokao,
          alevel,
          ib,
          ap,
          dse,
        })
      : normalizePg(pg);
  const subjectAdjustment =
    level === "ug" && curriculum === "alevel"
      ? alevelSubjectAdjustment(major, alevelSubjects, alevel)
      : 0;
  const evidenceAdjustment =
    level === "ug" ? additionalEvidenceAdjustment(personalStatement, supercurricular) : 0;
  const score = Math.max(0, Math.min(100, gradeScore + subjectAdjustment + evidenceAdjustment));
  const gaokaoMode = level === "ug" && curriculum === "gaokao";

  const results = useMemo(() => {
    const out: Record<Tier, typeof PROGRAMS> = { Reach: [], Target: [], Safety: [] };
    PROGRAMS.filter((p) => p.level === level && p.major === major && regions.includes(p.uni.region))
      .filter((p) => !gaokaoMode || p.uni.acceptsGaokao)
      .forEach((p) => {
        const adjustedBar = competitionAdjustedBar(p.uni, major, p.bar);
        const t = classify(score, adjustedBar, ESTIMATED_REACH_MARGIN);
        if (t) out[t].push(p);
      });
    (Object.keys(out) as Tier[]).forEach((k) => out[k].sort((a, b) => a.uni.qs - b.uni.qs));
    return out;
  }, [level, major, regions, score, gaokaoMode]);

  const total = results.Reach.length + results.Target.length + results.Safety.length;
  const toggleRegion = (r: Region) =>
    setRegions((rs) => (rs.includes(r) ? rs.filter((x) => x !== r) : [...rs, r]));
  const searchResults = majorSearch.trim()
    ? SEARCHABLE_MAJORS.filter((option) =>
        [option.label, option.en, ...option.aliases, t(option.label)].some((value) =>
          value.toLocaleLowerCase().includes(majorSearch.trim().toLocaleLowerCase()),
        ),
      ).slice(0, 8)
    : [];

  const { plan } = Route.useSearch();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    if (!plan || !user) return;
    supabase
      .from("plans")
      .select("name, filters")
      .eq("id", plan)
      .maybeSingle()
      .then(({ data }) => {
        if (!data) return;
        const f = data.filters as unknown as PlanFilters;
        setLevel(f.level);
        setRegions(f.regions);
        setMajor(f.major);
        setTrack(f.track);
        setCurriculum(f.curriculum);
        setGaokao(f.gaokao);
        setAlevel(f.alevel);
        setAlevelSubjects(f.alevelSubjects ?? ["mathematics", "physics", "chemistry"]);
        setPersonalStatement(f.personalStatement ?? "typical");
        setSupercurricular(f.supercurricular ?? "none");
        setIb(f.ib);
        setAp(f.ap);
        setDse(f.dse);
        setPg(f.pg);
        setIelts(f.ielts);
        setNotice(
          locale === "en"
            ? `Loaded "${data.name}" and refreshed your matches`
            : locale === "zh-TW"
              ? `已載入方案「${data.name}」並重新配對`
              : `已加载方案「${data.name}」并重新匹配`,
        );
      });
  }, [plan, user, locale]);

  async function savePlan() {
    if (!user) {
      navigate({ to: "/auth" });
      return;
    }
    const name = prompt(
      t("为这个申请方案命名："),
      `${MAJORS.find((m) => m.id === major)!.en} · ${new Date().toLocaleDateString(locale)}`,
    );
    if (!name?.trim()) return;
    const filters: PlanFilters = {
      level,
      regions,
      major,
      track,
      curriculum,
      gaokao,
      alevel,
      alevelSubjects,
      personalStatement,
      supercurricular,
      ib,
      ap,
      dse,
      pg,
      ielts,
    };
    const summary = {
      reach: results.Reach.length,
      target: results.Target.length,
      safety: results.Safety.length,
      score,
    };
    const { error } = await supabase
      .from("plans")
      .insert({ name: name.trim(), filters: filters as never, summary: summary as never });
    setNotice(
      error
        ? `${t("保存失败：")}${error.message}`
        : locale === "en"
          ? `Plan "${name.trim()}" saved. Find it under My Plans.`
          : locale === "zh-TW"
            ? `方案「${name.trim()}」已儲存，可在「我的方案」中查看`
            : `方案「${name.trim()}」已保存，可在“我的方案”中回看`,
    );
  }

  return (
    <div>
      <section className="border-b border-border bg-hero text-primary-foreground">
        <div className="mx-auto max-w-7xl px-4 py-12 md:py-16">
          <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary-foreground/20 px-3 py-1 text-xs">
            <Sparkles className="h-3.5 w-3.5 text-gold" /> {t("全部检索匹配功能免费开放")}
          </p>
          <h1 className="max-w-3xl font-serif text-3xl font-bold leading-tight md:text-5xl">
            {t("将你的梦想与世界大学相连，")}
            <br className="hidden md:block" />
            {t("走向世界，")}
            <br className="hidden md:block" />
            {t("迈向你人生独特的道路。")}
          </h1>
          <p className="mt-4 max-w-2xl text-sm text-primary-foreground/75 md:text-base">
            {t(
              "覆盖中国香港、英国、美国、加拿大 18 所名校。支持高考、A-Level、IB、AP、HKDSE 自动折算与本科院校层次 + GPA 精细匹配。",
            )}
          </p>
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-8 lg:grid-cols-[340px_1fr]">
        {/* Filters */}
        <aside className="h-fit space-y-6 rounded-xl border border-border bg-card p-5 shadow-card lg:sticky lg:top-20">
          <Field label={t("申请身份")}>
            <div className="grid grid-cols-2 gap-2">
              <Chip active={level === "ug"} onClick={() => setLevel("ug")}>
                {t("申请本科")}
              </Chip>
              <Chip active={level === "pg"} onClick={() => setLevel("pg")}>
                {t("申请研究生")}
              </Chip>
            </div>
          </Field>

          <Field label={t("意向地区（多选）")}>
            <div className="flex flex-wrap gap-2">
              {REGIONS.map((r) => (
                <Chip key={r.id} active={regions.includes(r.id)} onClick={() => toggleRegion(r.id)}>
                  {t(r.label)}
                </Chip>
              ))}
            </div>
          </Field>

          <Field label={t("专业大类与方向")}>
            <div className="grid grid-cols-2 gap-2">
              {MAJORS.map((m) => (
                <Chip
                  key={m.id}
                  active={major === m.id}
                  onClick={() => {
                    setMajor(m.id);
                    setTrack(m.tracks[0]!);
                  }}
                >
                  <span className="block text-xs leading-tight">{t(m.label)}</span>
                </Chip>
              ))}
            </div>
            <div className="relative">
              <input
                className={inputCls}
                type="search"
                value={majorSearch}
                onChange={(event) => setMajorSearch(event.target.value)}
                placeholder={t("搜索专业或方向，例如 Mathematics、mat")}
                aria-label={t("搜索专业或方向")}
              />
              {majorSearch.trim() && (
                <div className="absolute inset-x-0 top-full z-20 mt-1 max-h-56 overflow-y-auto rounded-md border border-border bg-card p-1 shadow-lg">
                  {searchResults.length > 0 ? (
                    searchResults.map((option) => (
                      <button
                        key={`${option.parent}-${option.label}`}
                        type="button"
                        onClick={() => {
                          setMajor(option.parent);
                          setTrack(option.label);
                          setMajorSearch("");
                        }}
                        className="flex w-full items-center justify-between rounded px-3 py-2 text-left text-sm hover:bg-muted"
                      >
                        <span>{locale === "en" ? option.en : t(option.label)}</span>
                        <span className="ml-3 text-xs text-muted-foreground">
                          {t(MAJORS.find((item) => item.id === option.parent)!.label)}
                        </span>
                      </button>
                    ))
                  ) : (
                    <p className="px-3 py-2 text-sm text-muted-foreground">
                      {t("没有找到相关专业")}
                    </p>
                  )}
                </div>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {t("细分专业将按所属热门大类匹配现有院校项目")}
            </p>
            <select className={inputCls} value={track} onChange={(e) => setTrack(e.target.value)}>
              {!MAJORS.find((m) => m.id === major)!.tracks.includes(track) && (
                <option value={track}>
                  {locale === "en"
                    ? (SEARCHABLE_MAJORS.find((option) => option.label === track)?.en ?? t(track))
                    : t(track)}
                </option>
              )}
              {MAJORS.find((m) => m.id === major)!.tracks.map((trackName) => (
                <option key={trackName} value={trackName}>
                  {locale === "en"
                    ? (SEARCHABLE_MAJORS.find((option) => option.label === trackName)?.en ??
                      t(trackName))
                    : t(trackName)}
                </option>
              ))}
            </select>
          </Field>

          {level === "ug" ? (
            <Field label={t("生源背景 / 课程体系")}>
              <div className="flex flex-wrap gap-1.5">
                {CURRICULA.map((c) => (
                  <Chip key={c.id} active={curriculum === c.id} onClick={() => setCurriculum(c.id)}>
                    {t(c.label)}
                  </Chip>
                ))}
              </div>
              {curriculum === "gaokao" && (
                <label className="block text-sm">
                  {t("高考总分（750）")}
                  <input
                    type="number"
                    className={inputCls}
                    value={gaokao}
                    min={300}
                    max={750}
                    onChange={(e) => setGaokao(Math.min(750, +e.target.value))}
                  />
                  <span className="text-xs text-muted-foreground">
                    {t("已自动筛选接受高考成绩的院校")}
                  </span>
                </label>
              )}
              {curriculum === "alevel" && (
                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground">
                    {t("A-Level 科目与成绩")}
                  </p>
                  {alevel.map((grade, index) => (
                    <div key={index} className="grid grid-cols-[1fr_5rem] gap-2">
                      <select
                        className={inputCls}
                        aria-label={`${t("A-Level 科目")} ${index + 1}`}
                        value={alevelSubjects[index]}
                        onChange={(event) => {
                          const selected = ALEVEL_SUBJECTS.find(
                            (subject) => subject.id === event.target.value,
                          );
                          if (selected) {
                            setAlevelSubjects(
                              alevelSubjects.map((subject, i) =>
                                i === index ? selected.id : subject,
                              ),
                            );
                          }
                        }}
                      >
                        {ALEVEL_SUBJECTS.map((subject) => (
                          <option key={subject.id} value={subject.id}>
                            {t(subject.label)}
                          </option>
                        ))}
                      </select>
                      <select
                        className={inputCls}
                        aria-label={`${t("A-Level 成绩")} ${index + 1}`}
                        value={grade}
                        onChange={(event) =>
                          setAlevel(
                            alevel.map((value, i) => (i === index ? event.target.value : value)),
                          )
                        }
                      >
                        {ALEVEL_GRADES.map((value) => (
                          <option key={value}>{value}</option>
                        ))}
                      </select>
                    </div>
                  ))}
                  <p className="text-xs text-muted-foreground">
                    {t("A-Level 选课相关性会影响不同专业的竞争力评估。")}
                  </p>
                </div>
              )}
              {curriculum === "ib" && (
                <label className="block text-sm">
                  {t("IB 总分（45）")}
                  <input
                    type="number"
                    className={inputCls}
                    value={ib}
                    min={24}
                    max={45}
                    onChange={(e) => setIb(Math.min(45, +e.target.value))}
                  />
                </label>
              )}
              {curriculum === "ap" && (
                <label className="block text-sm">
                  {t("AP 平均分（1–5）")}
                  <input
                    type="number"
                    step={0.1}
                    className={inputCls}
                    value={ap}
                    min={1}
                    max={5}
                    onChange={(e) => setAp(Math.min(5, +e.target.value))}
                  />
                </label>
              )}
              {curriculum === "hkdse" && (
                <div className="grid grid-cols-5 gap-1">
                  {dse.map((g, i) => (
                    <select
                      key={i}
                      className={cn(inputCls, "px-1")}
                      value={g}
                      onChange={(e) => setDse(dse.map((x, j) => (j === i ? e.target.value : x)))}
                    >
                      {DSE_GRADES.map((x) => (
                        <option key={x}>{x}</option>
                      ))}
                    </select>
                  ))}
                </div>
              )}
            </Field>
          ) : (
            <Field label={t("本科背景")}>
              <div className="grid grid-cols-4 gap-1.5">
                {(["985", "211", "双非", "海本"] as const).map((tier) => (
                  <Chip key={tier} active={pg.tier === tier} onClick={() => setPg({ ...pg, tier })}>
                    {t(tier)}
                  </Chip>
                ))}
              </div>
              <label className="block text-sm">
                {t("GPA（4.0 制）")}
                <input
                  type="number"
                  step={0.05}
                  className={inputCls}
                  value={pg.gpa}
                  min={2}
                  max={4}
                  onChange={(e) => setPg({ ...pg, gpa: Math.min(4, +e.target.value) })}
                />
              </label>
            </Field>
          )}

          {level === "ug" && (
            <Field label={t("补充申请背景（选填）")}>
              <label className="block space-y-1 text-sm">
                <span>{t("个人陈述 / 文书")}</span>
                <select
                  className={inputCls}
                  value={personalStatement}
                  onChange={(event) =>
                    setPersonalStatement(event.target.value as typeof personalStatement)
                  }
                >
                  <option value="typical">{t("普通或暂未准备")}</option>
                  <option value="strong">{t("内容突出且针对专业")}</option>
                </select>
              </label>
              <label className="block space-y-1 text-sm">
                <span>{t("竞赛与学术拓展")}</span>
                <select
                  className={inputCls}
                  value={supercurricular}
                  onChange={(event) =>
                    setSupercurricular(event.target.value as typeof supercurricular)
                  }
                >
                  <option value="none">{t("暂无相关经历")}</option>
                  <option value="some">{t("有一些相关经历")}</option>
                  <option value="strong">{t("有高质量相关成果")}</option>
                </select>
              </label>
            </Field>
          )}

          <Field label={t("雅思成绩（可选）")}>
            <input
              type="number"
              step={0.5}
              className={inputCls}
              value={ielts}
              min={4}
              max={9}
              onChange={(e) => setIelts(+e.target.value)}
            />
          </Field>

          <div className="rounded-lg bg-muted p-4">
            <p className="text-xs text-muted-foreground">{t("综合竞争力评估")}</p>
            <p className="font-serif text-3xl font-bold text-primary">
              {score.toFixed(1)}
              <span className="text-sm text-muted-foreground"> / 100</span>
            </p>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-border">
              <div className="h-full bg-gold transition-all" style={{ width: `${score}%` }} />
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              {curriculum === "alevel" && level === "ug"
                ? `${t("A-Level 科目匹配度")}: ${subjectAdjustment > 0 ? "+" : ""}${subjectAdjustment} · ${t("背景补充")}: ${evidenceAdjustment > 0 ? "+" : ""}${evidenceAdjustment}`
                : t("本科推荐同时考虑院校竞争度；研究生推荐综合参考院校背景与 GPA。")}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {t("院校竞争度为估算值，尚未接入当年申请及录取统计；推荐仅供选校参考。")}
            </p>
          </div>
        </aside>

        {/* Results */}
        <main className="min-w-0">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="font-serif text-2xl font-bold">{t("匹配结果")}</h2>
              <p className="text-sm text-muted-foreground">
                {t(MAJORS.find((m) => m.id === major)!.label)} · {t(track)} ·{" "}
                {locale === "en" ? `${total} programs` : `${t("共")} ${total} ${t("个项目")}`}
              </p>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {(["All", "Reach", "Target", "Safety"] as const).map((tierName) => (
                <Chip
                  key={tierName}
                  active={tierFilter === tierName}
                  onClick={() => setTierFilter(tierName)}
                >
                  {tierName === "All" ? t("全部") : tierName}
                </Chip>
              ))}
              <button
                onClick={savePlan}
                title={user ? "" : t("登录后可保存")}
                className="flex items-center gap-1.5 rounded-md bg-gold px-3 py-1.5 text-sm font-semibold text-gold-foreground"
              >
                <Save className="h-4 w-4" /> {t("保存方案")}
              </button>
            </div>
          </div>
          {notice && (
            <div className="mb-5 flex items-center justify-between rounded-lg border border-border bg-muted px-4 py-2 text-sm">
              {notice}
              <button onClick={() => setNotice(null)} className="text-muted-foreground">
                ✕
              </button>
            </div>
          )}

          {total === 0 && (
            <div className="rounded-xl border border-dashed border-border p-12 text-center text-muted-foreground">
              {t("暂无匹配项目，试试增加意向地区或调整成绩。")}
            </div>
          )}

          <div className="space-y-10">
            {(["Reach", "Target", "Safety"] as Tier[])
              .filter((tierName) => tierFilter === "All" || tierFilter === tierName)
              .filter((tierName) => results[tierName].length > 0)
              .map((tierName) => (
                <section key={tierName}>
                  <div className="mb-4 flex items-center gap-3">
                    <span className={cn("h-6 w-1.5 rounded-full", TIER_META[tierName].color)} />
                    <h3 className="font-serif text-xl font-bold">{t(TIER_META[tierName].title)}</h3>
                    <span className="text-sm text-muted-foreground">
                      {t(TIER_META[tierName].desc)} · {results[tierName].length}
                    </span>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {results[tierName].map((p) => (
                      <div key={p.id} className="relative">
                        {ielts < p.ielts && (
                          <span className="absolute -top-2 right-14 z-10 rounded bg-destructive px-1.5 py-0.5 text-[10px] text-destructive-foreground">
                            {t("雅思差")} {(p.ielts - ielts).toFixed(1)}
                          </span>
                        )}
                        <ProgramCard p={p} tier={tierName} gaokaoMode={gaokaoMode} track={track} />
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
