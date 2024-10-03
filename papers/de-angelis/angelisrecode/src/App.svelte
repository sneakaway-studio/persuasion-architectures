<script>
  import InteractiveTitle from "./components/InteractiveTitle.svelte";
  import Carousel from "./components/Carousel.svelte";
</script>

<!-- content to render -->
<InteractiveTitle />

<main>
  <h4 style="color: whitesmoke;">
    There are countless examples of situations that take advantage of social
    proof. From the situations below, select boxes of ones you relate with or
    have experienced to discover the impact this phenomenon has on you.
  </h4>
  
<!-- carousel contains items + results as well -->
  <Carousel/>
</main>

<style>
  main {
    text-align: center;
    padding: 1em;
    max-width: 500px;
    margin: 0 auto;
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
