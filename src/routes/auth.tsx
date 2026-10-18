import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { GraduationCap } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/store";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n-context";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "登录 / 注册 · UniBridge 留学桥" },
      { name: "description", content: "登录 UniBridge，云端保存你的申请方案、收藏院校与对比结果。" },
      { property: "og:title", content: "登录 / 注册 · UniBridge 留学桥" },
      { property: "og:description", content: "云端保存申请方案与收藏院校。" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AuthPage,
});

const inputCls = "w-full rounded-md border border-input bg-card px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring";

function AuthPage() {
  const { t } = useI18n();
  const [mode, setMode] = useState<"in" | "up">("in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate({ to: "/plans", replace: true });
  }, [user, navigate]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    if (mode === "in") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setMsg({ ok: false, text: error.message === "Invalid login credentials" ? t("邮箱或密码错误") : error.message });
    } else {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: window.location.origin },
      });
      if (error) setMsg({ ok: false, text: error.message });
      else if (!data.session) setMsg({ ok: true, text: t("注册成功！请前往邮箱点击确认链接后登录。") });
    }
    setBusy(false);
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-12">
      <div className="rounded-xl border border-border bg-card p-8 shadow-card">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-md bg-primary text-primary-foreground">
          <GraduationCap className="h-6 w-6" />
        </span>
        <h1 className="mt-4 text-center font-serif text-2xl font-bold">{mode === "in" ? t("欢迎回来") : t("创建账号")}</h1>
        <p className="mt-1 text-center text-sm text-muted-foreground">{t("登录后可保存申请方案、收藏与对比院校")}</p>
        <div className="mt-6 grid grid-cols-2 gap-1 rounded-md bg-muted p-1">
          {(["in", "up"] as const).map((m) => (
            <button key={m} type="button" onClick={() => { setMode(m); setMsg(null); }}
              className={cn("rounded px-3 py-1.5 text-sm", mode === m ? "bg-card font-semibold shadow-sm" : "text-muted-foreground")}>
              {m === "in" ? t("登录") : t("注册")}
            </button>
          ))}
        </div>
        <form onSubmit={submit} className="mt-5 space-y-3">
          <input className={inputCls} type="email" required placeholder={t("邮箱")} value={email} onChange={(e) => setEmail(e.target.value)} />
          <input className={inputCls} type="password" required minLength={6} placeholder={t("密码（至少 6 位）")} value={password} onChange={(e) => setPassword(e.target.value)} />
          {msg && <p className={cn("text-sm", msg.ok ? "text-safety" : "text-destructive")}>{msg.text}</p>}
          <button disabled={busy} className="w-full rounded-md bg-primary py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-60">
            {busy ? t("请稍候…") : mode === "in" ? t("登录") : t("注册")}
          </button>
        </form>
      </div>
    </div>
  );
}
