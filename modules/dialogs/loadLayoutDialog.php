<div class="modal fade" id="loadLayoutDialog">

	<!-- messages -->
	<input id="msg-select-layout-error" value="<?php print _("Please select a layout"); ?>" type="hidden">

	<div class="modal-dialog">
	
		<div class="modal-content">
  
			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal">x</button>
				<h3><?php print _("Load Existing Page"); ?></h3>
			</div>
			<!-- /.modal-header -->

			<div class="modal-body">
			
			<div id="selectPage" class="select">
				<ul data-bind="foreach: pages">
					<li data-bind="attr:{'data-pageuniqid': pageUniqId}, text:name"></li>
				</ul>
				<p data-bind="visible: pagesLoading()" class="inline-status"><i class="fa fa-spinner fa fa-spin"></i> <?php print _("Loading..."); ?></p>
			</div>    
			
			</div>
			<!-- /.modal-body -->

			<div class="modal-footer">
				<button class="secondary-button" data-dismiss="modal"><?php print _("Close"); ?></button>
				<button id="loadLayout" class="primary-button" type="button"><?php print _("Load Layout"); ?></button>
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
