<?php	
	include 'app.php'; // import php files
	
	$authUser = new AuthUser(); // get auth user
	$authUser->Authenticate('Admin');
	
	Utilities::SetLanguage($authUser->Language); // set language
?>
<!DOCTYPE html>
<html lang="<?php print str_replace('_', '-', $authUser->Language) ?>">

<head>
	
<title><?php print _("Roles"); ?>&mdash;<?php print $authUser->SiteName; ?></title>

<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
<meta http-equiv="content-type" content="text/html; charset=utf-8">

<!-- include css -->
<?php include 'modules/css.php'; ?>
<link type="text/css" href="css/dialog.css?v=<?php print VERSION; ?>" rel="stylesheet">
<link type="text/css" href="css/dropzone.css?v=<?php print VERSION; ?>" rel="stylesheet">

</head>

<body id="roles-page" data-currpage="roles" data-sitefriendlyid="<?php print $authUser->SiteFriendlyId; ?>">

<?php include 'modules/menu.php'; ?>

<!-- messages -->
<input id="msg-all-required" value="<?php print _("All fields are required"); ?>" type="hidden">
<input id="msg-match" value="<?php print _("The password must match the retype field"); ?>" type="hidden">
<input id="msg-adding" value="<?php print _("Adding..."); ?>" type="hidden">
<input id="msg-added" value="<?php print _("Role successfully added"); ?>" type="hidden">
<input id="msg-updating" value="<?php print _("Updating..."); ?>" type="hidden">
<input id="msg-updated" value="<?php print _("Role successfully updated"); ?>" type="hidden">
<input id="msg-removing" value="<?php print _("Removing..."); ?>" type="hidden">
<input id="msg-removed" value="<?php print _("Role successfully removed"); ?>" type="hidden">
		
<section class="main">

    <nav>
        <a class="show-menu"><i class="fa fa-bars fa-lg"></i></a>
    
        <ul>
            <li class="static"><a href="users"><?php print _("Users"); ?></a></li>
            <li class="static active"><a><?php print _("Roles"); ?></a></li>
        </ul>
        
        <a class="primary-action show-tooltip" data-bind="click: showAddDialog" title="<?php print _("Add Role"); ?>"><i class="fa fa-plus-circle"></i></span></a>
    </nav>


    <div id="rolesList" class="list">
    	<div class="listItem" data-id="Admin">
    		<h2>
    			<a data-bind="click: showEditDialog"
    				data-type="default"
    				data-view="All"	
					data-edit="All"
					data-publish="All"
					data-remove="All"
					data-create="All"
    				>Admin</a>
    		</h2>
            <em>Default</em>
    	</div>
    	
    	<div class="listItem" data-id="Contributor">
    		<h2>
    			<a data-bind="click: showEditDialog"
    				data-type="default"
    				data-view="All"	
					data-edit="All"
					data-publish=""
					data-remove=""
					data-create=""
    				>Contributor</a>
    		</h2>
            <em>Default</em>
    	</div>
    	
    	<div class="listItem" data-id="Member">
    		<h2>
    			<a data-bind="click: showEditDialog"
    				data-type="default"
    				data-view="All"	
					data-edit=""
					data-publish=""
					data-remove=""
					data-create=""
    				>Member</a>
    		</h2>
            <em>Default</em>
    	</div>
    	
    
    	<!-- ko foreach: roles -->
		<div class="listItem">
    		<a class="remove" data-bind="click: $parent.showRemoveDialog">
                <i class="fa fa-minus-circle"></i>
            </a>
    		<h2>
    			<a data-bind="text:name, click: $parent.showEditDialog,
    				attr:{'data-view':canView, 'data-edit':canEdit, 'data-publish':canPublish, 'data-remove':canRemove, 'data-create':canCreate}"
    				data-type="custom"></a>
    		</h2>
            <em>Custom</em>
    	</div>
    	<!-- /ko -->
    
    </div>
    <!-- /.list -->
    
    <p data-bind="visible: rolesLoading()" class="list-loading"><i class="fa fa-spinner fa-spin"></i> <?php print _("Loading..."); ?></p>
    

</section>
<!-- /.main -->

