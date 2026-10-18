CREATE TABLE public.program_summaries (
  university_id text NOT NULL,
  major text NOT NULL CHECK (major IN ('ENG', 'CS', 'ECON', 'SOC')),
  level text NOT NULL CHECK (level IN ('ug', 'pg')),
  track varchar(100) NOT NULL,
  locale text NOT NULL CHECK (locale IN ('zh-CN', 'zh-TW', 'en')),
  source_url text NOT NULL,
  summary jsonb NOT NULL,
  sources jsonb NOT NULL,
  generated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (university_id, major, level, track, locale)
);

ALTER TABLE public.program_summaries ENABLE ROW LEVEL SECURITY;
GRANT ALL ON public.program_summaries TO service_role;
REVOKE ALL ON public.program_summaries FROM anon, authenticated;

CREATE TABLE public.program_summary_usage (
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  usage_day date NOT NULL DEFAULT current_date,
  generations smallint NOT NULL DEFAULT 1 CHECK (generations > 0),
  PRIMARY KEY (user_id, usage_day)
);

ALTER TABLE public.program_summary_usage ENABLE ROW LEVEL SECURITY;
GRANT ALL ON public.program_summary_usage TO service_role;
REVOKE ALL ON public.program_summary_usage FROM anon, authenticated;

CREATE FUNCTION public.claim_program_summary_generation(
  p_user_id uuid,
  p_daily_limit smallint DEFAULT 12
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  claimed boolean;
BEGIN
  INSERT INTO public.program_summary_usage (user_id)
  VALUES (p_user_id)
  ON CONFLICT (user_id, usage_day)
  DO UPDATE SET generations = program_summary_usage.generations + 1
  WHERE program_summary_usage.generations < p_daily_limit
  RETURNING true INTO claimed;

  RETURN COALESCE(claimed, false);
END;
$$;

REVOKE ALL ON FUNCTION public.claim_program_summary_generation(uuid, smallint) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.claim_program_summary_generation(uuid, smallint) TO service_role;
