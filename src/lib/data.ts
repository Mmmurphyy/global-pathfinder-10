export type Level = "ug" | "pg";
export type Region = "HK" | "UK" | "US" | "CA";
export type Major = "ENG" | "CS" | "ECON" | "SOC";
export type Tier = "Safety" | "Target" | "Reach";

export const REGIONS: { id: Region; label: string }[] = [
  { id: "HK", label: "中国香港" },
  { id: "UK", label: "英国" },
  { id: "US", label: "美国" },
  { id: "CA", label: "加拿大" },
];

export const MAJORS: { id: Major; label: string; en: string; tracks: string[] }[] = [
  { id: "ENG", label: "工程", en: "Engineering", tracks: ["机械工程", "电子电气", "土木工程", "化学工程"] },
  { id: "CS", label: "计算机", en: "Computer Science", tracks: ["人工智能", "软件工程", "数据科学", "网络安全"] },
  { id: "ECON", label: "经济与商科", en: "Economics & Business", tracks: ["经济学", "金融", "会计", "市场营销"] },
  { id: "SOC", label: "社会科学", en: "Social Sciences", tracks: ["心理学", "社会学", "国际关系", "公共政策"] },
];

export interface University {
  id: string;
  name: string;
  en: string;
  region: Region;
  qs: number;
  bar: number; // 0-100 normalized admission bar
  acceptsGaokao: boolean;
  gaokao: string;
  ielts: number;
  toefl: number;
  city: string;
}

export const UNIVERSITIES: University[] = [
  { id: "hku", name: "香港大学", en: "The University of Hong Kong", region: "HK", qs: 17, bar: 88, acceptsGaokao: true, gaokao: "一本线 +120 或 省排名前 1%", ielts: 6.5, toefl: 93, city: "香港" },
  { id: "cuhk", name: "香港中文大学", en: "The Chinese University of Hong Kong", region: "HK", qs: 36, bar: 84, acceptsGaokao: true, gaokao: "一本线 +100 或 省排名前 2%", ielts: 6.5, toefl: 79, city: "香港" },
  { id: "hkust", name: "香港科技大学", en: "HKUST", region: "HK", qs: 47, bar: 83, acceptsGaokao: true, gaokao: "一本线 +100，数学单科 ≥ 130", ielts: 6.5, toefl: 80, city: "香港" },
  { id: "cityu", name: "香港城市大学", en: "City University of Hong Kong", region: "HK", qs: 62, bar: 74, acceptsGaokao: true, gaokao: "一本线 +50", ielts: 6.0, toefl: 79, city: "香港" },
  { id: "polyu", name: "香港理工大学", en: "The Hong Kong Polytechnic University", region: "HK", qs: 57, bar: 72, acceptsGaokao: true, gaokao: "一本线 +40", ielts: 6.0, toefl: 80, city: "香港" },
  { id: "oxford", name: "牛津大学", en: "University of Oxford", region: "UK", qs: 3, bar: 96, acceptsGaokao: false, gaokao: "不接受", ielts: 7.5, toefl: 110, city: "牛津" },
  { id: "imperial", name: "帝国理工学院", en: "Imperial College London", region: "UK", qs: 2, bar: 93, acceptsGaokao: false, gaokao: "不接受", ielts: 7.0, toefl: 100, city: "伦敦" },
  { id: "ucl", name: "伦敦大学学院", en: "University College London", region: "UK", qs: 9, bar: 88, acceptsGaokao: false, gaokao: "不接受", ielts: 7.0, toefl: 100, city: "伦敦" },
  { id: "manchester", name: "曼彻斯特大学", en: "The University of Manchester", region: "UK", qs: 34, bar: 76, acceptsGaokao: true, gaokao: "满分 80% 以上（部分专业）", ielts: 6.5, toefl: 90, city: "曼彻斯特" },
  { id: "bristol", name: "布里斯托大学", en: "University of Bristol", region: "UK", qs: 54, bar: 74, acceptsGaokao: true, gaokao: "满分 78% 以上 + 面试", ielts: 6.5, toefl: 90, city: "布里斯托" },
  { id: "mit", name: "麻省理工学院", en: "MIT", region: "US", qs: 1, bar: 98, acceptsGaokao: false, gaokao: "不接受（需 SAT/AP）", ielts: 7.0, toefl: 100, city: "剑桥, MA" },
  { id: "columbia", name: "哥伦比亚大学", en: "Columbia University", region: "US", qs: 34, bar: 92, acceptsGaokao: false, gaokao: "不接受", ielts: 7.0, toefl: 105, city: "纽约" },
  { id: "uiuc", name: "伊利诺伊大学厄巴纳-香槟", en: "UIUC", region: "US", qs: 69, bar: 82, acceptsGaokao: false, gaokao: "不接受", ielts: 6.5, toefl: 80, city: "香槟" },
  { id: "nyu", name: "纽约大学", en: "New York University", region: "US", qs: 43, bar: 85, acceptsGaokao: true, gaokao: "省排名前 5% + 面试（部分项目）", ielts: 7.0, toefl: 100, city: "纽约" },
  { id: "toronto", name: "多伦多大学", en: "University of Toronto", region: "CA", qs: 25, bar: 86, acceptsGaokao: true, gaokao: "一本线 +80（结合会考）", ielts: 6.5, toefl: 100, city: "多伦多" },
  { id: "ubc", name: "英属哥伦比亚大学", en: "University of British Columbia", region: "CA", qs: 38, bar: 80, acceptsGaokao: true, gaokao: "一本线 +60", ielts: 6.5, toefl: 90, city: "温哥华" },
  { id: "mcgill", name: "麦吉尔大学", en: "McGill University", region: "CA", qs: 29, bar: 78, acceptsGaokao: true, gaokao: "满分 85% 以上", ielts: 6.5, toefl: 90, city: "蒙特利尔" },
  { id: "waterloo", name: "滑铁卢大学", en: "University of Waterloo", region: "CA", qs: 115, bar: 77, acceptsGaokao: true, gaokao: "一本线 +50，数学优秀", ielts: 6.5, toefl: 90, city: "滑铁卢" },
];

