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

export function useWorkouts() {
  return useSyncExternalStore(subscribe, getSnapshot);
}
