<?php	
	include 'app.php'; // import php files
?>
<!DOCTYPE html>
<html>

<head>
	
<title>Login&mdash;<?php print BRAND; ?></title>

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
  <span><?php print $p->Errors; ?></span>
  <a class="close" href="#"></a>
</p>
		
<!-- begin content -->
<div class="content">

    <h1><span class="brand"><?php print BRAND; ?></span></h1>

    <form>
	<fieldset class="login">
		<p>Enter your email and password to login</p>

		<div class="control-group">
			<label for="email" class="control-label">Email:</label>
			<input id="email" type="text" autocomplete="off" placeholder="Enter email">
		</div>
		
		<div class="control-group">
			<label for="password" class="control-label">Password:</label>
			<input id="password" type="Password" autocomplete="off" placeholder="Enter password">
		</div>
		
		<span class="actions">
			<button class="primary-button" type="submit" data-bind="click: login">Login <i class="icon-chevron-right icon-white"></i></button>
		</span>
	</fieldset>
    </form>
	<!-- /.login -->
    
    <p>
    	<a href="forgot">Forgot your password?</a>
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
<script type="text/javascript" src="js/viewModels/indexModel.js"></script>

</html>