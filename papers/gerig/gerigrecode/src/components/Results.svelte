<script>
  import { count } from "../stores";
  import { results } from "../data";
</script>

<div>
  {#if $count >= 0 && $count <= 4}
    <div class="wrap">
      <img src={results[0].media.image} />

      <small style="clear: right;">
        <a href={results[0].credit_url}>Media Credits:</a>
        {results[0].credit}
      </small>
    </div>

    <h2>{results[0].title}</h2>
    <p>{results[0].description}</p>
  {:else if $count >= 5 && $count <= 8}
    <div class="wrap">
      <img src={results[1].media.image} />

      <small style="clear: right;">
        <a href={results[1].credit_url}>Media Credits:</a>
        {results[1].credit}
      </small>
    </div>

    <h2>{results[1].title}</h2>
    <p>{results[1].description}</p>
  {:else if $count >= 9 && $count <= 12}
    <div class="wrap">
      <img src={results[2].media.image} />

      <small style="clear: right;">
        <a href={results[2].credit_url}>Media Credits:</a>
        {results[2].credit}
      </small>
    </div>

    <h2>{results[2].title}</h2>
    <p>{results[2].description}</p>
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
