<?php    
	include 'app.php'; // import php files
	
	$authUser = new AuthUser(); // get auth user
	$authUser->Authenticate('Admin');
	
	Utilities::SetLanguage($authUser->Language); // set language
?>
<!DOCTYPE html>
<html lang="<?php print str_replace('_', '-', $authUser->Language) ?>">

<head>
	
<title><?php print _("Menus"); ?>&mdash;<?php print $authUser->SiteName; ?></title>

<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
<meta http-equiv="content-type" content="text/html; charset=utf-8">

<!-- include css -->
<?php include 'modules/css.php'; ?>

</head>

<body data-currpage="menu">

<?php include 'modules/menu.php'; ?>

<!-- messages -->
<input id="msg-label-required" value="<?php print _("A label is required"); ?>" type="hidden">
<input id="msg-all-required" value="<?php print _("All fields are required"); ?>" type="hidden">
<input id="msg-adding" value="<?php print _("Adding..."); ?>" type="hidden">
<input id="msg-added" value="<?php print _("The menu item was added successfully"); ?>" type="hidden">
<input id="msg-updating" value="<?php print _("Updating..."); ?>" type="hidden">
<input id="msg-updated" value="<?php print _("The menu item was updated successfully"); ?>" type="hidden">
<input id="msg-order" value="<?php print _("The order was updated successfully"); ?>" type="hidden">
<input id="msg-removed" value="<?php print _("The menu item was removed successfully"); ?>" type="hidden">
<input id="msg-type-added" value="<?php print _("The menu type was added successfully"); ?>" type="hidden">
<input id="msg-type-removed" value="<?php print _("The menu type was removed successfully"); ?>" type="hidden">
			
<section class="main">

    <nav>
        <a class="show-menu"><i class="fa fa-bars fa-lg"></i></a>
        
        <div class="fs-container">
    
			<div class="fs">
    
		        <ul>
		            <li class="static" data-bind="click: showPrimary, css: {active: type()=='primary'}"><a><?php print _("Primary"); ?></a></li>
		        	<li class="static" data-bind="click: showFooter, css: {active: type()=='footer'}"><a><?php print _("Footer"); ?></a></li>
		    	<!-- ko foreach: menuTypes -->
		    		<li class="has-action" data-bind="css: {active: $parent.type()==friendlyId()}"><a data-bind="text: name, attr:{'data-friendlyid':friendlyId}, click:$parent.showMenuType"></a> <i class="fa fa-minus-circle show-tooltip"  data-bind="click: $parent.showRemoveMenuTypeDialog" title="<?php print _("Add Menu Type"); ?>"></i></li>
		    	<!-- /ko -->
		            <li class="add"><i class="fa fa-plus-circle show-tooltip" data-bind="click: showAddMenuTypeDialog" title="<?php print _("Add Menu Type"); ?>"></i></li>
		        </ul>
		        
			</div>
			<!-- /.fs -->
        
        </div>
        <!-- /.fs-container -->
        
        <a class="primary-action show-tooltip" data-bind="click: showAddDialog" title="<?php print _("Add Menu Item"); ?>"><i class="fa fa-plus-circle"></i></a>
    </nav>

	<div id="menu-republish-message" class="list-menu">
		<p>
			<?php print _("Updates to the menu will not be reflected until the site is re-published.."); ?>
			<a class="publish-site"><?php print _("Re-publish now"); ?></a>
		</p>
	</div>
	<!-- /.list-menu -->
	
	<div id="menuItemsList" class="list" data-bind="foreach: menuItems">
    
        <div class="listItem sortable" data-bind="css: {'is-nested': isNested()==1}, attr:{'data-id':menuItemUniqId, 'data-isnested':isNested}">
            <a class="remove" data-bind="click: $parent.showRemoveDialog"><i class="not-published fa fa-minus-circle"></i></a>
            <span class="hook fa fa-arrows-v"></span>
            <h2>
	            <span class="nested-left" data-bind="click: $parent.toggleIsNested">
	            	<i class="fa fa-angle-left arrow"></i> 
	            	<i class="fa fa-spinner fa-spin"></i>
	            </span> 
	            <span class="nested-right" data-bind="click: $parent.toggleIsNested">
	            	<i class="fa fa-angle-right arrow"></i> 
	            	<i class="fa fa-spinner fa-spin"></i>
	            </span>
	            <a data-bind="click: $parent.showEditDialog"><span class="name" data-bind="text:name"></span></a>
	            <span class="url" data-bind="text: url"></span>             
	        </h2>
        </div>
		<!-- /.listItem -->
    
	</div>
	<!-- /.list -->
    
    <p data-bind="visible: menuLoading()" class="list-loading"><i class="fa fa-spinner fa-spin"></i> <?php print _("Loading..."); ?></p>

    <p data-bind="visible: menuLoading()==false && menuItems().length < 1" class="list-none"><?php print _("No menu items here. Click Add Menu Item to get started."); ?></p>
    
    <button id="save" class="primary-button"style="display: none; margin-left: 20px" data-bind="click:saveOrder"><?php print _("Save Order"); ?></button>
	
</section>
<!-- /.main -->

