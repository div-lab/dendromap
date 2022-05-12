import { writable } from "svelte/store";

export const globalLeafNodesObject = writable({ idMap: new Map(), array: [] });
export const globalClasses = writable([]);
