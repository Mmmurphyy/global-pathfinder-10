# Program summary function

The function fetches the supplied university program page, extracts its text, and asks an OpenAI-compatible chat-completions API to summarize only the information present in that page. Requests require a signed-in user and are limited to 12 uncached generations per user per day. Successful results are cached by university, degree level, major, track, locale, and source URL.

Before deploying:

1. Apply the database migration with `supabase db push`.
2. Configure the provider endpoint, model, and key as Supabase secrets:

   ```sh
   supabase secrets set AI_API_BASE_URL=https://your-provider.example/v1 AI_API_KEY=your-secret AI_MODEL=your-model
   ```

   The function calls `${AI_API_BASE_URL}/chat/completions`. Never expose `AI_API_KEY` through a `VITE_` variable or in browser code.
3. Deploy with `supabase functions deploy program-summary`.

Supabase's standard `SUPABASE_URL`, `SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY` function secrets are also required for authentication and private cache access.
