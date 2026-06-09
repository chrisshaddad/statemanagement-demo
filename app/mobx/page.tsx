"use client";

import { useState } from "react";
import { observer } from "mobx-react-lite";
import { list } from "./list-store";

// observer() subscribes a component to whatever observable fields it reads while
// rendering. ItemList reads list.items, so it re-renders when the list changes —
// automatically, with no selector and no dispatch.

function AddItem() {
  const [text, setText] = useState("");
  return (
    <form
      className="add-form"
      onSubmit={(e) => {
        e.preventDefault();
        const t = text.trim();
        if (!t) return;
        list.add(t);
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

const ItemList = observer(function ItemList() {
  return (
    <>
      <p className="count-badge">{list.items.length} item(s)</p>
      {list.items.length === 0 ? (
        <p className="empty">Nothing here yet — add something.</p>
      ) : (
        <ul className="items">
          {list.items.map((it) => (
            <li key={it.id}>
              <span>{it.text}</span>
              <button
                className="del"
                aria-label="delete"
                onClick={() => list.remove(it.id)}
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}
    </>
  );
});

export default function MobxPage() {
  return (
    <main>
      <h1>/mobx — MobX</h1>
      <div className="list">
        <AddItem />
        <ItemList />
      </div>
      <p className="note">
        You mutate state directly — <code>list.items.push(...)</code> — and any{" "}
        <code>observer</code> component that read that data re-renders on its
        own. No actions, no selectors; MobX tracks who read what.
      </p>
    </main>
  );
}
