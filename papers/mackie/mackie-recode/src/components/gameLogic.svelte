<script>
  import { images } from "../data";
  import { randomIndices } from "../indexRandomizer";

  export let onGameCompleted;
  export let matchCount;
  let selectedTiles = [];
  $: randomIndices;

  //showing tile +
  //logging tile selections
  function handleTileClick(tileId) {
    // Prevent double-clicking on the same tile
    if (selectedTiles.includes(tileId)) return;

    //update reveal status
    images.update((currentTiles) =>
      currentTiles.map((tile) =>
        tile.id === tileId ? { ...tile, isRevealed: !tile.isRevealed } : tile
      )
    );

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
      images.update((currentTiles) =>
        currentTiles.map((tile) =>
          tile.id === firstTile || tile.id === secondTile
            ? { ...tile, matched: true }
            : tile
        )
      );
      matchCount += 1;

      if (matchCount === 8) {
        onGameCompleted(); // triggers pop up
      }
    } else {
      // hide tiles
      setTimeout(() => {
        images.update((currentTiles) =>
          currentTiles.map((tile) =>
            tile.id === firstTile || tile.id === secondTile
              ? { ...tile, isRevealed: false }
              : tile
          )
        );
      }, 500);
    }

    // reset selection record
    selectedTiles = [];
  }
</script>

<!-- render image tiles -->
<div class="container-fluid">
  <div class="row justify-content-center">
    {#each $randomIndices as index}
      <div
        class="col-12 col-sm-4 col-md-3 col-lg-3 col{$images[index]
          .id} d-flex justify-content-center g-0 colClass"
      >
        <button
          class="btn btn-link p-1 no-border"
          on:click={() => handleTileClick($images[index].id)}
          disabled={$images[index].matched}
        >
          <div
            class="card {$images[index].isRevealed ? 'revealed' : ''} {$images[
              index
            ].matched
              ? 'matched'
              : ''} mb-1"
          >
            {#if $images[index].isRevealed}
              <div
                class="image"
                style="background-image: url({$images[index]
                  .img_url}); width:100%;"
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
    height: 150px;
    width: 160px;
    background-repeat: no-repeat;
    background-size: cover;
  }

  .no-border,
  .btn-link {
    border: none !important;
    background-color: transparent !important;
    color: inherit;
  }
  .card {
    min-height: 160px;
    width: 160px;
    background-color: lightgray;
    border-radius: 0%;
  }

  .card:hover {
    transform: scale(1.05);
  }

  .card.revealed {
    background-color: transparent; /* remove bg upon revelation */
  }

  .matched {
    border-width: 4px;
    border-color: rgba(34, 168, 92, 0.7);
  }
</style>
