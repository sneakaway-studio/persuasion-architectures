<script>
  import ImageTile from "./imageTile.svelte";
  import { images } from "../data";

  //todo: add actual mathcing logic

  function handleTileClick(tileId) {
    images.update((currentTiles) =>
      currentTiles.map((tile) =>
        tile.id === tileId ? { ...tile, isRevealed: !tile.isRevealed } : tile
      )
    );
    console.log("tile clicked logic.svelte");
  }
</script>

<div class="game-board">
  {#each $images as imgtile (imgtile.id)}
    <!-- <ImageTile
        imageUrl={imgtile.img_url}
        isRevealed={imgtile.isRevealed}
      
        on:click={() => handleTileClick(imgtile.id)}
      /> -->

      <button on:click={() => handleTileClick(imgtile.id)}>
        <div class="card {imgtile.isRevealed ? 'revealed' : ''} mb-2">
          {#if imgtile.isRevealed}
            <!-- <img src={imgtile.img_url} alt="Matching tile" /> -->
             <div class="image" style="background-image: url({imgtile.img_url});">
             </div>
          {/if}
        </div>
      </button>
  {/each}
</div>

<style>
  .image{
    height: 200px;
    width: 200px;
    background-repeat: no-repeat;
    background-size: contain;
  }

  .game-board {
    display: grid;
    grid-template-columns: auto auto auto auto;
    gap: 10px;
    max-width: 600px; /* TO OD: look into*/
    margin: 0 auto;
  }


  .card {
    min-height: 100px;
    max-width: 100px; /* Adjust width to be square */
    background-color: lightgray; /* Placeholder color */
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .card:hover {
    transform: scale(1.05);
  }

  .card.revealed {
    background-color: transparent; /* remove bg upon revelation */
  }
</style>
