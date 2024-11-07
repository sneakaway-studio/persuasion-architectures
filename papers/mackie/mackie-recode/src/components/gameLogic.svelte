<!-- TODOs
 3. code review - refine 
-->
<script>
  import { images } from "../data";
  import Modal from "./Modal.svelte";

  let selectedTiles = [];
  let matchCount = 0;
  let gameCompleted = false;

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
    // Prevent double-clicking on the same tile
    if (selectedTiles.includes(tileId)) return;

    //update reveal status
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
      images.update((currentTiles) =>
        currentTiles.map((tile) =>
          tile.id === firstTile || tile.id === secondTile
            ? { ...tile, matched: true }
            : tile
        )
      );
      matchCount += 1;

      if (matchCount === 8) {
        gameCompleted = true; // triggers pop up
      }
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
      }, 500);
    }

    // reset selection record
    selectedTiles = [];
  }

  // Function to restart the game
  function restartGame() {
    // Reset selected tiles, matched count, and completion flag
    selectedTiles = [];
    matchCount = 0;
    gameCompleted = false;

    // reset tile stats
    images.update((currentTiles) =>
      currentTiles.map((tile) => ({
        ...tile,
        isRevealed: false,
        matched: false,
      }))
    );
  }

  // Close the modal function (without restarting the game)
  function closeModal() {
    gameCompleted = false; // Simply hide the modal without restarting the game
  }
</script>

<!-- Display the pop-up message if the game is completed -->
<!-- Modal component -->
<Modal {gameCompleted} resetBoard={restartGame} closeOnly={closeModal} />

<!-- bootstrap grid  -->
<div class="container-fluid">
  <div class="row justify-content-center">
    <!-- {#each $images as imgtile (imgtile.id)} -->

    <!-- including ramdomization -->
    <!-- {#each $images.slice().sort(shuffler) as imgtile (imgtile.id)} -->
    {#each randomIndices as index}
      <!-- bootstrap column  -->
      <!-- hm. todo. confirm; slight issue bw small and medium -->
      <div
        class="col-sm-6 col-md-3 col-lg-3 col{$images[index]
          .id} d-flex justify-content-center"
      >
        <button
          class="btn btn-link p-1 no-border"
          on:click={() => handleTileClick($images[index].id)}
        >
          <div
            class="card {$images[index].isRevealed ? 'revealed' : ''} {$images[
              index
            ].matched
              ? 'matched'
              : ''} mb-1"
          >
            {#if $images[index].isRevealed}
              <!-- <img src={imgtile.img_url} alt="Matching tile" /> -->
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
