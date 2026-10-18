import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { FolderOpen, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/store";
import { MAJORS, REGIONS } from "@/lib/data";
import type { PlanFilters, PlanSummary } from "@/lib/plans";
import { useI18n } from "@/lib/i18n-context";

export const Route = createFileRoute("/plans")({
  head: () => ({
    meta: [
      { title: "我的申请方案 · UniBridge 留学桥" },
      { name: "description", content: "查看、加载或删除你保存的选校申请方案，对比条件变化与匹配结果。" },
      { property: "og:title", content: "我的申请方案 · UniBridge 留学桥" },
      { property: "og:description", content: "回看历史选校方案与匹配结果摘要。" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Plans,
});

type Plan = { id: string; name: string; filters: PlanFilters; summary: PlanSummary; created_at: string };

function Plans() {
  const { locale, t } = useI18n();
  const { user, ready } = useAuth();
  const [plans, setPlans] = useState<Plan[] | null>(null);

  useEffect(() => {
    if (!user) return;
    supabase.from("plans").select("*").order("created_at", { ascending: false })
      .then(({ data }) => setPlans((data ?? []) as unknown as Plan[]));
  }, [user]);

  async function remove(id: string) {
    if (!confirm(t("确定删除该方案？"))) return;
    await supabase.from("plans").delete().eq("id", id);
    setPlans((p) => p?.filter((x) => x.id !== id) ?? null);
  }

  if (!ready) return <div className="p-12 text-center text-muted-foreground">{t("加载中…")}</div>;
  if (!user)
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <h1 className="font-serif text-2xl font-bold">{t("我的申请方案")}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{t("登录后即可保存并回看你的选校方案。")}</p>
        <Link to="/auth" className="mt-6 inline-block rounded-md bg-primary px-5 py-2 text-sm text-primary-foreground">{t("登录 / 注册")}</Link>
      </div>
    );

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="font-serif text-3xl font-bold">{t("我的申请方案")}</h1>
      <p className="mt-1 text-sm text-muted-foreground">{user.email} · {locale === "en" ? `${plans?.length ?? 0} plans` : `${t("共")} ${plans?.length ?? 0} ${t("个方案")}`}</p>
      {plans && plans.length === 0 && (
        <div className="mt-8 rounded-xl border border-dashed border-border p-12 text-center">
          <p className="text-muted-foreground">{t("还没有保存方案，在选校页点击“保存方案”即可。")}</p>
          <Link to="/" className="mt-4 inline-block rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground">{t("去智能选校")}</Link>
        </div>
      )}
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {plans?.map((p) => {
          const f = p.filters;
          return (
            <article key={p.id} className="rounded-xl border border-border bg-card p-5 shadow-card">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h2 className="font-serif text-lg font-bold">{p.name}</h2>
                  <p className="text-xs text-muted-foreground">{new Date(p.created_at).toLocaleString(locale)}</p>
                </div>
                <button aria-label={t("删除")} onClick={() => remove(p.id)} className="text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
              </div>
              <p className="mt-3 text-sm">
                {t(f.level === "ug" ? "本科" : "研究生")} · {f.regions.map((r) => t(REGIONS.find((x) => x.id === r)?.label ?? "")).join("/")} · {MAJORS.find((m) => m.id === f.major)?.en} · {t(f.track)}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {t("竞争力指数")} {p.summary.score.toFixed(1)} · {t("雅思")} {f.ielts}
              </p>
              <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
                <div className="rounded bg-reach/10 p-2 text-reach"><b className="block text-lg">{p.summary.reach}</b>{t("冲刺")}</div>
                <div className="rounded bg-target/10 p-2 text-target"><b className="block text-lg">{p.summary.target}</b>{t("匹配")}</div>
                <div className="rounded bg-safety/10 p-2 text-safety"><b className="block text-lg">{p.summary.safety}</b>{t("保底")}</div>
              </div>
              <Link to="/" search={{ plan: p.id }} className="mt-4 flex items-center justify-center gap-1.5 rounded-md bg-primary py-2 text-sm text-primary-foreground">
                <FolderOpen className="h-4 w-4" /> {t("加载方案并重新匹配")}
              </Link>
            </article>
          );
        })}
      </div>
    </div>
  );
}
