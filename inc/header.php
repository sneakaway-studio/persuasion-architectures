<?php

function isLocalhost($whitelist = ['127.0.0.1', '::1'])
{
    return in_array($_SERVER['REMOTE_ADDR'], $whitelist);
}
$site_root = "https://sneakaway.studio/persuasion-architectures/";
$file_root = "";
$page_title = "";
if (isLocalhost()) {
    $site_root = "http://localhost/SneakawayStudio/Pursuasion%20Architectures/persuasion-architectures/";
}
if ($subdirectory){
    $file_root = "../../";
}

?>

<!doctype html>
<html lang="en">

<head>
    <!-- Required meta tags -->
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <title>Persuasion Architectures<?php print ($page_title); ?></title>

    <link href="https://fonts.googleapis.com/css2?family=PT+Serif&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400&display=swap" rel="stylesheet">

    <!-- <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous"> -->
    <link rel="stylesheet" href="<?php print ($file_root); ?>assets/libs/superhero/bootstrap.min.css">
    <link rel="stylesheet" href="<?php print ($file_root); ?>assets/css/styles.css">
</head>

<body>
<nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <a class="navbar-brand" href="<?php print($site_root); ?>">Persuasion<br>Architectures</a>
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav mr-auto"></ul>
        <ul class="navbar-nav my-2 my-lg-0">
            <li class="nav-item">
                <a class="nav-link" href="about/">About</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="https://github.com/sneakaway-studio/persuasion-architectures">Github</a>
            </li>
        </ul>
    </div>
</nav>
