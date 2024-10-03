<script>
  //TODO: image credits? ask prof. mundy
  import { count } from "../stores";
  import { results } from "../data";
</script>

<!-- Display the count -->
<p style="color: azure;">Total checked boxes: {$count}</p>

<div>
  {#if $count >= 0 && $count <= 9}
    <h2>{results[0].title}</h2>
    <p>{results[0].description}</p>
    <!-- TODO: write proper alt Text.  -->
    <img src={results[0].media.image} alt="33% score result" />
    
  {:else if $count >= 10 && $count <= 19}
    <h2>{results[1].title}</h2>
    <p>{results[1].description}</p>
    <img src={results[1].media.image} alt="34%+% score result" />

  {:else if $count >= 20 && $count <= 28}
    <h2>{results[2].title}</h2>
    <p>{results[2].description}</p>
    <img src={results[2].media.image} alt="68% + score result" />

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
    width: 500px;
    height: 400px;
  }
</style>
