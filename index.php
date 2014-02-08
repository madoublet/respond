<?php	
$headerValues = array(
	'user' => array(
		'authenticate' => false,
	),
	'language' => 'preferred',
	'title' => array(
		'first' => 'Login',
		'second' => '{{BRAND}}'
	),
	'stylesheet' => array(
		'css/login.css'
	),
);
include 'include/header.php';
?>
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
<script type="text/javascript" src="<?php print JQUERY_JS; ?>"></script>
<script type="text/javascript" src="<?php print JQUERYUI_JS; ?>"></script>
<script type="text/javascript" src="<?php print BOOTSTRAP_JS; ?>"></script>
<script type="text/javascript" src="<?php print KNOCKOUT_JS; ?>"></script>
<script type="text/javascript" src="js/helper/moment.min.js?v=<?php print VERSION; ?>"></script>
<script type="text/javascript" src="js/global.js?v=<?php print VERSION; ?>"></script>
<script type="text/javascript" src="js/messages.js?v=<?php print VERSION; ?>"></script>
<script type="text/javascript" src="js/viewModels/indexModel.js?v=<?php print VERSION; ?>"></script>

</html>