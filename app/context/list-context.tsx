"use client";

import { createContext, useContext, useState } from "react";

// Approach 1 — React Context API.
// Built into React: create a context, hold the state in a Provider, and let any
// descendant read it with a hook. No prop drilling — the value skips the layers.

export type Item = { id: string; text: string };

type ListValue = {
  items: Item[];
  add: (text: string) => void;
  remove: (id: string) => void;
};

const ListContext = createContext<ListValue | null>(null);

export function ListProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<Item[]>([]);
  const add = (text: string) =>
    setItems((list) => [...list, { id: crypto.randomUUID(), text }]);
  const remove = (id: string) =>
    setItems((list) => list.filter((it) => it.id !== id));

  return (
    <ListContext.Provider value={{ items, add, remove }}>
      {children}
    </ListContext.Provider>
  );
}

export function useList() {
  const ctx = useContext(ListContext);
  if (!ctx) throw new Error("useList must be used inside <ListProvider>");
  return ctx;
}
