import { NextResponse } from "next/server";

// A tiny fake "server": a route handler returning hardcoded JSON. No database needed.
// In a real app this data would live in a backend — which is exactly the point of /server.
export async function GET() {
  const users = [
    { id: 1, name: "Ada Lovelace" },
    { id: 2, name: "Alan Turing" },
    { id: 3, name: "Grace Hopper" },
    { id: 4, name: "Dennis Ritchie" },
  ];
  return NextResponse.json(users);
}
