<?php 
	$parts = explode(".", $file); 
	$ext = end($parts); // get extension
	$ext = strtolower($ext); // convert to lowercase	
?>

<?php
    $file_icon = 'fa fa-file-text-o';

    if($ext=='pdf'){
        $file_icon = 'fa fa-file-text-o';
    }
    else if($ext=='doc' || $ext=='docx'){
        $file_icon = 'fa fa-file-text-o';
    }
    else if($ext=='png' || $ext=='jpg' || $ext=='jpeg' || $ext='gif'){
        $file_icon = 'fa fa-picture-o';
    }
?>

<p class="file">
	<i class="<?php print $file_icon; ?>"></i>
	<a href="<?php print $rootloc.'files/'; ?><?php print $file; ?>"><?php print '<?php print _("'.$description.'"); ?>'; ?></a>
</p>