import {
  createSlice,
  configureStore,
  type PayloadAction,
  type Middleware,
} from "@reduxjs/toolkit";

// Approach 3 — Redux Toolkit.
// Redux Toolkit removes the classic boilerplate. createSlice defines the state plus
// the actions that change it (the array ops look mutable but Immer makes them safe).

export type Item = { id: string; text: string };

const list = createSlice({
  name: "list",
  initialState: { items: [] as Item[] },
  reducers: {
    add: (s, action: PayloadAction<Item>) => {
      s.items.push(action.payload);
    },
    remove: (s, action: PayloadAction<string>) => {
      s.items = s.items.filter((it) => it.id !== action.payload);
    },
    // Time-travel: replace the whole list with a past snapshot.
    jumpTo: (s, action: PayloadAction<Item[]>) => {
      s.items = action.payload;
    },
  },
});

export const { add, remove, jumpTo } = list.actions;

// --- Action history (what powers the time-travel panel) -----------------------
// Because EVERY change is a dispatched action, we can record each one and the state
// it produced. This middleware logs them; the panel replays any entry with jumpTo.
export type HistoryEntry = { id: number; label: string; items: Item[] };

let history: HistoryEntry[] = [];
let nextId = 0;
const listeners = new Set<() => void>();

const historyMiddleware: Middleware = (store) => (next) => (action) => {
  const result = next(action);
  // Don't record the jumps themselves — that would clutter the timeline.
  if ((action as { type: string }).type !== "list/jumpTo") {
    history = [
      ...history,
      {
        id: nextId++,
        label: (action as { type: string }).type,
        items: store.getState().list.items,
      },
    ];
    listeners.forEach((l) => l());
  }
  return result;
};

export function subscribeHistory(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}
export function getHistory() {
  return history;
}

// --- Store --------------------------------------------------------------------
export const store = configureStore({
  reducer: { list: list.reducer },
  middleware: (getDefault) => getDefault().concat(historyMiddleware),
});

// Types so useSelector/useDispatch know the shape of our store.
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// A THUNK: an action that's a function instead of a plain object. RTK wires up the
// thunk middleware by default, so dispatch accepts this. Thunks are where ASYNC work
// lives — here we wait 1s, then dispatch the normal add().
export const addAfterDelay = (text: string) => (dispatch: AppDispatch) => {
  setTimeout(() => dispatch(add({ id: crypto.randomUUID(), text })), 1000);
};
