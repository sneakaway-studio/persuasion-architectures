<script>
  import Title from "./components/Title.svelte";
  import GameUI from "./components/gameUI.svelte";
</script>

<!-- content to render -->
<Title />
<main>
  <GameUI>
    <!-- invokes Modal.svelte within -->
    <!-- invokes gameLogic.svelte within -->
  </GameUI>
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
