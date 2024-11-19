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
	<button class="btn btn-primary" on:click={restartGame} aria-label="Restart Game">
		<i class="bi bi-arrow-clockwise"></i>
		 Restart Game
	</button>
</div>
