<div class="modal fade" id="loadLayoutDialog">

	<!-- messages -->
	<input id="msg-select-layout-error" value="<?php print _("Please select a layout"); ?>" type="hidden">

	<div class="modal-dialog">
	
		<div class="modal-content">
  
			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal">x</button>
				<h3><?php print _("Load Page"); ?></h3>
			</div>
			<!-- /.modal-header -->
			
			<ul class="segmented-control count-3">
				<li class="active" data-navigate="load-existing"><a><?php print _("Existing Page"); ?></a></li>
				<li data-navigate="load-theme"><a><?php print _("From Theme"); ?></a></li>
				<li data-navigate="load-code"><a><?php print _("From Code"); ?></a></li>
			</ul>
			<!-- /.segmented-control -->

			<div class="modal-body">
			
			<div class="load-existing">
				<div id="selectPage" class="select select-lg">
					<ul data-bind="foreach: pages">
						<li data-bind="attr:{'data-pageuniqid': pageUniqId}, text:name"></li>
					</ul>
					<p data-bind="visible: pagesLoading()" class="inline-status"><i class="fa fa-spinner fa fa-spin"></i> <?php print _("Loading..."); ?></p>
				</div>
			</div>
			<!-- /#load-existing -->
			
			<div class="load-theme">
				<div id="selectThemePage" class="select select-lg">
					<ul data-bind="foreach: themePages">
						<li data-bind="attr:{'data-location': location}, text:name"></li>
					</ul>
					<p data-bind="visible: themePagesLoading()" class="inline-status"><i class="fa fa-spinner fa fa-spin"></i> <?php print _("Loading..."); ?></p>
				</div>    
			</div>
			<!-- #load-theme -->
			
			<div class="load-code">
				<textarea id="load-code" style="width: 100%;"></textarea>   
			</div>
			<!-- #load-code -->
			
			</div>
			<!-- /.modal-body -->

			<div class="modal-footer">
				<button class="secondary-button" data-dismiss="modal"><?php print _("Close"); ?></button>
				<button id="loadLayout" class="load-existing primary-button" type="button"><?php print _("Load Layout"); ?></button>
				<button id="loadLayoutFromTheme" class="load-theme primary-button" type="button"><?php print _("Load Layout"); ?></button>
				<button id="loadLayoutFromCode" class="load-code primary-button" type="button"><?php print _("Load Layout"); ?></button>
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