const MAJOR_ADJ: Record<Major, number> = { CS: 4, ENG: 1, ECON: 3, SOC: -3 };
const PROGRAM_NAMES: Record<Major, [string, string]> = {
  ENG: ["BEng Engineering", "MSc Engineering"],
  CS: ["BSc Computer Science", "MSc Computer Science"],
  ECON: ["BSc Economics & Finance", "MSc Finance / Economics"],
  SOC: ["BA Social Sciences", "MSc Social Policy / Psychology"],
};

export interface Program {
  id: string;
  uni: University;
  major: Major;
  level: Level;
  name: string;
  bar: number;
  ielts: number;
  toefl: number;
  tuition: string;
  duration: string;
  pgGpa: string;
}

const TUITION: Record<Region, [string, string]> = {
  HK: ["HK$ 18.2 万/年", "HK$ 22 万/总"],
  UK: ["£ 3.2 万/年", "£ 3.8 万/总"],
  US: ["$ 6.1 万/年", "$ 7.2 万/总"],
  CA: ["C$ 6.0 万/年", "C$ 5.5 万/总"],
};

export const PROGRAMS: Program[] = UNIVERSITIES.flatMap((uni) =>
  (Object.keys(MAJOR_ADJ) as Major[]).flatMap((major) =>
    (["ug", "pg"] as Level[]).map((level) => {
      const bar = Math.min(99, uni.bar + MAJOR_ADJ[major] + (level === "pg" ? -2 : 0));
      return {
        id: `${uni.id}-${major}-${level}`,
        uni,
        major,
        level,
        name: PROGRAM_NAMES[major][level === "ug" ? 0 : 1],
        bar,
        ielts: uni.ielts + (major === "SOC" || major === "ECON" ? 0.5 : 0) > 7.5 ? 7.5 : uni.ielts + (major === "SOC" || major === "ECON" ? 0.5 : 0),
        toefl: uni.toefl,
        tuition: TUITION[uni.region][level === "ug" ? 0 : 1],
        duration: level === "ug" ? (uni.region === "UK" ? "3 年" : "4 年") : uni.region === "US" || uni.region === "CA" ? "1.5–2 年" : "1 年",
        pgGpa: `GPA ≥ ${(2.9 + (bar - 70) / 30).toFixed(1)}/4.0（约 ${Math.round(78 + (bar - 70) / 2.2)}/100）`,
      };
    }),
  ),
);

export const getProgram = (id: string) => PROGRAMS.find((p) => p.id === id);

/* ---------- Mentors ---------- */
const SURNAMES = ["林", "陈", "王", "周", "许", "张", "李", "赵", "吴", "何", "郑", "孙"];
const GIVEN = ["思远", "可欣", "一鸣", "若溪", "子涵", "嘉禾", "明哲", "语桐", "皓然", "诗雨", "天宇", "沐晴"];
const BACKGROUNDS_UG = ["高考 668 / 雅思 7.5", "A-Level A*A*A / 雅思 7.0", "IB 42 / 托福 110", "AP 5×5 / SAT 1540", "HKDSE 5**5*5*55"];
const BACKGROUNDS_PG = ["985 · GPA 3.8 / 雅思 7.5", "211 · GPA 3.7 / 托福 106", "双非 · GPA 3.9 / 雅思 7.0", "海本 UCL · 一等学位"];

