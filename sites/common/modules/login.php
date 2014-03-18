<fieldset class="respond-login">
	<form>

		<div class="alert alert-success"><?php print _("Login successful."); ?></div>
		<div class="alert alert-danger"><?php print _("Your username or password is invalid. Please try again."); ?></div>
	
		<div class="form-group">
			<label class="control-label"><?php print _("Email:"); ?></label>
			<input type="email" autocomplete="off" class="form-control email">
		</div>
		
		<div class="form-group">
			<label class="control-label"><?php print _("Password:"); ?></label>
			<input type="password" autocomplete="off" class="form-control password">
		</div>
		
		<span class="actions">
			<button class="btn btn-default" type="submit"><?php print _("Login"); ?> <i class="fa fa-angle-right fa-white"></i></button>
		</span>
	
	</form>
</fieldset>