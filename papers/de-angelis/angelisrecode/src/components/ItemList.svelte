<script>
  import { count, checkedStates } from "../stores"; // Import the writable stores
  import { onMount } from 'svelte';

  // acepting data
  export let options = [];

  // Local variable to track current checkbox states
  let localCheckedStates = {};

  // Subscribe to the global checkedStates store to keep track of checked items
  let unsubscribe;
  onMount(() => {
    unsubscribe = checkedStates.subscribe(value => {
      localCheckedStates = value; // Update local state based on the store
    });
  });

  // Cleanup subscription on component destroy
  import { onDestroy } from 'svelte';
  onDestroy(() => {
    unsubscribe();
  });

  // Function to update the global count and local checked states
  function updateCheckedState(opt, event) {
    const isChecked = event.target.checked;
    localCheckedStates[opt.id] = isChecked; // Update local state

    // Update the checked states in the store
    checkedStates.update(currentStates => {
      const newState = { ...currentStates, [opt.id]: isChecked };

      // Calculate the new count of checked boxes
      const newCount = Object.values(newState).filter(Boolean).length;

      // Update the global count store
      count.set(newCount);

      return newState;
    });
  }
</script>

<!-- Display total number of checked items -->
<!-- <p style="color: azure;">Total checked across lists: {$count}</p> -->

<div class="table-body">
  {#each options as opt (opt.id)}
    <div class="checkbox-item">
      <input
        type="checkbox"
        id={`item` + opt.id}
        checked={localCheckedStates[opt.id] || false}  
        on:change={(e) => updateCheckedState(opt, e)}
      />
      <label for={`item` + opt.id}>{opt.text}</label>
    </div>
  {/each}
</div>

<style>
  /* Styling the table body (blue part) */
  .table-body {
    background-color: #d5eaf6; /* Light blue */
    padding: 20px;
    border-radius: 0 0 10px 10px;
  }

  /* Style for checkbox items */
  .checkbox-item {
    display: flex;
    align-items: center;
    margin-bottom: 15px;
  }

  .checkbox-item input[type="checkbox"] {
    margin-right: 10px;
    width: 20px;
    height: 20px;
    border-radius: 4px;
    border: 2px solid #333;
  }

  .checkbox-item input[type="checkbox"]:checked {
    background-color: #6d519b; /* Purple color for checked boxes */
    border-color: #6d519b;
  }

  .checkbox-item label {
    font-size: 16px;
    color: #333;
  }
</style>