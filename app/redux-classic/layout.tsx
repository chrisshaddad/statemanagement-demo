"use client";

import { Provider } from "react-redux";
import { store } from "./list-store";

// Same react-redux <Provider> as the RTK route — the wiring on the React side is
// identical. The difference is entirely in list-store.ts.
export default function ReduxClassicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Provider store={store}>{children}</Provider>;
}
