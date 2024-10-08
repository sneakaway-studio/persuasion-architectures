<script>
  import { count, checkedStates } from "../stores"; // Import the writable stores

  // acepting data
  export let options = [];
  export let disabled = false;

  // Function to update the global count and checked states
  function updateCheckedState(opt, event) {
    const isChecked = event.target.checked;

    // Update the checked states in the store
    checkedStates.update((currentStates) => {
      const newState = { ...currentStates, [opt.id]: isChecked };

      // Calculate the new count of checked boxes
      const newCount = Object.values(newState).filter(Boolean).length;

      // Update the global count store
      count.set(newCount);

      return newState;
    });
  }
</script>

<div class="table-body">
  {#each options as opt (opt.id)}
    <div class="checkbox-item">
		<label for={`item` + opt.id}>
      <input
        type="checkbox"
        id={`item` + opt.id}
        checked={checkedStates[opt.id] || false}
        on:change={(e) => !disabled && updateCheckedState(opt, e)}
        {disabled}
      />
      {opt.text}</label>
    </div>
  {/each}
</div>

<style>
  .table-body {
    background-color: #fff;
    padding: 15px;
    border-radius: 10px;
  }

  /*checkbox items */
  .checkbox-item {
    /* display: flex;
    align-items: center; */
    margin-bottom: 15px;
  }

  .checkbox-item input[type="checkbox"] {
    margin-right: 10px;
    width: 20px !important;
    height: 20px !important;
    border-radius: 4px;
    border: 2px solid #333;
  }

  .checkbox-item label {
    font-size: 18px;
    color: #333;
  }
</style>
