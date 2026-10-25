import { useSyncExternalStore } from "react";

// Your fairy's name and look. Kept in memory for now (resets when the app reloads); persist it with the user profile later.
export type FairyLook = { wing: string; dress: string; hair: string };
export type Fairy = { name: string; look: FairyLook };

export const FAIRY_DEFAULT: Fairy = { name: "Pixie", look: { wing: "#BFA8F0", dress: "#F29BB8", hair: "#6B3F2A" } };

let current: Fairy = FAIRY_DEFAULT;
const listeners = new Set<() => void>();

export function setFairy(next: Fairy) {
  current = next;
  listeners.forEach((l) => l());
}

export function useFairy(): Fairy {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => {
        listeners.delete(cb);
      };
    },
    () => current,
    () => current
  );
}

// Swatches from the "Make your fairy" design.
export const WING_SWATCHES = [
  { c: "#BFA8F0", name: "Violet wings" },
  { c: "#9ED9C0", name: "Mint wings" },
  { c: "#F5B5CB", name: "Pink wings" },
  { c: "#F7DE8E", name: "Gold wings" },
];
export const DRESS_SWATCHES = [
  { c: "#F29BB8", name: "Rose dress" },
  { c: "#7FB8E8", name: "Sky dress" },
  { c: "#8ED1A5", name: "Moss dress" },
  { c: "#E3B04B", name: "Gold dress" },
];
export const HAIR_SWATCHES = [
  { c: "#6B3F2A", name: "Brown hair" },
  { c: "#2B2347", name: "Midnight hair" },
  { c: "#D97A4A", name: "Copper hair" },
  { c: "#F2D27A", name: "Blonde hair" },
];
