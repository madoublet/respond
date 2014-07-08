<?php    
    include 'app.php'; // import php files
	
	$authUser = new AuthUser(); // get auth user
	$authUser->Authenticate('All');	
	
	Utilities::SetLanguage($authUser->Language); // set language
?>
<!DOCTYPE html>
<html lang="<?php print str_replace('_', '-', $authUser->Language) ?>">

<head>
	
<title><?php print _("Pages"); ?>&mdash;<?php print $authUser->SiteName; ?></title>

<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
<meta http-equiv="content-type" content="text/html; charset=utf-8">

<!-- include css -->
<?php include 'modules/css.php'; ?>

</head>

<body data-currpage="pages" data-timezone="<?php print $authUser->TimeZone; ?>" data-offset="<?php print $authUser->Offset(); ?>">
	
<?php include 'modules/menu.php'; ?>

<!-- messages -->
<input id="msg-add-error" value="<?php print _("Name and Friendly URL are required"); ?>" type="hidden">
<input id="msg-adding" value="<?php print _("Adding..."); ?>" type="hidden">
<input id="msg-added" value="<?php print _("Page added successfully"); ?>" type="hidden">
<input id="msg-removing" value="<?php print _("Removing..."); ?>" type="hidden">
<input id="msg-removed" value="<?php print _("Page removed successfully"); ?>" type="hidden">
<input id="msg-remove-error" value="<?php print _("There was a problem removing the page"); ?>" type="hidden">
<input id="msg-all-required" value="<?php print _("All fields are required"); ?>" type="hidden">
<input id="msg-type-adding" value="<?php print _("Adding..."); ?>" type="hidden">
<input id="msg-type-added" value="<?php print _("Page type added successfully"); ?>" type="hidden">
<input id="msg-type-updating" value="<?php print _("Updating..."); ?>" type="hidden">
<input id="msg-type-updated" value="<?php print _("Page type updated successfully"); ?>" type="hidden">
<input id="msg-type-removing" value="<?php print _("Removing..."); ?>" type="hidden">
<input id="msg-type-removed" value="<?php print _("Page type removed successfully"); ?>" type="hidden">
<input id="msg-type-remove-error" value="<?php print _("There was a problem removing the page type"); ?>" type="hidden">
<input id="msg-unpublished" value="<?php print _("The page was un-published successfully"); ?>" type="hidden">
<input id="msg-published" value="<?php print _("The page was published successfully"); ?>" type="hidden">
<input id="msg-publish-error" value="<?php print _("There was a problem publishing/un-publishing the page"); ?>" type="hidden">
<input id="msg-category-adding" value="<?php print _("Adding..."); ?>" type="hidden">
<input id="msg-category-added" value="<?php print _("Category added successfully"); ?>" type="hidden">
<input id="msg-category-removing" value="<?php print _("Removing..."); ?>" type="hidden">
<input id="msg-category-removed" value="<?php print _("Category removed successfully"); ?>" type="hidden">
<input id="msg-category-remove-error" value="<?php print _("There was a problem removing the category"); ?>" type="hidden">

<input id="can-create" type="hidden" value="<?php print $authUser->CanCreate; ?>">
<input id="can-remove" type="hidden" value="<?php print $authUser->CanRemove; ?>">

