import "expo-sqlite/localStorage/install";
import { useSyncExternalStore } from "react";

import type { Exercise } from "@/lib/exercises";

const STORAGE_KEY = "sessions_v1";

/** Completed exercise ids per date, e.g. { "2026-08-16": ["push-up", ...] }. */
type SessionsByDate = Record<string, string[]>;

type Listener = () => void;
const listeners = new Set<Listener>();

let cache: SessionsByDate = JSON.parse(
  localStorage.getItem(STORAGE_KEY) ?? "{}",
);

function write(sessions: SessionsByDate) {
  cache = sessions;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  listeners.forEach((listener) => listener());
}

function getSnapshot() {
  return cache;
}

function subscribe(onStoreChange: Listener) {
  listeners.add(onStoreChange);
  return () => listeners.delete(onStoreChange);
}

export function isExerciseCompleted(
  sessions: SessionsByDate,
  dateKey: string,
  exerciseId: string,
): boolean {
  return (sessions[dateKey] ?? []).includes(exerciseId);
}

export function toggleExerciseCompleted(dateKey: string, exerciseId: string) {
  const completed = cache[dateKey] ?? [];
  const next = completed.includes(exerciseId)
    ? completed.filter((id) => id !== exerciseId)
    : [...completed, exerciseId];
  write({ ...cache, [dateKey]: next });
}

export function useSessions() {
  return useSyncExternalStore(subscribe, getSnapshot);
}

export type DayCompletion = {
  completedCount: number;
  totalCount: number;
  isComplete: boolean;
};

/** Completion summary for a day's planned exercises. `totalCount: 0` means nothing was planned. */
export function getDayCompletion(
  sessions: SessionsByDate,
  dateKey: string,
  plannedExercises: Exercise[],
): DayCompletion {
  const completed = sessions[dateKey] ?? [];
  const completedCount = plannedExercises.filter((exercise) =>
    completed.includes(exercise.id),
  ).length;
  const totalCount = plannedExercises.length;
  return {
    completedCount,
    totalCount,
    isComplete: totalCount > 0 && completedCount === totalCount,
  };
}
