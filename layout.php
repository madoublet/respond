<?php	
	include 'app.php'; // import php files

	$authUser = new AuthUser(); // get auth user
	$authUser->Authenticate('All');
?>
<!DOCTYPE html>
<html>

<head>
	
<title>Layout&mdash;<?php print $authUser->SiteName; ?></title>

<meta name="viewport" content="width=device-width, initial-scale=1.0">

<!-- include css -->
<link type="text/css" href="libs/bootstrap/css/bootstrap.min.css" rel="stylesheet">
<link type="text/css" href="libs/bootstrap/css/bootstrap-responsive.min.css" rel="stylesheet">
<link type="text/css" href="js/helper/codemirror/codemirror.css" rel="stylesheet">
<link type="text/css" href="css/app.css" rel="stylesheet">
<link type="text/css" href="css/messages.css" rel="stylesheet">
<link type="text/css" href="css/list.css" rel="stylesheet">
<link type="text/css" href="libs/font-awesome/css/font-awesome.min.css" rel="stylesheet" />

</head>

<body data-currpage="layout">
	
<p id="message">
  <span>Holds the message text.</span>
  <a class="close" href="#"></a>
</p>

<?php include 'modules/menu.php'; ?>

<section class="main">

    <nav>
        <a class="show-menu"><i class="icon-reorder icon-large"></i></a>
    
        <ul>
        <!-- ko foreach: files -->
            <li data-bind="css: name"><a data-bind="text: file, click: $parent.updateContent"></a><i data-bind="click: $parent.showRemoveDialog" class="icon-minus-sign icon-large"></i></li>
        <!-- /ko -->    
            <li class="add"><i class="icon-plus-sign icon-large" data-bind="click: showAddDialog"></i></li>
        </ul>
        
    </nav>

    <div class="container">
	    <textarea id="content" spellcheck="false" data-bind="value: content"></textarea>
	</div>
    
    <div class="actions">
        <button class="primary-button" type="button" data-bind="click: save">Save</button>
    </div>
</section>
<!-- /.main -->


<div class="modal hide" id="addDialog">
  <div class="modal-header">
    <button type="button" class="close" data-dismiss="modal">x</button>
    <h3>Add Layout</h3>
  </div>
  <!-- /.modal-header -->

  <div class="modal-body">

  <form class="form-horizontal">

	<div class="control-group">
		<label for="name" class="control-label">Name:</label>
		<div class="controls">
			<input id="name" type="text"><span style="font-size: 16px; color: #aaa;">.html</span>
			<span class="help-block">Lowercase, no spaces</span>
		</div>
	</div>
	
	</form>
	<!-- /.form-horizontal -->

  </div>
  <!-- /.modal-body -->

  <div class="modal-footer">
    <button class="secondary-button" data-dismiss="modal">Close</button>
	<button class="primary-button" data-bind="click: addLayout">Add Layout</button>
  </div>

</div>
<!-- /.modal -->

<div class="modal hide" id="removeDialog">
  <div class="modal-header">
    <button type="button" class="close" data-dismiss="modal">x</button>
    <h3>Remove Layout</h3>
  </div>
  <!-- /.modal-header -->

  <div class="modal-body">
	
	<p>
		Are you sure that you want to delete <strong id="removeName">this layout</strong>?
	</p>

  </div>
  <!-- /.modal-body -->

  <div class="modal-footer">
    <button class="secondary-button" data-dismiss="modal">Close</button>
	<button class="primary-button" data-bind="click: removeLayout">Remove Layout</button>
  </div>

</div>
<!-- /.modal -->

<?php include 'modules/footer.php'; ?>

</body>

<!-- include js -->
<script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js"></script>
<script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jqueryui/1.8.18/jquery-ui.min.js"></script>
<script type="text/javascript" src="libs/bootstrap/js/bootstrap.min.js"></script>
<script type="text/javascript" src="js/helper/knockout-2.2.0.js"></script>
<script type="text/javascript" src="js/helper/moment.min.js"></script>
<script type="text/javascript" src="js/helper/codemirror/codemirror.js"></script>
<script type="text/javascript" src="js/helper/codemirror/mode/xml/xml.js"></script>
<script type="text/javascript" src="js/global.js"></script>
<script type="text/javascript" src="js/messages.js"></script>
<script type="text/javascript" src="js/viewModels/layoutModel.js"></script>

</html>