import { useSyncExternalStore } from "react";

const KEY = "unipath-favs";
let favs: string[] = [];
let loaded = false;
const listeners = new Set<() => void>();

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    favs = JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    favs = [];
  }
}

export function toggleFav(id: string) {
  load();
  favs = favs.includes(id) ? favs.filter((f) => f !== id) : [...favs, id];
  localStorage.setItem(KEY, JSON.stringify(favs));
  listeners.forEach((l) => l());
}

const EMPTY: string[] = [];
export function useFavs() {
  return useSyncExternalStore(
    (cb) => {
      load();
      listeners.add(cb);
      cb();
      return () => listeners.delete(cb);
    },
    () => (loaded ? favs : EMPTY),
    () => EMPTY,
  );
}
