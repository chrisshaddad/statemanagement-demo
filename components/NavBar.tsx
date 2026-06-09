import Link from "next/link";

// Plain navigation links shared by every page (a Server Component — no state here).
export default function NavBar() {
  return (
    <nav>
      <Link href="/">Home</Link>
      <Link href="/local">/local</Link>
      <Link href="/context">/context</Link>
      <Link href="/zustand">/zustand</Link>
      <Link href="/redux">/redux</Link>
      <Link href="/redux-classic">/redux-classic</Link>
      <Link href="/mobx">/mobx</Link>
      <Link href="/server">/server</Link>
    </nav>
  );
}
