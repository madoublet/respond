<div class="modal fade" id="fieldDialog">

	<div class="modal-dialog">
	
		<div class="modal-content">

			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal">×</button>
				<h3><?php print _("Add Field"); ?></h3>
			</div>
			<!-- /.modal-header -->

			<div class="modal-body">
				
				<div class="form-group">
					<label for="fieldType" class="control-label"><?php print _("Field Type:"); ?></label>
					<select id="fieldType" class="form-control">
						<option value="text"><?php print _("Text Box"); ?></option>
						<option value="textarea"><?php print _("Text Area"); ?></option>
						<option value="select"><?php print _("Dropdown List"); ?></option>
						<option value="checkboxlist"><?php print _("Checkbox List"); ?></option>
						<option value="radiolist"><?php print _("Radio button List"); ?></option>
				  	</select>
				</div>

				<div class="form-group">
					<label for="fieldName" class="control-label"><?php print _("Field Name:"); ?></label>
					<input id="fieldName" type="text" maxlength="128" value="" class="form-control">
					<span class="help-block"><?php print _("e.g.: Phone Number, Name, etc."); ?></span>
				</div>
				
				<div class="form-group">
					<label for="fieldRequired" class="control-label"><?php print _("Required:"); ?></label>
					<select id="fieldRequired" class="form-control">
					  <option value="yes"><?php print _("Yes"); ?></option>
					  <option value="no"><?php print _("No"); ?></option>
					</select>
				</div>
				
				<div id="options" class="form-group">
					<label for="fieldOptions" class="control-label"><?php print _("Options:"); ?></label>
					<textarea id="fieldOptions" class="form-control"></textarea>
					<span class="help-block"><?php print _("Separate each option with a comma"); ?></span>
				</div>
				
				<div class="form-group">
					<label for="fieldHelperText" class="control-label"><?php print _("Helper Text:"); ?></label>
					<input id="fieldHelperText" type="text" maxlength="256" value="" class="form-control">
					<span class="help-block"><?php print _("e.g.: (314) 444-2343"); ?></span>
				</div>
				
				<div class="form-group">
					<label for="fieldPlaceholderText" class="control-label"><?php print _("Placeholder:"); ?></label>
					<input id="fieldPlaceholderText" type="text" maxlength="256" value="" class="form-control">
				</div>
				
				<div class="form-group">
					<label for="fieldCssClass" class="control-label"><?php print _("CSS Class:"); ?></label>
					<input id="fieldCssClass" type="text" maxlength="256" value="" class="form-control">
				</div>
				
				</div>
				<!-- /.modal-body -->
				
				<div class="modal-footer">
					<button type="button" class="secondary-button" data-dismiss="modal"><?php print _("Close"); ?></button>
					<button id="addField" type="button" class="primary-button"><?php print _("Add Field"); ?></button>
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