<!-- begin add/edit dialog -->
<div class="modal fade" id="addEditDialog">

	<div class="modal-dialog">
	
		<div class="modal-content">

			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal">x</button>
				<h3 class="add"><?php print _("Add Menu Item"); ?></h3>
				<h3 class="edit"><?php print _("Update Menu Item"); ?></h3>
			</div>
			<!-- /.modal-header -->
			
			<div class="modal-body">
			
	
				<div class="form-group">
					<label for="name" class="control-label"><?php print _("Label:"); ?></label>
					<input id="name" type="text" value="" maxlength="140" class="form-control">
				</div>
			
				<div class="form-group">
					<label for="cssClass" class="control-label"><?php print _("CSS Class:"); ?></label>
					<input id="cssClass" type="text" value="" maxlength="140" class="form-control">
				</div>
			
				<div class="edit">
			    
					<div class="form-group">
						<label for="editUrl" class="control-label"><?php print _("Url:"); ?></label>
						<input id="editUrl" value="" maxlength="140" class="form-control">
					</div>
					
				</div>
				<!-- /#editUrl -->
				
				<div class="add">
			    
					<div class="form-group no-border">
						<label class="radio"><input id="existing" type="radio" name="content" checked> <?php print _("Existing Page"); ?></label>
					</div>	
					
					<div class="form-group no-border">
						<div id="selectPage" class="select">
		                	<ul data-bind="foreach: pages">
			                  <li data-bind="attr:{'data-pageid': pageId, 'data-url': url}">
			                    <span data-bind="text:name"></span>
			                    <small data-bind="text:url"></small>
			                  </li>
			                </ul>
						</div>
					</div>
					
					<div class="form-group no-border">
						<label class="radio"><input id="customUrl" type="radio" name="content"> <?php print _("Custom URL"); ?></label>
					</div>
					
					<div class="form-group">
						<input id="url" type="text" class="form-control">
					</div>
			
				</div>
				<!-- /#addUrl -->
		
			</div>
			<!-- /.modal-body -->

			<div class="modal-footer">
				<button class="secondary-button" data-dismiss="modal"><?php print _("Close"); ?></button>
				<button class="primary-button add" data-bind="click: addMenuItem"><?php print _("Add Menu Item"); ?></button>
				<button class="primary-button edit" data-bind="click: editMenuItem"><?php print _("Update Menu Item"); ?></button>
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
				<button type="button" class="close" data-dismiss="modal">×</button>
				<h3><?php print _("Remove Menu Item"); ?></h3>
			</div>
			
			<div class="modal-body">
			
				<p>
					<?php print _("Confirm that you want to remove:"); ?> <strong id="removeName">this page</strong>
				</p>
			
			</div>
			<div class="modal-footer">
				<button class="secondary-button" data-dismiss="modal"><?php print _("Close"); ?></button>
				<button class="primary-button" data-bind="click: removeMenuItem"><?php print _("Remove Menu Item"); ?></button>
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

<div class="modal fade" id="addMenuTypeDialog">

	<div class="modal-dialog">
	
		<div class="modal-content">
		
			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal">x</button>
				<h3><?php print _("Add Menu Type"); ?></h3>
			</div>
			<!-- /.modal-header -->
			
			<div class="modal-body">
			
			<div class="form-group">
				<label for="menuTypeName" class="control-label"><?php print _("Name:"); ?></label>
				<input id="menuTypeName" value="" maxlength="50" class="form-control">
			</div>
			
			<div class="form-group">
				<label for="menuTypeFriendlyId" class="control-label"><?php print _("Friendly Id:"); ?></label>
				<input id="menuTypeFriendlyId" value="" maxlength="50" class="form-control">
				<span class="help-block"><?php print _("Lowercase, no spaces, must be unique"); ?></span>
			</div>
			
			</div>
			<!-- /.modal-body -->
			
			<div class="modal-footer">
				<button class="secondary-button" data-dismiss="modal"><?php print _("Close"); ?></button>
				<button class="primary-button" data-bind="click: addMenuType" class="form-control"><?php print _("Add Menu Type"); ?></button>
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

<div class="modal fade" id="deleteMenuTypeDialog">

	<div class="modal-dialog">
	
		<div class="modal-content">

			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal">x</button>
				<h3><?php print _("Remove Menu Type"); ?></h3>
			</div>
			<!-- /.modal-header -->
			
			<div class="modal-body">
			
				<p>
					<?php print _("Are you sure that you want to delete"); ?> <strong id="removeName">this menu type</strong>?
				</p>
			
			</div>
			<!-- /.modal-body -->
			
			<div class="modal-footer">
				<button class="secondary-button" data-dismiss="modal"><?php print _("Close"); ?></button>
				<button class="primary-button" data-bind="click: removeMenuType"><?php print _("Remove Menu Type"); ?></button>
			</div>
			<!-- /.modal-footer -->
			
		</div>
		<!-- /.modal-content -->
		
	</div>
	<!-- /.modal-dialog -->

</div>
<!-- /.modal -->
	
</body>

<!-- include js -->
<?php include 'modules/js.php'; ?>
<script type="text/javascript" src="js/viewModels/models.js?v=<?php print VERSION; ?>"></script>
<script type="text/javascript" src="js/viewModels/menusModel.js?v=<?php print VERSION; ?>"></script>

</html>