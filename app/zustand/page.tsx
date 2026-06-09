"use client";

import { useState } from "react";
import { useList } from "./list-store";

// Each component selects just the slice it needs from the store hook.

function AddItem() {
  const add = useList((s) => s.add);
  const [text, setText] = useState("");
  return (
    <form
      className="add-form"
      onSubmit={(e) => {
        e.preventDefault();
        const t = text.trim();
        if (!t) return;
        add(t);
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
  const items = useList((s) => s.items);
  const remove = useList((s) => s.remove);
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
                onClick={() => remove(it.id)}
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

export default function ZustandPage() {
  return (
    <main>
      <h1>/zustand — Zustand</h1>
      <div className="list">
        <AddItem />
        <ItemList />
      </div>
      <p className="note">
        The store <strong>is</strong> the hook. No Provider, no context — call{" "}
        <code>useList()</code> anywhere and select the piece you need.
      </p>
    </main>
  );
}
