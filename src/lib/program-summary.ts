import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import type { Level, Major } from "@/lib/data";
import type { Locale } from "@/lib/i18n-context";

const programSummarySchema = z.object({
  courses: z.array(z.string()),
  studyPlan: z.array(z.string()),
  ranking: z.string(),
  strengths: z.array(z.string()),
  careerOutcomes: z.array(z.string()),
  evidenceLimitations: z.string(),
});

const programSummaryResponseSchema = z.object({
  summary: programSummarySchema,
  sources: z.array(
    z.object({
      title: z.string(),
      url: z.string().url(),
    }),
  ),
  generatedAt: z.string(),
});

export type ProgramSummaryResponse = z.infer<typeof programSummaryResponseSchema>;

export async function fetchProgramSummary(input: {
  universityId: string;
  major: Major;
  level: Level;
  programName: string;
  track: string;
  locale: Locale;
  sourceUrl: string;
}): Promise<ProgramSummaryResponse> {
  const { data, error } = await supabase.functions.invoke("program-summary", {
    body: input,
  });

  if (error) {
    const responseError = await getFunctionErrorCode(error);
    throw new Error(responseError ?? error.message);
  }

  const parsed = programSummaryResponseSchema.safeParse(data);
  if (!parsed.success) {
    throw new Error("The program summary service returned an invalid response.");
  }

  return parsed.data;
}

async function getFunctionErrorCode(error: Error): Promise<string | null> {
  if (!("context" in error) || !(error.context instanceof Response)) return null;

  try {
    const body: unknown = await error.context.clone().json();
    if (
      typeof body === "object" &&
      body !== null &&
      "error" in body &&
      typeof body.error === "string"
    ) {
      return body.error;
    }
  } catch {
    return null;
  }

  return null;
}
