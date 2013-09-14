<?php    
	include 'app.php'; // import php files
	
	$authUser = new AuthUser(); // get auth user
	$authUser->Authenticate('All');
?>
<!DOCTYPE html>
<html>

<head>
	
<title>Menu&mdash;<?php print $authUser->SiteName; ?></title>

<meta name="viewport" content="width=device-width, initial-scale=1.0">

<!-- include css -->
<link href="<?php print BOOTSTRAP_CSS; ?>" rel="stylesheet">
<link href="<?php print FONTAWESOME_CSS; ?>" rel="stylesheet">
<link type="text/css" href="css/app.css" rel="stylesheet">
<link type="text/css" href="css/page.css" rel="stylesheet">
<link type="text/css" href="css/messages.css" rel="stylesheet">
<link type="text/css" href="css/menu.css" rel="stylesheet">
<link type="text/css" href="css/pages.css" rel="stylesheet">
<link type="text/css" href="css/list.css" rel="stylesheet">
<link type="text/css" href="css/menuItems.css" rel="stylesheet">

</head>

<body data-currpage="menu">

<p id="message">
  <span>Holds the message text.</span>
  <a class="close" href="#"></a>
</p>
	
<?php include 'modules/menu.php'; ?>
			
<section class="main">

    <nav>
        <a class="show-menu"><i class="icon-reorder icon-large"></i></a>
    
        <ul>
            <li class="static" data-bind="click: showPrimary, css: {active: type()=='primary'}"><a>Primary</a></li>
        	<li class="static" data-bind="click: showFooter, css: {active: type()=='footer'}"><a>Footer</a></li>
    	<!-- ko foreach: menuTypes -->
    		<li data-bind="css: {active: $parent.type()==friendlyId()}"><a data-bind="text: name, attr:{'data-friendlyid':friendlyId}, click:$parent.showMenuType"></a> <i class="icon-minus-sign icon-large"  data-bind="click: $parent.showRemoveMenuTypeDialog"></i></li>
    	<!-- /ko -->
            <li class="add"><i class="icon-plus-sign icon-large" data-bind="click: showAddMenuTypeDialog"></i></li>
        </ul>
        
        <a class="primary-action" data-bind="click: showAddDialog"><i class="icon-plus-sign icon-large"></i> Add Menu Item</a>
    </nav>

	<div id="menuItemsList" class="list" data-bind="foreach: menuItems">
    
        <div class="listItem sortable" data-bind="attr:{'data-id':menuItemUniqId}">
            <a class="remove" data-bind="click: $parent.showRemoveDialog"><i class="not-published icon-minus-sign icon-large"></i></a>
            <span class="hook"></span>
            <h2><a data-bind="text: name, click: $parent.showEditDialog"></a> <small data-bind="text: url"></small></h2>
        </div>
		<!-- /.listItem -->
    
	</div>
	<!-- /.list -->
    
    <p data-bind="visible: menuLoading()" class="list-loading"><i class="icon-spinner icon-spin"></i> Loading...</p>

    <p data-bind="visible: menuLoading()==false && menuItems().length < 1" class="list-none">No menu items here. Click Add Menu Item to get started.</p>
    
    <button id="save" class="primary-button"style="display: none; margin-left: 20px" data-bind="click:saveOrder">Save Order</button>
	
</section>
<!-- /.main -->

