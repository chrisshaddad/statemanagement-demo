"use client";

import { useQuery } from "@tanstack/react-query";

type User = { id: number; name: string };

// useQuery fetches and caches server data, handing back loading/error/data for us.

function UserList() {
  const { data, isPending, error } = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: () => fetch("/api/users").then((r) => r.json()),
  });

  if (isPending) return <p className="note">Loading users…</p>;
  if (error) return <p className="note">Something went wrong.</p>;

  return (
    <ul className="users">
      {data.map((u) => (
        <li key={u.id}>{u.name}</li>
      ))}
    </ul>
  );
}

export default function ServerPage() {
  return (
    <main>
      <h1>/server — TanStack Query</h1>
      <UserList />
      <p className="note">
        This is a different <strong>kind</strong> of state — data that lives on
        the server. The library handles loading, caching, and refetching for
        you. Don&apos;t put this in Redux.
      </p>
    </main>
  );
}