<div class="modal fade" id="addEditDialog">

	<div class="modal-dialog">
	
		<div class="modal-content">

			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal">x</button>
				<h3 class="add"><?php print _("Add Role"); ?></h3>
				<h3 class="edit"><?php print _("Update Role"); ?></h3>
			</div>
			<!-- /.modal-header -->

			<div class="modal-body">
			
				<div id="custom-name" class="form-group no-border">
					<label for="name"><?php print _("Name:"); ?></label>
					<input id="name" type="text" class="form-control">
					<span class="help-block"><?php print _("Uppercase first letter, e.g. Admin"); ?></span>
				</div>
				
				<p id="default-message" class="alert alert-info">
					<?php print _("Access for default roles cannot be changed; create a new role for custom access rules."); ?>
				</p>
				
				<table class="role-table table table-striped table-bordered">
					<col>
					<col width="15%">
					<col width="15%">
					<col width="15%">
					<col width="15%">
					<col width="15%">
					<thead>
						<tr>
							<th><?php print _("Page Type"); ?></th>
							<th class="text-center"><?php print _("View"); ?><small><?php print _("On Site"); ?></small></th>
							<th class="text-center"><?php print _("Edit"); ?><small><?php print _("In App"); ?></small></th>
							<th class="text-center"><?php print _("Publish"); ?><small><?php print _("In App"); ?></small></th>
							<th class="text-center"><?php print _("Remove"); ?><small><?php print _("In App"); ?></small></th>
							<th class="text-center"><?php print _("Create"); ?><small><?php print _("In App"); ?></small></th>
						</tr>
					</thead>
					<tbody>
						<tr class="all-row info">
							<td>All</td>
							<td class="text-center"><input class="chk-view-all" type="checkbox" type="form-control"></td>
							<td class="text-center"><input class="chk-edit-all" type="checkbox" type="form-control"></td>
							<td class="text-center"><input class="chk-publish-all" type="checkbox" type="form-control"></td>
							<td class="text-center"><input class="chk-remove-all" type="checkbox" type="form-control"></td>
							<td class="text-center"><input class="chk-create-all" type="checkbox" type="form-control"></td>
						</tr>
						<tr class="root-row">
							<td>/</td>
							<td class="text-center">&nbsp;</td>
							<td class="text-center"><input class="chk-edit-root chk-edit" type="checkbox" type="form-control" value="root"></td>
							<td class="text-center"><input class="chk-publish-root chk-publish" type="checkbox" type="form-control" value="root"></td>
							<td class="text-center"><input class="chk-remove-root chk-remove" type="checkbox" type="form-control" value="root"></td>
							<td class="text-center"><input class="chk-create-root chk-create" type="checkbox" type="form-control" value="root"></td>
						</tr>
						<!-- ko foreach: pageTypes -->
						<tr class="type-row">
							<td data-bind="html: dir"></td>
							<td class="text-center"><input class="chk-view" type="checkbox" type="form-control" data-bind="visible: isSecure()==1, css: 'chk-view-' + pageTypeUniqId(), value: pageTypeUniqId"></td>
							<td class="text-center"><input class="chk-edit" type="checkbox" type="form-control" data-bind="css: 'chk-edit-' + pageTypeUniqId(), value: pageTypeUniqId"></td>
							<td class="text-center"><input class="chk-publish" type="checkbox" type="form-control" data-bind="css: 'chk-publish-' + pageTypeUniqId(), value: pageTypeUniqId"></td>
							<td class="text-center"><input class="chk-remove" type="checkbox" type="form-control" data-bind="css: 'chk-remove-' + pageTypeUniqId(), value: pageTypeUniqId"></td>
							<td class="text-center"><input class="chk-create" type="checkbox" type="form-control" data-bind="css: 'chk-create-' + pageTypeUniqId(), value: pageTypeUniqId"></td>
						</tr>
						<!-- /ko -->
		    		</tbody>
				
				</table>
			
			
			</div>
			<!-- /.modal-body -->

			<div class="modal-footer">
				<button class="secondary-button" data-dismiss="modal"><?php print _("Close"); ?></button>
				<button class="primary-button add" type="button" data-bind="click: addRole"><?php print _("Add Role"); ?></button>
				<button id="update-role-btn" class="primary-button edit" type="button" data-bind="click: editRole"><?php print _("Update Role"); ?></button>
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

<div class="modal fade" id="deleteDialog">

	<div class="modal-dialog">
	
		<div class="modal-content">
		
			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal">x</button>
				<h3><?php print _("Remove Role"); ?></h3>
			</div>
			<!-- /.modal-header -->
			
			<div class="modal-body">
			
				<p>
				<?php print _("Confirm you want to remove:"); ?> <strong id="removeName">this role</strong>
				</p>
			
			</div>
			<!-- /.modal-body -->
			
			<div class="modal-footer">
				<button class="secondary-button" data-dismiss="modal"><?php print _("Close"); ?></button>
				<button class="primary-button" data-bind="click: removeRole"><?php print _("Remove Role"); ?></button>
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

</form>

</body>

<!-- include js -->
<?php include 'modules/js.php'; ?>
<script type="text/javascript" src="js/viewModels/models.js?v=<?php print VERSION; ?>"></script>
<script type="text/javascript" src="js/viewModels/rolesModel.js?v=<?php print VERSION; ?>"></script>

</html>