<script>
  import Modal from "./Modal.svelte";
  import GameLogic from "./gameLogic.svelte";
  import { shuffleIndices } from "../indexRandomizer";
  import { images } from "../data";

  let gameCompleted = false;
  let matchCount = 0;

  function restartGame() {
    // reset match count, and completion flag
    matchCount = 0;
    gameCompleted = false;

    // reset image properties
    images.update((currentTiles) =>
      currentTiles.map((tile) => ({
        ...tile,
        isRevealed: false,
        matched: false,
      }))
    );

    //reshuffle images/ tiles
    shuffleIndices();
  }

  function handleGameCompleted() {
    gameCompleted = true;
  }

  // Adds a new breakpoint @ 400px
  // https://www.w3schools.com/howto/howto_js_media_queries.asp
  function changeBreakpoints(mql) {
    let eles = document.querySelectorAll(".colClass");
    if (mql.matches) {
      // If media query matches
      // document.body.style.backgroundColor = "yellow";
      eles.forEach((ele, i) => {
        ele.classList.remove("col-6");
        ele.classList.add("col-12");
      });
    } else {
      // document.body.style.backgroundColor = "pink";
      eles.forEach((ele, i) => {
        ele.classList.add("col-6");
        ele.classList.remove("col-12");
      });
    }
  }

  // Create a MediaQueryList object
  var mql = window.matchMedia("(max-width: 400px)");

  // Call listener function at run time
  changeBreakpoints(mql);

  // Attach listener function on state changes
  mql.addEventListener("change", function () {
    changeBreakpoints(mql);
  });

  //initial randomize
  shuffleIndices();
</script>

<!-- Display the pop-up message if the game is completed -->
<Modal
  {gameCompleted}
  resetBoard={restartGame}
  closeOnly={() => (gameCompleted = false)}
/>

<!-- display interactive game board -->
<GameLogic onGameCompleted={handleGameCompleted} {matchCount} />

<!-- Restart Button (placed below the game) -->
<div class="text-center mt-2">
  <button
    class="btn btn-primary"
    on:click={restartGame}
    aria-label="Restart Game"
  >
    <i class="bi bi-arrow-clockwise"></i> Restart Game
  </button>
</div>
