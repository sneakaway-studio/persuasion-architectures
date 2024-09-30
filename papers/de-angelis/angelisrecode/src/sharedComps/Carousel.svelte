<script>
  let currentSlide = 0;
  export let items = []; // List of tab names
  export let itemLists = []; // Array of item lists (content for each tab)

  // Show the next slide
  function nextSlide() {
    currentSlide = (currentSlide + 1) % items.length;
  }

  // Show the previous slide
  function prevSlide() {
    currentSlide = (currentSlide - 1 + items.length) % items.length;
  }
</script>

<div class="carousel">
  <button on:click={prevSlide} class="arrow prev-arrow">❮</button>

  <div class="slide">
    <!-- Tabs navigation -->
    <div class="tabs-header">
      <ul>
        {#each items as item, index}
          <li
            on:click={() => (currentSlide = index)}
            class={item === items[currentSlide] ? "active" : ""}
          >
            {item}
          </li>
        {/each}
      </ul>
    </div>

    <!-- Conditionally render the content for the current slide -->
    {#if currentSlide === 0}
      <slot name="slide-0"></slot>
    {:else if currentSlide === 1}
      <slot name="slide-1"></slot>
    {:else if currentSlide === 2}
      <slot name="slide-2"></slot>
    {:else if currentSlide === 3}
      <slot name="slide-3"></slot>
    {/if}

    <!-- Conditionally render the submit button if the active tab is the last one -->
    {#if currentSlide === items.length - 1}
      <div class="submit-container">
        <button on:click={handleSubmit}>Submit</button>
      </div>
    {/if}
  </div>

  <button on:click={nextSlide} class="arrow next-arrow">❯</button>
</div>

<style>
  .carousel {
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    flex-direction: column;
  }
  .slide {
    /* TODO: adjust width for responsiveness */
    width: 800px;
    overflow: hidden;
    text-align: center;
  }
  .tabs-header {
    display: flex;
    background-color: #e0e0e0;
    border-radius: 10px 10px 0 0;
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
  .active {
    background-color: #bddff3;
    color: #333;
    border-bottom: 2px solid #bddff3;
  }
  .submit-container {
    text-align: center;
    margin-top: 20px;
  }
  button {
    padding: 10px 20px;
    font-size: 16px;
    background-color: #6d519b;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  button:hover {
    background-color: #5a4286;
  }
  .arrow {
    cursor: pointer;
    background: none;
    border: none;
    font-size: 2rem;
    padding: 3rem;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    color: azure;
  }
  .prev-arrow {
    left: -40px;
  }
  .next-arrow {
    right: -40px;
  }
</style>
