<fieldset class="respond-registration">

	<div class="alert registration-success alert-success"><?php print _("Registration successful. The site administrator will contact you when you are approved."); ?></div>
	<div class="alert registration-error alert-danger"><?php print _("There was a problem registering. Please try again."); ?></div>
	<div class="alert registration-retype-error alert-danger"><?php print _("The password must match the retype field"); ?></div>
	<div class="alert registration-required-error alert-danger"><?php print _("All fields are required"); ?></div>
	<div class="alert captcha-error alert-danger"><?php print _("Captcha value incorrect. Please try again."); ?></div>

	<div class="form-group">
		<label class="control-label"><?php print _("First Name:"); ?></label>
		<input type="text" autocomplete="off" class="firstName form-control">
	</div>
	
	<div class="form-group">
		<label class="control-label"><?php print _("Last Name:"); ?></label>
		<input type="text" autocomplete="off" class="lastName form-control">
	</div>

	<div class="form-group">
		<label class="control-label"><?php print _("Email:"); ?></label>
		<input type="email" autocomplete="off" class="email form-control">
	</div>
	
	<div class="form-group">
		<label class="control-label"><?php print _("Password:"); ?></label>
		<input type="password" autocomplete="off" class="password form-control">
	</div>
	
	<div class="form-group">
		<label class="control-label"><?php print _("Retype Password:"); ?></label>
		<input type="password" autocomplete="off" class="retype form-control">
	</div>
	
	<?php if($formPublicId != '' && $formPublicId != NULL){ ?>
	<div class="form-group captcha">
		<?php require_once($rootloc.'libs/recaptchalib.php'); echo recaptcha_get_html($formPublicId); ?>
	</div>
	<?php } ?>
	
	<span class="actions">
		<button class="btn btn-default" type="submit"><?php print _("Register"); ?> 		
		<i class="fa fa-spinner fa-spin icon-spinner"></i>
	</span>
	
</fieldset>