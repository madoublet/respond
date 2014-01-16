<div class="modal fade" id="pageSettingsDialog">

	<!-- messages -->
	<input id="msg-page-settings-name-error" value="<?php print _("You must add a name"); ?>" type="hidden">
	<input id="msg-page-settings-friendly-error" value="<?php print _("You must select a friendly URL"); ?>" type="hidden">
	<input id="msg-page-settings-success" value="<?php print _("You have successfully updated the page"); ?>" type="hidden">
	<input id="msg-page-settings-updating" value="<?php print _("Updating page..."); ?>" type="hidden">

	<div class="modal-dialog">
	
		<div class="modal-content">

			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal">x</button>
				<h3><?php print _("Page Settings"); ?></h3>
			</div>
			<!-- /.modal-header -->

			<div class="modal-body" data-bind="with: page">

				<div class="form-group">
					<label for="name"><?php print _("Name:"); ?></label>
					<input id="name" type="text" maxlength="128" data-bind="value: name" class="form-control">
				</div>
				
				<div class="form-group">
					<label for="URL"><?php print _("URL:"); ?></label>
					<input id="friendlyId" type="text" maxlength="128" data-bind="value: friendlyId" class="form-control">
					<span class="help-block"><?php print _("No spaces, no special characters, dashes allowed."); ?></span>
				</div>
				
				<div class="form-group">
					<label for="description"><?php print _("Description:"); ?></label>
					<textarea id="description" data-bind="value: description" class="form-control"></textarea>
					<span class="help-block"><?php print _("Added to the head of the page, used as the description in search engines and for lists"); ?></span>
				</div>
				
				<div class="form-group">
					<label for="keywords"><?php print _("Keywords:"); ?></label>
					<textarea id="keywords" data-bind="value: keywords" class="form-control"></textarea>
				</div>   
				
				<div class="form-group">
					<label for="callout"><?php print _("Callout:"); ?></label>
					<input id="callout" type="text" maxlength="100" placeholder="Between $5-$8, On Sale Now"  data-bind="value: callout" class="form-control">
					<span class="help-block"><?php print _("Shows below the page name in lists to call attention to the item"); ?></span>
				</div>
				
				<div class="form-group">
					<label for="rss" class="control-label"><?php print _("RSS:"); ?></label>  
					<span class="checklist" data-bind="foreach: $parent.pageTypes">
						<label class="checkbox"><input type="checkbox" class="rss" data-bind="value: friendlyId, checked: ($parent.rss().indexOf(friendlyId())>-1), attr:{'data-rss': $parent.rss, 'data-friendlyId': friendlyId}"> <span data-bind="text:typeP"></span></label>
					</span>
					<span class="help-block"><?php print _("Adds a reference to the selected RSS feeds in the head of the page"); ?></span>
				</div>
				
				<div class="form-group" data-bind="visible: $parent.categories().length>0">
					<label for="categories-list" class="control-label"><?php print _("Categories:"); ?></label>  
					<span class="checklist categories-list" data-bind="foreach: $parent.categories">
						<label class="checkbox"><input type="checkbox" data-bind="value: categoryUniqId, checked: ($parents[1].categoriesForPage().indexOf(categoryUniqId())>-1)"> <span data-bind="text:name"></span></label>
					</span>
				</div>
				
				<div class="form-group">
					<label for="layout"><?php print _("Layout:"); ?></label>
					<select id="layout" data-bind="options: $parent.layouts, value: layout()" class="form-control"></select>
					<p data-bind="visible: $parent.layoutsLoading()" class="inline-status"><i class="fa fa-spinner fa fa-spin"></i> <?php print _("Loading..."); ?></p>
					<span class="help-block"><?php print _("HTML used to render the page"); ?></span>
				</div>
				
				<div class="control-group">
					<label for="stylesheet"><?php print _("Stylesheet:"); ?></label>
					<select id="stylesheet" data-bind="options: $parent.stylesheets, value: stylesheet()" class="form-control"></select>
					<p data-bind="visible: $parent.stylesheetsLoading()" class="inline-status"><i class="fa fa-spinner fa fa-spin"></i> <?php print _("Loading..."); ?></p>
					<span class="help-block"><?php print _("CSS used to render the page"); ?></span>
				</div>
				
			</div>
			<!-- /.modal-body -->
				
			<div class="modal-footer">
				<button class="secondary-button" data-dismiss="modal"><?php print _("Close"); ?></button>
				<button class="primary-button" data-bind="click:saveSettings"><?php print _("Update"); ?></button>
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