<!-- begin add/edit dialog -->
<div class="modal fade" id="addEditDialog">

	<div class="modal-dialog">
	
		<div class="modal-content">

			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal">x</button>
				<h3></h3>
			</div>
			<!-- /.modal-header -->
			
			<div class="modal-body">
			
	
				<div class="form-group">
					<label for="name" class="control-label">Label:</label>
					<input id="name" type="text" value="" maxlength="140" class="form-control">
				</div>
			
				<div class="form-group">
					<label for="cssClass" class="control-label">CSS Class:</label>
					<input id="cssClass" type="text" value="" maxlength="140" class="form-control">
				</div>
			
				<div class="edit">
			    
					<div class="form-group">
						<label for="editUrl" class="control-label">Url:</label>
						<input id="editUrl" value="" maxlength="140" class="form-control">
					</div>
					
				</div>
				<!-- /#editUrl -->
				
				<div class="add">
			    
					<div class="form-group">
						<label class="radio"><input id="existing" type="radio" name="content" checked> Existing Page</label>
					</div>	
					
					<div class="form-group">
						<div id="selectPage" class="select">
		                	<ul data-bind="foreach: pages">
			                  <li data-bind="attr:{'data-pageid': pageId, 'data-url': url}">
			                    <span data-bind="text:name"></span>
			                    <small data-bind="text:url"></small>
			                  </li>
			                </ul>
						</div>
					</div>
					
					<div class="form-group">
						<label class="radio"><input id="customUrl" type="radio" name="content"> Custom URL</label>
					</div>
					
					<div class="form-group">
						<input id="url" type="text" class="form-control">
					</div>
			
				</div>
				<!-- /#addUrl -->
		
			</div>
			<!-- /.modal-body -->

			<div class="modal-footer">
				<button class="secondary-button" data-dismiss="modal">Close</button>
				<button class="primary-button" data-bind="click: addEditMenuItem">Add Menu Item</button>
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
				<h3>Remove Menu Item</h3>
			</div>
			
			<div class="modal-body">
			
				<p>
					Are you sure that you want to delete <strong id="removeName">this page</strong>?
					</p>
			
			</div>
			<div class="modal-footer">
				<button class="secondary-button" data-dismiss="modal">Close</button>
				<button class="primary-button" data-bind="click: removeMenuItem">Remove Menu Item</button>
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
				<h3>Add Menu Type</h3>
			</div>
			<!-- /.modal-header -->
			
			<div class="modal-body">
			
			<div class="form-group">
				<label for="menuTypeName" class="control-label">Name:</label>
				<input id="menuTypeName" value="" maxlength="50" class="form-control">
			</div>
			
			<div class="form-group">
				<label for="menuTypeFriendlyId" class="control-label">Friendly Id:</label>
				<input id="menuTypeFriendlyId" value="" maxlength="50" class="form-control">
				<span class="help-block">Lowercase, no spaces, must be unique</span>
			</div>
			
			</div>
			<!-- /.modal-body -->
			
			<div class="modal-footer">
				<button class="secondary-button" data-dismiss="modal">Close</button>
				<button class="primary-button" data-bind="click: addMenuType" class="form-control">Add Menu Type</button>
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

<div class="modal hide" id="deleteMenuTypeDialog">
  <div class="modal-header">
    <button type="button" class="close" data-dismiss="modal">x</button>
    <h3>Remove Menu Type</h3>
  </div>
  <!-- /.modal-header -->

  <div class="modal-body">

	<p>
		Are you sure that you want to delete <strong id="removeName">this menu type</strong>?
	</p>

  </div>
  <!-- /.modal-body -->

  <div class="modal-footer">
    <button class="secondary-button" data-dismiss="modal">Close</button>
    <button class="primary-button" data-bind="click: removeMenuType">Remove Menu Type</button>
  </div>
  <!-- /.modal-footer -->

</div>
<!-- /.modal -->
	
</body>

<!-- include js -->
<script type="text/javascript" src="<?php print JQUERY_JS; ?>"></script>
<script type="text/javascript" src="<?php print JQUERYUI_JS; ?>"></script>
<script type="text/javascript" src="<?php print BOOTSTRAP_JS; ?>"></script>
<script type="text/javascript" src="<?php print KNOCKOUT_JS; ?>"></script>
<script type="text/javascript" src="js/helper/moment.min.js"></script>
<script type="text/javascript" src="js/global.js"></script>
<script type="text/javascript" src="js/messages.js"></script>
<script type="text/javascript" src="js/viewModels/models.js"></script>
<script type="text/javascript" src="js/viewModels/menusModel.js"></script>

</html>