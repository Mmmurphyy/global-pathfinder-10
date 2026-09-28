import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowLeft, BadgeCheck, CheckCircle2, Lock, MessageCircle, Send, ShieldCheck, Star } from "lucide-react";
import { buildMentor, MAJORS, SERVICES } from "@/lib/data";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/mentors/$id")({
  head: ({ params }) => {
    const m = buildMentor(params.id);
    const t = `${m.name} · ${m.uni.name}在读学长学姐 · UniPath`;
    return {
      meta: [
        { title: t },
        { name: "description", content: `预约${m.uni.name}认证在读生 1v1 咨询：快速答疑、深度复盘、文书批注。` },
        { property: "og:title", content: t },
        { property: "og:description", content: m.bio },
        { property: "og:type", content: "profile" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: MentorPage,
});

const SLOTS = ["10:00", "14:00", "16:30", "20:00", "21:30"];

function MentorPage() {
  const { id } = Route.useParams();
  const m = buildMentor(id);
  const major = MAJORS.find((x) => x.id === m.major)!;
  const [service, setService] = useState(SERVICES[1]!);
  const days = useMemo(
    () => Array.from({ length: 6 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() + i + 1);
      return d;
    }),
    [],
  );
  const [day, setDay] = useState(0);
  const [slot, setSlot] = useState<string | null>(null);
  const taken = (d: number, s: string) => (d * 7 + s.charCodeAt(1) + m.sessions) % 3 === 0;

  const [msgs, setMsgs] = useState<{ me: boolean; text: string }[]>([
    { me: false, text: `你好！我是${m.name}，目前在${m.uni.name}读${major.en}。有什么申请问题都可以先问我～` },
  ]);
  const [draft, setDraft] = useState("");
  const send = () => {
    if (!draft.trim()) return;
    const text = draft.trim().slice(0, 500);
    setMsgs((x) => [...x, { me: true, text }]);
    setDraft("");
    setTimeout(() => setMsgs((x) => [...x, { me: false, text: "收到！这个问题三言两语说不清，建议预约一次深度复盘，我会结合你的背景详细分析。" }]), 900);
  };

  const [payStep, setPayStep] = useState<0 | 1 | 2 | 3>(0);
  const [method, setMethod] = useState("wechat");
  const needsSlot = service.mins > 0;
  const canBook = !needsSlot || slot;
  const dateLabel = `${days[day]!.getMonth() + 1}月${days[day]!.getDate()}日`;
  const pay = () => {
    setPayStep(2);
    setTimeout(() => setPayStep(3), 1600);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <Link to="/" className="mb-5 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> 返回选校结果
      </Link>

      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          {/* Profile */}
          <section className="overflow-hidden rounded-xl border border-border bg-card shadow-card">
            <div className="h-24 bg-hero" />
            <div className="px-6 pb-6">
              <div className="-mt-10 flex flex-wrap items-end gap-4">
                <span className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-card bg-primary font-serif text-3xl text-primary-foreground">{m.name[0]}</span>
                <div className="pt-12">
                  <h1 className="flex items-center gap-2 font-serif text-2xl font-bold">{m.name}</h1>
                  <p className="text-sm text-muted-foreground">{m.uni.name} · {major.en} · {m.year}</p>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2 text-xs">
                <span className="inline-flex items-center gap-1 rounded border border-gold/40 bg-gold/10 px-2 py-1 font-semibold text-gold-foreground">
                  <BadgeCheck className="h-3.5 w-3.5 text-gold" /> {m.uni.en} 官方认证
                </span>
                <span className="inline-flex items-center gap-1 rounded bg-muted px-2 py-1"><Star className="h-3.5 w-3.5 fill-gold text-gold" /> {m.rating.toFixed(1)} 评分</span>
                <span className="rounded bg-muted px-2 py-1">{m.sessions} 次咨询</span>
                {m.tags.map((t) => <span key={t} className="rounded bg-muted px-2 py-1">{t}</span>)}
              </div>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div className="rounded-lg bg-muted/60 p-4">
                  <p className="text-xs text-muted-foreground">当年申请录取背景</p>
                  <p className="mt-1 font-semibold">{m.background}</p>
                </div>
                <div className="rounded-lg bg-muted/60 p-4">
                  <p className="text-xs text-muted-foreground">录取项目</p>
                  <p className="mt-1 font-semibold">{m.uni.name} · {major.en}</p>
                </div>
              </div>
              <p className="mt-5 text-sm leading-relaxed text-foreground/85">{m.bio}</p>
            </div>
          </section>

          {/* Services */}
          <section className="rounded-xl border border-border bg-card p-6 shadow-card">
            <h2 className="font-serif text-xl font-bold">服务类型 · 透明标价</h2>
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              {SERVICES.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setService(s)}
                  className={cn("rounded-lg border p-4 text-left transition", service.id === s.id ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-border hover:border-primary/40")}
                >
                  <p className="font-semibold">{s.name}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{s.desc}</p>
                  <p className="mt-3 font-serif text-2xl font-bold text-primary">¥{s.price}</p>
                </button>
              ))}
            </div>
          </section>

          {/* Chat */}
          <section className="rounded-xl border border-border bg-card shadow-card">
            <div className="flex items-center gap-2 border-b border-border px-6 py-4">
              <MessageCircle className="h-5 w-5 text-primary" />
              <h2 className="font-serif text-lg font-bold">发起对话</h2>
              <span className="ml-auto text-xs text-muted-foreground">通常 2 小时内回复</span>
            </div>
            <div className="h-64 space-y-3 overflow-y-auto p-6">
              {msgs.map((x, i) => (
                <div key={i} className={cn("flex", x.me && "justify-end")}>
                  <p className={cn("max-w-[80%] rounded-2xl px-4 py-2 text-sm", x.me ? "rounded-br-sm bg-primary text-primary-foreground" : "rounded-bl-sm bg-muted")}>{x.text}</p>
                </div>
              ))}
            </div>
            <div className="flex gap-2 border-t border-border p-4">
              <input
                value={draft}
                maxLength={500}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
                placeholder="例如：我 GPA 3.5 双非，能申 CS 吗？"
                className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <button onClick={send} className="rounded-md bg-primary px-3 text-primary-foreground" aria-label="发送"><Send className="h-4 w-4" /></button>
            </div>
          </section>
        </div>

        {/* Booking */}
        <aside className="h-fit rounded-xl border border-border bg-card p-6 shadow-card lg:sticky lg:top-20">
          <h2 className="font-serif text-xl font-bold">预约咨询</h2>
          <p className="mt-1 text-sm text-muted-foreground">{service.name}</p>

          {needsSlot ? (
            <>
              <div className="mt-5 grid grid-cols-6 gap-1.5">
                {days.map((d, i) => (
                  <button key={i} onClick={() => { setDay(i); setSlot(null); }}
                    className={cn("rounded-md border py-2 text-center text-xs", day === i ? "border-primary bg-primary text-primary-foreground" : "border-border")}>
                    <span className="block">{"日一二三四五六"[d.getDay()]}</span>
                    <span className="block font-semibold">{d.getDate()}</span>
                  </button>
                ))}
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2">
                {SLOTS.map((s) => {
                  const t = taken(day, s);
                  return (
                    <button key={s} disabled={t} onClick={() => setSlot(s)}
                      className={cn("rounded-md border py-2 text-sm", t ? "cursor-not-allowed border-border text-muted-foreground line-through opacity-50" : slot === s ? "border-gold bg-gold/15 font-semibold" : "border-border hover:border-primary/50")}>
                      {s}
                    </button>
                  );
                })}
              </div>
              <p className="mt-2 text-xs text-muted-foreground">时间为北京时间（UTC+8）</p>
            </>
          ) : (
            <p className="mt-5 rounded-md bg-muted p-3 text-sm">付款后上传文书，72 小时内收到逐段批注。</p>
          )}

          <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
            <span className="text-sm text-muted-foreground">合计</span>
            <span className="font-serif text-2xl font-bold">¥{service.price}</span>
          </div>
          <button disabled={!canBook} onClick={() => setPayStep(1)}
            className="mt-4 w-full rounded-md bg-primary py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:opacity-40">
            {canBook ? "立即预约并支付" : "请选择时间"}
          </button>
          <p className="mt-3 flex items-start gap-1.5 text-xs text-muted-foreground">
            <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-safety" /> 平台托管支付：咨询完成并确认后才会结算给学长学姐，未完成可全额退款。
          </p>
        </aside>
      </div>

      <Dialog open={payStep > 0} onOpenChange={(o) => !o && setPayStep(0)}>
        <DialogContent>
          <DialogHeader><DialogTitle className="font-serif">{payStep === 3 ? "预约成功" : "托管支付"}</DialogTitle></DialogHeader>
          {payStep === 1 && (
            <div className="space-y-4">
              <div className="rounded-lg bg-muted p-4 text-sm">
                <p><span className="text-muted-foreground">导师：</span>{m.name}（{m.uni.name}）</p>
                <p><span className="text-muted-foreground">服务：</span>{service.name}</p>
                {needsSlot && <p><span className="text-muted-foreground">时间：</span>{dateLabel} {slot}</p>}
                <p className="mt-2 font-serif text-xl font-bold">¥{service.price}</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {([["wechat", "微信支付"], ["alipay", "支付宝"]] as const).map(([k, l]) => (
                  <button key={k} onClick={() => setMethod(k)} className={cn("rounded-md border py-3 text-sm", method === k ? "border-primary ring-1 ring-primary" : "border-border")}>{l}</button>
                ))}
              </div>
              <button onClick={pay} className="flex w-full items-center justify-center gap-2 rounded-md bg-primary py-3 text-sm font-semibold text-primary-foreground">
                <Lock className="h-4 w-4" /> 确认支付（模拟）
              </button>
            </div>
          )}
          {payStep === 2 && (
            <div className="flex flex-col items-center py-8">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-muted border-t-primary" />
              <p className="mt-4 text-sm text-muted-foreground">正在将款项存入平台托管账户…</p>
            </div>
          )}
          {payStep === 3 && (
            <div className="flex flex-col items-center py-4 text-center">
              <CheckCircle2 className="h-14 w-14 text-safety" />
              <p className="mt-3 font-semibold">¥{service.price} 已进入平台托管</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {needsSlot ? `${dateLabel} ${slot} 与 ${m.name} 的视频咨询已确认，会前 30 分钟提醒你。` : `请在对话中上传文书，${m.name} 将在 72 小时内完成批注。`}
              </p>
              <ol className="mt-5 w-full space-y-2 text-left text-xs">
                {["支付成功 · 款项托管中", "完成咨询", "你确认满意 · 平台结算给导师"].map((s, i) => (
                  <li key={s} className="flex items-center gap-2">
                    <span className={cn("flex h-5 w-5 items-center justify-center rounded-full text-[10px]", i === 0 ? "bg-safety text-primary-foreground" : "bg-muted")}>{i + 1}</span>{s}
                  </li>
                ))}
              </ol>
              <button onClick={() => { setPayStep(0); setSlot(null); }} className="mt-5 w-full rounded-md bg-primary py-2.5 text-sm text-primary-foreground">完成</button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