function hash(s: string) {
  let h = 0;
  for (const c of s) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return h;
}

export interface Mentor {
  id: string;
  name: string;
  uni: University;
  major: Major;
  level: Level;
  year: string;
  background: string;
  rating: number;
  sessions: number;
  bio: string;
  tags: string[];
}

export function mentorsForProgram(p: Program): Mentor[] {
  return [0, 1].map((i) => buildMentor(`${p.id}-${i}`));
}

export function buildMentor(id: string): Mentor | never {
  const [uniId, major, level] = id.split("-") as [string, Major, Level, string];
  const uni = UNIVERSITIES.find((u) => u.id === uniId) ?? UNIVERSITIES[0]!;
  const h = hash(id);
  const bgs = level === "pg" ? BACKGROUNDS_PG : BACKGROUNDS_UG;
  const m = MAJORS.find((x) => x.id === major) ?? MAJORS[0]!;
  return {
    id,
    name: SURNAMES[h % 12]! + GIVEN[(h >>> 4) % 12]!,
    uni,
    major: m.id,
    level: level ?? "ug",
    year: level === "pg" ? "研一在读" : ["大一在读", "大二在读", "大三在读"][h % 3]!,
    background: bgs[h % bgs.length]!,
    rating: 4.6 + ((h >>> 8) % 5) / 10,
    sessions: 40 + ((h >>> 3) % 280),
    bio: `目前就读于${uni.name} ${m.en} 方向（${m.tracks[h % 4]!}）。当年以 ${bgs[h % bgs.length]} 的背景获得录取，熟悉${uni.region === "HK" ? "港校面试" : "海外申请"}全流程，擅长选校定位与文书打磨。`,
    tags: [m.tracks[h % 4]!, uni.region === "HK" ? "面试辅导" : "文书写作", "选校定位"],
  };
}

export const SERVICES = [
  { id: "quick", name: "15 分钟快速答疑", desc: "针对单个问题快速解答，如选校、语言规划", price: 99, mins: 15 },
  { id: "deep", name: "45 分钟深度申请复盘", desc: "完整复盘背景，给出定位与时间线规划", price: 299, mins: 45 },
  { id: "essay", name: "文书批注", desc: "PS / SOP 逐段批注 + 修改建议，72 小时内交付", price: 399, mins: 0 },
];

/* ---------- Score conversion ---------- */
export type Curriculum = "gaokao" | "alevel" | "ib" | "ap" | "hkdse";
export const CURRICULA: { id: Curriculum; label: string }[] = [
  { id: "gaokao", label: "高考" },
  { id: "alevel", label: "A-Level" },
  { id: "ib", label: "IB" },
  { id: "ap", label: "AP" },
  { id: "hkdse", label: "HKDSE" },
];
export const ALEVEL_GRADES = ["A*", "A", "B", "C", "D"];
const ALEVEL_PTS: Record<string, number> = { "A*": 100, A: 90, B: 78, C: 66, D: 54 };
export const DSE_GRADES = ["5**", "5*", "5", "4", "3"];
const DSE_PTS: Record<string, number> = { "5**": 7, "5*": 6, "5": 5, "4": 4, "3": 3 };

export interface UgInput {
  curriculum: Curriculum;
  gaokao: number;
  alevel: string[];
  ib: number;
  ap: number;
  dse: string[];
}
export interface PgInput {
  tier: "985" | "211" | "双非" | "海本";
  gpa: number;
}

export function normalizeUg(i: UgInput): number {
  switch (i.curriculum) {
    case "gaokao":
      return Math.min(100, (i.gaokao / 750) * 100 + 12);
    case "alevel":
      return i.alevel.reduce((a, g) => a + ALEVEL_PTS[g]!, 0) / i.alevel.length;
    case "ib":
      return Math.min(100, (i.ib / 45) * 100 + 4);
    case "ap":
      return Math.min(100, (i.ap / 5) * 100 - 2);
    case "hkdse":
      return Math.min(100, (i.dse.reduce((a, g) => a + DSE_PTS[g]!, 0) / 35) * 100 + 8);
  }
}

export function normalizePg(i: PgInput): number {
  const adj = { "985": 8, "211": 3, 双非: -6, 海本: 5 }[i.tier];
  return Math.max(0, Math.min(100, (i.gpa / 4) * 100 + adj - 6));
}

export function classify(score: number, bar: number): Tier | null {
  const d = score - bar;
  if (d >= 6) return "Safety";
  if (d >= -4) return "Target";
  if (d >= -12) return "Reach";
  return null;
}
