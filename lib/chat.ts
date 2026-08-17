import "expo-sqlite/localStorage/install";
import { useSyncExternalStore } from "react";

import type { ChatRole } from "@/lib/ai";

// v1: simple localStorage persistence — swap for a real database later
// without touching call sites (same useSyncExternalStore shape as
// lib/workouts.ts, lib/favorites.ts, etc.).
const STORAGE_KEY = "chat_messages_v1";

export type ChatEntry = {
  id: string;
  role: ChatRole;
  content: string;
};

type Listener = () => void;
const listeners = new Set<Listener>();

let cache: ChatEntry[] = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");

function write(messages: ChatEntry[]) {
  cache = messages;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  listeners.forEach((listener) => listener());
}

function getSnapshot() {
  return cache;
}

function subscribe(onStoreChange: Listener) {
  listeners.add(onStoreChange);
  return () => listeners.delete(onStoreChange);
}

export function appendChatMessage(role: ChatRole, content: string): ChatEntry {
  const entry: ChatEntry = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    role,
    content,
  };
  write([...cache, entry]);
  return entry;
}

export function clearChatMessages() {
  write([]);
}

export function useChatMessages() {
  return useSyncExternalStore(subscribe, getSnapshot);
}
