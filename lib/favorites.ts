import "expo-sqlite/localStorage/install";
import { useSyncExternalStore } from "react";

import type { Exercise } from "@/lib/videos";

const STORAGE_KEY = "favorites";

type Listener = () => void;
const listeners = new Set<Listener>();

let cache: Exercise[] = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");

function write(favorites: Exercise[]) {
  cache = favorites;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  listeners.forEach((listener) => listener());
}

function getSnapshot() {
  return cache;
}

function subscribe(onStoreChange: Listener) {
  listeners.add(onStoreChange);
  return () => listeners.delete(onStoreChange);
}

export function isFavorite(favorites: Exercise[], name: string) {
  return favorites.some((exercise) => exercise.name === name);
}

export function toggleFavorite(exercise: Exercise) {
  const next = isFavorite(cache, exercise.name)
    ? cache.filter((item) => item.name !== exercise.name)
    : [...cache, exercise];
  write(next);
}

export function useFavorites() {
  return useSyncExternalStore(subscribe, getSnapshot);
}
