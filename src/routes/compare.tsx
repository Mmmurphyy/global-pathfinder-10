import { createFileRoute, Link } from "@tanstack/react-router";
import { X } from "lucide-react";
import { getProgram, MAJORS, REGIONS } from "@/lib/data";
import { toggleFav, useFavs } from "@/lib/store";

export const Route = createFileRoute("/compare")({
  head: () => ({
    meta: [
      { title: "收藏与对比 · UniPath 启程留学" },
      { name: "description", content: "并排对比已收藏的大学项目：排名、语言、学费、学制与录取要求。" },
      { property: "og:title", content: "收藏与对比 · UniPath 启程留学" },
      { property: "og:description", content: "并排对比已收藏的大学项目。" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Compare,
});

function Compare() {
  const favs = useFavs();
  const items = favs.map(getProgram).filter((p): p is NonNullable<typeof p> => !!p);

  const rows: [string, (p: (typeof items)[number]) => string][] = [
    ["地区", (p) => REGIONS.find((r) => r.id === p.uni.region)!.label],
    ["QS 排名", (p) => `#${p.uni.qs}`],
    ["层次", (p) => (p.level === "ug" ? "本科" : "研究生")],
    ["专业", (p) => `${p.name}（${MAJORS.find((m) => m.id === p.major)!.en}）`],
    ["高考接受", (p) => (p.level === "ug" ? p.uni.gaokao : "—")],
    ["GPA 要求", (p) => (p.level === "pg" ? p.pgGpa : "—")],
    ["雅思", (p) => p.ielts.toFixed(1)],
    ["托福", (p) => String(p.toefl)],
    ["学制", (p) => p.duration],
    ["学费", (p) => p.tuition],
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="font-serif text-3xl font-bold">收藏与对比</h1>
      <p className="mt-1 text-sm text-muted-foreground">已收藏 {items.length} 个项目</p>

      {items.length === 0 ? (
        <div className="mt-8 rounded-xl border border-dashed border-border p-12 text-center">
          <p className="text-muted-foreground">还没有收藏任何项目。</p>
          <Link to="/" className="mt-4 inline-block rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground">去智能选校</Link>
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-xl border border-border bg-card shadow-card">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="w-28 p-4 text-left text-xs text-muted-foreground">项目</th>
                {items.map((p) => (
                  <th key={p.id} className="p-4 text-left align-top">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-serif text-base font-bold">{p.uni.name}</p>
                        <p className="text-xs font-normal text-muted-foreground">{p.uni.en}</p>
                      </div>
                      <button aria-label="移除" onClick={() => toggleFav(p.id)} className="text-muted-foreground hover:text-destructive">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map(([label, fn]) => (
                <tr key={label} className="border-b border-border last:border-0">
                  <td className="p-4 text-xs font-semibold text-muted-foreground">{label}</td>
                  {items.map((p) => <td key={p.id} className="p-4">{fn(p)}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
