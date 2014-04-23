<div class="modal fade" id="listDialog">

	<!-- messages -->
	<input id="msg-select-list-error" value="<?php print _("You must select a type of list"); ?>" type="hidden">

	<div class="modal-dialog">
	
		<div class="modal-content">

			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal">×</button>
				<h3 class="add"><?php print _("Add List"); ?></h3>
				<h3 class="edit"><?php print _("Update List"); ?></h3>
			</div>
			<!-- /.modal-header -->
			
			<div class="modal-body">
			
			<div id="listPageTypeBlock" class="form-group">
				<label for="listPageType"><?php print _("Page Type:"); ?></label>
				<select id="listPageType" data-bind="foreach: pageTypes" class="form-control">
					<option data-bind="value: friendlyId, text: typeP"></option>
				</select>
			</div>
			
			<div class="form-group">
				<label for="listDisplay"><?php print _("Display:"); ?></label>
				<select id="listDisplay" class="form-control">
					<option value="list"><?php print _("List"); ?></option>
					<option value="blog"><?php print _("Blog"); ?></option>
					<option value="thumbnails"><?php print _("Thumbnails"); ?></option>
					<option value="calendar"><?php print _("Calendar"); ?></option>
					<option value="map"><?php print _("Map"); ?></option>
				</select>
			</div>
			
			<div class="form-group">
				<label for="listOrderBy"><?php print _("Order By:"); ?></label>
				<select id="listOrderBy" class="form-control">
					<option value="Name"><?php print _("Name"); ?></option>
					<option value="Created"><?php print _("Date Created (newest first)"); ?></option>
					<option value="BeginDate"><?php print _("Event Start Date (newest first)"); ?></option>
				</select>
			</div>
			
			<div class="form-group">
				<label for="listCategory"><?php print _("Filter By Category:"); ?></label>
				<select id="listCategory" class="form-control">
					<option value="-1"><?php print _("All Categories"); ?></option>
				<!--ko foreach: categories -->
					<option data-bind="value:categoryUniqId, text:name"></option>
				<!--/ko -->
				</select>
			</div>
			
			<div class="form-group">
				<label for="listDescLength"><?php print _("Description Length:"); ?></label>
				<input id="listDescLength" type="number" value="250" class="form-control">
			</div>
			
			<div class="form-group paging">
				<label for="listLength"><?php print _("Page Size:"); ?></label>
				<input id="listLength" type="number" value="10" class="form-control">
			</div>
			
			<div class="form-group paging">
				<label for="listPageResults"><?php print _("Page Results:"); ?></label>
				<select id="listPageResults" class="form-control">
					<option value="true"><?php print _("Yes"); ?></option>
					<option value="false"><?php print _("No"); ?></option>
				</select>
			</div>
			
			</div>
			<!-- /.modal-body -->
			
			<div class="modal-footer">
				<button class="secondary-button" data-dismiss="modal"><?php print _("Close"); ?></button>
				<button id="addList" class="primary-button add"><?php print _("Add List"); ?></button>
				<button id="updateList" class="primary-button edit"><?php print _("Update List"); ?></button>
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