<?php	
	include 'app.php'; // import php files
?>
<!DOCTYPE html>
<html>

<head>
	
<title>Create Site&mdash;<?php print BRAND; ?></title>

<meta name="viewport" content="width=device-width, initial-scale=1.0">

<!-- include styles -->
<link href="<?php print BOOTSTRAP_CSS; ?>" rel="stylesheet">
<link href="<?php print FONTAWESOME_CSS; ?>" rel="stylesheet">
<link type="text/css" href="css/app.css" rel="stylesheet">
<link type="text/css" href="css/messages.css" rel="stylesheet">
<link type="text/css" href="css/login.css" rel="stylesheet">

</head>

<body>

<p id="message">
  <span></span>
  <a class="close" href="#"></a>
</p>
	
<!-- begin content -->
<div class="content">

	<h1>Respond</h1>

	<div id="create-form">
	
	<fieldset>
		
		<p>Tell us your site name</p>

		<div class="control-group">
			<label for="name">Site Name:</label>
			<input id="name" type="text" value="" placeholder="Site Name">
			<p class="siteName"><?php print APP_URL; ?>/sites/<span id="tempUrl" class="temp">your-site</span></p>
			<input id="friendlyId" type="hidden" value="">
		</div>

		<p class="createLogin">Create a login</p>
		
		<div class="control-group">
			<label for="email">Email:</label>
			<input id="email" type="text" value="" placeholder="Email">
		</div>
		
		<div class="control-group">
			<label for="password">Password:</label>
			<input id="password" type="password" placeholder="Password">
		</div>

		<div class="control-group">
			<label for="retype">&nbsp;</label>
			<input id="retype" type="password" placeholder="Retype to verify">
		</div>

		<p>Key in the passcode</p>

		<div class="control-group">
			<label for="passcode">&nbsp;</label>
			<input id="passcode" type="text" placeholder="Type the passcode">
		</div>

		<span class="actions">
			<button type="button" class="primary-button" data-bind="click: create">Create Site</button>
		</span>

	</fieldset>
	
	</div>
	
	<div id="create-confirmation">

	<fieldset>
		<p>
			Account created! To get started, click on your login link below.
		</p>	


		<p>
			Login here to update your site:
		</p>
		<p>
			<a id="loginLink" href="<?php print APP_URL; ?>"><?php print APP_URL; ?></a>
		</p>
		
		<p>
			You can already view your site here: 
		</p>
		<p>	
			<a id="siteLink" href="<?php print APP_URL; ?>/sites/{friendlyId}"><?php print APP_URL; ?>/sites/{friendlyId}</a>
		</p>
		
		<p>
			Bookmark these links for easy access.
		</p>
		

	</fieldset>
	
	</div>

	 <small><?php print COPY; ?></small>


</div>
<!-- /.content -->

</body>

<!-- include js -->
<script type="text/javascript" src="<?php print JQUERY_JS; ?>"></script>
<script type="text/javascript" src="<?php print JQUERYUI_JS; ?>"></script>
<script type="text/javascript" src="<?php print BOOTSTRAP_JS; ?>"></script>
<script type="text/javascript" src="<?php print KNOCKOUT_JS; ?>"></script>
<script type="text/javascript" src="js/helper/moment.min.js"></script>
<script type="text/javascript" src="js/global.js"></script>
<script type="text/javascript" src="js/messages.js"></script>
<script type="text/javascript" src="js/viewModels/createModel.js"></script>

</html>