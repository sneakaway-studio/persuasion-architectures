<?php

$subdirectory = false;
include_once('inc/header.php');
$papers = returnJsonData();
// print "<pre>";
// print_r($papers);
// print "</pre>";

?>


<div class="container-fluid">
	<div class="row">

		<?php foreach ($papers as $key => $paper) { ?>
			<?php if (isset($paper["skip"]) && $paper["skip"] == true ) continue; ?>
			<div class="col-xs-12 col-sm-6 col-lg-4 col-xl-3 col-xxl-2 my-3">
				<div class="card home-card bg-dark text-white h-100">
					<!-- <img class="card-img-top w-100 img-fluid" alt="thumbnail"
						src="<?php printThumbnailPath($key, $paper); ?>"> -->
					<div class="card-img-bg" style="background-image: url(<?php printThumbnailPath($key, $paper); ?>);"></div>
					<div class="card-body">
						<a href="papers/<?php print $key; ?>" title="" class="stretched-link">
							<h5 class="card-title"><?php print $paper["title"]; ?></h5>
							<h6 class="card-text text-muted"><?php print $paper["subtitle"]; ?></h6>
							<h6><?php print $paper["author"]; ?></h6>
						</a>
						<p class="mt-1 card-text card-tags"><?php printTags($paper["tags"]); ?></p>
					</div>
				</div>
			</div>
		<?php } ?>

	</div>
</div>


<?php include_once('inc/footer.php'); ?>