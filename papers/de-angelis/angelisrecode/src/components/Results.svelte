<script>
  import { count } from "../stores";
  import { results } from "../data";
</script>

<!-- Display the count -->
<p style="color: azure;">Total checked boxes: {$count}</p>

<div>
  {#if $count >= 0 && $count <= 9}
  <img
	src={results[0].media.image}
	alt="An aerial view of a large group of people standing together to form the shape of an arrow pointing to the right. "
  />
    <h2>{results[0].title}</h2>
    <p>{results[0].description}</p>
    <!-- TODO: write proper alt Text.  -->
    <p>
      <a href={results[0].credit_url}>Media Credits:</a>
      {results[0].credit}
    </p>
  {:else if $count >= 10 && $count <= 19}
    <h2>{results[1].title}</h2>
    <p>{results[1].description}</p>
    <img
      src={results[1].media.image}
      alt="An icon of a group of people huddled together with an icon of four out five star rating and a thumbs up icon above them."
    />
    <p>
      <a href={results[1].credit_url}>Media Credits:</a>
      {results[1].credit}
    </p>
  {:else if $count >= 20 && $count <= 28}
    <h2>{results[2].title}</h2>
    <p>{results[2].description}</p>
    <img
      src={results[2].media.image}
      alt="A character outlined in the middle with social icons such as a money bag, idea light bulbs, people conversing, etc. around it."
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
