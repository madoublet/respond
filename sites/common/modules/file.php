<?php 
	$parts = explode(".", $file); 
	$ext = end($parts); // get extension
	$ext = strtolower($ext); // convert to lowercase	
?>

<p class="file <?php
	if($ext=='pdf'){
		print 'pdf';
	}
	else if($ext=='doc' || $ext=='docx'){
		print 'word';
	}
	else if($ext=='png' || $ext=='jpg' || $ext=='jpeg' || $ext='gif'){
		print 'image';
	}
	else{
		print 'misc';
	}
?>">
	<span class="type"></span>
	<a class="file-name" href="<?php print $rootloc.'files/'; ?><?php print $file; ?>"><?php print $file; ?></a>
	<span class="file-desc">
		<?php print $description; ?>
	</span>
</p>