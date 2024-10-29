<script>
  export let imageUrl;
  export let isRevealed = false;
  
  export let onClick; //fyi, may not need to be a prop

  function handleClick() {
    if (!isRevealed) {
      onClick(); // Call the provided click function
      
      console.log("click recon in tile.svelte")
    }
  }
</script>

<button on:click={handleClick}>
<div class="card {isRevealed ? 'revealed' : ''} mb-2">
    {#if isRevealed}
      <img src={imageUrl} alt="Matching tile" />
    {/if}
</div>
</button>

<style>
  /* .car {
    width: 100px;
    height: 100px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    overflow: hidden;
    transition: transform 0.2s ease;
    background-color: #ccc; /* Placeholder for hidden tile */
  /* } */ 

  .card{
    height: 100px;
  }

  .card:hover {
    transform: scale(1.05);
  }

  .card.revealed {
    background-color: transparent; /* Remove background when revealed */
  }

  /* .card img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  } */
</style>
