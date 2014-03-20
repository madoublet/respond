<div class="modal fade" id="featuredDialog">

	<!-- messages -->
	<input id="msg-select-feature-error" value="<?php print _("Please select a page to feature"); ?>" type="hidden">
	<input id="msg-featured-content" value="<?php print _("Featured content:"); ?>" type="hidden">

	<div class="modal-dialog">
	
		<div class="modal-content">

			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal">x</button>
				<h3><?php print _("Feature Content"); ?></h3>
			</div>
			<!-- /.modal-header -->

			<div class="modal-body">
			
				<div class="form-block">
					<div id="selectFeaturedPage" class="select select-lg">
						<ul data-bind="foreach: pages">
							<li data-bind="attr:{'data-pageuniqid': pageUniqId, 'data-name': name, 'data-url': url}, text:name"></li>
						</ul>
						<p data-bind="visible: pagesLoading()" class="inline-status"><i class="fa fa-spinner fa fa-spin"></i> <?php print _("Loading..."); ?></p>
					</div>    
				</div>
			
			</div>
			<!-- /.modal-body -->

			<div class="modal-footer">
				<button class="secondary-button" data-dismiss="modal"><?php print _("Close"); ?></button>
				<button id="addFeatured" class="primary-button" type="button"><?php print _("Add Featured Content"); ?></button>
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