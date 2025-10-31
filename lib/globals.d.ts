import type EphemeralStore from "./store";

declare global {
  // eslint-disable-next-line no-var
  var __sharex_store: EphemeralStore | undefined;
}

export {};
