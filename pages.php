<?php    
    include 'app.php'; // import php files
	
	$authUser = new AuthUser(); // get auth user
	$authUser->Authenticate('All');	
?>
<!DOCTYPE html>
<html>

<head>
	
<title><?php print $authUser->SiteName; ?></title>

<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta http-equiv="content-type" content="text/html; charset=utf-8">

<!-- include css -->
<link href="<?php print BOOTSTRAP_CSS; ?>" rel="stylesheet">
<link href="<?php print FONTAWESOME_CSS; ?>" rel="stylesheet">
<link type="text/css" href="css/app.css" rel="stylesheet">
<link type="text/css" href="css/messages.css" rel="stylesheet">
<link type="text/css" href="css/list.css" rel="stylesheet">

</head>

<body data-currpage="pages">
	
<p id="message">
  <span>Holds the message text.</span>
  <a class="close" href="#"></a>
</p>
	
<?php include 'modules/menu.php'; ?>

<section class="main">

    <nav>
        <a class="show-menu"><i class="icon-reorder icon-large"></i></a>
    
        <ul>
            <li class="root" data-bind="click: switchPageType, css: {'active': friendlyId()=='root'}"><a data-friendlyid="root" data-pagetypeuniqid="-1" data-types="Page" data-typep="Pages">/</a></li>
        	<!--ko foreach: pageTypes -->
    		<li data-bind="css: {'active': friendlyId()==$parent.friendlyId()}"><a data-bind="text: dir, attr: {'data-friendlyid': friendlyId, 'data-pagetypeuniqid': pageTypeUniqId, 'data-types': typeS, 'data-typep': typeP}, click: $parent.switchPageType"></a> <i data-bind="click: $parent.showRemovePageTypeDialog" class="icon-minus-sign icon-large"></i></li>
    		<!--/ko -->
            <li class="add"><i class="icon-plus-sign icon-large" data-bind="click: showAddPageTypeDialog"></i></li>
        </ul>
        
        <a class="primary-action" data-bind="click: showAddDialog"><i class="icon-plus-sign icon-large"></i> Add <span data-bind="text: typeS"></span></a>
    </nav>

    <div class="list" data-bind="foreach: pages">
    
    	<div class="listItem" data-bind="attr: { 'data-id': pageUniqId, 'data-name': name, 'data-isactive': isActive}">
    		<a class="remove" data-bind="click: $parent.showRemoveDialog">
                <i class="not-published icon-minus-sign icon-large"></i>
            </a>
    		<h2><a data-bind="text:name, attr: { 'href': editUrl }"></a></h2>
    		<p data-bind="text:description"></p>
    		<em>Last updated <span data-bind="text:friendlyDate"></span> by <span data-bind="text:lastModifiedFullName"></span></em>
    		<span class="status" data-bind="css: { 'published': isActive() == 1, 'not-published': isActive() == 0 }, click: $parent.toggleActive">
    			<i class="not-published icon-circle-blank icon-large"></i>
    			<i class="published icon-ok-sign icon-large"></i>
    		</span>
    	</div>
    	<!-- /.listItem -->
    
    </div>
    <!-- /.list -->
    
    <p data-bind="visible: pagesLoading()" class="list-loading"><i class="icon-spinner icon-spin"></i> Loading...</p>
    
    <p data-bind="visible: pagesLoading()==false && pages().length < 1" class="list-none">No <span data-bind="text: typeP().toLowerCase()"></span> here. Click Add <span data-bind="text: typeS"></span> to get started.</p>
      
</section>
<!-- /.main -->

