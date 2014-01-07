<form role="form" class="respond-form">
	<?php 
	print '<div class="alert alert-success"><?php print _("Form submitted successfully!"); ?></div>';
	print '<div class="alert alert-danger"><?php print _("You are missing required fields."); ?></div>';
	print html_entity_decode($form); 
	print '<button type="button" class="btn btn-default btn-lg"><?php print _("Submit"); ?> <i class="icon-spinner icon-spin"></i></button>';
	?>
</form>

