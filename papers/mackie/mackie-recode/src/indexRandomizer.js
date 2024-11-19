import { writable } from "svelte/store";

export const randomIndices = writable([]);

// Generate shuffled indices
function IndexGenerator() {
  const indices = Array.from({ length: 16 }, (_, i) => i);
  return indices.sort(() => Math.random() - 0.5);
}

// Shuffle the indices and update the store
export function shuffleIndices() {
  randomIndices.set(IndexGenerator());
}
