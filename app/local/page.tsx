"use client";

import { useState } from "react";

// Approach 0 — the BASELINE (the pain).
// The list lives in the page with useState, then items/add/remove are passed down as
// props through an intermediate component into AddItem and ItemList. That hand-off is
// "prop drilling."

type Item = { id: string; text: string };

// The "write" side: a small form that adds an item.
function AddItem({ add }: { add: (text: string) => void }) {
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

// The "read" side: shows the list and a count, and can delete an item.
function ItemList({
  items,
  remove,
}: {
  items: Item[];
  remove: (id: string) => void;
}) {
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

// An intermediate layer that uses NONE of this data — it only forwards the props
// down to the children that do. Every layer in between has to relay them. The smell.
function ListPanel({
  items,
  add,
  remove,
}: {
  items: Item[];
  add: (text: string) => void;
  remove: (id: string) => void;
}) {
  return (
    <div className="list">
      <AddItem add={add} />
      <ItemList items={items} remove={remove} />
    </div>
  );
}

export default function LocalPage() {
  const [items, setItems] = useState<Item[]>([]);
  const add = (text: string) =>
    setItems((list) => [...list, { id: crypto.randomUUID(), text }]);
  const remove = (id: string) =>
    setItems((list) => list.filter((it) => it.id !== id));

  return (
    <main>
      <h1>/local — useState + prop drilling</h1>
      {/* items + add + remove must travel down as props to every child that needs them */}
      <ListPanel items={items} add={add} remove={remove} />
      <p className="note">
        The list lives here in the page via <code>useState</code>. To reach the
        Add form and the list display, we hand <code>items</code>,{" "}
        <code>add</code> and <code>remove</code> down through{" "}
        <code>ListPanel</code> — which doesn&apos;t use any of them, it just
        forwards them. That&apos;s prop drilling. If the NavBar at the top needed
        this list too, we&apos;d have to lift state higher and thread it through
        every layer. The next routes fix this.
      </p>
    </main>
  );
}
