<div class="modal fade" id="slideshowDialog">

	<div class="modal-dialog">
	
		<div class="modal-content">
		
			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal">×</button>
				<h3><?php print _("Add Slideshow"); ?></h3>
			</div>
			<!-- /.modal-header -->
			
			<div class="modal-body">

			<p>
			  <?php print _("Select the target width and height for the images in the slideshow."); ?>
			</p>
			
			<div class="form-group">
			  <label for="slideShowWidth" class="control-label"><?php print _("Target Width:"); ?></label>
			  <input id="slideShowWidth" type="number" value="1024" class="form-control">
			  <span class="help-block"><?php print _("In Pixels"); ?></span>
			</div>
			
			<div class="form-group">
			  <label for="slideShowHeight" class="control-label"><?php print _("Target Height:"); ?></label>
			  <input id="slideShowHeight" type="number" value="768" class="form-control">
			  <span class="help-block"><?php print _("In Pixels"); ?></span>
			</div>
			
			
			</div>
			<!-- /.modal-body -->
			
			<div class="modal-footer">
				<button class="secondary-button" data-dismiss="modal"><?php print _("Close"); ?></button>
				<input id="addSlideShow" type="button" class="primary-button" value="Add Slideshow">
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