<div class="modal fade" id="linkDialog">

	<div class="modal-dialog">
	
		<div class="modal-content">

			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal">×</button>
				<h3><?php print _("Add Link"); ?></h3>
			</div>
			<!-- /.modal-header -->
	
			<div class="modal-body">
			
			<div class="form-group no-border">
				<label class="radio"><input id="existing" type="radio" class="radio" name="content" checked> <?php print _("Existing Page"); ?></label>
			</div>  
		
			<div class="form-group no-border">
				<div id="pageUrl" class="select small">
					<ul data-bind="foreach: pages">
						<li data-bind="attr:{'data-pageid': pageId, 'data-url': $parent.toPagePrefix() + url()}, text:name"></li>
					</ul>
					<p data-bind="visible: pagesLoading()" class="inline-status"><i class="fa fa-spinner fa fa-spin"></i> <?php print _("Loading..."); ?></p>
				</div>
			</div>
			
			<div class="form-group no-border">
				<label class="radio"><input id="customUrl" type="radio" name="content" class="radio"> <?php print _("Custom URL"); ?></label>
			</div>
			
			<div class="form-group">
				<input id="linkUrl" type="text" class="form-control">
			</div>
			
			<div class="form-group">
				<label for="linkCssClass"><?php print _("CSS Class:"); ?></label>
				<input id="linkCssClass" type="text" maxlength="128" data-bind="" class="form-control">
			</div>
			
			<div class="form-group">
				<label for="linkTarget"><?php print _("Target:"); ?></label>
				<input id="linkTarget" type="text" maxlength="128" data-bind="" class="form-control">
			</div>
			
			<div class="form-group">
				<label for="linkTitle"><?php print _("Title:"); ?></label>
				<input id="linkTitle" type="text" maxlength="128" data-bind="" class="form-control">
			</div>
			
			</div>
			<!-- /.modal-body -->
			
			<div class="modal-footer">
				<button class="secondary-button" data-dismiss="modal"><?php print _("Close"); ?></button>
				<button id="addLink" type="button" class="primary-button"><?php print _("Add Link"); ?></button>
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