<!-- TODOs
 1. smoother transitions?
 2. color palette
 3. code review - refine 
 4. display counts
 5. reset option ?-->
<script>
  import ImageTile from "./imageTile.svelte";
  import { images } from "../data";

  let selectedTiles = [];

  // //to shuffle image order each rendering
  // function shuffler() {
  //   return Math.random() - 0.5;
  //   // - 0.5 allows for neg values
  // }

  function IndexGenerator() {
    // generate [0, 1, 2, ..., 15]
    // 16 = number of images
    const indices = Array.from({ length: 16 }, (_, i) => i);

    // - 0.5 allows for neg values
    return indices.sort(() => Math.random() - 0.5);
  }

  // Reactive random indices array
  $: randomIndices = IndexGenerator();

  //showing tile +
  //logging tile selections
  function handleTileClick(tileId) {
    images.update((currentTiles) =>
      currentTiles.map((tile) =>
        tile.id === tileId ? { ...tile, isRevealed: !tile.isRevealed } : tile
      )
    );
    //DEBUGUGING
    console.log("tile clicked logic.svelte");

    // record selected tile for match
    selectedTiles.push(tileId);

    // check for match when 2 tiles selected
    if (selectedTiles.length === 2) {
      checkForMatch(selectedTiles);
    }
  }

  // checking for tile matches
  function checkForMatch(tiles) {
    const [firstTile, secondTile] = tiles;

    //second digit in ID to match
    const firstMatchId = firstTile.toString().slice(1);
    const secondMatchId = secondTile.toString().slice(1);

    if (firstMatchId === secondMatchId) {
      //DEBUUGIGN
      console.log("Match found!");
    } else {
      // DEBUGGING
      console.log("No match. Hiding tiles.");
      // hide tiles
      setTimeout(() => {
        images.update((currentTiles) =>
          currentTiles.map((tile) =>
            tile.id === firstTile || tile.id === secondTile
              ? { ...tile, isRevealed: false }
              : tile
          )
        );
      }, 1000);
    }

    // resect selection record
    selectedTiles = [];
  }
</script>

<!-- bootstrap grid  -->
<div class="container">
  <div class="row">
    <!-- {#each $images as imgtile (imgtile.id)} -->

      <!-- including ramdomization -->
      <!-- {#each $images.slice().sort(shuffler) as imgtile (imgtile.id)} -->
      {#each randomIndices as index}

      <!-- bootstrap column  -->
      <div class="col-12 col-md-6 col-lg-3 col{$images[index].id}">
        <button
          class="btn btn-link p-2 no-border"
          on:click={() => handleTileClick($images[index].id)}
        >
          <div class="card {$images[index].isRevealed ? 'revealed' : ''} mb-2">
            {#if $images[index].isRevealed}
              <!-- <img src={imgtile.img_url} alt="Matching tile" /> -->
              <div
                class="image"
                style="background-image: url({$images[index].img_url});"
              ></div>
            {/if}
          </div>
        </button>
      </div>
    {/each}
  </div>
</div>

<style>
  .image {
    height: 200px;
    width: 200px;
    background-repeat: no-repeat;
    background-size: cover; /*only issues with lindsey lohan - change?*/
  }

  .no-border,
  .btn-link {
    border: none !important;
    background-color: transparent !important;
    color: inherit;
  }
  .card {
    min-height: 200px;
    width: 200px; /*doesn't cater to phone sizes - todo?*/
    /* max-width: 200px; */
    background-color: lightgray;
  }

  .card:hover {
    transform: scale(1.05);
  }

  .card.revealed {
    background-color: transparent; /* remove bg upon revelation */
  }
</style>
