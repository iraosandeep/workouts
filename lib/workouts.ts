import "expo-sqlite/localStorage/install";
import { useSyncExternalStore } from "react";

import { getExerciseById, type Exercise } from "@/lib/exercises";

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

export function addExerciseToWorkout(dateKey: string, exercise: Exercise) {
  const current = getWorkout(cache, dateKey);
  if (current.some((existing) => existing.id === exercise.id)) return;
  setWorkout(dateKey, [...current, exercise]);
}

export function removeExerciseFromWorkout(dateKey: string, exerciseId: string) {
  const current = getWorkout(cache, dateKey);
  setWorkout(
    dateKey,
    current.filter((exercise) => exercise.id !== exerciseId),
  );
}

/** Reads the current snapshot directly — for callers outside a React render
 * (e.g. the chat agent's tools), where `useWorkouts()` isn't available. */
export function getWorkoutForDate(dateKey: string): Exercise[] {
  return getWorkout(cache, dateKey);
}

/** Exports the given dates as `{ dateKey: exerciseId[] }` — just ids, so the
 * result stays valid even if the exercises.json schema grows over time. */
export function exportWorkoutsJson(dateKeys: string[]): string {
  const data: Record<string, string[]> = {};
  for (const dateKey of dateKeys) {
    data[dateKey] = getWorkout(cache, dateKey).map((exercise) => exercise.id);
  }
  return JSON.stringify(data, null, 2);
}

export type ImportWorkoutsResult = {
  importedDays: number;
  skippedIds: string[];
};

/** Imports a `{ dateKey: exerciseId[] }` JSON blob (the shape produced by
 * `exportWorkoutsJson`), resolving each id against the current exercise
 * catalog. Unknown ids are skipped and reported rather than failing the
 * whole import. */
export function importWorkoutsJson(json: string): ImportWorkoutsResult {
  const parsed: unknown = JSON.parse(json);
  if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
    throw new Error('Expected a JSON object of "dateKey": [exerciseId, ...].');
  }

  const skippedIds: string[] = [];
  let importedDays = 0;

  for (const [dateKey, exerciseIds] of Object.entries(
    parsed as Record<string, unknown>,
  )) {
    if (!Array.isArray(exerciseIds)) continue;

    const exercises: Exercise[] = [];
    for (const id of exerciseIds) {
      const exercise = typeof id === "string" ? getExerciseById(id) : undefined;
      if (exercise) {
        exercises.push(exercise);
      } else {
        skippedIds.push(String(id));
      }
    }

    setWorkout(dateKey, exercises);
    importedDays += 1;
  }

  return { importedDays, skippedIds };
}

export function useWorkouts() {
  return useSyncExternalStore(subscribe, getSnapshot);
}
