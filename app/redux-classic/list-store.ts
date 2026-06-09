import {
  legacy_createStore as createStore,
  combineReducers,
  applyMiddleware,
  type Middleware,
  type UnknownAction,
} from "redux";

// Approach 3b — CLASSIC Redux (NO Redux Toolkit).
// This is everything RTK's createSlice + configureStore generate FOR you, written by
// hand. Open list-slice.ts side by side: same behavior, far more ceremony.

export type Item = { id: string; text: string };
type State = { items: Item[] };

// 1) Action type constants — string tags for each kind of change.
const ADD = "list/add";
const REMOVE = "list/remove";

// 2) Action creators — functions that build the plain { type, payload } objects you
//    dispatch. (RTK generates these from your reducer names.)
export const add = (text: string) => ({
  type: ADD,
  payload: { id: crypto.randomUUID(), text } as Item,
});
export const remove = (id: string) => ({ type: REMOVE, payload: id });

// 3) The reducer — given the old state + an action, return a BRAND-NEW state. You copy
//    immutably by hand here: there is no Immer, so note the spread and the filter.
const initialState: State = { items: [] };
function listReducer(state: State = initialState, action: UnknownAction): State {
  switch (action.type) {
    case ADD:
      return { items: [...state.items, action.payload as Item] };
    case REMOVE:
      return { items: state.items.filter((it) => it.id !== action.payload) };
    default:
      return state;
  }
}

// 4) Middleware, wired by hand with applyMiddleware. (On the /redux route, RTK adds
//    its historyMiddleware for you via configureStore's `middleware` option — same
//    idea, less plumbing.) This one just logs every action to the console.
const logger: Middleware = () => (next) => (action) => {
  console.log("[classic redux] dispatching", (action as UnknownAction).type);
  return next(action);
};

// 5) Assemble the store. combineReducers nests our slice under `list` (so selectors
//    read `s.list.items`, matching the RTK route). createStore is now DEPRECATED —
//    Redux itself points you at RTK — so we use the legacy_ alias. That nudge IS the
//    lesson: this file is why RTK exists.
const rootReducer = combineReducers({ list: listReducer });
export const store = createStore(rootReducer, applyMiddleware(logger));

export type RootState = ReturnType<typeof store.getState>;
