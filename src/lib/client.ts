import { writable, type Writable } from "svelte/store";
import type { Vyos } from "$lib/vyos";

export const vyos: Writable<Vyos> = writable()