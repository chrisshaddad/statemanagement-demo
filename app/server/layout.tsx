"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

// Approach — TanStack Query (server state).
// QueryClientProvider gives the route a cache for server data. We create the client
// once (useState) so it survives re-renders, and scope it to this route only.
export default function ServerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [client] = useState(() => new QueryClient());
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
