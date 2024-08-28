<?php include_once('functions.php'); ?>

<!doctype html>
<html lang="en">

<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<title>Persuasion Architectures<?php print($page_title); ?></title>

	<link rel="preconnect" href="https://fonts.googleapis.com">
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
	<link href="https://fonts.googleapis.com/css2?family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&family=PT+Serif:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet">

	<!-- <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous"> -->

	<link rel="stylesheet" href="<?php printFileRoot(); ?>assets/libs/bootstrap-darkly-5.3.3.min.css">
	<link rel="stylesheet" href="<?php printFileRoot(); ?>assets/css/styles.css">

</head>

<body>
	<nav class="navbar navbar-expand-lg" data-bs-theme="dark">
		<div class="container-fluid">
			<a class="navbar-brand" href="<?php printSiteRoot(); ?>">Persuasion<br>Architectures</a>

			<button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarColor02" aria-controls="navbarColor02" aria-expanded="false" aria-label="Toggle navigation">
				<span class="navbar-toggler-icon"></span>
			</button>

			<div class="collapse navbar-collapse" id="navbarColor02">
				<ul class="navbar-nav me-auto"></ul>
				<ul class="navbar-nav my-2 my-lg-0">
					<li class="nav-item">
						<a class="nav-link" href="<?php printSiteRoot(); ?>papers/about/">About</a>
					</li>
					<li class="nav-item">
						<a class="nav-link" href="https://github.com/sneakaway-studio/persuasion-architectures">Github</a>
					</li>
				</ul>
			</div>
		</div>
	</nav>
