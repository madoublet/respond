<?php    
	include 'app.php'; // import php files
	
	$authUser = new AuthUser(); // get auth user
	$authUser->Authenticate('Admin');
	
	Utilities::SetLanguage($authUser->Language); // set language
?>
<!DOCTYPE html>
<html lang="<?php print str_replace('_', '-', $authUser->Language) ?>">

<head>
	
<title><?php print _("Files"); ?>&mdash;<?php print $authUser->SiteName; ?></title>

<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
<meta http-equiv="content-type" content="text/html; charset=utf-8">

<!-- include css -->
<?php include 'modules/css.php'; ?>
<link type="text/css" href="css/dropzone.css?v=<?php print VERSION; ?>" rel="stylesheet">

</head>

<body>

<?php include 'modules/menu.php'; ?>

<!-- messages -->
<input id="msg-extension-match" value="<?php print _("The extensions must match when editing an existing file"); ?>" type="hidden">
<input id="msg-drag" value="<?php print _("Drag file here or click to upload"); ?>" type="hidden">
<input id="msg-drag-replace" value="<?php print _("Drag file here to replace selected file"); ?>" type="hidden">
<input id="msg-remove-successfully" value="<?php print _("The file was removed successfully"); ?>" type="hidden">
		
<section class="main">

    <nav>
        <a class="show-menu"><i class="fa fa-bars fa-lg"></i></a>
    
        <ul>
    	    <li class="static active"><a><?php print _("Files"); ?></a></li>
        </ul>
    </nav>
    
    
    <div id="drop" class="dropzone dark">
        <span class="dz-message">
            <i class="fa fa-cloud-upload fa-4x"></i> <?php print _("Drag file here or click to upload"); ?></span>
        </span>
    </div>
    
    <div class="list has-dropzone" data-bind="foreach: files">
    
        <div class="listItem" data-bind="css: {'has-thumb': isImage==true}">
        	<a class="edit" data-bind="click: $parent.edit"><i class="fa fa-pencil fa-lg"></i></a>
    		<a class="remove" data-bind="click: $parent.showRemoveDialog"><i class="fa fa-minus-circle fa-lg"></i></a>
    		<a class="cancel-edit" data-bind="click: $parent.undoEdit">
    			<i class="fa fa-undo fa-lg"></i>
    		</a>
    		
    		<span class="editable-selected"><?php print _("Selected"); ?></span>
            
            <span class="image" data-bind="if: isImage"><img height="75" width="75" data-bind="attr:{'src':thumbUrl}"></span>
            
        	<h2><a data-bind="text:filename, attr: { 'href': fullUrl }"></a></h2>
            <em data-bind="if: isImage"><span data-bind="text: width"></span>px x <span data-bind="text: height"></span>px</em>
       
    	</div>
    	<!-- /.listItem -->
    
    </div>
    <!-- /.list -->
    
    <p data-bind="visible: filesLoading()" class="list-loading"><i class="fa fa-spinner fa fa-spin"></i> <?php print _("Loading..."); ?></p>
    
    <p data-bind="visible: filesLoading()==false && files().length < 1" class="list-none"><?php print _("No files here. Click Upload File to get started."); ?></p>
      
</section>
<!-- /.main -->

<div class="modal fade" id="deleteDialog">

	<div class="modal-dialog">
	
		<div class="modal-content">
		
			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal">x</button>
				<h3><?php print _("Remove File"); ?></h3>
			</div>
			<!-- /.modal-header -->
			
			<div class="modal-body">
			
				<p>
					<?php print _("Confirm you want to delete:"); ?> <strong id="removeName"></strong>
				</p>
				
				<p>
					<?php print _("This will completely remove it from the system."); ?>
				</p>
			
			</div>
			<!-- /.modal-body -->
			
			<div class="modal-footer">
				<button class="secondary-button" data-dismiss="modal"><?php print _("Close"); ?></button>
				<button class="primary-button" data-bind="click: removeFile"><?php print _("Remove File"); ?></button>
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
<script type="text/javascript" src="js/helper/dropzone.js?v=<?php print VERSION; ?>"></script>
<script type="text/javascript" src="js/viewModels/models.js?v=<?php print VERSION; ?>"></script>
<script type="text/javascript" src="js/viewModels/filesModel.js?v=<?php print VERSION; ?>"></script>

</html>