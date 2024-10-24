<script>
	import { count } from "../stores";
	import { results } from "../data";

	let resultId = 0;

	if ($count >= 0 && $count <= 4) resultId = 0;
	else if ($count >= 5 && $count <= 8) resultId = 1;
	// if $count >= 9 && $count <= 12}
	else resultId = 2;
</script>

<div class="row">
	<div class="col-12 col-md-6">
		<h2>{results[resultId].title}</h2>
		<p>{results[resultId].description}</p>
	</div>
	<div class="col-12 col-md-6">
		<img
			src={results[resultId].media.image}
			class="img-fluid"
			alt="image {results[resultId].title}"
		/>
		<small>
			<a href={results[resultId].credit_url}>Media Credits:</a>
			{results[resultId].credit}
		</small>
	</div>
</div>

<style>
	/* spacing all elements */
	h2,
	p,
	img {
		margin-top: 1.5rem;
	}

	img {
		width: 100%;
	}
</style>
