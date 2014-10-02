<div class="modal fade" id="galleryImgDialog">

	<div class="modal-dialog">
	
		<div class="modal-content">

			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal">×</button>
				<h3><?php print _("Settings"); ?></h3>
			</div>
			<!-- /.modal-header -->
			
			<div class="modal-body">

				<div class="form-group">
					<label for="galleryImgId"><?php print _("Container Element Id:"); ?></label>
					<input id="galleryImgId" type="text" class="form-control" maxlength="128">
				</div>

				<div class="form-group">
					<label for="galleryImgCssClass"><?php print _("Container CSS Class:"); ?></label>
					<input id="galleryImgCssClass" type="text" class="form-control" maxlength="128">
				</div>

				<div class="form-group">
					<label for="galleryImgCaption"><?php print _("Caption:"); ?></label>
					<input id="galleryImgCaption" type="text" class="form-control" maxlength="255">
				</div>

			</div>
			<!-- /.modal-body -->
			
			<div class="modal-footer">
				<button class="secondary-button" data-dismiss="modal"><?php print _("Close"); ?></button>
				<button id="updateGalleryImg" class="primary-button"><?php print _("Update Gallery Image"); ?></button>
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