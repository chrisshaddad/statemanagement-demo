# State Management, Five Ways

A small Next.js (App Router) project that builds the **same feature** — a shared list
you can add items to and delete from — several different ways, one per route. The UI
is identical everywhere; the only thing that changes is the code that holds the list.
Comparing the routes is the whole point: same problem, different tools.

| Route | Approach | Key files |
|---|---|---|
| `/local` | useState + prop drilling (the baseline) | `app/local/page.tsx` |
| `/context` | React Context API | `list-context.tsx`, `layout.tsx` |
| `/zustand` | Zustand | `list-store.ts` |
| `/redux` | Redux Toolkit (+ thunk & time-travel) | `list-slice.ts`, `layout.tsx` |
| `/redux-classic` | the same store by hand, **no RTK** | `list-store.ts`, `layout.tsx` |
| `/mobx` | MobX | `list-store.ts` |

Plus one deliberate odd-one-out:

| Route | Approach | Key files |
|---|---|---|
| `/server` | TanStack Query — *server* state, not client state | `layout.tsx`, `app/api/users/route.ts` |

Every list route splits into the same two pieces: **`AddItem`** (the "write" side — a
form that adds) and **`ItemList`** (the "read" side — shows the items and count, and
deletes). The interesting question on each route is: *how do those two separate
components share one list?*

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
```

Open each route and add/delete a few items. They behave identically — then read the
source for each to see how differently the state is wired.

---

## The approaches

### `/local` — useState + prop drilling

The starting point, and the problem the other routes solve.

The list lives in the page via `useState`. But the form and the list display are
separate components (`AddItem` and `ItemList`), with a `ListPanel` wrapping them. To
get the list down to where it's used, the page passes `items`, `add`, and `remove`
into `ListPanel` — which uses *none* of them and only forwards them to its children.

That forwarding of props through components that don't care about them is **prop
drilling**. Here it's only one level deep, so it's harmless. But if something far away
— say a cart badge in the NavBar — needed this list, you'd have to lift the state up
to a common ancestor and thread it down through every layer in between. That pain is
what the remaining approaches remove.

**Takeaway:** fine for state used in one small subtree; awkward once the same state is
needed in far-apart places.

### `/context` — React Context API

Built into React, no library. Three pieces in `list-context.tsx`:

- `createContext` makes a shared "channel."
- `ListProvider` holds the actual `useState` and puts `{ items, add, remove }` on the
  channel.
- `useList` is a hook to read it.

`layout.tsx` wraps the route in `<ListProvider>`, and now any component inside can
call `useList()` directly. Look at `page.tsx`: `AddItem` and `ItemList` take **no
props** — the list reaches them without being threaded through intermediates. The
pattern is *create → provide → consume*.

**Takeaway:** removes prop drilling with zero dependencies. But it isn't a performance
tool — when the value changes, *every* component reading the context re-renders. Fine
for small/infrequently-changing state.

### `/zustand` — Zustand

`create()` returns a hook, and that hook *is* the store (`list-store.ts`). Notice
what's missing from the folder: no Provider and no `layout.tsx`. The store is a plain
module-level singleton you import anywhere.

In `page.tsx`, components select just the slice they need: `useList((s) => s.items)`,
`useList((s) => s.add)`. Because of that selector, `AddItem` (which only grabs `add`)
doesn't re-render when the list changes — only `ItemList` does. Since the store lives
outside React's tree, its state also survives navigation between routes.

**Takeaway:** global client state with almost no ceremony, plus selective re-renders.

### `/redux` — Redux Toolkit

The most structured option, and the most code — but it buys things the others don't.

- `list-slice.ts`: `createSlice` bundles the state and the actions that change it in
  one object. The reducers look like they mutate state (`s.items.push(...)`), but RTK
  runs them through Immer, which turns that into a safe immutable update. `configureStore`
  assembles the slice into the central store.
- `layout.tsx`: a `<Provider>` wraps the route (a `'use client'` component, since it
  holds live state).
- `page.tsx`: reading and writing are deliberately split — `useSelector((s) => s.list.items)`
  reads, and you can't change state directly; you `dispatch(add(...))` to *send an
  action*. Every change flows through that one channel, which is what makes Redux
  predictable and traceable.

Two extras on this route show what that discipline enables:

- **Thunk (async).** The teal *"Add an item after 1s"* button dispatches a *function*
  instead of a plain action (`addAfterDelay` in `list-slice.ts`). The function waits,
  then dispatches the real `add()`. Thunks are where async work / side effects live;
  the thunk middleware ships inside Redux Toolkit, so there's nothing to install.
- **Action history & time travel.** Because every change is a logged action, a small
  `historyMiddleware` records each one and the state it produced. The history panel
  lists the timeline and lets you *jump* back to any past state (it dispatches that
  snapshot via `jumpTo`). This is the idea behind Redux DevTools' time-travel
  debugging — and the payoff for routing every change through one channel.

**Takeaway:** more boilerplate, but central, traceable, time-travelable state. Worth
it for large apps and teams.

### `/redux-classic` — the same store, without RTK

The "before" picture. Same list, same React components as `/redux` — but
`list-store.ts` is written by hand, so you can see exactly what Redux Toolkit
generates for you:

1. action type constants (`const ADD = "list/add"`)
2. action creators that build the `{ type, payload }` objects
3. a `switch` reducer that returns a brand-new state — **no Immer**, so you copy by
   hand with spreads and `.filter` (miss one and you've mutated state)
4. `combineReducers` and `applyMiddleware` (a hand-wired `logger` — open the console
   to see it log each dispatch)
5. `createStore`, which is now *deprecated* — Redux itself nudges you toward RTK

The components in `page.tsx` are identical to the `/redux` route; all the extra code
lives in the store file. That contrast is the point: RTK collapses this whole file
into one `createSlice`. This route exists so you recognize the older style in
existing codebases — for new code, prefer RTK.

### `/mobx` — MobX

The opposite philosophy to Redux. In `list-store.ts`, a plain class is made reactive
with `makeAutoObservable`, and methods mutate state directly (`this.items.push(...)`)
— no actions, no dispatch. Like Zustand, it's a module singleton with no Provider.

The key piece is `observer` in `page.tsx`: it wraps a component and tracks which
observable fields that component *reads* while rendering. `ItemList` reads
`list.items`, so MobX re-renders it automatically when the list changes.

**Takeaway:** the least ceremony — change data, the UI follows. The trade-off is less
explicitness: when something *doesn't* update it's usually a value read outside an
`observer`, which is harder to trace than Redux's explicit flow. That same
"mutate-from-anywhere" freedom is also why MobX doesn't give you Redux's free
time-travel — there's no single channel to record.

### `/server` — a different *kind* of state

The odd-one-out, and intentionally so. Every route above holds **client state**: it
lives in the browser, you own it, it resets on refresh. This route shows **server
state** — data that lives elsewhere (a server, a database), loads asynchronously, can
be stale, and can fail.

`app/api/users/route.ts` is a stand-in backend (a route handler returning a hardcoded
list). `layout.tsx` provides a `QueryClientProvider` (a cache), and `page.tsx` fetches
with a single `useQuery` call that hands back `{ data, isPending, error }` — the
library models loading, caching, and refetching so you don't write that by hand.
Reload the page and you'll see a brief "Loading users…" flash; that asynchrony is the
whole distinction.

**Takeaway:** server data has a different shape than client state — don't put it in
Redux/Zustand/MobX. Use a tool built for it.

---

## Picking an approach

| Tool | Provider? | Ceremony | Reach for it when… |
|---|---|---|---|
| `useState` | no | none | state stays in one small subtree |
| Context | yes | low | a few components need it; it changes rarely |
| Zustand | no | very low | you want global client state with minimal fuss |
| Redux Toolkit | yes | medium | large app / team / you want traceable, time-travelable state |
| MobX | no | low | you prefer mutating state directly and letting the UI react |
| TanStack Query | yes | low | the data lives on a **server** |

Redux vs. MobX, the core philosophical contrast:

| | How you write state | How you change it | Time travel? |
|---|---|---|---|
| Redux | central store, explicit | `dispatch(action)` — ceremony, traceable | yes (one channel to record) |
| MobX | observable objects | mutate directly — implicit, reactive | no (mutate from anywhere) |

---

## Notes

- **`'use client'`:** App Router components are Server Components by default, and
  hooks/state/providers only run in the browser. So every stateful file here starts
  with `'use client'`. The NavBar and root layout don't — they hold no state.
- **Isolation:** each route owns its own store/provider, so the approaches never share
  state or interfere with each other.
