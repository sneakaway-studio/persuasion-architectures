<script>
  import Title from "./components/Title.svelte";
  import GameLogic from "./components/gameLogic.svelte";
</script>

<!-- content to render -->
<Title />
<main>
  <GameLogic></GameLogic>

  <!-- <div class="card" style="width: 18rem;">
	<img class="card-img-top" src="..." alt="Card image cap">
  </div> -->
</main>

<style>
  main {
    padding: 1em;
    max-width: 500px;
    margin: 0 auto;
    font-family: "PT Sans", sans-serif; /*body font*/
  }

  h4 {
    color: #333;
    margin-bottom: 20px;
  }

  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }
</style>
