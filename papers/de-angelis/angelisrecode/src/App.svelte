<script>
  import Title from "./components/Title.svelte";
  import Carousel from "./components/Carousel.svelte";
</script>

<!-- content to render -->
<Title />

<!-- instructions -->
<main>
  <div class="container d-none d-md-block text-center">
    <div class="row">
      <h4 style="color: whitesmoke;">
        Select items that reflect your experience(s) to discover the impact this
        phenomenon has on you.
      </h4>
    </div>
  </div>

  <!-- carousel contains items + results as well -->
  <Carousel />
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
