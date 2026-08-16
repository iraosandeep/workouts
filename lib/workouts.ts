import "expo-sqlite/localStorage/install";
import { useSyncExternalStore } from "react";

import type { Exercise } from "@/lib/exercises";

// v2: keyed by the richer exercises.json Exercise shape (id/difficulty/equipment/etc.),
// not the old API-derived shape — bumped so stale on-device data isn't read back in.
const STORAGE_KEY = "workouts_v2";

type WorkoutsByDate = Record<string, Exercise[]>;

type Listener = () => void;
const listeners = new Set<Listener>();

let cache: WorkoutsByDate = JSON.parse(
  localStorage.getItem(STORAGE_KEY) ?? "{}",
);

function write(workouts: WorkoutsByDate) {
  cache = workouts;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(workouts));
  listeners.forEach((listener) => listener());
}

function getSnapshot() {
  return cache;
}

function subscribe(onStoreChange: Listener) {
  listeners.add(onStoreChange);
  return () => listeners.delete(onStoreChange);
}

/** Exercises assigned to `dateKey`, or an empty list if none were created yet. */
export function getWorkout(
  workouts: WorkoutsByDate,
  dateKey: string,
): Exercise[] {
  return workouts[dateKey] ?? [];
}

export function setWorkout(dateKey: string, exercises: Exercise[]) {
  write({ ...cache, [dateKey]: exercises });
}

export function useWorkouts() {
  return useSyncExternalStore(subscribe, getSnapshot);
}
