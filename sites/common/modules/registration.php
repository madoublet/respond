<fieldset class="respond-registration">

	<div class="form-group">
		<label for="firstName" class="control-label"><?php print _("First Name:"); ?></label>
		<input id="firstName" type="text" autocomplete="off" class="form-control">
	</div>
	
	<div class="form-group">
		<label for="lastName" class="control-label"><?php print _("Last Name:"); ?></label>
		<input id="lastName" type="text" autocomplete="off" class="form-control">
	</div>

	<div class="form-group">
		<label for="email" class="control-label"><?php print _("Email:"); ?></label>
		<input id="email" type="email" autocomplete="off" class="form-control">
	</div>
	
	<div class="form-group">
		<label for="password" class="control-label"><?php print _("Password:"); ?></label>
		<input id="password" type="password" autocomplete="off" class="form-control">
	</div>
	
	<div class="form-group">
		<label for="retype" class="control-label"><?php print _("Retype Password:"); ?></label>
		<input id="retype" type="password" autocomplete="off" class="form-control">
	</div>
	
	<span class="actions">
		<button class="btn btn-default" type="submit"><?php print _("Register"); ?> <i class="fa fa-angle-right fa-white"></i></button>
	</span>
	
</fieldset>