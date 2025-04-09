import type { EntryGenerator } from "../../../.svelte-kit/types/src/routes/[tag]/$types";
import { utilItems } from "$state/util-items.svelte";

export const entries: EntryGenerator = () => {
  return  utilItems.map(e => e.items).filter(Boolean).flat().map(e => ({tag: e.tag}));
};

export const ssr = false;
export const prerender = true;
export const csr = true;