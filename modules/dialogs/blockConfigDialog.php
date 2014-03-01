<div class="modal fade" id="blockConfigDialog">

	<div class="modal-dialog">
	
		<div class="modal-content">

			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal">×</button>
				<h3><?php print _("Settings"); ?></h3>
			</div>
			<!-- /.modal-header -->
	
			<div class="modal-body">
			
				<div class="form-group">
					<label for="blockId" class="control-label"><?php print _("Block Id:"); ?></label>
					<input id="blockId" type="text" maxlength="128" value="" class="form-control">
				</div>
				
				<div class="form-group">
					<label for="blockCssClass" class="control-label"><?php print _("Block Class:"); ?></label>
					<input id="blockCssClass" type="text" maxlength="128" value="" class="form-control">
				</div>
				
				<div class="form-group">
					<label for="blockNested" class="control-label"><?php print _("Block Nesting:"); ?></label>
					<select id="blockNested" class="form-control">
						<option value="not-nested"><?php print _("Stand-alone (not nested)"); ?></option>
						<option value="nested"><?php print _("Nested in .container block"); ?></option>
					</select>
				</div>
				
				<div class="form-group block-nested">
					<label for="blockContainerId" class="control-label"><?php print _("Container Id:"); ?></label>
					<input id="blockContainerId" type="text" maxlength="128" value="" class="form-control">
				</div>
				
				<div class="form-group block-nested">
					<label for="blockContainerCssClass" class="control-label"><?php print _("Container Class:"); ?></label>
					<input id="blockContainerCssClass" type="text" maxlength="128" value="" class="form-control">
				</div>
			
			</div>
			<!-- /.modal-body -->
			
			<div class="modal-footer">
				<button class="secondary-button" data-dismiss="modal"><?php print _("Close"); ?></button>
				<button id="updateBlockConfig" class="primary-button" data-dismiss="modal"><?php print _("Update"); ?></button>
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