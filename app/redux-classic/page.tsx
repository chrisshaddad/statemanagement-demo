"use client";

import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { add, remove, type RootState } from "./list-store";

// The COMPONENTS are identical to the /redux route — useSelector reads, useDispatch
// sends actions. Only the store file differs. That's the point: same React code, but
// look at how much more work list-store.ts was vs RTK's list-slice.ts.

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
        dispatch(add(t));
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

export default function ReduxClassicPage() {
  return (
    <main>
      <h1>/redux-classic — Redux without RTK</h1>
      <div className="list">
        <AddItem />
        <ItemList />
      </div>
      <p className="note">
        Same list, same React code as <code>/redux</code> — but open{" "}
        <code>list-store.ts</code>. Defining the store by hand took action-type
        constants, action creators, a <code>switch</code> reducer with manual
        immutable copies, <code>combineReducers</code>, and{" "}
        <code>applyMiddleware</code>. RTK&apos;s <code>createSlice</code>{" "}
        generates all of it — and <code>createStore</code> is now deprecated
        precisely to push you toward RTK.
      </p>
    </main>
  );
}
