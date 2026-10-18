import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, X } from "lucide-react";
import { useEffect, useState } from "react";
import { getProgram, MAJORS, REGIONS, type Program, type Region } from "@/lib/data";
import { toggleFav, useAuth, useFavs } from "@/lib/store";
import { useI18n } from "@/lib/i18n-context";

type DimensionId =
  | "region"
  | "ranking"
  | "level"
  | "major"
  | "admission"
  | "language"
  | "duration"
  | "tuition"
  | "environment"
  | "research"
  | "career"
  | "employmentRate"
  | "residency";

const DIMENSIONS: { id: DimensionId; label: string }[] = [
  { id: "region", label: "地区" },
  { id: "ranking", label: "QS 排名" },
  { id: "level", label: "层次" },
  { id: "major", label: "专业" },
  { id: "admission", label: "录取要求" },
  { id: "language", label: "语言要求" },
  { id: "duration", label: "学制" },
  { id: "tuition", label: "留学费用" },
  { id: "environment", label: "城市与留学环境" },
  { id: "research", label: "科研与高学位" },
  { id: "career", label: "就业方向参考" },
  { id: "employmentRate", label: "就业率" },
  { id: "residency", label: "毕业后发展与永居" },
];

const DEFAULT_DIMENSIONS: DimensionId[] = [
  "region",
  "ranking",
  "level",
  "major",
  "admission",
  "language",
  "duration",
  "tuition",
  "environment",
  "research",
  "career",
  "residency",
];

const RESEARCH_GUIDANCE: Record<Region, string> = {
  HK: "可关注 MPhil/PhD 项目、导师与资助，具体以院系信息为准",
  UK: "可关注研究型硕士与 PhD 路径，具体以院系信息为准",
  US: "可关注 PhD 项目、研究助理机会与资助，具体以院系信息为准",
  CA: "可关注研究型硕士与 PhD 路径，具体以院系信息为准",
};

const CAREER_GUIDANCE: Record<Region, string> = {
  HK: "可考察本地行业机会、实习及校招资源；因专业和个人背景而异",
  UK: "可考察目标行业、实习与雇主联系；因专业和城市而异",
  US: "可考察目标行业、实习与校招资源；因专业和个人背景而异",
  CA: "可考察目标行业、实习与校招资源；因专业和城市而异",
};

