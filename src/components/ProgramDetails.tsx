import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { BookOpen, ExternalLink, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { SEARCHABLE_MAJORS, type Level, type Major } from "@/lib/data";
import { useI18n } from "@/lib/i18n-context";
import { useAuth } from "@/lib/store";
import { fetchProgramSummary, type ProgramSummaryResponse } from "@/lib/program-summary";

const SUMMARY_ERROR_MESSAGES: Record<string, string> = {
  daily_generation_limit: "今日 AI 摘要次数已达上限，请明天再试。",
  official_page_unavailable: "无法读取该官网页面，请更换为该专业的详细介绍页后重试。",
  official_page_has_no_readable_content: "该页面没有可读取的课程资料，请粘贴更具体的专业介绍页。",
  summary_provider_not_configured: "AI 摘要服务尚未配置，请联系网站管理员。",
  summary_service_unavailable: "AI 摘要服务暂时不可用，请稍后重试。",
  summary_generation_failed: "AI 暂时无法生成有效摘要，请稍后重试。",
};

export function ProgramDetails({
  universityId,
  universityName,
  programName,
  officialUrl,
  officialDomains,
  major,
  level,
  track,
}: {
  universityId: string;
  universityName: string;
  programName: string;
  officialUrl: string;
  officialDomains: string[];
  major: Major;
  level: Level;
  track: string;
}) {
  const { locale, t } = useI18n();
  const { user, ready } = useAuth();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<ProgramSummaryResponse | null>(null);
  const [sourceUrl, setSourceUrl] = useState(officialUrl);
  const trackName =
    locale === "en"
      ? (SEARCHABLE_MAJORS.find((option) => option.label === track)?.en ?? t(track))
      : t(track);
  const validSourceUrl = isAllowedOfficialUrl(sourceUrl, officialDomains);

  async function generateSummary() {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchProgramSummary({
        universityId,
        major,
        level,
        programName,
        track,
        locale,
        sourceUrl,
      });
      setResponse(result);
    } catch (caught) {
      console.error("Unable to generate a program summary.", caught);
      const message =
        caught instanceof Error
          ? (SUMMARY_ERROR_MESSAGES[caught.message] ?? "AI 服务生成失败，请稍后重试。")
          : "AI 服务生成失败，请稍后重试。";
      setError(t(message));
    } finally {
      setLoading(false);
    }
  }

  const summary = response?.summary;
  const sections = summary
    ? [
        { title: t("课程内容"), items: summary.courses },
        { title: t("学业安排"), items: summary.studyPlan },
        { title: t("专业优势"), items: summary.strengths },
        { title: t("就业情况"), items: summary.careerOutcomes },
      ]
    : [];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="mt-4 w-full">
          <BookOpen />
          {t("专业详情 / AI 解读")}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{trackName}</DialogTitle>
          <DialogDescription>
            {universityName} · {programName}
          </DialogDescription>
        </DialogHeader>

        {!officialUrl && (
          <p className="text-sm text-muted-foreground">
            {t("目前没有已核实的课程目录链接，请粘贴该校官网专业页。")}
          </p>
        )}

        <div className="space-y-2">
          <label htmlFor={`program-url-${universityId}`} className="text-sm font-medium">
            {t("专业官网链接")}
          </label>
          <input
            id={`program-url-${universityId}`}
            className="w-full rounded-md border border-input bg-card px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            type="url"
            value={sourceUrl}
            placeholder={t("请粘贴该专业的官方课程介绍链接")}
            onChange={(event) => {
              setSourceUrl(event.target.value);
              setResponse(null);
              setError(null);
            }}
            aria-invalid={!validSourceUrl}
          />
          {validSourceUrl ? (
            <a
              href={sourceUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium text-primary underline underline-offset-4"
            >
              {t("前往学校官网查看专业介绍")}
              <ExternalLink className="h-4 w-4" />
            </a>
          ) : (
            <p className="text-sm text-destructive">{t("请输入该大学官网域名下的 HTTPS 链接。")}</p>
          )}
        </div>

        <p className="text-xs leading-relaxed text-muted-foreground">
          {t(
            "AI 摘要仅依据校方课程页面内容生成；来源未明确提供的排名、学业安排或就业数据会标注为暂无可核实信息，请以官网最新说明为准。",
          )}
        </p>

        {!ready ? (
          <p className="text-sm text-muted-foreground">{t("正在检查登录状态…")}</p>
        ) : !user ? (
          <div className="rounded-lg border border-border bg-muted/50 p-4 text-sm">
            <p>{t("登录后生成 AI 摘要")}</p>
            <Link to="/auth" className="mt-2 inline-block font-medium text-primary underline">
              {t("登录")}
            </Link>
          </div>
        ) : (
          <Button
            onClick={generateSummary}
            disabled={loading || !validSourceUrl}
            className="w-full sm:w-fit"
          >
            <Sparkles />
            {loading ? t("正在读取官网并生成摘要…") : t("生成 AI 摘要")}
          </Button>
        )}

        {error && (
          <p role="alert" className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
            {error}
          </p>
        )}

        {summary && response && (
          <div className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="font-semibold">{t("AI 摘要")}</h3>
              <span className="text-xs text-muted-foreground">
                {t("生成时间")}{" "}
                {new Intl.DateTimeFormat(locale).format(new Date(response.generatedAt))}
              </span>
            </div>

            {sections.map(({ title, items }) => (
              <section key={title} className="space-y-2">
                <h4 className="text-sm font-semibold">{title}</h4>
                {items.length ? (
                  <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                    {items.map((item, index) => (
                      <li key={`${index}-${item}`}>{item}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">{t("来源未提供可核实的信息。")}</p>
                )}
              </section>
            ))}

            <section className="space-y-2">
              <h4 className="text-sm font-semibold">{t("专业排名")}</h4>
              <p className="text-sm text-muted-foreground">
                {summary.ranking || t("来源未提供可核实的信息。")}
              </p>
            </section>

            <section className="space-y-2">
              <h4 className="text-sm font-semibold">{t("信息说明")}</h4>
              <p className="text-sm text-muted-foreground">{summary.evidenceLimitations}</p>
            </section>

            <section className="space-y-2">
              <h4 className="text-sm font-semibold">{t("摘要来源")}</h4>
              <ul className="space-y-1 text-sm">
                {response.sources.map((source) => (
                  <li key={source.url}>
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-primary underline underline-offset-4"
                    >
                      {source.title}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function isAllowedOfficialUrl(value: string, allowedDomains: string[]): boolean {
  try {
    const url = new URL(value);
    return (
      url.protocol === "https:" &&
      !url.username &&
      !url.password &&
      !url.port &&
      allowedDomains.some(
        (domain) => url.hostname === domain || url.hostname.endsWith(`.${domain}`),
      )
    );
  } catch {
    return false;
  }
}
