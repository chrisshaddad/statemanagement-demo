import { create } from "zustand";

// Approach 2 — Zustand.
// The store IS the hook. create() returns a hook you call anywhere — no Provider,
// no context wiring. set() updates the state and re-renders the components using it.

export type Item = { id: string; text: string };

type ListState = {
  items: Item[];
  add: (text: string) => void;
  remove: (id: string) => void;
};

export const useList = create<ListState>((set) => ({
  items: [],
  add: (text) =>
    set((s) => ({ items: [...s.items, { id: crypto.randomUUID(), text }] })),
  remove: (id) => set((s) => ({ items: s.items.filter((it) => it.id !== id) })),
}));
