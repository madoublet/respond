<?php	
	include 'app.php'; // import php files

	$authUser = new AuthUser(); // get auth user
	$authUser->Authenticate('Admin');
	
	Utilities::SetLanguage($authUser->Language); // set language
?>
<!DOCTYPE html>
<html lang="<?php print str_replace('_', '-', $authUser->Language) ?>">

<head>
	
<title><?php print _("Layout"); ?>&mdash;<?php print $authUser->SiteName; ?></title>

<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
<meta http-equiv="content-type" content="text/html; charset=utf-8">

<!-- include css -->
<?php include 'modules/css.php'; ?>
<link type="text/css" href="js/helper/codemirror/codemirror.css?v=<?php print VERSION; ?>" rel="stylesheet">

</head>

<body data-currpage="layout">

<?php include 'modules/menu.php'; ?>

<!-- messages -->
<input id="msg-updating" value="<?php print _("Updating..."); ?>" type="hidden">
<input id="msg-saved" value="<?php print _("Layout saved"); ?>" type="hidden">
<input id="msg-saving-error" value="<?php print _("There was a problem saving the layout, please try again"); ?>" type="hidden">
<input id="msg-add-error" value="<?php print _("A name is required to add a layout"); ?>" type="hidden">
<input id="msg-add-success" value="<?php print _("Layout successfully added"); ?>" type="hidden">
<input id="msg-add-problem" value="<?php print _("There was a problem adding the layout, please try again"); ?>" type="hidden">
<input id="msg-remove-success" value="<?php print _("Layout successfully removed"); ?>" type="hidden">
<input id="msg-remove-problem" value="<?php print _("There was a problem removing the layout, please try again"); ?>" type="hidden">

<section class="main">

    <nav>
        <a class="show-menu"><i class="fa fa-bars fa-lg"></i></a>
        
        <div class="fs-container full">
    
			<div class="fs">
    
		        <ul>
		        <!-- ko foreach: files -->
		            <li class="has-action" data-bind="css: name"><a data-bind="text: file, click: $parent.updateContent"></a><i data-bind="click: $parent.showRemoveDialog" class="fa fa-minus-circle show-tooltip" title="<?php print _("Remove Layout"); ?>"></i></li>
		        <!-- /ko -->    
		            <li class="add"><i class="fa fa-plus-circle show-tooltip" data-bind="click: showAddDialog" title="<?php print _("Add Layout"); ?>"></i></li>
		        </ul>
        
			</div>
			<!-- /.fs -->
        
        </div>
        <!-- /.fs-container -->
        
    </nav>
   
    	<div class="codemirror-block">
	    	<textarea id="content" spellcheck="false" data-bind="value: content"></textarea>
    	</div>
    
    <div class="actions">
        <button class="primary-button" type="button" data-bind="click: save"><?php print _("Save"); ?></button>
    </div>
</section>
<!-- /.main -->


<div class="modal fade" id="addDialog">

	<div class="modal-dialog">
	
		<div class="modal-content">
		
			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal">x</button>
				<h3><?php print _("Add Layout"); ?></h3>
			</div>
			<!-- /.modal-header -->

			<div class="modal-body">
			
			<div class="form-group">
				<label for="name"><?php print _("Name:"); ?></label>
				<input id="name" type="text" class="form-control">
				<span class="help-block"><?php print _("Lowercase, no space, leave the .html off"); ?></span>
			</div>
			
			</div>
			<!-- /.modal-body -->
			
			<div class="modal-footer">
				<button class="secondary-button" data-dismiss="modal"><?php print _("Close"); ?></button>
				<button class="primary-button" data-bind="click: addLayout"><?php print _("Add Layout"); ?></button>
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

<div class="modal fade" id="removeDialog">

	<div class="modal-dialog">
	
		<div class="modal-content">
		
			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal">x</button>
				<h3><?php print _("Remove Layout"); ?></h3>
			</div>
			<!-- /.modal-header -->
			
			<div class="modal-body">
			
			<p>
				<?php print _("Confirm that you want to delete"); ?> <strong id="removeName">this layout</strong>
			</p>
			
			</div>
			<!-- /.modal-body -->
			
			<div class="modal-footer">
				<button class="secondary-button" data-dismiss="modal"><?php print _("Close"); ?></button>
				<button class="primary-button" data-bind="click: removeLayout"><?php print _("Remove Layout"); ?></button>
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

</body>

<!-- include js -->
<?php include 'modules/js.php'; ?>
<script type="text/javascript" src="js/helper/flipsnap.min.js?v=<?php print VERSION; ?>"></script>
<script type="text/javascript" src="js/helper/codemirror/codemirror.js?v=<?php print VERSION; ?>"></script>
<script type="text/javascript" src="js/helper/codemirror/mode/xml/xml.js?v=<?php print VERSION; ?>"></script>
<script type="text/javascript" src="js/viewModels/layoutModel.js?v=<?php print VERSION; ?>"></script>

</html>