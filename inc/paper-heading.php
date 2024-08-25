<?php

$subdirectory = true;
include_once('header.php');
include_once('functions.php');
$paper = returnJsonData($author);
// print_r($paper);

?>

<div class="container">
	<div class="row my-5">
		<div class="col-12 col-lg-8 offset-lg-2 text-center paper-title">
			<h2><?php print $paper['title']; ?></h2>
			<h3><?php print $paper['subtitle']; ?></h3>
			<h4><?php print $paper['author']; ?></h4>
		</div>
	</div>
</div>