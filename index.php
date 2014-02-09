<?php	
	include 'app.php';
	
	// set language to preferred language (HTTP_ACCEPT_LANGUAGE)
	$supported = Utilities::GetSupportedLanguages('');
	$language = Utilities::GetPreferredLanguage($supported);

	Utilities::SetLanguage($language); 
?>
<!DOCTYPE html>
<html lang="<?php print str_replace('_', '-', $language) ?>">

<head>
	
<title><?php print _("Login"); ?>&mdash;<?php print BRAND; ?></title>

<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">

<!-- include styles -->
<?php include 'modules/css.php'; ?>
<link type="text/css" href="css/login.css?v=<?php print VERSION; ?>" rel="stylesheet">

</head>

<body>

<!-- messages -->
<input id="msg-progress" value="<?php print _("Login..."); ?>" type="hidden">
<input id="msg-error" value="<?php print _("Access Denied"); ?>" type="hidden">
		
<!-- begin content -->
<div class="content">

    <h1><span class="brand"><?php print BRAND; ?></span></h1>

    <form>
	<fieldset class="login">

		<div class="form-group">
			<label for="email" class="control-label"><?php print _("Email:"); ?></label>
			<input id="email" type="email" autocomplete="off" class="form-control input-lg">
		</div>
		
		<div class="form-group">
			<label for="password" class="control-label"><?php print _("Password:"); ?></label>
			<input id="password" type="Password" autocomplete="off" class="form-control input-lg">
		</div>
		
		<span class="actions">
			<button class="primary-button" type="submit" data-bind="click: login"><?php print _("Login"); ?> <i class="fa fa-angle-right fa-white"></i></button>
		</span>
	</fieldset>
    </form>
	<!-- /.login -->
    
    <p class="alternate">
    	<a href="forgot"><?php print _("Forgot your Password?"); ?></a>
	</p>
    
    <small><?php print COPY; ?></small>

</div>
<!-- /.content -->

</body>

<!-- include js -->
<?php include 'modules/js.php'; ?>
<script type="text/javascript" src="js/viewModels/indexModel.js?v=<?php print VERSION; ?>"></script>

</html>