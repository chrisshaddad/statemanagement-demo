"use client";

import { Provider } from "react-redux";
import { store } from "./list-slice";

// The Redux <Provider> needs to run on the client, so this wrapper is a client
// component. It scopes the store to this route only.
export default function ReduxLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Provider store={store}>{children}</Provider>;
}
