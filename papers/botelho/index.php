<?php

$subdirectory = true;
include_once('../../inc/header.php');
$paper = returnJsonData("botelho");
// print_r($paper);


// CODE NOTES
// ...

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





<div class="container">

    <div class="row my-2">
        <div class="col-12 col-lg-8 offset-lg-2">



<h5 class="subheading">Introduction</h5>














		</div>
	</div>
</div>


<div class="container-fluid px-0 my-2 mb-4">
	<div class="container px-0">
		<div class="row">
			<div class="col-12">
				<iframe id="my_iframe" width="100%" height="860px" frameBorder="0" src="game/Rad Recommeners.html" scrolling="no"> </iframe>

				<figcaption class="figure-caption">xxxxx</figcaption>


			</div>
		</div>
	</div>
</div>







<div class="container">
	<div class="row my-2">
		<div class="col-12 col-lg-8 offset-lg-2">

		<h4>Bibliography</h4>


		<ol>

		<li>xxxx</li>

		</ol>


	    </div>
	</div>
</div>


<?php include_once('../../inc/footer.php'); ?>
