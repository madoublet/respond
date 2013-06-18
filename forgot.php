<?php	
	include 'app.php'; // import php files
?>
<!DOCTYPE html>
<html>

<head>
	
<title>Forgot Password - <?php print BRAND; ?></title>

<meta name="viewport" content="width=device-width, initial-scale=1.0">

<!-- include styles -->
<link href="<?php print BOOTSTRAP_CSS; ?>" rel="stylesheet">
<link href="<?php print FONTAWESOME_CSS; ?>" rel="stylesheet">
<link type="text/css" href="css/app.css" rel="stylesheet">
<link type="text/css" href="css/messages.css" rel="stylesheet">
<link type="text/css" href="css/login.css" rel="stylesheet">

</head>
<body id="forgot" class="external default">

<p id="message">
  <span></span>
  <a class="close" href="#"></a>
</p>

<!-- begin content -->
<div class="content">

	<h1><?php print BRAND; ?></h1>

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
<script type="text/javascript" src="js/viewModels/forgotModel.js"></script>

</html>