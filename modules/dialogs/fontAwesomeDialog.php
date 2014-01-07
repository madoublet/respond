<div class="modal fade" id="fontAwesomeDialog">

	<div class="modal-dialog">
	
		<div class="modal-content">

			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal">×</button>
				<h3><?php print _("Add Font Awesome Icon"); ?></h3>
			</div>
  
			<div class="modal-body">

				<div id="selectIcon" class="select select-lg">
				
				<ul data-bind="foreach: icons">
					<li>
						<i data-bind="css: icon"></i> <span data-bind="text: name"></span>
					</li>
				</ul>
				
				<p data-bind="visible: iconsLoading()" class="inline-status"><i class="fa fa-spinner fa fa-spin"></i> <?php print _("Loading..."); ?></p>
				
				</div>
				
			</div>
			
			<div class="modal-footer">
				<button class="secondary-button" data-dismiss="modal"><?php print _("Close"); ?></button>
				<button class="primary-button" data-bind="click: addIcon"><?php print _("Add Icon"); ?></a>
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