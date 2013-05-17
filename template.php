<?php	
	include 'app.php'; // import php files

	$authUser = new AuthUser(); // get auth user
	$authUser->Authenticate('All');
?>
<!DOCTYPE html>
<html>

<head>
	
<title>Template&mdash;<?php print $authUser->SiteName; ?></title>

<meta name="viewport" content="width=device-width, initial-scale=1.0">

<!-- include css -->
<link href="//netdna.bootstrapcdn.com/twitter-bootstrap/2.3.1/css/bootstrap-combined.no-icons.min.css" rel="stylesheet">
<link type="text/css" href="css/app.css" rel="stylesheet">
<link type="text/css" href="css/page.css" rel="stylesheet">
<link type="text/css" href="css/messages.css" rel="stylesheet">
<link type="text/css" href="css/menu.css" rel="stylesheet">
<link type="text/css" href="css/list.css" rel="stylesheet">
<link type="text/css" href="//netdna.bootstrapcdn.com/font-awesome/3.1.1/css/font-awesome.min.css" rel="stylesheet">

</head>

<body data-currpage="template">
	
<!-- required for actions -->
<input type="hidden" name="_submit_check" value="1"/>

<p id="message">
  <span>Holds the message text.</span>
  <a class="close" href="#"></a>
</p>


<?php include 'modules/menu.php'; ?>

<section class="main">

    <nav>
        <a class="show-menu"><i class="icon-reorder icon-large"></i></a>
    
        <ul>
    	    <li class="static active"><a href="template">Template</a></li>
        </ul>
        
    </nav>

    <div id="templatesList" class="list" data-bind="foreach: templates">
    
        <div class="listItem">
            <h2 data-bind="text: name"></h2>
            <p data-bind="text: desc"></p>
            
            <button class="primary-button" data-bind="click: $parent.showApplyDialog, visible: ($parent.template()!=id())">Apply Template</button>
    		<button class="secondary-button" data-bind="click: $parent.showResetDialog, visible: ($parent.template()==id())">Reset Template</button>
        </div>
    
    </div>
    <!-- /.list -->

</section>
<!-- /.main -->

<div class="modal hide" id="applyDialog">
    <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal">×</button>
        <h3>Apply Template</span></h3>
    </div>
    <div class="modal-body">
    
    <p>
    	Are you sure that you want to apply the <strong id="applyName">template</strong> Template?
    </p>
    
    <p>
        This will completely change the look &amp; feel of your site and remove any custom
        changes you made to the Layout and Styles of the site.
    </p>
    
    </div>
    <div class="modal-footer">
    	<button class="secondary-button" data-dismiss="modal">Close</button>
    	<button class="primary-button" data-bind="click: applyTemplate">Apply Template</button>
    </div>

</div>
<!-- /.modal -->

<div class="modal hide" id="resetDialog">
    <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal">×</button>
        <h3>Reset Template</span></h3>
    </div>
    <div class="modal-body">
    
    <p>
        Are you sure that you want to reset the <strong id="resetName">template</strong> Template?
    </p>
    
    <p>
        This will override any custom changes you made to the Layout or Styles for the site.
    </p>
    
    </div>
    <div class="modal-footer">
        <button class="secondary-button" data-dismiss="modal">Close</button>
    	<button class="primary-button" data-bind="click: resetTemplate">Reset Template</button>
    </div>

</div>
<!-- /.modal -->


<?php include 'modules/footer.php'; ?>

</body>

<!-- include js -->
<script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js"></script>
<script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jqueryui/1.8.18/jquery-ui.min.js"></script>
<script src="//netdna.bootstrapcdn.com/twitter-bootstrap/2.3.1/js/bootstrap.min.js"></script>
<script type="text/javascript" src="js/helper/knockout-2.2.0.js"></script>
<script type="text/javascript" src="js/helper/moment.min.js"></script>
<script type="text/javascript" src="js/global.js"></script>
<script type="text/javascript" src="js/dialog.js"></script>
<script type="text/javascript" src="js/messages.js"></script>
<script type="text/javascript" src="js/viewModels/models.js"></script>
<script type="text/javascript" src="js/viewModels/templateModel.js"></script>

</html>