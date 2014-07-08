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
	
<title><?php print _("Forgot Password"); ?> - <?php print BRAND; ?></title>

<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
<meta http-equiv="content-type" content="text/html; charset=utf-8">

<!-- include styles -->
<?php include 'modules/css.php'; ?>
<link type="text/css" href="css/login.css?v=<?php print VERSION; ?>" rel="stylesheet">

</head>

<body id="forgot" class="external default">

<!-- messages -->
<input id="msg-sending" value="<?php print _("Sending..."); ?>" type="hidden">
<input id="msg-sent" value="<?php print _("Email sent"); ?>" type="hidden">
<input id="msg-email-invalid" value="<?php print _("We could not find your email in the system"); ?>" type="hidden">
<input id="msg-match-error" value="<?php print _("The password and retype must match"); ?>" type="hidden">
<input id="msg-resetting" value="<?php print _("Resetting..."); ?>" type="hidden">
<input id="msg-reset" value="<?php print _("Password successfully reset"); ?>" type="hidden">
<input id="msg-denied" value="<?php print _("Access denied"); ?>" type="hidden">

<!-- begin content -->
<div class="content">

	<h1><span class="brand"><img src="<?php print BRAND_LOGO; ?>" title="<?php print BRAND; ?>"></span></h1>
	
	<fieldset class="forgot" data-bind="visible:hasToken()==false">
	
		<p><?php print _("Type your email address and we will send you a link to reset your password."); ?></p>
		
		<div class="form-group">
			<label for="email"><?php print _("Email:"); ?></label>
			<input id="email" type="text" value="" placeholder="you@yourlogin.com" class="form-control input-lg">	
		</div>
		
		<span class="actions">
			<button type="submit" class="primary-button" data-bind="click:forgot"><?php print _("Send Email"); ?> <i class="fa fa-envelope-o"></i></button>
		</span>
		
	</fieldset>
	<!-- /.forgot -->
		
	<fieldset class="reset" data-bind="visible:hasToken()==true">
		
		<p>
			<?php print _("Welcome back. Type a new password for your account."); ?>
		</p>

		<div class="control-group">
			<label for="password"><?php print _("Password:"); ?></label>
			<input id="password" type="password" placeholder="New Password" class="form-control">
		</div>
		
		<div class="control-group">
			<label for="retype"><?php print _("Retype Password:"); ?></label>
			<input id="retype" type="password" placeholder="Retype New Password" class="form-control input-lg">
		</div>
		
		<span class="actions">
			<button type="submit" class="primary-button" data-bind="click:reset"><?php print _("Change Password"); ?></button>
		</span>
			
	</fieldset>
	<!-- /.reset -->

	<p  class="alternate">
		<a href="index"><?php print _("Return to Login"); ?></a>
	</p>

	<small><?php print COPY; ?></small>

</div>
<!-- /.content -->


</body>

<!-- include js -->
<?php include 'modules/js.php'; ?>
<script type="text/javascript" src="js/viewModels/forgotModel.js?v=<?php print VERSION; ?>"></script>

</html>