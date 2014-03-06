<div class="modal fade" id="formDialog">

	<div class="modal-dialog">
	
		<div class="modal-content">

			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal">×</button>
				<h3><?php print _("Add Form"); ?></h3>
			</div>
			<!-- /.modal-header -->

			<div class="modal-body">
				
				<div class="form-group">
					<label for="formType" class="control-label"><?php print _("Form Type:"); ?></label>
					<select id="formType" class="form-control">
						<option value="contact"><?php print _("Contact"); ?></option>
						<option value="login"><?php print _("Login"); ?></option>
						<option value="register"><?php print _("Register"); ?></option>
						<option value="custom"><?php print _("Custom"); ?></option>
				  	</select>
				</div>
				
				<div class="form-group">
					<label for="formSuccessMessage" class="control-label"><?php print _("Success Message:"); ?></label>
					<input id="formSuccessMessage" type="text" maxlength="256" value="<?php print _("Form submitted successfully!"); ?>" class="form-control">
				</div>
				
				<div class="form-group">
					<label for="formErrorMessage" class="control-label"><?php print _("Error Message:"); ?></label>
					<input id="formErrorMessage" type="text" maxlength="256" value="<?php print _("You are missing required fields."); ?>" class="form-control">
				</div>
				
				</div>
				<!-- /.modal-body -->
				
				<div class="modal-footer">
					<button type="button" class="secondary-button" data-dismiss="modal"><?php print _("Close"); ?></button>
					<button id="addForm" type="button" class="primary-button"><?php print _("Add Form"); ?></button>
				</div>  
				<!-- /.modal-footer -->
		
		</div>
		<!-- /.modal-content -->
		
	</div>
	<!-- /.modal-dialog -->

  </div>
  <!-- /.modal-body -->

</div>
<!-- /.modal -->