<section class="main">

    <nav>
        <a class="show-menu"><i class="fa fa-bars fa-lg"></i></a>
        
        <div class="fs-container">
    
			<div class="fs">
			
		        <ul>
		        
		        	<?php if($authUser->Access=='All' || strpos($authUser->Access, 'root') !== FALSE){ ?>
		        
		            <li id="root-item" class="root" data-bind="click: switchPageType, css: {'active': friendlyId()=='root'}"><a data-friendlyid="root" data-pagetypeuniqid="-1" data-types="Page" data-typep="Pages" data-layout="content" data-stylesheet="content">/</a></li>
		            
		            <?php } ?>
		            
		        	<!--ko foreach: pageTypes -->
		    		<li 
		    			<?php if($authUser->Role=='Admin'){ ?>class="has-action"<?php } ?>
						data-bind="css: {'active': friendlyId()==$parent.friendlyId(), 'is-secure': isSecure()==1}">
		    			
		    			<a data-bind="html: dir, attr: {'data-friendlyid': friendlyId, 'data-pagetypeuniqid': pageTypeUniqId, 'data-types': typeS, 'data-typep': typeP, 'data-layout': layout, 'data-stylesheet': stylesheet, 'data-issecure': isSecure}, click: $parent.switchPageType">
						</a> 
						
			    		<?php if($authUser->Role=='Admin'){ ?>
			    		<i data-bind="click: $parent.showRemovePageTypeDialog" class="fa fa-minus-circle show-tooltip" title="<?php print _("Remove Page Type"); ?>"></i>
			    		<?php } ?>
			    		
		    		</li>
		    		<!--/ko -->
		    		
		    		<?php if($authUser->Role=='Admin'){ ?>
		            <li class="add"><i class="fa fa-plus-circle show-tooltip" data-bind="click: showAddPageTypeDialog" title="<?php print _("Add Page Type"); ?>"></i></li>
		             <?php } ?>
		        </ul>
	        
			</div>
			<!-- /.fs -->
        
        </div>
        <!-- /.fs-container -->
        
        <a id="add-page" class="primary-action show-tooltip" data-bind="click: showAddDialog" title="<?php print _("Add Page"); ?>"><i class="fa fa-plus-circle"></i></a>
  
    </nav>
    
    <div class="list-menu">
    	<?php include 'modules/account.php'; ?>
    	
		<div class="list-menu-actions">
		
			<div id="categories" class="categories btn-group" data-bind="visible: pageTypeUniqId()!=-1">
				<button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown">
				  <span class="current-category"><?php print _("All Categories"); ?></span> <i class="fa fa-angle-down"></i>
				</button>
				<ul class="dropdown-menu">
				  <li><a data-bind="click:resetCategory"><?php print _("All Categories"); ?></a></li>
				  <!--ko foreach: categories -->
				  <li><a data-bind="text:name, click: $parent.setCategory"></a><i data-bind="click: $parent.showRemoveCategoryDialog" class="fa fa-minus-circle remove"></i></li>
				  <!--/ko -->
				  <li role="presentation" class="divider"></li>
				  <li><a data-bind="click:showAddCategoryDialog"><?php print _("Add Category"); ?></a></li>
				</ul>
			</div>
		
    		<a title="<?php print _("Sort by Last Modified"); ?>" class="active" data-bind="click:sortDate"><i class="fa fa-sort-amount-desc"></i></a>
			<a title="<?php print _("Sort by Name"); ?>"><i class="fa fa-sort-alpha-asc" data-bind="click:sortName"></i></a>
			<a><i class="fa fa-cog" data-bind="click: showEditPageTypeDialog, visible: pageTypeUniqId()!=-1"></i></a>
		</div>
    </div>

    <div class="list" data-bind="foreach: pages">
    
    	<div class="listItem" data-bind="attr: { 'data-id': pageUniqId, 'data-name': name, 'data-isactive': isActive}, css: {'has-thumb': thumb()!=''}">
        
            <span class="image" data-bind="if: thumb()!=''"><img height="75" width="75" data-bind="attr:{'src':thumb}"></span>
        
	
    		<a class="remove" data-bind="click: $parent.showRemoveDialog, visible: canRemove">
                <i class="fa fa-minus-circle"></i>
            </a>
            
    		<h2>
    		<a data-bind="text:name, attr: { 'href': editUrl}, visible: (canEdit || canPublish)"></a>
    		<span data-bind="text: name, visible: (!canEdit() && !canPublish())"></span>
    		
    		<span class="draft-tag" data-bind="visible:hasDraft"><?php print _("Draft"); ?></span></h2>
    		<p data-bind="text:description"></p>
    		<em><?php print _("Last updated"); ?> <span data-bind="text:friendlyDate"></span> <?php print _("by"); ?> <span data-bind="text:lastModifiedFullName"></span></em>
    		

    		<span class="status" data-bind="visible: canPublish, css: { 'published': isActive() == 1, 'not-published': isActive() == 0 }, click: $parent.toggleActive">
    			<i class="not-published fa fa-circle-o"></i>
    			<i class="published fa fa-check-circle"></i>
    		</span>
    		
    	</div>
    	<!-- /.listItem -->
    
    </div>
    <!-- /.list -->
    
    <p data-bind="visible: pagesLoading()" class="list-loading"><i class="fa fa-spinner fa-spin"></i> <?php print _("Loading..."); ?></p>
    
    <p data-bind="visible: pagesLoading()==false && pages().length < 1" class="list-none"><?php print _("No pages here. Click Add Page to get started."); ?></p>
      
