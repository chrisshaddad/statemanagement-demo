"use client";

import { useState } from "react";
import { useList } from "./list-context";

// No props passed anywhere — each component reaches into the context directly.

function AddItem() {
  const { add } = useList();
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
  const { items, remove } = useList();
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

export default function ContextPage() {
  return (
    <main>
      <h1>/context — React Context API</h1>
      <div className="list">
        <AddItem />
        <ItemList />
      </div>
      <p className="note">
        Built into React. Create context → wrap in Provider → read with a hook.
        No prop drilling: AddItem and ItemList grab what they need straight from{" "}
        <code>useList()</code>.
      </p>
    </main>
  );
}
