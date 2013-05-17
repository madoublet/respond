<?php	
	include 'app.php'; // import php files
?>
<!DOCTYPE html>
<html>

<head>
	
<title>Forgot Password</title>

<meta name="viewport" content="width=device-width, initial-scale=1.0">

<!-- include styles -->
<link href="//netdna.bootstrapcdn.com/twitter-bootstrap/2.3.1/css/bootstrap-combined.no-icons.min.css" rel="stylesheet">
<link type="text/css" href="css/app.css" rel="stylesheet">
<link type="text/css" href="css/messages.css" rel="stylesheet">
<link type="text/css" href="css/login.css" rel="stylesheet">
<link type="text/css" href="//netdna.bootstrapcdn.com/font-awesome/3.1.1/css/font-awesome.min.css" rel="stylesheet">

</head>
<body id="forgot" class="external default">

<p id="message">
  <span></span>
  <a class="close" href="#"></a>
</p>

<!-- begin content -->
<div class="content">

	<h1>Respond</h1>

	<fieldset class="forgot" data-bind="visible:hasToken()==false">
		
		<p>
			Type your email address and we will send you a link to reset your password.
		</p>

		<div class="control-group">
			<label for="email">Email:</label>
			<input id="email" type="text" value="" placeholder="you@yourlogin.com">	
		</div>
		
		<span class="actions">
			<button type="submit" class="primary-button" data-bind="click:forgot">Send Email</button>
		</span>
		
	</fieldset>
	<!-- /.forgot -->
		
	<fieldset class="reset" data-bind="visible:hasToken()==true">
		
		<p>
			Welcome back <?php print $p->Email; ?>. Type a new password for your account.
		</p>

		<div class="control-group">
			<label for="password">Password:</label>
			<input id="password" type="password" placeholder="New Password">
		</div>
		
		<div class="control-group">
			<label for="retype">Retype Password:</label>
			<input id="retype" type="password" placeholder="Retype New Password">
		</div>
		
		<span class="actions">
			<button type="submit" class="primary-button" data-bind="click:reset">Change Password</button>
		</span>
			
	</fieldset>
	<!-- /.reset -->

	<p class="return">
		<a href="/">Return to Login</a>
	</p>

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
<script type="text/javascript" src="js/viewModels/forgotModel.js"></script>

</html>