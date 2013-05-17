<?php    
    error_reporting(E_ALL);
    ini_set('display_errors', '1');
    
	include 'app.php'; // import php files
	
	$authUser = new AuthUser(); // get auth user
	$authUser->Authenticate('All');
?>
<!DOCTYPE html>
<html>

<head>
	
<title>Settings&mdash;<?php print $authUser->SiteName; ?></title>

<meta name="viewport" content="width=device-width, initial-scale=1.0">

<!-- include css -->
<link href="//netdna.bootstrapcdn.com/twitter-bootstrap/2.3.1/css/bootstrap-combined.no-icons.min.css" rel="stylesheet">
<link type="text/css" href="css/app.css" rel="stylesheet">
<link type="text/css" href="css/dialog.css" rel="stylesheet">
<link type="text/css" href="css/messages.css" rel="stylesheet">
<link type="text/css" href="css/menu.css" rel="stylesheet">
<link type="text/css" href="css/list.css" rel="stylesheet">
<link type="text/css" href="css/dropzone.css" rel="stylesheet">
<link type="text/css" href="css/cupertino/jquery-ui-1.8.1.custom.css" rel="stylesheet">
<link type="text/css" href="//netdna.bootstrapcdn.com/font-awesome/3.1.1/css/font-awesome.min.css" rel="stylesheet">

</head>

<body data-currpage="branding">
	
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
		    <li class="static active"><a href="branding">Branding</a></li>
        </ul>
        
        <a class="primary-action" data-bind="click: showImagesDialog"><i class="icon-plus-sign icon-large"></i> Update Logo</a>
    </nav>

  <div class="row-fluid">
    <div class="span12">
	
		<form class="form-horizontal">

		<div class="control-group">
			<label class="control-label">Default Logo:</label>

			<div class="controls">
                <span id="logo">
                    <img data-bind="attr:{'src': fullUrl, 'logo-url': logoUrl}">
                </span>
			</div>
		</div>
	
		</form>
		<!-- /.form-horizontal -->
		
	</div>
	<!-- /.span12 -->	
	
  </div>
  <!-- /.row-fluid -->

</section>
<!-- /.main -->

<div id="overlay"></div>

<div class="hide immersive" id="imagesDialog">
  <div class="immersive-header">
    <h3>Select or upload a new image</h3>
    <button type="button" class="close" data-dismiss="modal">x</button>
  </div>
  <!-- /.modal-header -->

  <div class="immersive-body">
  
    <h2 data-bind="visible: (newimages().length > 0)">New Images</h2>

    <div  data-bind="visible: (newimages().length > 0)" class="image-list">
    
        <!-- ko foreach:newimages -->
        <div class="image new">
            <img data-bind="attr:{'src': thumbUrl}, click: $parent.changeLogo">
            <small>
                <span data-bind="text: filename"></span><br>
                <span data-bind="text: width"></span>px x <span data-bind="text: height"></span>px
            </small>
        </div>
        <!-- /ko -->

    </div>
  
    <h2>Existing Images</h2>

    <div class="image-list">
    
        <!-- ko foreach:images -->
        <div class="image existing">
            <img data-bind="attr:{'src': thumbUrl}, click: $parent.changeLogo">
            <small>
                <span data-bind="text: filename"></span><br>
                <span data-bind="text: width"></span>px x <span data-bind="text: height"></span>px
            </small>
        </div>
        <!-- /ko -->

    </div>
    
    <div id="drop" class="custom-dropzone">
        <span class="message">
            <i class="icon-cloud-upload icon-4x"></i>
            <span class="message-text">Drag file here or click to upload</span>
        </span>
    </div>
    
  </div>
  <!-- /.modal-body -->

</div>
<!-- /.modal -->


<?php include 'modules/footer.php'; ?>

</body>

<!-- include js -->
<script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js"></script>
<script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jqueryui/1.8.18/jquery-ui.min.js"></script>
<script type="text/javascript" src="//netdna.bootstrapcdn.com/twitter-bootstrap/2.3.1/js/bootstrap.min.js"></script>
<script type="text/javascript" src="js/helper/knockout-2.2.0.js"></script>
<script type="text/javascript" src="js/helper/moment.min.js"></script>
<script type="text/javascript" src="js/global.js"></script>
<script type="text/javascript" src="js/dialog.js"></script>
<script type="text/javascript" src="js/messages.js"></script>
<script type="text/javascript" src="js/helper/dropzone.js"></script>
<script type="text/javascript" src="js/viewModels/brandingModel.js"></script>

</html>