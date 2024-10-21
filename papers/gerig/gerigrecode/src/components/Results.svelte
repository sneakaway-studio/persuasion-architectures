<script>
  import { count } from "../stores";
  import { results } from "../data";
</script>

<div>
  {#if $count >= 0 && $count <= 4}
  <img
	src={results[0].media.image}
  />
    <h2>{results[0].title}</h2>
    <p>{results[0].description}</p>
    <!-- TODO: write proper alt Text.  -->
    <p>
      <a href={results[0].credit_url}>Media Credits:</a>
      {results[0].credit}
    </p>
  {:else if $count >= 5 && $count <= 8}
    <h2>{results[1].title}</h2>
    <p>{results[1].description}</p>
    <img
      src={results[1].media.image}
    />
    <p>
      <a href={results[1].credit_url}>Media Credits:</a>
      {results[1].credit}
    </p>
  {:else if $count >= 9 && $count <= 12}
    <h2>{results[2].title}</h2>
    <p>{results[2].description}</p>
    <img
      src={results[2].media.image}
    />
    <p>
      <a href={results[2].credit_url}>Media Credits:</a>
      {results[2].credit}
    </p>
  {/if}
</div>

<style>
  /* spacing all elements */
  h2,
  p,
  img {
    margin-top: 1.5rem;
  }

  /* for similar img sizing; optional? */
  img {
    width: 300px;
	float: right;
  }
</style>
