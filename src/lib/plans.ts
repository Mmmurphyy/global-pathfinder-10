import type { Curriculum, Level, Major, PgInput, Region } from "@/lib/data";

export type PlanFilters = {
  level: Level;
  regions: Region[];
  major: Major;
  track: string;
  curriculum: Curriculum;
  gaokao: number;
  alevel: string[];
  ib: number;
  ap: number;
  dse: string[];
  pg: PgInput;
  ielts: number;
};

export type PlanSummary = { reach: number; target: number; safety: number; score: number };
