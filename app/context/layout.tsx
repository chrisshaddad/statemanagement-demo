import { ListProvider } from "./list-context";

// Wrap only this route in the provider, so the context state stays isolated here.
export default function ContextLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ListProvider>{children}</ListProvider>;
}
