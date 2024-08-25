<?php

include_once('functions.php');

?>

<!doctype html>
<html lang="en">

<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<title>Persuasion Architectures<?php print($page_title); ?></title>

	<link href="https://fonts.googleapis.com/css2?family=PT+Serif&display=swap" rel="stylesheet">
	<link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400&display=swap" rel="stylesheet">

	<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
	<link rel="stylesheet" href="<?php printFileRoot(); ?>assets/libs/bootstrap-darkly.min.css">
	<link rel="stylesheet" href="<?php printFileRoot(); ?>assets/css/styles.css">
</head>

<body>
	<nav class="navbar navbar-expand-lg navbar-dark bg-dark">
		<a class="navbar-brand" href="<?php printSiteRoot(); ?>">Persuasion<br>Architectures</a>
		<button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
			<span class="navbar-toggler-icon"></span>
		</button>
		<div class="collapse navbar-collapse" id="navbarSupportedContent">
			<ul class="navbar-nav mr-auto"></ul>
			<ul class="navbar-nav my-2 my-lg-0">
				<li class="nav-item">
					<a class="nav-link" href="<?php printSiteRoot(); ?>papers/about/">About</a>
				</li>
				<li class="nav-item">
					<a class="nav-link" href="https://github.com/sneakaway-studio/persuasion-architectures">Github</a>
				</li>
			</ul>
		</div>
	</nav>