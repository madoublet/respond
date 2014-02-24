<div class="modal fade" id="slideshowDialog">

	<div class="modal-dialog">
	
		<div class="modal-content">
		
			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal">×</button>
				<h3><?php print _("Image Group"); ?></h3>
			</div>
			<!-- /.modal-header -->
			
			<div class="modal-body">

				<div class="form-group">
				  <label for="slideShowDisplay" class="control-label"><?php print _("Display:"); ?></label>
				  <select id="slideShowDisplay" class="form-control">
				  	<option value="slideshow"><?php print _("Slideshow"); ?></option>
				  	<option value="gallery"><?php print _("Gallery"); ?></option>
				  </select>
				</div>
			
			</div>
			<!-- /.modal-body -->
			
			<div class="modal-footer">
				<button class="secondary-button" data-dismiss="modal"><?php print _("Close"); ?></button>
				<input id="addSlideShow" type="button" class="primary-button" value="<?php print _("Add Image Group"); ?>">
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