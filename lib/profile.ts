import "expo-sqlite/localStorage/install";
import { useSyncExternalStore } from "react";

import type { Difficulty, TrainingGoal } from "@/lib/exercises";

const STORAGE_KEY = "profile_v1";

export type UserProfile = {
  name?: string;
  weightKg?: number;
  heightCm?: number;
  primaryGoal?: TrainingGoal;
  experienceLevel?: Difficulty;
};

type Listener = () => void;
const listeners = new Set<Listener>();

let cache: UserProfile = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}");

function write(profile: UserProfile) {
  cache = profile;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  listeners.forEach((listener) => listener());
}

function getSnapshot() {
  return cache;
}

function subscribe(onStoreChange: Listener) {
  listeners.add(onStoreChange);
  return () => listeners.delete(onStoreChange);
}

export function setProfile(profile: UserProfile) {
  write(profile);
}

export function useProfile() {
  return useSyncExternalStore(subscribe, getSnapshot);
}
