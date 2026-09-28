import { useSyncExternalStore } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

// Auth + favorites store. Favorites live in the cloud database, per user.
let user: User | null = null;
let authReady = false;
let favs: string[] = [];
let started = false;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

async function loadFavs() {
  if (!user) {
    favs = [];
    emit();
    return;
  }
  const { data } = await supabase.from("favorites").select("program_id").order("created_at");
  favs = (data ?? []).map((r) => r.program_id);
  emit();
}

function start() {
  if (started || typeof window === "undefined") return;
  started = true;
  supabase.auth.onAuthStateChange((_e, session) => {
    const prev = user?.id;
    user = session?.user ?? null;
    authReady = true;
    emit();
    if (prev !== user?.id) void loadFavs();
  });
  supabase.auth.getSession().then(({ data }) => {
    user = data.session?.user ?? null;
    authReady = true;
    emit();
    void loadFavs();
  });
}

function subscribe(cb: () => void) {
  start();
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

/** Returns false if the user must sign in first. */
export async function toggleFav(id: string): Promise<boolean> {
  if (!user) return false;
  const has = favs.includes(id);
  favs = has ? favs.filter((f) => f !== id) : [...favs, id];
  emit();
  const { error } = has
    ? await supabase.from("favorites").delete().eq("program_id", id).eq("user_id", user.id)
    : await supabase.from("favorites").insert({ program_id: id });
  if (error) await loadFavs();
  return true;
}

const EMPTY: string[] = [];
export function useFavs() {
  return useSyncExternalStore(subscribe, () => favs, () => EMPTY);
}

export function useAuth() {
  const u = useSyncExternalStore(subscribe, () => user, () => null);
  const ready = useSyncExternalStore(subscribe, () => authReady, () => false);
  return { user: u, ready };
}

export async function signOut() {
  await supabase.auth.signOut();
}
