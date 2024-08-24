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
			<div class="col-xs-12 col-sm-6 col-lg-4 col-xl-3 col-xxl-2 my-3">
				<div class="card home-card bg-dark text-white h-100">
					<img class="card-img-top w-100 img-fluid" alt="thumbnail"
						src="<?php printThumbnailPath($key, $paper); ?>">
					<div class="card-body">
						<a href="papers/<?php print $key; ?>" title="" class="stretched-link">
							<h4 class="card-title"><?php print $paper["title"]; ?></h4>
							<h6><?php print $paper["author"]; ?></h6>
							<p class="card-text text-muted"><?php print $paper["subtitle"]; ?></p>
						</a>
						<p class="mt-1 card-text card-tags"><?php printTags($paper["tags"]); ?></p>
					</div>
				</div>
			</div>
		<?php } ?>

	</div>
</div>


<?php include_once('inc/footer.php'); ?>