</section>
<!-- /.main -->

<div class="modal fade" id="addDialog">

	<div class="modal-dialog">
	
		<div class="modal-content">
		
			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal">×</button>
				<h3><?php print _("Add Page"); ?></h3>
			</div>
			<div class="modal-body">
				
				<div class="form-group">
					<label for="name" class="control-label"><?php print _("Name:"); ?></label>
					<input id="name" type="text" value="" maxlength="255" class="form-control">
				</div>
				
				<div class="form-group">
					<label for="URL" class="control-label"><?php print _("Friendly URL:"); ?></label>
					<input id="friendlyId" type="text" maxlength="128" value="" placeholder="page-name" class="form-control">
					<span class="help-block"><?php print _("No spaces, no special characters, dashes allowed."); ?></span>
				</div>
				
				<div class="form-group">
					<label for="description" class="control-label"><?php print _("Description:"); ?></label>
					<textarea id="description" class="form-control"></textarea>
				</div>
				
				<div class="form-group" data-bind="visible: categories().length>0">
					<label for="categories-list" class="control-label"><?php print _("Categories:"); ?></label>  
					<span class="checklist categories-list" data-bind="foreach: categories">
						<label class="checkbox"><input type="checkbox" data-bind="value: categoryUniqId"> <span data-bind="text:name"></span></label>
					</span>
				</div>
				
			</div>
			<div class="modal-footer">
				<button class="secondary-button" data-dismiss="modal"><?php print _("Close"); ?></button>
				<button class="primary-button" data-bind="click: addPage"><?php print _("Add Page"); ?></button>
			</div>
			<!-- /.modal-footer -->
			
		</div>
		<!-- /.modal-content -->
		
	</div>
	<!-- /.modal-dialog -->

</div>
<!-- /.modal -->

<div class="modal fade" id="deleteDialog">

	<div class="modal-dialog">
	
		<div class="modal-content">
		
			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal">×</button>
				<h3><?php print _("Remove Page"); ?></h3>
			</div>
			<div class="modal-body">
			
			<p>
				<?php print _("Confirm that you want to remove:"); ?> <strong id="removeName">this page</strong>
			</p>
			
			</div>
			<div class="modal-footer">
				<button class="secondary-button" data-dismiss="modal"><?php print _("Close"); ?></button>
				<button class="primary-button" data-bind="click: removePage"><?php print _("Remove Page"); ?></button>
			</div>
			<!-- /.modal-footer -->
			
		</div>
		<!-- /.modal-content -->
		
	</div>
	<!-- /.modal-dialog -->

</div>
<!-- /.modal -->

<div class="modal fade" id="deletePageTypeDialog">

	<div class="modal-dialog">
	
		<div class="modal-content">
		
			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal">×</button>
				<h3><?php print _("Remove Page Type"); ?></h3>
			</div>
			
			<div class="modal-body">
			
				<p data-bind="visible: pages().length == 0">
					<?php print _("Confirm you want to remove:"); ?> <strong id="removePageTypeName">this page type</strong>
				</p>
				
				<p data-bind="visible: pages().length > 0">
					<?php print _("Please remove all pages first."); ?></strong>
				</p>
				
			</div>
			
			<div class="modal-footer">
				<button class="secondary-button" data-dismiss="modal"><?php print _("Close"); ?></button>
				<button class="primary-button" data-bind="click: removePageType, visible: pages().length == 0"><?php print _("Remove Type"); ?></button>
			</div>
			<!-- /.modal-footer -->
			
		</div>
		<!-- /.modal-content -->
		
	</div>
	<!-- /.modal-dialog -->

</div>
<!-- /.modal -->

