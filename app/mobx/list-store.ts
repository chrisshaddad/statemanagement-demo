import { makeAutoObservable } from "mobx";

// Approach — MobX.
// Define a plain class; makeAutoObservable() makes its fields reactive. You mutate
// state directly (this.items.push(...)) — no actions to dispatch, no selectors.

export type Item = { id: string; text: string };

class ListStore {
  items: Item[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  add(text: string) {
    this.items.push({ id: crypto.randomUUID(), text });
  }

  remove(id: string) {
    this.items = this.items.filter((it) => it.id !== id);
  }
}

// A module-level singleton, like Zustand — import it anywhere, no Provider needed.
export const list = new ListStore();
