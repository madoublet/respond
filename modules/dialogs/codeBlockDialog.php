<div class="modal fade" id="codeBlockDialog">

	<div class="modal-dialog">
	
		<div class="modal-content">

			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal">x</button>
				<h3><?php print _("Add Code Block"); ?></h3>
			</div>
			<!-- /.modal-header -->
			
			<div class="modal-body">
			
				<div class="control-group">
					<label for="stylesheet"><?php print _("Code:"); ?></label>
					<textarea id="Code" class="form-control"></textarea>
					<span class="help-block"><?php print _("Paste your code in the textarea above."); ?></span>
				</div>
			
			</div>
			<!-- /.modal-body -->
			
			<div class="modal-footer">
				<button class="secondary-button" data-dismiss="modal"><?php print _("Close"); ?></button>
				<button id="addCode" class="primary-button"><?php print _("Add Code Block"); ?></buttons>
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