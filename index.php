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
<meta http-equiv="content-type" content="text/html; charset=utf-8">

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

    <h1><span class="brand"><img src="<?php print BRAND_LOGO; ?>" title="<?php print BRAND; ?>"></span></h1>

    <form>
	<fieldset class="login">

		<div class="form-group">
			<label for="email" class="control-label"><?php print _("Email:"); ?></label>
			<input id="email" type="email" autocomplete="off" class="form-control input-lg" tabindex="1">
		</div>
		
		<div class="form-group">
			<label for="password" class="control-label"><?php print _("Password:"); ?> <a class="forgot-link" href="forgot" tabindex="4"><?php print _("Forgot your Password?"); ?></a></label>
			<input id="password" type="Password" autocomplete="off" class="form-control" tabindex="2">
		</div>
		
		<span class="actions">
			<button class="primary-button" type="submit" data-bind="click: login" tabindex="3"><?php print _("Login"); ?> <i class="fa fa-angle-right fa-white"></i></button>
		</span>
	</fieldset>
    </form>
	<!-- /.login -->
    
    <p class="alternate">
   	 	<a href="create"><?php print _("Create a Site"); ?></a>
    </p>
    
    <small><?php print COPY; ?></small>

</div>
<!-- /.content -->

</body>

<!-- include js -->
<?php include 'modules/js.php'; ?>
<script type="text/javascript" src="js/viewModels/indexModel.js?v=<?php print VERSION; ?>"></script>

</html>