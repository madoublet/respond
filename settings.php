<?php	
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
<link href="<?php print BOOTSTRAP_CSS; ?>" rel="stylesheet">
<link href="<?php print FONTAWESOME_CSS; ?>" rel="stylesheet">
<link type="text/css" href="css/app.css" rel="stylesheet">
<link type="text/css" href="css/messages.css" rel="stylesheet">

</head>

<body data-currpage="settings">
	
<p id="message">
  <span>Holds the message text.</span>
  <a class="close" href="#"></a>
</p>

<?php include 'modules/menu.php'; ?>

<section class="main">

    <nav>
        <a class="show-menu"><i class="icon-reorder icon-large"></i></a>
    
        <ul>
            <li class="static active"><a>Settings</a></li>
        </ul>
        
    </nav>
    <!-- /nav -->

	
	<form class="form-horizontal" data-bind="with: site">
		
		<fieldset>
		
		<div class="control-group">
			<label for="name" class="control-label">Site Name:</label>
			<div class="controls">
				<input id="name" type="text" data-bind="value: name">
			</div>
		</div>
		
		<div class="control-group">
			<label for="domain" class="control-label">Domain:</label>
			<div class="controls">
				<input id="domain" type="text"  data-bind="value: domain">
			</div>
		</div>
		
		<div class="control-group">
			<label for="primaryEmail" class="control-label">Primary Email:</label>
			<div class="controls">
				<input id="primaryEmail" type="text" data-bind="value: primaryEmail">
				<span class="help-block">Forms submitted on your site will be sent to this email address</span>
			</div>
		</div>
		
		</fieldset>
		
		<fieldset>
		
		<div class="control-group">
			<label for="timeZone" class="control-label">Time Zone:</label>
			<div class="controls">
				<select id="timeZone" data-bind="value: timeZone">
					<option value="EST">Eastern (EST)</option>
					<option value="CST">Central (CST)</option>
					<option value="MST">Mountain (MST)</option>
					<option value="PST">Pacific (PST)</option>
				</select>
			</div>
		</div>
		
		</fieldset>
		
		<fieldset>
		<div class="control-group">
			<label for="analyticsId" class="control-label">Google Analytics ID:</label>
			<div class="controls">
				<input id="analyticsId" type="text" data-bind="value: analyticsId">
				<span class="help-block">Google Analytics Web Property Id (adds analytics to all pages on your site)</span>
			</div>
		</div>	
		</fieldset>

		<fieldset>
		<div class="control-group">
			<label for="facebookAppId" class="control-label">Facebook App ID:</label>
			<div class="controls">
				<input id="facebookAppId" type="text" data-bind="value: facebookAppId">
				<span class="help-block">Allows you to moderate comments on your site, create here: <a href="https://developers.facebook.com/apps/">https://developers.facebook.com/apps/</a></span>
			</div>
		</div>	
		</fieldset>
		
		<fieldset>
		<div class="control-group">
			<label for="sitemap" class="control-label">Sitemap:</label>
			<div class="controls">
				<span class="readOnly" data-bind="text: $parent.siteMap"></span>
			</div>
		</div>	
		<div class="control-group">
			<label for="verification" class="control-label">Sitemap Verification:</label>
			<div class="controls">
				<span class="readOnly">
					<a data-bind="click: $parent.showVerificationDialog">Generate Verification File</a>
				</span>
				<span class="help-block">Setup your sitemaps at google.com/webmasters</span>
			</div>
		</div>	
		</fieldset>
		
    </form>
    <!-- /.form-horizontal -->
    
    <div class="actions" data-bind="with: site">
        <button class="primary-button" type="button" data-bind="click: $parent.save">Save</button>
    </div>

</section>
<!-- /.main -->

<div class="modal hide" id="verificationDialog">
  <div class="modal-header">
    <button type="button" class="close" data-dismiss="modal">x</button>
    <h3>Generate Verification File</h3>
  </div>
  <!-- /.modal-header -->

  <div class="modal-body">

	<form class="form-horizontal">
	
	<div class="control-group">
		<label for="fileName" class="control-label">File Name:</label>
		<div class="controls">
			<input id="fileName" type="text" value="" class="text" maxlength="255">
			<span class="help-block">e.g. google12345678910abc123.html</span>
		</div>
	</div>
	
	<div class="control-group">
		<label for="fileContent" class="control-label">File Contents:</label>
		<div class="controls">
			<textarea id="fileContent"></textarea>
			<span class="help-block">e.g. google-site-verification: google12345678910abc123.html</span>
		</div>
	</div>
	
	</form>

  </div>
  <!-- /.modal-body -->

  <div class="modal-footer">
    <button class="secondary-button" data-dismiss="modal">Close</button>
	<button class="primary-button" data-bind="click: generateVerification">Generate Verification File</button>
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
<script type="text/javascript" src="js/dialog.js"></script>
<script type="text/javascript" src="js/messages.js"></script>
<script type="text/javascript" src="js/viewModels/models.js"></script>
<script type="text/javascript" src="js/viewModels/settingsModel.js"></script>

</html>