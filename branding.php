<?php    
   	include 'app.php'; // import php files
	
	$authUser = new AuthUser(); // get auth user
	$authUser->Authenticate('Admin');
	
	Utilities::SetLanguage($authUser->Language); // set language
?>
<!DOCTYPE html>
<html lang="<?php print str_replace('_', '-', $authUser->Language) ?>">

<head>
	
<title><?php print _("Branding"); ?>&mdash;<?php print $authUser->SiteName; ?></title>

<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
<meta http-equiv="content-type" content="text/html; charset=utf-8">

<!-- include css -->
<?php include 'modules/css.php'; ?>
<link type="text/css" href="css/dialog.css?v=<?php print VERSION; ?>" rel="stylesheet">
<link type="text/css" href="css/dropzone.css?v=<?php print VERSION; ?>" rel="stylesheet">

</head>

<body id="branding-page" data-currpage="branding">

<!-- messages -->
<input id="msg-updating-branding" value="<?php print _("Updating..."); ?>" type="hidden">
<input id="msg-branding-updated" value="<?php print _("Branding successfully updated"); ?>" type="hidden">
<input id="msg-updating-logo" value="<?php print _("Updating..."); ?>" type="hidden">
<input id="msg-logo-updated" value="<?php print _("Logo successfully updated"); ?>" type="hidden">

<?php include 'modules/menu.php'; ?>

<section class="main">

    <nav>
        <a class="show-menu"><i class="fa fa-bars fa-lg"></i></a>
    
        <ul>
		    <li class="static active"><a href="branding"><?php print _("Branding"); ?></a></li>
		    <li class="static"><a href="colors"><?php print _("Colors"); ?></a></li>
        </ul>
        
    </nav>

  <div class="row-fluid">
    <div class="span12">
	
		<form class="form-horizontal">

			<div class="form-group">
				<label class="col-lg-2 control-label"><?php print _("Site:"); ?></label>
	
				<div class="col-lg-10">
	                <span id="logo" class="placeholder" data-bind="click: showImagesDialog">
	                    <img data-type="logo" data-bind="attr:{'src': fullLogoUrl, 'logo-url': logoUrl}">
	                </span>
				</div>
			</div>
			
			<div class="form-group">
				<label class="col-lg-2 control-label"><?php print _("PayPal:"); ?></label>
	
				<div class="col-lg-10">
	                <span id="payPalLogo" class="placeholder paypal" data-bind="click: showImagesDialog">
	                    <img data-type="paypal" data-bind="attr:{'src': fullPayPalLogoUrl, 'logo-url': payPalLogoUrl}">
	                </span>
	                <small><?php print _("PayPal recommends 150px x 50px"); ?></small>
				</div>
			</div>
			
			<div class="form-group">
				<label class="col-lg-2 control-label"><?php print _("Touch / Tile / Favorite:"); ?></label>
	
				<div class="col-lg-10">
	                <span id="favIcon" class="placeholder touch" data-bind="click: showImagesDialog">
	                    <img data-type="icon" data-bind="attr:{'src': fullIconUrl, 'logo-url': iconUrl}">
	                </span>
	                <small>200px x 200px (<?php print _("PNG format, we will convert it to .ico)"); ?></small>
				</div>
			</div>
			
			<div class="form-group">
				<label class="col-lg-2 control-label"><?php print _("Tile Background:"); ?></label>
	
				<div class="col-lg-10">
					<input id="iconBg" type="text" data-bind="value: iconBg" class="form-control inline">
					<button class="btn btn-default" data-bind="click: updateIconBg"><?php print _("Update"); ?></button>
	                <small><?php print _("The background color for a pinned Windows 8 tile"); ?></small>
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

<?php include 'modules/dialogs/imagesDialog.php'; ?>

</body>

<!-- include js -->
<?php include 'modules/js.php'; ?>
<script type="text/javascript" src="js/helper/dropzone.js?v=<?php print VERSION; ?>"></script>
<script type="text/javascript" src="js/viewModels/brandingModel.js?v=<?php print VERSION; ?>"></script>

</html>