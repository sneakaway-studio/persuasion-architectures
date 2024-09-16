<script>
  import { createEventDispatcher } from "svelte";

  // accepting props:
  export let activeItem;
  export let items;

  const dispatch = createEventDispatcher();
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
</style>