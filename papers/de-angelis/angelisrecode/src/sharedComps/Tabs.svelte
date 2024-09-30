<script>
  import { createEventDispatcher } from "svelte";

  // accepting props:
  export let activeItem;
  export let items;

  const dispatch = createEventDispatcher();

  // Function to handle the submit action
  function handleSubmit() {
    dispatch("submit"); // Dispatch a submit event
  }
</script>

<div class="tabs-header">
  <ul>
    {#each items as item}
      <li
        on:click={() => {
          dispatch("changeTab", item);
        }}
      >
        <div class:active={item === activeItem}>{item}</div>
      </li>
    {/each}
  </ul>
</div>

<div class="item-list">
  <slot></slot>
</div>

<!-- Conditionally render the submit button if the active tab is the last one -->
{#if activeItem === items[items.length - 1]}
  <div class="submit-container">
    <button on:click={handleSubmit}>Submit</button>
  </div>
{/if}

<!-- /* TODO: 
 1. current tab should be blue
 2. rounded corner for each tab */ -->
<style>
  /* Tabs styling (Grey part) */
  .tabs-header {
    display: flex;
    background-color: #e0e0e0; /* Light grey background for the tabs */
    border-radius: 10px 10px 0 0; /* Rounded top corners */
    overflow: hidden;
    justify-content: space-around;
  }

  ul {
    display: flex;
    justify-content: center;
    padding: 0;
    list-style-type: none;
    width: 100%;
  }

  li {
    flex: 1;
    margin: 0 16px;
    font-size: 18px;
    color: #525252;
    cursor: pointer;
    text-align: center;
    padding: 10px;
  }

  /* Active Tab Styling */
  .active {
    background-color: #bddff3; /* White background for active tab */
    color: #333;
    border-bottom: 2px solid #bddff3; /* Light blue border */
  }

  /* Styling for submit button container */
  .submit-container {
    text-align: center; /* Center the button */
    margin-top: 20px; /* Space above the button */
  }

  button {
    padding: 10px 20px; /* Padding for the button */
    font-size: 16px; /* Font size */
    background-color: #6d519b; /* Button background color */
    color: white; /* Button text color */
    border: none; /* Remove default border */
    border-radius: 5px; /* Rounded corners for the button */
    cursor: pointer; /* Pointer cursor on hover */
  }

  button:hover {
    background-color: #5a4286; /* Darker shade on hover */
  }
</style>
