<div class="modal fade" id="pageSettingsDialog" data-timezone="<?php print $authUser->TimeZone; ?>">

	<!-- messages -->
	<input id="msg-page-settings-name-error" value="<?php print _("You must add a name"); ?>" type="hidden">
	<input id="msg-page-settings-friendly-error" value="<?php print _("You must select a friendly URL"); ?>" type="hidden">
	<input id="msg-page-settings-success" value="<?php print _("You have successfully updated the page"); ?>" type="hidden">
	<input id="msg-page-settings-updating" value="<?php print _("Updating..."); ?>" type="hidden">

	<div class="modal-dialog">
	
		<div class="modal-content">

			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal">x</button>
				<h3><?php print _("Page Settings"); ?></h3>
			</div>
			<!-- /.modal-header -->
			
			<ul class="segmented-control">
				<li class="active" data-navigate="settings-basic"><a><?php print _("Basic"); ?></a></li>
				<li data-navigate="settings-event"><a><?php print _("Event"); ?></a></li>
				<li data-navigate="settings-location"><a><?php print _("Location"); ?></a></li>
				<li data-navigate="settings-advanced"><a><?php print _("Advanced"); ?></a></li>
			</ul>
			<!-- /.segmented-control -->

			<div class="modal-body" data-bind="with: page">
			
				<div id="settings-basic" class="segment">

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
					</div>
					
					<div class="form-group">
						<label for="keywords"><?php print _("Keywords:"); ?></label>
						<textarea id="keywords" data-bind="value: keywords" class="form-control"></textarea>
					</div>   
					
					<div class="form-group">
						<label for="callout"><?php print _("Callout:"); ?></label>
						<input id="callout" type="text" maxlength="100" placeholder="Between $5-$8, On Sale Now"  data-bind="value: callout" class="form-control">
					</div>
				
				</div>
				<!-- /#settings-basic -->
				
				<div id="settings-event" class="segment">
				
					<div class="form-group">
						<label for="beginDate"><?php print _("Begin Date:"); ?></label>
						<input id="beginDate" type="date" class="form-control" data-bind="value: localBeginDate">
					</div>
					
					<div class="form-group">
						<label for="beginTime"><?php print _("Begin Time:"); ?></label>
						<input id="beginTime" type="time" class="form-control" data-bind="value: localBeginTime">
					</div>
					
					<div class="form-group">
						<label for="endDate"><?php print _("End Date:"); ?></label>
						<input id="endDate" type="date" class="form-control" data-bind="value: localEndDate">
					</div>
					
					<div class="form-group">
						<label for="endTime"><?php print _("End Time:"); ?></label>
						<input id="endTime" type="time" class="form-control" data-bind="value: localEndTime">
					</div>
				
				</div>
				<!-- /#settings-event -->
				
				<div id="settings-location" class="segment">
				
					<div class="form-group">
						<label for="location"><?php print _("Location:"); ?></label>
						<input id="location" type="text" maxlength="128" data-bind="value: location" class="form-control" placeholder="1234 Main Street, Some City, LA 90210">
					</div>
					
					<div class="form-group">
						<label for="lat"><?php print _("Latitude:"); ?></label>
						<input id="lat" type="number" data-bind="value: latitude" class="form-control">
					</div>
					
					<div class="form-group">
						<label for="long"><?php print _("Longitude:"); ?></label>
						<input id="long" type="number" data-bind="value: longitude" class="form-control">
					</div>
				
				</div>
				<!-- /#settings-event -->
				
				<div id="settings-advanced" class="segment">
				
					<div class="form-group">
						<label for="rss" class="control-label"><?php print _("RSS:"); ?></label>  
						<span class="checklist" data-bind="foreach: $parent.pageTypes">
							<label class="checkbox"><input type="checkbox" class="rss" data-bind="value: friendlyId, checked: ($parent.rss().indexOf(friendlyId())>-1), attr:{'data-rss': $parent.rss, 'data-friendlyId': friendlyId}"> <span data-bind="text:typeP"></span></label>
						</span>
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
				<!-- /#settings-advanced -->
				
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