<div class="modal fade" id="pluginsDialog">

	<!-- messages -->
	<input id="msg-select-plugins-error" value="<?php print _("Please select a plugin"); ?>" type="hidden">

	<div class="modal-dialog">
	
		<div class="modal-content">

			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal">x</button>
				<h3><?php print _("Select Plugin"); ?></h3>
			</div>
			<!-- /.modal-header -->
	
			<div class="modal-body">
			
			<div id="selectPlugin" class="select select-g">
			
				<ul data-bind="foreach: plugins">
					<li>
						<a data-bind="attr:{'data-name':name, 'data-type':type, 'data-render':render, 'data-config':config}, text:name"></a>
						<em data-bind="text:desc"></em>
					</li>
				</ul>
				
				<p data-bind="visible: pluginsLoading()" class="inline-status"><i class="fa fa-spinner fa fa-spin"></i> <?php print _("Loading..."); ?></p>
				
			</div>
			
			</div>
			<!-- /.modal-body -->
			
			<div class="modal-footer">
				<button class="secondary-button" data-dismiss="modal"><?php print _("Close"); ?></button>
				<button id="addPlugin" class="primary-button"><?php print _("Add Plugin"); ?></button>
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