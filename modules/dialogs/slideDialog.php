<div class="modal fade" id="slideDialog">

	<div class="modal-dialog">
	
		<div class="modal-content">

			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal">×</button>
				<h3><?php print _("Settings"); ?></h3>
			</div>
			<!-- /.modal-header -->
			
			<ul class="segmented-control">
				<li class="active" data-navigate="settings-general"><a><?php print _("General"); ?></a></li>
				<li data-navigate="settings-overlay"><a><?php print _("Text Overlay"); ?></a></li>
			</ul>
			<!-- /.segmented-control -->

			<div class="modal-body">

			<div id="settings-general" class="segment">

				<div class="form-group">
					<label for="slideId"><?php print _("Container Element Id:"); ?></label>
					<input id="slideId" type="text" class="form-control" maxlength="128">
				</div>

				<div class="form-group">
					<label for="slideCssClass"><?php print _("Container CSS Class:"); ?></label>
					<input id="slideCssClass" type="text" class="form-control" maxlength="128">
				</div>

			</div><!-- /#settings-general -->

			<div id="settings-overlay" class="segment">
			
				<div class="form-group">
					<label for="slideHeadline"><?php print _("Headline:"); ?></label>
					<input id="slideHeadline" type="text" class="form-control" maxlength="255">
				</div>
				
				<div class="form-group">
					<label for="slideCaption"><?php print _("Caption:"); ?></label>
					<textarea id="slideCaption" type="text" class="form-control"></textarea>
				</div>

				<div class="form-group">
					<label for="slideButtonLabel"><?php print _("Button Text:"); ?></label>
					<input id="slideButtonLabel" type="text" class="form-control" maxlength="255">
				</div>

				<div class="form-group">
					<label for="slideButtonURL"><?php print _("Button URL:"); ?></label>
					<input id="slideButtonURL" type="url" class="form-control" maxlength="255" placeholder="http://">
				</div>

				<div class="form-group">
					<label for="slideButtonTarget"><?php print _("Button Target:"); ?></label>
					<input id="slideButtonTarget" type="url" class="form-control" maxlength="128">
				</div>

			</div><!-- /#settings-overlay -->


			</div>
			<!-- /.modal-body -->
			
			<div class="modal-footer">
				<button class="secondary-button" data-dismiss="modal"><?php print _("Close"); ?></button>
				<button id="updateSlide" class="primary-button"><?php print _("Update Slide"); ?></button>
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