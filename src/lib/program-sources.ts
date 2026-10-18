import {
  UNIVERSITY_SOURCES,
  type UniversitySource,
} from "../../supabase/functions/_shared/university-sources.ts";

export { UNIVERSITY_SOURCES };

const sourcesById: Readonly<Record<string, UniversitySource>> = UNIVERSITY_SOURCES;

export function getProgramSource(universityId: string): UniversitySource {
  const source = sourcesById[universityId];
  if (!source) throw new Error(`No official program source configured for "${universityId}".`);
  return source;
}
