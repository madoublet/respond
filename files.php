<?php    
	include 'app.php'; // import php files
	
	$authUser = new AuthUser(); // get auth user
	$authUser->Authenticate('All');
?>
<!DOCTYPE html>
<html>

<head>
	
<title>Files&mdash;<?php print $authUser->SiteName; ?></title>

<meta name="viewport" content="width=device-width, initial-scale=1.0">

<!-- include css -->
<link href="<?php print FONT; ?>" rel="stylesheet" type="text/css">
<link href="<?php print BOOTSTRAP_CSS; ?>" rel="stylesheet">
<link href="<?php print FONTAWESOME_CSS; ?>" rel="stylesheet">
<link type="text/css" href="css/app.css?v=<?php print VERSION; ?>" rel="stylesheet">
<link type="text/css" href="css/messages.css?v=<?php print VERSION; ?>" rel="stylesheet">
<link type="text/css" href="css/list.css?v=<?php print VERSION; ?>" rel="stylesheet">
<link type="text/css" href="css/dropzone.css?v=<?php print VERSION; ?>" rel="stylesheet">

</head>

<body>

<p id="message">
  <span>Holds the message text.</span>
  <a class="close" href="#"></a>
</p>

<?php include 'modules/menu.php'; ?>
		
<section class="main">

    <nav>
        <a class="show-menu"><i class="fa fa-bars fa-lg"></i></a>
    
        <ul>
    	    <li class="static active"><a>Files</a></li>
        </ul>
    </nav>
    
    
    <div id="drop" class="dropzone dark">
        <span class="dz-message">
            <i class="fa fa-cloud-upload fa-4x"></i> Drag file here or click to upload</span>
        </span>
    </div>
    
    <div class="list has-dropzone" data-bind="foreach: files">
    
        <div class="listItem" data-bind="css: {'has-thumb': isImage==true}">
        	<a class="edit" data-bind="click: $parent.edit"><i class="fa fa-pencil fa-lg"></i></a>
    		<a class="remove" data-bind="click: $parent.showRemoveDialog"><i class="fa fa-minus-circle fa-lg"></i></a>
    		<a class="cancel-edit" data-bind="click: $parent.undoEdit">
    			<i class="fa fa-undo fa-lg"></i>
    		</a>
    		
    		<span class="editable-selected">Selected</span>
            
            <span class="image" data-bind="if: isImage"><img height="75" width="75" data-bind="attr:{'src':thumbUrl}"></span>
            
        	<h2><a data-bind="text:filename, attr: { 'href': fullUrl }"></a></h2>
            <em data-bind="if: isImage"><span data-bind="text: width"></span>px x <span data-bind="text: height"></span>px</em>
       
    	</div>
    	<!-- /.listItem -->
    
    </div>
    <!-- /.list -->
    
    <p data-bind="visible: filesLoading()" class="list-loading"><i class="fa fa-spinner fa fa-spin"></i> Loading...</p>
    
    <p data-bind="visible: filesLoading()==false && files().length < 1" class="list-none">No files here. Click Upload File to get started.</p>
      
</section>
<!-- /.main -->

<div class="modal fade" id="deleteDialog">

	<div class="modal-dialog">
	
		<div class="modal-content">
		
			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal">x</button>
				<h3>Remove File</h3>
			</div>
			<!-- /.modal-header -->
			
			<div class="modal-body">
			
				<p>
					Are you sure that you want to delete <strong id="removeName"></strong>?
				</p>
				
				<p>
					This will completely remove it from the system.
				</p>
			
			</div>
			<!-- /.modal-body -->
			
			<div class="modal-footer">
				<button class="secondary-button" data-dismiss="modal">Close</button>
				<button class="primary-button" data-bind="click: removeFile">Remove File</button>
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
<script type="text/javascript" src="<?php print JQUERY_JS; ?>"></script>
<script type="text/javascript" src="<?php print JQUERYUI_JS; ?>"></script>
<script type="text/javascript" src="<?php print BOOTSTRAP_JS; ?>"></script>
<script type="text/javascript" src="<?php print KNOCKOUT_JS; ?>"></script>
<script type="text/javascript" src="js/helper/moment.min.js?v=<?php print VERSION; ?>"></script>
<script type="text/javascript" src="js/global.js?v=<?php print VERSION; ?>"></script>
<script type="text/javascript" src="js/messages.js?v=<?php print VERSION; ?>"></script>
<script type="text/javascript" src="js/helper/dropzone.js?v=<?php print VERSION; ?>"></script>
<script type="text/javascript" src="js/viewModels/models.js?v=<?php print VERSION; ?>"></script>
<script type="text/javascript" src="js/viewModels/filesModel.js?v=<?php print VERSION; ?>"></script>

</html>