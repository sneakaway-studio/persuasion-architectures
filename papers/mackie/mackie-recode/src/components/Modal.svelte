<script>
  export let gameCompleted = false; // Prop to determine if the game is complete
  export let resetBoard; // Function to restart the game passed from the parent component
  export let closeOnly; // Function to close the modal without restarting the game, passed from parent
</script>

{#if gameCompleted}
  <!-- Show the modal only when the game is completed -->
  <div class="overlay">
    <div class="content">
      <h2>Congratulations!</h2>
      <p>You successfully completed the game!</p>
      <button on:click={closeOnly}>Close</button>
      <button on:click={resetBoard}>Restart Game</button>
    </div>
  </div>
{/if}

<style>
  /* Modal overlay */
  .overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5); /* Dimmed background */
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2; /* Ensure modal appears on top of other content */
  }

  /* Modal content box */
  .content {
    background-color: white;
    padding: 20px;
    text-align: center;
    width: 300px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  }

  .content h2 {
    margin-bottom: 10px;
    font-size: 24px;
    color: #333;
  }

  .content p {
    margin-bottom: 20px;
    font-size: 18px;
    color: #555;
  }

  .content button {
    padding: 8px 16px;
    font-size: 16px;
    cursor: pointer;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
  }

  .content button:hover {
    background-color: #0056b3;
  }
</style>
