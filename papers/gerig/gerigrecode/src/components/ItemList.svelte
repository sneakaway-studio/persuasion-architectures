<script>
  import { count, checkedStates } from "../stores"; // Import the writable stores

  // acepting data
  export let options = [];

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

<!-- content to render / slides  -->
<div class="grid-container">
  {#each options as opt (opt.id)}
    <div class="checkbox-item">
      <label for={`item` + opt.id}>
      <img src={opt.img_url} alt="image {opt.text}" class="mb-2" />
        <br />
        <input
          type="checkbox"
          id={`item` + opt.id}
          checked={checkedStates[opt.id] || false}
          on:change={(e) => updateCheckedState(opt, e)}
        />
        {opt.text}</label
      >
    </div>
  {/each}
</div>

<style>
  .grid-container {
    display: grid;
    grid-template-columns: auto auto;
    background-color: #fff;
    padding: 10px;
  }

  img {
    width: 100%;
    max-width: 250px;
    height: auto;
  }

  /*checkbox items */
  .checkbox-item {
    margin-bottom: 5px;
    text-align: center;
    padding: 10px;
  }

  .checkbox-item input[type="checkbox"] {
    margin-right: 5px;
    width: 15px !important;
    height: 15px !important;
    border-radius: 4px;
    border: 2px solid #333;
  }

  .checkbox-item label {
    font-size: 18px;
    color: #333;
  }
</style>
