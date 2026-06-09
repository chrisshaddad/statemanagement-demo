import Link from "next/link";

// Landing page: one sentence per approach so students know what each route demonstrates.
export default function Home() {
  return (
    <main>
      <h1>State Management, Five Ways</h1>
      <p className="note">
        The exact same feature — a shared list you can add to and delete from —
        built five different ways, one per route. The UI is identical
        everywhere; only the code that holds the list changes. Click through and
        compare. (<strong>/server</strong> is the deliberate odd-one-out: a
        different <em>kind</em> of state.)
      </p>

      <div className="cards">
        <Link className="card" href="/local">
          <strong>/local</strong> — useState + prop drilling. The baseline that
          shows <em>the pain</em> global state solves.
        </Link>
        <Link className="card" href="/context">
          <strong>/context</strong> — React Context API. Built into React: wrap
          in a Provider, read with a hook.
        </Link>
        <Link className="card" href="/zustand">
          <strong>/zustand</strong> — Zustand. The store <em>is</em> the hook —
          no Provider, no boilerplate.
        </Link>
        <Link className="card" href="/redux">
          <strong>/redux</strong> — Redux Toolkit. A slice defines state +
          actions; selectors read, dispatch writes.
        </Link>
        <Link className="card" href="/redux-classic">
          <strong>/redux-classic</strong> — the same store written by hand (no
          RTK). See exactly what Redux Toolkit saves you.
        </Link>
        <Link className="card" href="/mobx">
          <strong>/mobx</strong> — MobX. Mutate state directly; observer
          components react automatically.
        </Link>
        <Link className="card" href="/server">
          <strong>/server</strong> — TanStack Query. A different <em>kind</em>{" "}
          of state: data that lives on the server.
        </Link>
      </div>
    </main>
  );
}
