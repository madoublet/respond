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
<link type="text/css" href="css/app.css" rel="stylesheet">
<link type="text/css" href="css/messages.css" rel="stylesheet">
<link type="text/css" href="css/list.css" rel="stylesheet">
<link type="text/css" href="css/dropzone.css" rel="stylesheet">

</head>

<body>

<p id="message">
  <span>Holds the message text.</span>
  <a class="close" href="#"></a>
</p>

<?php include 'modules/menu.php'; ?>
		
<section class="main">

    <nav>
        <a class="show-menu"><i class="icon-reorder icon-large"></i></a>
    
        <ul>
    	    <li class="static active"><a href="branding">Files</a></li>
        </ul>
    </nav>
    
    <div id="drop" class="custom-dropzone dark">
        <span class="message">
            <i class="icon-cloud-upload icon-4x"></i>
            <span class="message-text">Drag file here or click to upload</span>
        </span>
    </div>
    
    <div class="list has-dropzone" data-bind="foreach: files">
    
        <div class="listItem" data-bind="css: {'has-thumb': isImage==true}">
    		<a class="remove" data-bind="click: $parent.showRemoveDialog">
                <i class="icon-minus-sign icon-large"></i>
            </a>
            
            <span class="image" data-bind="if: isImage"><img height="75" width="75" data-bind="attr:{'src':thumbUrl}"></span>
            
        	<h2><a data-bind="text:filename, attr: { 'href': fullUrl }"></a></h2>
            <em data-bind="if: isImage"><span data-bind="text: width"></span>px x <span data-bind="text: height"></span>px</em>
       
    	</div>
    	<!-- /.listItem -->
    
    </div>
    <!-- /.list -->
    
    <p data-bind="visible: filesLoading()" class="list-loading"><i class="icon-spinner icon-spin"></i> Loading...</p>
    
    <p data-bind="visible: filesLoading()==false && files().length < 1" class="list-none">No files here. Click Upload File to get started.</p>
      
</section>
<!-- /.main -->

<div class="modal hide" id="deleteDialog">
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
<!-- /.modal -->


<!-- /.modal -->
<?php include 'modules/footer.php'; ?>

</body>

<!-- include js -->
<script type="text/javascript" src="<?php print JQUERY_JS; ?>"></script>
<script type="text/javascript" src="<?php print JQUERYUI_JS; ?>"></script>
<script type="text/javascript" src="<?php print BOOTSTRAP_JS; ?>"></script>
<script type="text/javascript" src="<?php print KNOCKOUT_JS; ?>"></script>
<script type="text/javascript" src="js/helper/moment.min.js"></script>
<script type="text/javascript" src="js/global.js"></script>
<script type="text/javascript" src="js/messages.js"></script>
<script type="text/javascript" src="js/helper/dropzone.js"></script>
<script type="text/javascript" src="js/viewModels/models.js"></script>
<script type="text/javascript" src="js/viewModels/filesModel.js"></script>

</html>