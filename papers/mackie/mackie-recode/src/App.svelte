<script>
  import Title from "./components/Title.svelte";
  import GameLogic from "./components/gameLogic.svelte";
</script>

<!-- content to render -->
<Title />
<main>
  <GameLogic>
    <!-- invokes Modal.svelte within -->
  </GameLogic>
</main>

<style>
  main {
    padding: 1em;
    max-width: 100%;
    margin: auto auto;
    font-family: "PT Sans", sans-serif; /*body font*/
  }

  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }
</style>
