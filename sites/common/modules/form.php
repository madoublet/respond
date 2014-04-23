<form id="<?php print $formId; ?>" role="form"<?php if($type=='default'){ ?> class="respond-form"<?php } ?><?php if($action!=''){ ?> action="<?php print $action; ?>" type="post"<?php } ?>>
	<?php 
	// handle success message
	if($successMessage != ''){
		print '<div class="alert alert-success"><?php print _("'.$successMessage.'"); ?></div>';
	}
	else{
		print '<div class="alert alert-success"><?php print _("Form submitted successfully!"); ?></div>';
	}
	
	// handle error message
	if($errorMessage != ''){
		print '<div class="alert alert-danger"><?php print _("'.$errorMessage.'"); ?></div>';
	}
	else{
		print '<div class="alert alert-danger"><?php print _("You are missing required fields."); ?></div>';
	}
	
	// set form
	print html_entity_decode($form); 
	
	// set button
	if($submitText != ''){
		print '<button type="submit" class="btn btn-default btn-lg"><?php print _("'.$submitText.'"); ?> <i class="fa fa-spinner fa-spin icon-spinner"></i></button>';
	}
	else{
		print '<button type="submit" class="btn btn-default btn-lg"><?php print _("Submit"); ?> <i class="fa fa-spinner fa-spin icon-spinner"></i></button>';
	}
	?>
</form>

