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