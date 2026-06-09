"use client";

import { useState, useSyncExternalStore } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  add,
  remove,
  jumpTo,
  addAfterDelay,
  subscribeHistory,
  getHistory,
  type RootState,
  type AppDispatch,
} from "./list-slice";

// useSelector reads a piece of the store; useDispatch sends actions to change it.

function AddItem() {
  const dispatch = useDispatch();
  const [text, setText] = useState("");
  return (
    <form
      className="add-form"
      onSubmit={(e) => {
        e.preventDefault();
        const t = text.trim();
        if (!t) return;
        dispatch(add({ id: crypto.randomUUID(), text: t }));
        setText("");
      }}
    >
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Add an item…"
      />
      <button type="submit">Add</button>
    </form>
  );
}

function ItemList() {
  const items = useSelector((s: RootState) => s.list.items);
  const dispatch = useDispatch();
  return (
    <>
      <p className="count-badge">{items.length} item(s)</p>
      {items.length === 0 ? (
        <p className="empty">Nothing here yet — add something.</p>
      ) : (
        <ul className="items">
          {items.map((it) => (
            <li key={it.id}>
              <span>{it.text}</span>
              <button
                className="del"
                aria-label="delete"
                onClick={() => dispatch(remove(it.id))}
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

// BONUS 1 — a thunk for async work. Typed as AppDispatch so TS knows dispatch can
// accept a function (a thunk), not just a plain action object.
function ThunkBonus() {
  const dispatch = useDispatch<AppDispatch>();
  return (
    <button
      className="bonus"
      onClick={() => dispatch(addAfterDelay("⏰ added after 1s"))}
    >
      Add an item after 1s (thunk)
    </button>
  );
}

// BONUS 2 — time travel. Because every change is a logged action, we can show the
// timeline and jump back to any past state by dispatching that snapshot with jumpTo.
function History() {
  const dispatch = useDispatch();
  const history = useSyncExternalStore(
    subscribeHistory,
    getHistory,
    getHistory, // server snapshot (empty history during SSR)
  );

  if (history.length === 0) {
    return <p className="empty">No actions yet — add or delete an item.</p>;
  }

  return (
    <div className="history">
      <ol>
        {history.map((h) => (
          <li key={h.id}>
            <span>
              #{h.id} {h.label} → {h.items.length} item(s)
            </span>
            <button className="jump" onClick={() => dispatch(jumpTo(h.items))}>
              jump here
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}

export default function ReduxPage() {
  return (
    <main>
      <h1>/redux — Redux Toolkit</h1>
      <div className="list">
        <AddItem />
        <ItemList />
      </div>
      <p className="note">
        Redux Toolkit removes the classic boilerplate. <code>createSlice</code>{" "}
        defines state + actions; <code>useSelector</code> reads,{" "}
        <code>useDispatch</code> sends actions.
      </p>

      <h2>Bonus — thunk (async)</h2>
      <div className="list">
        <ThunkBonus />
      </div>
      <p className="note">
        The Add form dispatches a plain action that changes state immediately. A{" "}
        <em>thunk</em> dispatches a <em>function</em> instead — it can wait (or
        fetch), then dispatch the real <code>add()</code>. Click and the item
        appears a second later. Thunks are where side effects live.
      </p>

      <h2>Bonus — action history &amp; time travel</h2>
      <p className="note">
        Because <strong>every</strong> change is a dispatched action, Redux can
        record the whole timeline. Add and delete a few items, then hit{" "}
        <em>“jump here”</em> on any past entry — the list snaps back to that
        state. This is what Redux DevTools&apos; time-travel debugging is built
        on; no other approach here gives you it for free.
      </p>
      <History />
    </main>
  );
}
