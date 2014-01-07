<div class="modal fade" id="htmlDialog">

	<!-- messages -->
	<input id="msg-html-dialog-desc" value="<?php print _("HTML block"); ?>" type="hidden">

	<div class="modal-dialog">
	
		<div class="modal-content">

			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal">x</button>
				<h3><?php print _("Add HTML"); ?></h3>
			</div>
			<!-- /.modal-header -->
			
			<div class="modal-body">
			
				<p class="twitter-instructions instructions alert alert-info"><?php print _("Create your widget at:"); ?> <a href="https://twitter.com/settings/widgets" target="_blank">//twitter.com/settings/widgets</a> <?php print _(". Paste the HTML code below."); ?></p>
			
				<div class="form-group">
					<label for="HtmlDescription"><?php print _("Description:"); ?></label>
					<input id="HtmlDescription" type="text" maxlength="50" class="form-control">
				</div>
			
				<div class="form-group">
					<label for="Html"><?php print _("HTML:"); ?></label>
					<textarea id="Html" class="form-control"></textarea>
					<span class="help-block"><?php print _("Add your HTML, JS, or HTML here"); ?></span>
				</div>
			
			</div>
			<!-- /.modal-body -->
			
			<div class="modal-footer">
				<button class="secondary-button" data-dismiss="modal"><?php print _("Close"); ?></button>
				<button id="addHtml" class="primary-button"><?php print _("Add HTML"); ?></buttons>
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