<div class="modal fade" id="pageTypeDialog">

	<div class="modal-dialog">
	
		<div class="modal-content">
			
			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal">x</button>
				<h3 class="add"><?php print _("Add Page Type"); ?></h3>
				<h3 class="edit"><?php print _("Update Page Type"); ?></h3>
			</div>
			<!-- /.modal-header -->

			<div class="modal-body">
			
				<div class="form-group">
					<label for="typeS" class="control-label"><?php print _("Name (singular):"); ?></label>
					<input id="typeS"  value="" maxlength="100" class="form-control">
					<span class="add help-block"><?php print _("e.g.: Page, Blog, Product, etc."); ?></span>
				</div>
				
				<div class="form-group">
					<label for="typeP" class="control-label"><?php print _("Name (Plural):"); ?></label>
					<input id="typeP"  value="" maxlength="100" class="form-control">
					<span class="add help-block"><?php print _("e.g.: Pages, Blogs, Products, etc."); ?></span>
				</div>
				
				<div class="add form-group">
					<label for="typeFriendlyId" class="control-label"><?php print _("Friendly URL:"); ?></label>
					<input id="typeFriendlyId" value="" maxlength="50" class="form-control">
					<span class="add help-block">e.g. http://respondcms.com/[friendly-url]/. <?php print _("Must be lowercase with no spaces."); ?></span>
				</div>
				
				<div class="form-group">
					<label for="layout" class="control-label"><?php print _("Default Layout:"); ?></label>
					<select id="layout" data-bind="options: layouts, value: layout" class="form-control"></select>
				</div>
				
				<div class="form-group">
					<label for="stylesheet" class="control-label"><?php print _("Default Styles:"); ?></label>
					<select id="stylesheet" data-bind="options: stylesheets, value: stylesheet" class="form-control"></select>
				</div>
				
				<div class="form-group">
					<label for="stylesheet" class="control-label"><?php print _("Requires Login:"); ?></label>
					<select id="isSecure" class="form-control">
						<option value="0">No</option>
						<option value="1">Yes</option>
					</select>
				</div>
			
			</form>
			<!-- /.form-horizontal -->
			
			</div>
			<!-- /.modal-body -->
			
			<div class="modal-footer">
				<button class="secondary-button" data-dismiss="modal"><?php print _("Close"); ?></button>
				<button class="add primary-button" data-bind="click: addPageType"><?php print _("Add Type"); ?></button>
				<button class="edit primary-button" data-bind="click: editPageType"><?php print _("Update Type"); ?></button>
			</div>
			<!-- /.modal-footer -->
			
		</div>
		<!-- /.modal-content -->
		
	</div>
	<!-- /.modal-dialog -->

</div>
<!-- /.modal -->

<div class="modal fade" id="addCategoryDialog">

	<div class="modal-dialog">
	
		<div class="modal-content">
		
			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal">×</button>
				<h3><?php print _("Add Category"); ?></h3>
			</div>
			<div class="modal-body">
				
				<div class="form-group">
					<label for="name" class="control-label"><?php print _("Name:"); ?></label>
					<input id="categoryName" type="text" value="" maxlength="255" class="form-control">
				</div>
				
				<div class="form-group">
					<label for="URL" class="control-label"><?php print _("Friendly URL:"); ?></label>
					<input id="categoryFriendlyId" type="text" maxlength="128" value="" placeholder="category-name" class="form-control">
					<span class="help-block">e.g. /list#category:name</span>
				</div>
				
			</div>
			<div class="modal-footer">
				<button class="secondary-button" data-dismiss="modal"><?php print _("Close"); ?></button>
				<button class="primary-button" data-bind="click: addCategory"><?php print _("Add Category"); ?></button>
			</div>
			<!-- /.modal-footer -->
			
		</div>
		<!-- /.modal-content -->
		
	</div>
	<!-- /.modal-dialog -->

</div>
<!-- /.modal -->

<div class="modal fade" id="deleteCategoryDialog">

	<div class="modal-dialog">
	
		<div class="modal-content">
		
			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal">×</button>
				<h3><?php print _("Remove Cateogry"); ?></h3>
			</div>
			
			<div class="modal-body">
			
				<p>
					<?php print _("Confirm you want to remove:"); ?> <strong id="removeCategoryName">this category</strong>
				</p>
				
			</div>
			
			<div class="modal-footer">
				<button class="secondary-button" data-dismiss="modal"><?php print _("Close"); ?></button>
				<button class="primary-button" data-bind="click: removeCategory"><?php print _("Remove Category"); ?></button>
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
<script type="text/javascript" src="js/viewModels/pagesModel.js?v=<?php print VERSION; ?>" defer="defer"></script>

</html>