export const Route = createFileRoute("/compare")({
  head: () => ({
    meta: [
      { title: "收藏与对比 · UniBridge 留学桥" },
      {
        name: "description",
        content: "最多并排对比四个已收藏的大学项目：费用、声誉、环境与升学就业方向。",
      },
      { property: "og:title", content: "收藏与对比 · UniBridge 留学桥" },
      { property: "og:description", content: "最多并排对比四个已收藏的大学项目。" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Compare,
});

function Compare() {
  const { locale, t } = useI18n();
  const favs = useFavs();
  const { user, ready } = useAuth();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [initialized, setInitialized] = useState(false);
  const [selectedDimensions, setSelectedDimensions] = useState<DimensionId[]>(DEFAULT_DIMENSIONS);
  const items = favs.map(getProgram).filter((p): p is Program => !!p);
  const selectedPrograms = selectedIds
    .map((id) => items.find((program) => program.id === id))
    .filter((program): program is Program => !!program);
  const comparisonBase = selectedPrograms[0];

  useEffect(() => {
    if (initialized || items.length === 0) return;
    const first = items[0]!;
    setSelectedIds(
      items
        .filter((program) => program.major === first.major && program.level === first.level)
        .slice(0, 4)
        .map((program) => program.id),
    );
    setInitialized(true);
  }, [initialized, items]);

  useEffect(() => {
    setSelectedIds((current) => current.filter((id) => favs.includes(id)));
  }, [favs]);

  if (ready && !user)
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <h1 className="font-serif text-2xl font-bold">{t("收藏与对比")}</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {t("登录后即可收藏院校并在任意设备上对比。")}
        </p>
        <Link
          to="/auth"
          className="mt-6 inline-block rounded-md bg-primary px-5 py-2 text-sm text-primary-foreground"
        >
          {t("登录 / 注册")}
        </Link>
      </div>
    );

  const canCompareWith = (program: Program) =>
    !comparisonBase ||
    (program.major === comparisonBase.major && program.level === comparisonBase.level);

  const toggleProgram = (program: Program) => {
    if (selectedIds.includes(program.id)) {
      setSelectedIds((current) => current.filter((id) => id !== program.id));
      return;
    }
    if (selectedIds.length >= 4 || !canCompareWith(program)) return;
    setSelectedIds((current) => [...current, program.id]);
  };

  const toggleDimension = (dimension: DimensionId) => {
    setSelectedDimensions((current) =>
      current.includes(dimension)
        ? current.filter((item) => item !== dimension)
        : [...current, dimension],
    );
  };

  const getValue = (dimension: DimensionId, program: Program): string => {
    const major = MAJORS.find((item) => item.id === program.major);
    const region = REGIONS.find((item) => item.id === program.uni.region);
    switch (dimension) {
      case "region":
        return region ? t(region.label) : "—";
      case "ranking":
        return `#${program.uni.qs}`;
      case "level":
        return t(program.level === "ug" ? "本科" : "研究生");
      case "major":
        return `${program.name}（${major?.en ?? ""}）`;
      case "admission":
        if (program.level === "ug") return t(program.uni.gaokao);
        return t(program.pgGpa);
      case "language":
        return `${t("雅思")} ${program.ielts.toFixed(1)} · ${t("托福")} ${program.toefl}`;
      case "duration":
        return t(program.duration);
      case "tuition":
        return t(program.tuition);
      case "environment":
        return `${t(program.uni.city)} · ${region ? t(region.label) : "—"}`;
      case "research":
        return t(RESEARCH_GUIDANCE[program.uni.region]);
      case "career":
        return t(CAREER_GUIDANCE[program.uni.region]);
      case "employmentRate":
        return t("暂无统一、可比的项目级就业率数据");
      case "residency":
        return t("永居概率无法可靠估算；毕业后签证与移民政策请以当地官方信息为准");
    }
  };

  if (ready && user && items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-10">
        <h1 className="font-serif text-3xl font-bold">{t("收藏与对比")}</h1>
        <div className="mt-8 rounded-xl border border-dashed border-border p-12 text-center">
          <p className="text-muted-foreground">{t("还没有收藏任何项目。")}</p>
          <Link
            to="/"
            className="mt-4 inline-block rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground"
          >
            {t("去智能选校")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="font-serif text-3xl font-bold">{t("收藏与对比")}</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        {locale === "en"
          ? `${items.length} saved programs`
          : `${t("已收藏")} ${items.length} ${t("个项目")}`}
      </p>

      <section className="mt-6 rounded-xl border border-border bg-card p-5 shadow-card">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="font-semibold">
            {t("选择对比项目")}{" "}
            <span className="text-muted-foreground">({selectedPrograms.length}/4)</span>
          </h2>
          <p className="text-xs text-muted-foreground">
            {t("最多选择四个项目；请比较相同专业和学历层次。")}
          </p>
        </div>
        <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((program) => {
            const checked = selectedIds.includes(program.id);
            const enabled = checked || (selectedIds.length < 4 && canCompareWith(program));
            return (
              <label
                key={program.id}
                className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition ${
                  checked ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                } ${!enabled ? "cursor-not-allowed opacity-50" : ""}`}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  disabled={!enabled}
                  onChange={() => toggleProgram(program)}
                  className="mt-1 accent-primary"
                  aria-label={`${t("加入对比")}: ${locale === "en" ? program.uni.en : program.uni.name} ${program.name}`}
                />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold">
                    {locale === "en" ? program.uni.en : program.uni.name}
                  </span>
                  <span className="block truncate text-xs text-muted-foreground">
                    {program.name} · {t(program.level === "ug" ? "本科" : "研究生")}
                  </span>
                </span>
                {checked && (
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                )}
              </label>
            );
          })}
        </div>
      </section>

      <section className="mt-5 rounded-xl border border-border bg-card p-5 shadow-card">
        <h2 className="font-semibold">{t("选择对比维度")}</h2>
        <p className="mt-1 text-xs text-muted-foreground">
          {t(
            "费用仅为学费参考，不含生活费；科研与就业方向为地区性参考。就业率暂无可比数据，永居概率不作估算，请核对院校及官方政策。",
          )}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {DIMENSIONS.map(({ id, label }) => {
            const checked = selectedDimensions.includes(id);
            return (
              <label
                key={id}
                className={`flex cursor-pointer items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition ${
                  checked
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggleDimension(id)}
                  className="accent-gold"
                />
                {t(label)}
              </label>
            );
          })}
        </div>
      </section>

      {selectedPrograms.length === 0 ? (
        <p className="mt-6 rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
          {t("请选择至少一个已收藏项目进行对比。")}
        </p>
      ) : selectedDimensions.length === 0 ? (
        <p className="mt-6 rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
          {t("请选择至少一个对比维度。")}
        </p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-xl border border-border bg-card shadow-card">
          <table className="w-full min-w-[680px] text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="w-36 p-4 text-left text-xs text-muted-foreground">
                  {t("对比维度")}
                </th>
                {selectedPrograms.map((program) => (
                  <th key={program.id} className="min-w-48 p-4 text-left align-top">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-serif text-base font-bold">
                          {locale === "en" ? program.uni.en : program.uni.name}
                        </p>
                        <p className="text-xs font-normal text-muted-foreground">
                          {program.name} · {program.uni.en}
                        </p>
                      </div>
                      <button
                        aria-label={`${t("取消收藏")}: ${locale === "en" ? program.uni.en : program.uni.name}`}
                        title={t("取消收藏")}
                        onClick={() => void toggleFav(program.id)}
                        className="rounded p-1 text-muted-foreground hover:text-destructive"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {selectedDimensions.map((dimension) => {
                const label = DIMENSIONS.find((item) => item.id === dimension)?.label ?? dimension;
                return (
                  <tr key={dimension} className="border-b border-border last:border-0">
                    <th
                      scope="row"
                      className="p-4 text-left text-xs font-semibold text-muted-foreground"
                    >
                      {t(label)}
                    </th>
                    {selectedPrograms.map((program) => (
                      <td key={program.id} className="min-w-48 p-4 align-top">
                        {getValue(dimension, program)}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
