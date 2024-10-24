// stores.js
import { writable } from 'svelte/store';

// Create a writable store for the checkbox count
export const count = writable(0);

// Create a writable store to track checked states
export const checkedStates = writable({});