<div class="modal hide" id="addDialog">
  <div class="modal-header">
    <button type="button" class="close" data-dismiss="modal">×</button>
    <h3>Add <span data-bind="text:typeS"></span></h3>
  </div>
  <div class="modal-body">
  	<form class="form-horizontal">
	<fieldset>
	
	<div class="control-group">
		<label for="name" class="control-label">Name:</label>
		<div class="controls">
			<input id="name" type="text" value="" class="span3" maxlength="255">
		</div>
	</div>
	
	</fieldset>
	<fieldset>
	
	<div class="control-group">
		<label for="URL" class="control-label">Friendly URL:</label>
		<div class="controls">
			<input id="friendlyId" type="text" maxlength="128" class="span2" value="" placeholder="page-name">
			<span class="help-block">No spaces, no special characters, dashes allowed.</span>
		<div>
	</div>

	</fieldset>

	<fieldset>

	<div class="control-group">
		<label for="description" class="control-label">Description:</label>
		<div class="controls">
			<textarea id="description" class="span3"></textarea>
		</div>
	</div>
	
	</fieldset>
		
	</form>
  </div>
  <div class="modal-footer">
    <button class="secondary-button" data-dismiss="modal">Close</button>
    <button class="primary-button" data-bind="click: addPage">Add <span data-bind="text: typeS"></span></button>
  </div>

</div>
<!-- /.modal -->

<div class="modal hide" id="deleteDialog">
  <div class="modal-header">
    <button type="button" class="close" data-dismiss="modal">×</button>
    <h3>Remove <span data-bind="text: typeS"></span></h3>
  </div>
  <div class="modal-body">
	
	<p>
		Are you sure that you want to remove <strong id="removeName">this page</strong>?
	</p>
	
	</div>
	<div class="modal-footer">
		<button class="secondary-button" data-dismiss="modal">Close</button>
		<button class="primary-button" data-bind="click: removePage">Remove <span data-bind="text: typeS"></span></button>
	</div>

</div>
<!-- /.modal -->

<div class="modal hide" id="deletePageTypeDialog">
  <div class="modal-header">
    <button type="button" class="close" data-dismiss="modal">×</button>
    <h3>Remove Page Type</h3>
  </div>
  <div class="modal-body">
    
    <p>
		Are you sure that you want to remove <strong id="removePageTypeName">this page type</strong>?
	</p>
	
	</div>
	<div class="modal-footer">
		<button class="secondary-button" data-dismiss="modal">Close</button>
    	<button class="primary-button" data-bind="click: removePageType">Remove Type</button>
	</div>

</div>
<!-- /.modal -->

<div class="modal hide" id="addPageTypeDialog">
  <div class="modal-header">
    <button type="button" class="close" data-dismiss="modal">x</button>
    <h3 id="AddEditTitle">Add Page Type</h3>
  </div>
  <!-- /.modal-header -->

  <div class="modal-body">

      <form class="form-horizontal">

		<div class="control-group">
			<label for="typeS" class="control-label">Name (singular):</label>
			<div class="controls">
				<input id="typeS"  value="" maxlength="100">
				<span class="help-block">e.g.: Page, Blog, Product, etc.</span>
			</div>
		</div>
		
		<div class="control-group">
			<label for="typeP" class="control-label">Name (Plural):</label>
			<div class="controls">
				<input id="typeP"  value="" maxlength="100">
				<span class="help-block">e.g.: Pages, Blogs, Products, etc.</span>
			</div>
		</div>
		
		<div class="control-group">
			<label for="typeFriendlyId" class="control-label">Friendly URL:</label>
			<div class="controls">
				<input id="typeFriendlyId" value="" maxlength="50">
				<span class="help-block">e.g. http://respondcms.com/[friendly-url]/. Must be lowercase with no spaces.</span>
			</div>
		</div>

	</form>
	<!-- /.form-horizontal -->

	</div>
	<!-- /.modal-body -->

	<div class="modal-footer">
		<button class="secondary-button" data-dismiss="modal">Close</button>
		<button class="primary-button" data-bind="click: addPageType">Add Type</button
	</div>

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
<script type="text/javascript" src="js/viewModels/pagesModel.js" defer="defer"></script>

</html>