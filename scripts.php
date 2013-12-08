<?php	
	include 'app.php'; // import php files

	$authUser = new AuthUser(); // get auth user
	$authUser->Authenticate('All');
?>
<!DOCTYPE html>
<html>

<head>
	
<title>Scripts&mdash;<?php print $authUser->SiteName; ?></title>

<meta name="viewport" content="width=device-width, initial-scale=1.0">

<!-- include css -->
<link href="<?php print FONT; ?>" rel="stylesheet" type="text/css">
<link href="<?php print BOOTSTRAP_CSS; ?>" rel="stylesheet">
<link href="<?php print FONTAWESOME_CSS; ?>" rel="stylesheet">
<link type="text/css" href="js/helper/codemirror/codemirror.css?v=<?php print VERSION; ?>" rel="stylesheet">
<link type="text/css" href="css/app.css?v=<?php print VERSION; ?>" rel="stylesheet">
<link type="text/css" href="css/messages.css?v=<?php print VERSION; ?>" rel="stylesheet">
<link type="text/css" href="css/list.css?v=<?php print VERSION; ?>" rel="stylesheet">

</head>

<body data-currpage="scripts">
	
<p id="message">
  <span>Holds the message text.</span>
  <a class="close" href="#"></a>
</p>

<?php include 'modules/menu.php'; ?>

<section class="main">

    <nav>
        <a class="show-menu"><i class="fa fa-bars fa-lg"></i></a>
        
        <div class="fs-container full">
    
			<div class="fs">
    
		        <ul>
		        <!-- ko foreach: files -->
		            <li data-bind="attr:{'data-file': file}"><a data-bind="text: file, click: $parent.updateContent"></a><i data-bind="click: $parent.showRemoveDialog" class="fa fa-minus-circle fa-lg"></i></li>
		        <!-- /ko -->    
		            <li class="add"><i class="fa fa-plus-circle fa-lg" data-bind="click: showAddDialog"></i></li>
		        </ul>
		        
			</div>
			<!-- /.fs -->
        
        </div>
        <!-- /.fs-container -->
        
    </nav>

    <div class="container">
    	<div class="codemirror-block" data-bind="visible: hasFile">
	    	<textarea id="content" spellcheck="false" data-bind="value: content"></textarea>
    	</div>
	</div>
    
    <div class="actions">
        <button class="primary-button" data-bind="click: save">Save</button>
    </div>
</section>
<!-- /.main -->


<div class="modal fade" id="addDialog">

	<div class="modal-dialog">
	
		<div class="modal-content">
		
			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal">x</button>
				<h3>Add Script</h3>
			</div>
			<!-- /.modal-header -->

			<div class="modal-body">
			
				<div class="form-group">
					<label for="name">Name:</label>
					<input id="name" type="text" class="form-control">
					<span class="help-block">Lowercase, no spaces, no special characters (., !, etc), <strong>leave the .js off</strong></span>
				</div>
				
			</div>
			<!-- /.modal-body -->

			<div class="modal-footer">
				<button class="secondary-button" data-dismiss="modal">Close</button>
				<button class="primary-button" data-bind="click: addScript">Add Script</button>
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
				<h3>Remove Script</h3>
			</div>
			<!-- /.modal-header -->
			
			<div class="modal-body">
			
			<p>
				Are you sure that you want to delete <strong id="removeName">this script</strong>?
			</p>
			
			</div>
			<!-- /.modal-body -->
			
			<div class="modal-footer">
				<button class="secondary-button" data-dismiss="modal">Close</button>
				<button class="primary-button" data-bind="click: removeScript">Remove Script</button>
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
<script type="text/javascript" src="<?php print JQUERY_JS; ?>"></script>
<script type="text/javascript" src="<?php print JQUERYUI_JS; ?>"></script>
<script type="text/javascript" src="<?php print BOOTSTRAP_JS; ?>"></script>
<script type="text/javascript" src="<?php print KNOCKOUT_JS; ?>"></script>
<script type="text/javascript" src="js/helper/moment.min.js?v=<?php print VERSION; ?>"></script>
<script type="text/javascript" src="js/helper/flipsnap.min.js?v=<?php print VERSION; ?>"></script>
<script type="text/javascript" src="js/helper/codemirror/codemirror.js?v=<?php print VERSION; ?>"></script>
<script type="text/javascript" src="js/helper/codemirror/mode/css/css.js?v=<?php print VERSION; ?>"></script>
<script type="text/javascript" src="js/global.js?v=<?php print VERSION; ?>"></script>
<script type="text/javascript" src="js/messages.js?v=<?php print VERSION; ?>"></script>
<script type="text/javascript" src="js/viewModels/scriptsModel.js?v=<?php print VERSION; ?>"></script>

</html>Layout