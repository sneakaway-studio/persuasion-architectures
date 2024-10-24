<script>
  import { count } from "../stores";
  import { results } from "../data";
</script>

<!-- Display the count
<p style="color: azure;">Total checked boxes: {$count}</p> -->

<div>
  {#if $count >= 0 && $count <= 9}
    <div class="wrap">
      <img
        src={results[0].media.image}
        alt="An aerial view of a large group of people standing together to form the shape of an arrow pointing to the right."
      />

      <small style="clear: right;">
        <a href={results[0].credit_url}>Media Credits:</a>
        {results[0].credit}
      </small>
    </div>

    <h2>{results[0].title}</h2>
    <p>{results[0].description}</p>
  {:else if $count >= 10 && $count <= 19}
    <div class="wrap">
      <img
        src={results[1].media.image}
        alt="An icon of a group of people huddled together with an icon of four out five star rating and a thumbs up icon above them."
      />

      <small>
        <a href={results[1].credit_url}>Media Credits:</a>
        {results[1].credit}
      </small>
    </div>

    <h2>{results[1].title}</h2>
    <p>{results[1].description}</p>
  {:else if $count >= 20 && $count <= 28}
    <div class="wrap">
      <img
        src={results[2].media.image}
        alt="A character outlined in the middle with social icons such as a money bag, idea light bulbs, people conversing, etc. around it."
      />
      <small>
        <a href={results[2].credit_url}>Media Credits:</a>
        {results[2].credit}
      </small>
    </div>

    <h2>{results[2].title}</h2>
    <p>{results[2].description}</p>
  {/if}
</div>

<style>
  /* spacing */
  h2,
  p,
  img {
    margin-top: 1.5rem;
  }

  /* for similar img sizing */
  img {
    width: 300px;
    float: right;
  }
</style>
