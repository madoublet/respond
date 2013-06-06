<?php	
	include 'app.php'; // import php files
?>
<!DOCTYPE html>
<html>

<head>
	
<title>Create Site</title>

<meta name="viewport" content="width=device-width, initial-scale=1.0">

<!-- include styles -->
<link href="//netdna.bootstrapcdn.com/twitter-bootstrap/2.3.1/css/bootstrap-combined.no-icons.min.css" rel="stylesheet">
<link type="text/css" href="css/app.css" rel="stylesheet">
<link type="text/css" href="css/messages.css" rel="stylesheet">
<link type="text/css" href="css/login.css" rel="stylesheet">
<link type="text/css" href="//netdna.bootstrapcdn.com/font-awesome/3.1.1/css/font-awesome.min.css" rel="stylesheet">

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

	<small>Version 2.0.  Made by <a href="http://matthewsmith.com">Matthew Smith</a> in Manchester, MO</small>


</div>
<!-- /.content -->

</body>

<!-- include js -->
<script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js"></script>
<script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jqueryui/1.8.18/jquery-ui.min.js"></script>
<script type="text/javascript" src="//netdna.bootstrapcdn.com/twitter-bootstrap/2.3.1/js/bootstrap.min.js"></script>
<script type="text/javascript" src="js/helper/knockout-2.2.0.js"></script>
<script type="text/javascript" src="js/helper/moment.min.js"></script>
<script type="text/javascript" src="js/global.js"></script>
<script type="text/javascript" src="js/messages.js"></script>
<script type="text/javascript" src="js/viewModels/createModel.js"></script>

</html>